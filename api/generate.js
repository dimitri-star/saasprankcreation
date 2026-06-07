// Adaptateur PROD (fonction serverless Vercel) : même route /api/generate, même
// cœur métier que le plugin Vite de dev. La clé Replicate vient des variables
// d'environnement Vercel (jamais committée, jamais exposée au client).
//
// NB prod : le corps d'une fonction Vercel est plafonné à ~4,5 Mo. Une photo de
// 10 Mo encodée base64 dépasse ce seuil → à l'étape Supabase (B), on uploadera
// la photo vers le storage et on passera une URL au lieu du data URL. En dev
// (plugin Vite), il n'y a pas cette limite : la génération est vérifiable ici.
import { runGenerate } from '../server/lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method', message: 'POST requis.' })
    return
  }
  // Vercel parse déjà le JSON ; tolère une string par sécurité.
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      res.status(400).json({ error: 'bad_json', message: 'Requête invalide.' })
      return
    }
  }
  const ip    = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'prod'
  const token = (req.headers['authorization'] || '').replace('Bearer ', '').trim() || null
  const { status, payload } = await runGenerate({ body, ip, token })
  res.status(status).json(payload)
}
