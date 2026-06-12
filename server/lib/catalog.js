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
// Doit rester TRÈS au-dessus du plus gros palier fini (signature_annual = 84000)
// pour que la dérivation METERED et la détection « illimité » restent nettes.
const UNLIMITED = 9_999_900

// Coût en crédits d'UNE génération. Les crédits sont « gonflés » (×100) pour s'aligner sur
// l'affichage des concurrents (2000 / 7000 crédits) SANS toucher au nombre réel d'images :
// 1 image = 100 crédits ⇒ 2000 crédits = 20 images. Le coût Replicate ne bouge donc pas.
export const GENERATION_COST = 100

// mode: 'subscription' | 'payment' ; `interval` requis si subscription.
// `creditsPerPeriod` = crédits accordés à CHAQUE facturation (annuel = 12× mensuel).
export const CATALOG = {
  // ── Paywall /debloquer ──
  weekly:  { label: 'PrankCreation Hebdo',   mode: 'subscription', interval: 'week',  amount: 199,  currency: EUR, creditsPerPeriod: 500,       plan: 'weekly'  },
  monthly: { label: 'PrankCreation Mensuel', mode: 'subscription', interval: 'month', amount: 299,  currency: EUR, creditsPerPeriod: 1000,      plan: 'monthly' },

  // ── Abonnements /abonnement (mensuel + annuel) ──
  evasion_monthly:   { label: 'Évasion — mensuel',   mode: 'subscription', interval: 'month', amount: 799,   currency: EUR, creditsPerPeriod: 2000,      plan: 'evasion'   },
  evasion_annual:    { label: 'Évasion — annuel',    mode: 'subscription', interval: 'year',  amount: 7668,  currency: EUR, creditsPerPeriod: 24000,     plan: 'evasion'   },
  signature_monthly: { label: 'Signature — mensuel', mode: 'subscription', interval: 'month', amount: 1499,  currency: EUR, creditsPerPeriod: 7000,      plan: 'signature' },
  signature_annual:  { label: 'Signature — annuel',  mode: 'subscription', interval: 'year',  amount: 14388, currency: EUR, creditsPerPeriod: 84000,     plan: 'signature' },
  prestige_monthly:  { label: 'Prestige — mensuel',  mode: 'subscription', interval: 'month', amount: 3499,  currency: EUR, creditsPerPeriod: UNLIMITED, plan: 'prestige'  },
  prestige_annual:   { label: 'Prestige — annuel',   mode: 'subscription', interval: 'year',  amount: 33588, currency: EUR, creditsPerPeriod: UNLIMITED, plan: 'prestige'  },

  // ── Tuto Snap (achat unique 2,99 €) ──
  'snap-tuto': { label: 'Tuto Snap Rouge', mode: 'payment', amount: 299, currency: EUR, creditsPerPeriod: 0, plan: 'snap_tuto' },

  // ── Déblocage à l'unité (paiement unique, façon « Recharge de crédits » Credia) ──
  // Pour qui REFUSE l'abonnement : débloque sa photo + petit pack (3 photos). plan:'unlock'
  // → isPaid('unlock')=true (défloute le résultat) ET métré (creditsPerPeriod fini → décompté,
  // bloque la génération à 0). Pas de modif webhook : grant() pose plan+credits génériquement.
  'unlock-photo': { label: 'Débloque ta photo', mode: 'payment', amount: 299, currency: EUR, creditsPerPeriod: 300, plan: 'unlock' },

  // ── Offres « à vie » (paiement unique) ──
  // creditsPerPeriod = crédits accordés à l'achat. La recharge mensuelle « à vie »
  // = un cron à brancher plus tard (TODO) ; v1 = un seul octroi.
  'avie-echappee': { label: 'Échappée — à vie', mode: 'payment', amount: 4900,  currency: EUR, creditsPerPeriod: 2000,      plan: 'lifetime_echappee' },
  'avie-odyssee':  { label: 'Odyssée — à vie',  mode: 'payment', amount: 9900,  currency: EUR, creditsPerPeriod: 6000,      plan: 'lifetime_odyssee'  },
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
