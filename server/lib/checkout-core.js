// Cœur métier du checkout Stripe — partagé entre l'adaptateur dev (plugin Vite)
// et l'adaptateur prod (fonction Vercel). Aucune dépendance HTTP ici.
// Sécurité : JWT obligatoire (on identifie qui paie), prix jamais fourni par le
// client (seulement un `priceKey` validé contre le CATALOG côté serveur).
import { getStripe } from './stripe.js'
import { getAdminClient } from './supabase.js'
import { CATALOG, getPriceId } from './catalog.js'
import { ApiError } from './generate.js'

export async function createCheckout({ priceKey, token, origin }) {
  const item = CATALOG[priceKey]
  if (!item) throw new ApiError(400, 'bad_plan', 'Offre inconnue.')

  const stripe = getStripe()
  if (!stripe) throw new ApiError(503, 'stripe_missing', 'Paiement non configuré (clé Stripe absente).')

  const admin = getAdminClient()
  if (!admin) throw new ApiError(503, 'supabase_missing', 'Auth non configurée.')

  const priceId = getPriceId(priceKey)
  if (!priceId) {
    throw new ApiError(503, 'stripe_not_setup', 'Tarifs Stripe pas encore créés — lance scripts/stripe-setup.mjs.')
  }

  if (!origin || !/^https?:\/\//.test(origin)) {
    throw new ApiError(400, 'bad_origin', "Origine de la requête invalide.")
  }

  // Auth obligatoire : on identifie l'utilisateur via son JWT Supabase.
  if (!token) throw new ApiError(401, 'not_authenticated', 'Connecte-toi pour payer.')
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) throw new ApiError(401, 'not_authenticated', 'Session invalide, reconnecte-toi.')

  // Get-or-create le client Stripe, mémorisé sur le profil (réutilisé aux prochains achats).
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || profile?.email || undefined,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const base = origin.replace(/\/$/, '')
  const session = await stripe.checkout.sessions.create({
    mode: item.mode,
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: priceKey === 'snap-tuto'
      ? `${base}/tuto-snap?checkout=success`
      : `${base}/studio?checkout=success`,
    cancel_url:  `${base}/abonnement?checkout=cancel`,
    client_reference_id: user.id,
    metadata: { user_id: user.id, price_key: priceKey },
    // Propage les métadonnées sur l'abonnement → exploitables aux renouvellements.
    ...(item.mode === 'subscription'
      ? { subscription_data: { metadata: { user_id: user.id, price_key: priceKey } } }
      : {}),
    allow_promotion_codes: true,
  })

  return { url: session.url }
}
