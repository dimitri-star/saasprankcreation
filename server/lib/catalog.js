// Catalogue Stripe — SOURCE DE VÉRITÉ CÔTÉ SERVEUR.
// Le client n'envoie JAMAIS un montant : seulement un `priceKey` validé ici
// (anti-tampering — un client malveillant ne peut pas se forger un prix à 0 €).
// Les `price_id` réels sont écrits par `scripts/stripe-setup.mjs` dans
// `stripe-prices.generated.json` (non secrets, committables).
import { readFileSync } from 'node:fs'

// Chargement défensif des price_id générés (absents tant que le script de setup
// n'a pas tourné → le checkout renverra une erreur claire `stripe_not_setup`).
let GENERATED = {}
try {
  GENERATED = JSON.parse(
    readFileSync(new URL('./stripe-prices.generated.json', import.meta.url), 'utf8'),
  )
} catch {
  GENERATED = {}
}

const EUR = 'eur'
// Sentinelle « illimité » (v1) : un grand solde rechargé à chaque période.
// Pas de bypass du compteur dans http.js — simple et sûr pour le lancement.
const UNLIMITED = 9999

// mode: 'subscription' | 'payment' ; `interval` requis si subscription.
// `creditsPerPeriod` = crédits accordés à CHAQUE facturation (annuel = 12× mensuel).
export const CATALOG = {
  // ── Paywall /debloquer ──
  weekly:  { label: 'PrankCreation Hebdo',   mode: 'subscription', interval: 'week',  amount: 199,  currency: EUR, creditsPerPeriod: 5,         plan: 'weekly'  },
  monthly: { label: 'PrankCreation Mensuel', mode: 'subscription', interval: 'month', amount: 299,  currency: EUR, creditsPerPeriod: 10,        plan: 'monthly' },

  // ── Abonnements /abonnement (mensuel + annuel) ──
  evasion_monthly:   { label: 'Évasion — mensuel',   mode: 'subscription', interval: 'month', amount: 499,   currency: EUR, creditsPerPeriod: 20,        plan: 'evasion'   },
  evasion_annual:    { label: 'Évasion — annuel',    mode: 'subscription', interval: 'year',  amount: 4788,  currency: EUR, creditsPerPeriod: 240,       plan: 'evasion'   },
  signature_monthly: { label: 'Signature — mensuel', mode: 'subscription', interval: 'month', amount: 999,   currency: EUR, creditsPerPeriod: 70,        plan: 'signature' },
  signature_annual:  { label: 'Signature — annuel',  mode: 'subscription', interval: 'year',  amount: 9588,  currency: EUR, creditsPerPeriod: 840,       plan: 'signature' },
  prestige_monthly:  { label: 'Prestige — mensuel',  mode: 'subscription', interval: 'month', amount: 1999,  currency: EUR, creditsPerPeriod: UNLIMITED, plan: 'prestige'  },
  prestige_annual:   { label: 'Prestige — annuel',   mode: 'subscription', interval: 'year',  amount: 19188, currency: EUR, creditsPerPeriod: UNLIMITED, plan: 'prestige'  },

  // ── Tuto Snap (achat unique 0,99 €) ──
  'snap-tuto': { label: 'Tuto Snap Rouge', mode: 'payment', amount: 99, currency: EUR, creditsPerPeriod: 0, plan: 'snap_tuto' },

  // ── Offres « à vie » (paiement unique) ──
  // creditsPerPeriod = crédits accordés à l'achat. La recharge mensuelle « à vie »
  // = un cron à brancher plus tard (TODO) ; v1 = un seul octroi.
  'avie-echappee': { label: 'Échappée — à vie', mode: 'payment', amount: 4900,  currency: EUR, creditsPerPeriod: 20,        plan: 'lifetime_echappee' },
  'avie-odyssee':  { label: 'Odyssée — à vie',  mode: 'payment', amount: 9900,  currency: EUR, creditsPerPeriod: 60,        plan: 'lifetime_odyssee'  },
  'avie-infini':   { label: 'Infini — à vie',   mode: 'payment', amount: 16900, currency: EUR, creditsPerPeriod: UNLIMITED, plan: 'lifetime_infini'   },
}

export const UNLIMITED_CREDITS = UNLIMITED

// priceKey → price_id Stripe (null si le setup n'a pas encore tourné).
export function getPriceId(priceKey) {
  return GENERATED[priceKey] || null
}

// price_id → priceKey (utilisé par le webhook pour les renouvellements d'abo).
export function priceKeyFromId(priceId) {
  for (const [key, id] of Object.entries(GENERATED)) {
    if (id === priceId) return key
  }
  return null
}
