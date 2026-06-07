// Démarre un paiement Stripe : récupère le JWT Supabase, demande une session de
// Checkout au serveur, puis redirige vers la page Stripe hébergée.
// Lève une Error avec `.code = 'auth'` si l'utilisateur n'est pas connecté
// (l'appelant ouvre alors la modale d'auth).
import { supabase } from './supabase.js'

export async function startCheckout(priceKey) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) {
    const e = new Error('Connecte-toi pour payer.')
    e.code = 'auth'
    throw e
  }

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ priceKey }),
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok || !data.url) {
    const e = new Error(data.message || 'Le paiement n’a pas pu démarrer. Réessaie.')
    e.code = data.error || 'failed'
    throw e
  }

  // Redirection vers la page de paiement Stripe.
  window.location.assign(data.url)
}
