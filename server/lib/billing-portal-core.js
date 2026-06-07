// Cœur métier du portail de facturation Stripe.
// Crée une session Customer Portal (gestion abo, annulation, historique)
// et renvoie l'URL vers laquelle rediriger l'utilisateur.
import { getStripe } from './stripe.js'
import { getAdminClient } from './supabase.js'
import { ApiError } from './generate.js'

export async function createBillingPortal({ token, origin }) {
  const stripe = getStripe()
  if (!stripe) throw new ApiError(503, 'stripe_missing', 'Paiement non configuré.')

  const admin = getAdminClient()
  if (!admin) throw new ApiError(503, 'supabase_missing', 'Auth non configurée.')

  if (!token) throw new ApiError(401, 'not_authenticated', 'Connecte-toi pour gérer ton abonnement.')
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) throw new ApiError(401, 'not_authenticated', 'Session invalide, reconnecte-toi.')

  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    throw new ApiError(404, 'no_customer', 'Aucun abonnement Stripe trouvé pour ce compte.')
  }

  if (!origin || !/^https?:\/\//.test(origin)) {
    throw new ApiError(400, 'bad_origin', 'Origine invalide.')
  }

  let session
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin.replace(/\/$/, '')}/abonnement`,
    })
  } catch (stripeErr) {
    const msg = stripeErr?.message || 'Stripe error inconnu'
    console.error('[billing-portal] Stripe error:', stripeErr?.type, '|', msg)
    throw new ApiError(502, 'stripe_error', msg)
  }

  return { url: session.url }
}
