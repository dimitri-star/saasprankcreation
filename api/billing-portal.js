// Adaptateur PROD (fonction serverless Vercel) : POST /api/billing-portal.
// Crée une session Stripe Customer Portal et renvoie l'URL de gestion d'abo.
import { createBillingPortal } from '../server/lib/billing-portal-core.js'
import { ApiError } from '../server/lib/generate.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method', message: 'POST requis.' })
    return
  }
  const token  = (req.headers['authorization'] || '').replace('Bearer ', '').trim() || null
  const origin = req.headers['origin'] || (req.headers['host'] ? `https://${req.headers['host']}` : '')

  try {
    const { url } = await createBillingPortal({ token, origin })
    res.status(200).json({ url })
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.status).json({ error: err.code, message: err.message })
      return
    }
    console.error('[api/billing-portal] erreur :', err?.message)
    res.status(500).json({ error: 'internal', message: 'Erreur interne. Réessaie.' })
  }
}
