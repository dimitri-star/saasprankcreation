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
    console.error('[billing-portal] Stripe:', stripeErr?.type, stripeErr?.message)
    // Mismatch test/live ou customer supprimé → on efface le customer_id en base
    // pour que le prochain checkout recrée un customer dans le bon mode.
    if (stripeErr?.code === 'resource_missing') {
      await getAdminClient()
        .from('profiles')
        .update({ stripe_customer_id: null })
        .eq('id', user.id)
        .catch(() => {})
      throw new ApiError(404, 'no_customer', 'Abonnement introuvable — souscris à nouveau pour accéder au portail.')
    }
    throw new ApiError(502, 'stripe_error', 'Impossible d\'ouvrir le portail Stripe. Réessaie dans un instant.')
  }

  return { url: session.url }
}
