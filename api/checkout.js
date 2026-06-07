// Adaptateur PROD (fonction serverless Vercel) : POST /api/checkout.
// Même cœur métier que le plugin Vite de dev. Crée une session Stripe Checkout
// et renvoie son URL ; le client redirige dessus. Clés via l'env Vercel.
import { createCheckout } from '../server/lib/checkout-core.js'
import { ApiError } from '../server/lib/generate.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method', message: 'POST requis.' })
    return
  }
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { res.status(400).json({ error: 'bad_json', message: 'Requête invalide.' }); return }
  }
  const token  = (req.headers['authorization'] || '').replace('Bearer ', '').trim() || null
  const origin = req.headers['origin'] || (req.headers['host'] ? `https://${req.headers['host']}` : '')

  try {
    const { url } = await createCheckout({ priceKey: body?.priceKey, token, origin })
    res.status(200).json({ url })
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.status).json({ error: err.code, message: err.message })
      return
    }
    console.error('[api/checkout] erreur inattendue :', err?.message)
    res.status(500).json({ error: 'internal', message: 'Erreur interne. Réessaie.' })
  }
}
