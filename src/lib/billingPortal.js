// Helper client : ouvre le portail Stripe de gestion d'abonnement.
// Appelle POST /api/billing-portal (auth JWT) → reçoit une URL Stripe → redirige.
import { supabase } from './supabase.js'

export async function openBillingPortal() {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token || null

  const res = await fetch('/api/billing-portal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({}),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || "Impossible d'ouvrir le portail.")
  if (data.url) window.location.href = data.url
}
