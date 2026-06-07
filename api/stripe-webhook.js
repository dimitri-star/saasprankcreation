// Adaptateur PROD (fonction serverless Vercel) : POST /api/stripe-webhook.
// IMPORTANT : la vérification de signature Stripe exige le corps BRUT (non parsé)
// → on désactive le bodyParser de Vercel et on lit le flux nous-mêmes.
import { handleWebhook } from '../server/lib/webhook-core.js'

export const config = { api: { bodyParser: false } }

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method' })
    return
  }
  const rawBody = await readRaw(req)
  const signature = req.headers['stripe-signature']
  const { status, body } = await handleWebhook({ rawBody, signature })
  res.status(status).json(body)
}
