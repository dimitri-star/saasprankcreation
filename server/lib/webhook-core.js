// Cœur du webhook Stripe — partagé dev (plugin Vite) / prod (fonction Vercel).
// C'est la SEULE source de vérité qui crédite un compte : déclenché par Stripe
// après un paiement RÉEL, signature vérifiée. Jamais par le client.
import { getStripe } from './stripe.js'
import { getAdminClient } from './supabase.js'
import { CATALOG, priceKeyFromId } from './catalog.js'

// Applique un octroi : pose le plan + (re)met le solde de crédits de la période.
// SET (pas d'accumulation) → idempotent.
// Cas spécial snap-tuto : ne pas écraser un plan d'abonnement existant ;
// ne set que si l'utilisateur est actuellement sur le plan gratuit.
const SUBSCRIPTION_PLANS = new Set(['weekly','monthly','evasion','signature','prestige','lifetime_echappee','lifetime_odyssee','lifetime_infini'])

async function grant(admin, userId, priceKey) {
  const item = CATALOG[priceKey]
  if (!item || !userId) return

  if (item.plan === 'snap_tuto') {
    const { data: profile } = await admin.from('profiles').select('plan').eq('id', userId).single()
    if (SUBSCRIPTION_PLANS.has(profile?.plan)) {
      // Déjà abonné : ne pas écraser le plan, mais marquer le tuto comme déverrouillé
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { snap_tuto_unlocked: true }
      })
      return
    }
    await admin.from('profiles').update({ plan: 'snap_tuto' }).eq('id', userId)
    return
  }

  await admin
    .from('profiles')
    .update({ plan: item.plan, credits_balance: item.creditsPerPeriod })
    .eq('id', userId)
}

// Retrouve l'utilisateur via son customer Stripe mémorisé sur le profil.
async function userIdFromCustomer(admin, customerId) {
  if (!customerId) return null
  const { data } = await admin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  return data?.id || null
}

export async function handleWebhook({ rawBody, signature }) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return { status: 503, body: { error: 'stripe_missing' } }

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    console.error('[webhook] signature invalide :', err?.message)
    return { status: 400, body: { error: 'bad_signature' } }
  }

  const admin = getAdminClient()
  if (!admin) return { status: 503, body: { error: 'supabase_missing' } }

  try {
    switch (event.type) {
      // Paiement initial (abo OU one-time « à vie ») terminé.
      case 'checkout.session.completed': {
        const s = event.data.object
        const userId = s.metadata?.user_id || s.client_reference_id
        if (userId && s.customer) {
          await admin.from('profiles').update({ stripe_customer_id: s.customer }).eq('id', userId)
        }
        await grant(admin, userId, s.metadata?.price_key)
        break
      }

      // Renouvellement d'abonnement (et 1re facture) → recharge des crédits.
      case 'invoice.paid': {
        const inv = event.data.object
        const linePrice = inv.lines?.data?.[0]?.price?.id
        const priceKey = linePrice ? priceKeyFromId(linePrice) : null
        const userId = await userIdFromCustomer(admin, inv.customer)
        if (priceKey) await grant(admin, userId, priceKey)
        break
      }

      // Abonnement résilié/expiré → retour au plan gratuit (crédits restants conservés).
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const userId = sub.metadata?.user_id || (await userIdFromCustomer(admin, sub.customer))
        if (userId) await admin.from('profiles').update({ plan: 'free' }).eq('id', userId)
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('[webhook] traitement échoué :', event.type, '|', err?.message)
    return { status: 500, body: { error: 'handler_error' } }
  }

  return { status: 200, body: { received: true } }
}
