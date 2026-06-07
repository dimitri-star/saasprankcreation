// Client Stripe côté serveur. La clé secrète vient de l'env (jamais le client).
// Lazy-init façon getAdminClient (supabase.js) : renvoie null si non configuré
// → les features paiement restent désactivées proprement (stub honnête).
import Stripe from 'stripe'

let client = null

export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return null            // pas encore configuré → features off
    client = new Stripe(key)         // version d'API = défaut du SDK (épinglé par la lib)
  }
  return client
}
