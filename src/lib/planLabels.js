// Labels lisibles côté client pour les plans Stripe.
// Doit rester aligné avec le `plan` posé par webhook-core.js (catalog.js).
export const PLAN_LABELS = {
  free:              'Gratuit',
  weekly:            'Hebdo',
  monthly:           'Mensuel',
  evasion:           'Évasion',
  signature:         'Signature',
  prestige:          'Prestige',
  lifetime_echappee: 'Échappée · À vie',
  lifetime_odyssee:  'Odyssée · À vie',
  lifetime_infini:   'Infini · À vie',
}

export const PLAN_CREDITS_LABEL = {
  free:              '3 crédits offerts',
  weekly:            '5 crédits / semaine',
  monthly:           '10 crédits / mois',
  evasion:           '20 crédits / mois',
  signature:         '70 crédits / mois',
  prestige:          'Crédits illimités',
  lifetime_echappee: '20 crédits / mois · À vie',
  lifetime_odyssee:  '60 crédits / mois · À vie',
  lifetime_infini:   'Crédits illimités · À vie',
}

/** Retourne le label humain d'un plan (ex. 'evasion' → 'Évasion'). */
export function planLabel(plan) {
  return PLAN_LABELS[plan] ?? 'Gratuit'
}

/** true si l'utilisateur a un abonnement actif (pas free / pas null). */
export function isPaid(plan) {
  return !!plan && plan !== 'free'
}
