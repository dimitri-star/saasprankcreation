// Pont HTTP partagé (plugin Vite dev + fonction Vercel prod).
// Lit/valide la requête, applique le rate-limit, vérifie l'auth + les crédits,
// exécute la génération, déduit GENERATION_COST crédits (abonnés décomptés) et renvoie { status, payload }.
import { generate, ApiError } from './generate.js'
import { getAdminClient } from './supabase.js'
import { CATALOG, UNLIMITED_CREDITS, GENERATION_COST } from './catalog.js'

// Plans « décomptés » : abonnements/achats qui accordent un nombre FINI de crédits.
// Dérivé du CATALOG (0 < creditsPerPeriod < UNLIMITED). Sont donc EXCLUS (génèrent
// librement, sans décompte ni blocage) :
//   - free       → le paywall des non-abonnés est le FLOU du résultat, pas un blocage ;
//   - snap_tuto  → 0 crédit (simple déblocage de tuto, pas un plan de génération) ;
//   - prestige / lifetime_infini → crédits illimités (sentinelle UNLIMITED).
const METERED_PLANS = new Set(
  Object.values(CATALOG)
    .filter((i) => i.creditsPerPeriod > 0 && i.creditsPerPeriod !== UNLIMITED_CREDITS)
    .map((i) => i.plan),
)

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

// Vérifie le JWT + lit le solde du profil (plan + credits_balance).
// Le solde gouverne la GÉNÉRATION des abonnés ; isPaid(plan) gouverne l'AFFICHAGE (flou).
async function verifyAuthAndProfile(token) {
  const admin = getAdminClient()
  if (!admin) throw new ApiError(503, 'supabase_missing', 'Auth non configurée.')

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) throw new ApiError(401, 'not_authenticated', 'Connecte-toi pour générer.')

  const { data: profile } = await admin
    .from('profiles')
    .select('plan, credits_balance')
    .eq('id', user.id)
    .single()

  return {
    userId:  user.id,
    plan:    profile?.plan || 'free',
    credits: profile?.credits_balance ?? 0,
  }
}

// Enregistre la génération à des fins d'analyse (best-effort, non bloquant).
// NB : le builder Supabase est thenable mais n'expose PAS .catch() → on await
// puis on lit { error } (il ne throw pas, il renvoie l'erreur dans l'objet).
async function logGeneration({ userId, body, imageUrl, creditsUsed = 0 }) {
  const admin = getAdminClient()
  if (!admin) return
  const { error } = await admin.from('generations').insert({
    user_id:      userId,
    prompt:       (body.prompt || '').slice(0, 200),
    style:        body.style   || 'naturel',
    quality:      body.quality || 'standard',
    mode:         body.mode    || 'image',
    image_url:    imageUrl,
    credits_used: creditsUsed,
  })
  if (error) console.error('[logGeneration]', error.message)
}

// Débite le solde (SET au nouveau total). Même contrainte builder que ci-dessus :
// on await + lit { error } (jamais .catch() sur un builder Supabase).
// v1 : read-then-write (solde lu à l'auth) — le bouton est désactivé pendant la
// génération, le risque de double-débit concurrent est négligeable.
async function deductCredit(userId, newBalance) {
  const admin = getAdminClient()
  if (!admin) return
  const { error } = await admin
    .from('profiles')
    .update({ credits_balance: newBalance })
    .eq('id', userId)
  if (error) console.error('[deductCredit]', error.message)
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

    // Mode production : Replicate + Supabase configurés → auth obligatoire.
    // Mode démo : clé Replicate absente → on laisse generate() répondre no_key (stub honnête).
    let authCtx = null
    if (hasReplicate && hasSupabase) {
      if (!token) throw new ApiError(401, 'not_authenticated', 'Connecte-toi pour générer.')
      authCtx = await verifyAuthAndProfile(token)

      // Garde crédits : UNIQUEMENT pour les abonnements décomptés, AVANT de dépenser
      // Replicate. Les comptes gratuits génèrent librement (leur paywall = le flou du
      // résultat) → on ne les bloque jamais ici, sinon le tunnel « générer → flouter
      // → payer » serait cassé (credits_balance free = 0 par défaut).
      if (METERED_PLANS.has(authCtx.plan) && authCtx.credits < GENERATION_COST) {
        throw new ApiError(402, 'no_credits',
          'Crédits épuisés. Attends le renouvellement de ton abonnement ou passe à une offre supérieure.')
      }
    }

    const result = await generate(body)

    // Débit APRÈS succès, uniquement pour les abonnements décomptés
    // (si Replicate échoue, aucun crédit perdu).
    let creditsLeft = null
    if (authCtx) {
      const metered = METERED_PLANS.has(authCtx.plan)
      if (metered) {
        creditsLeft = Math.max(0, authCtx.credits - GENERATION_COST)
        await deductCredit(authCtx.userId, creditsLeft)
      }
      await logGeneration({
        userId:      authCtx.userId,
        body,
        imageUrl:    result.imageUrl,
        creditsUsed: metered ? GENERATION_COST : 0,
      })
    }

    return { status: 200, payload: { ...result, credits: creditsLeft } }

  } catch (err) {
    if (err instanceof ApiError) {
      return { status: err.status, payload: { error: err.code, message: err.message } }
    }
    console.error('[runGenerate] erreur inattendue :', err)
    return { status: 500, payload: { error: 'internal', message: 'Erreur interne. Réessaie.' } }
  }
}
