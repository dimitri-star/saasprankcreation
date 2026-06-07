// Adaptateur DEV : monte POST /api/generate dans le serveur Vite (aucun second
// process, aucun proxy). En prod c'est la fonction Vercel `api/generate.js` qui
// sert la même route via le même cœur métier. Plugin actif uniquement en `serve`.
import { loadEnv } from 'vite'
import { readJson, runGenerate } from './lib/http.js'
import { createCheckout } from './lib/checkout-core.js'
import { handleWebhook } from './lib/webhook-core.js'
import { createBillingPortal } from './lib/billing-portal-core.js'

// Lit le corps BRUT (Buffer) sans le parser — requis pour la signature Stripe.
function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// Réponse JSON utilitaire (dev).
function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export default function devApi() {
  return {
    name: 'destinia-dev-api',
    apply: 'serve',

    // Pont d'env : Vite n'expose que les variables VITE_* au client. La clé
    // Replicate (sensible) reste côté serveur — on la copie dans process.env
    // depuis .env.local pour que le cœur métier la lise comme en prod (Vercel).
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      // Pont d'env : copie les vars sensibles côté serveur (non préfixées VITE_)
      // depuis .env.local dans process.env pour que le cœur métier les lise.
      const SERVER_VARS = [
        'REPLICATE_API_TOKEN',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'OPENAI_API_KEY',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
      ]
      for (const key of SERVER_VARS) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }
    },

    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'method', message: 'POST requis.' }))
          return
        }
        let result
        try {
          const body  = await readJson(req)
          const ip    = req.socket?.remoteAddress || 'dev'
          const token = (req.headers.authorization || '').replace('Bearer ', '').trim() || null
          result = await runGenerate({ body, ip, token })
        } catch (err) {
          // readJson rejette une ApiError (413/400) — la mapper proprement.
          const status = err?.status || 400
          result = { status, payload: { error: err?.code || 'bad_request', message: err?.message || 'Requête invalide.' } }
        }
        res.statusCode = result.status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result.payload))
      })

      // POST /api/checkout — crée une session Stripe Checkout, renvoie son URL.
      server.middlewares.use('/api/checkout', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method', message: 'POST requis.' })
        try {
          const body   = await readJson(req)
          const token  = (req.headers.authorization || '').replace('Bearer ', '').trim() || null
          const origin = req.headers.origin || ''
          const { url } = await createCheckout({ priceKey: body?.priceKey, token, origin })
          sendJson(res, 200, { url })
        } catch (err) {
          sendJson(res, err?.status || 500, { error: err?.code || 'internal', message: err?.message || 'Erreur interne.' })
        }
      })

      // POST /api/billing-portal — crée une session Customer Portal Stripe (gestion/annulation abo).
      server.middlewares.use('/api/billing-portal', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method', message: 'POST requis.' })
        try {
          const token  = (req.headers.authorization || '').replace('Bearer ', '').trim() || null
          const origin = req.headers.origin || ''
          const { url } = await createBillingPortal({ token, origin })
          sendJson(res, 200, { url })
        } catch (err) {
          sendJson(res, err?.status || 500, { error: err?.code || 'internal', message: err?.message || 'Erreur interne.' })
        }
      })

      // POST /api/stripe-webhook — corps BRUT + signature vérifiée → crédite le compte.
      server.middlewares.use('/api/stripe-webhook', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method' })
        try {
          const rawBody   = await readRaw(req)
          const signature = req.headers['stripe-signature']
          const { status, body } = await handleWebhook({ rawBody, signature })
          sendJson(res, status, body)
        } catch (err) {
          sendJson(res, 500, { error: 'internal', message: err?.message || 'Erreur interne.' })
        }
      })
    },
  }
}
