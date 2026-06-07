// Pont HTTP partagé (plugin Vite dev + fonction Vercel prod).
// Lit/valide la requête, applique le rate-limit, vérifie l'auth + les crédits,
// exécute la génération, déduit les crédits et renvoie { status, payload }.
import { generate, ApiError } from './generate.js'
import { getAdminClient } from './supabase.js'

// ~13 Mo de JSON ≈ une photo 10 Mo encodée en base64. Marge à 16 Mo.
const MAX_BODY = 16 * 1024 * 1024

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new ApiError(413, 'too_large', 'Photo trop lourde (16 Mo max).'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(new ApiError(400, 'bad_json', 'Requête invalide.'))
      }
    })
    req.on('error', () => reject(new ApiError(400, 'bad_request', 'Requête invalide.')))
  })
}

// Rate-limit en mémoire (best-effort). En prod serverless multi-instance,
// à remplacer par Upstash/KV pour un vrai partage entre instances.
const HITS = new Map()
const WINDOW_MS = 60_000
const MAX_HITS = 12
export function rateLimit(ip) {
  const now = Date.now()
  const recent = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    throw new ApiError(429, 'rate_limited', 'Trop de générations. Réessaie dans une minute.')
  }
  recent.push(now)
  HITS.set(ip, recent)
}

// Coût en crédits — miroir de COST dans useStudio.js.
const CREDIT_COST = {
  image: { standard: 1, hd: 2, ultra: 3 },
  video: { standard: 4, hd: 6, ultra: 8 },
}
const creditCost = (mode, quality) => (CREDIT_COST[mode] || CREDIT_COST.image)[quality] ?? 1

// Vérifie le JWT, récupère le profil, contrôle le solde de crédits.
async function verifyAndGetCredits(token, mode, quality) {
  const admin = getAdminClient()
  if (!admin) throw new ApiError(503, 'supabase_missing', 'Auth non configurée.')

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) throw new ApiError(401, 'not_authenticated', 'Connecte-toi pour générer.')

  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('credits_balance')
    .eq('id', user.id)
    .single()
  if (profileErr || !profile) throw new ApiError(401, 'not_authenticated', 'Compte introuvable.')

  const cost = creditCost(mode, quality)
  if (profile.credits_balance < cost) {
    throw new ApiError(402, 'no_credits', 'Plus de crédits — abonne-toi pour continuer.')
  }
  return { userId: user.id, creditsBalance: profile.credits_balance, cost }
}

// Déduit les crédits et enregistre la génération (best-effort, non bloquant).
async function deductAndLog({ userId, creditsBalance, cost, body, imageUrl }) {
  const admin = getAdminClient()
  if (!admin) return
  await Promise.all([
    admin.from('profiles').update({ credits_balance: creditsBalance - cost }).eq('id', userId),
    admin.from('generations').insert({
      user_id:      userId,
      prompt:       (body.prompt || '').slice(0, 200),
      style:        body.style   || 'naturel',
      quality:      body.quality || 'standard',
      mode:         body.mode    || 'image',
      image_url:    imageUrl,
      credits_used: cost,
    }),
  ]).catch(err => console.error('[deductAndLog]', err?.message))
}

// Point d'entrée principal appelé par les deux adaptateurs (Vite + Vercel).
export async function runGenerate({ body, ip, token }) {
  try {
    rateLimit(ip || 'unknown')
    if (!body || typeof body !== 'object') {
      throw new ApiError(400, 'bad_request', 'Requête invalide.')
    }

    const hasReplicate = !!process.env.REPLICATE_API_TOKEN
    const hasSupabase  = !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL)

    // Mode production : Replicate + Supabase configurés → auth + crédits obligatoires.
    // Mode démo : clé Replicate absente → on laisse generate() répondre no_key (stub honnête).
    let authCtx = null
    if (hasReplicate && hasSupabase) {
      if (!token) throw new ApiError(401, 'not_authenticated', 'Connecte-toi pour générer.')
      authCtx = await verifyAndGetCredits(token, body.mode, body.quality)
    }

    const result = await generate(body)

    if (authCtx) {
      await deductAndLog({ ...authCtx, body, imageUrl: result.imageUrl })
    }

    const credits = authCtx ? authCtx.creditsBalance - authCtx.cost : null
    return { status: 200, payload: { ...result, credits } }

  } catch (err) {
    if (err instanceof ApiError) {
      return { status: err.status, payload: { error: err.code, message: err.message } }
    }
    console.error('[runGenerate] erreur inattendue :', err)
    return { status: 500, payload: { error: 'internal', message: 'Erreur interne. Réessaie.' } }
  }
}
