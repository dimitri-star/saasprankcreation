// Labels lisibles côté client pour les plans Stripe.
// Doit rester aligné avec le `plan` posé par webhook-core.js (catalog.js).
export const PLAN_LABELS = {
  free:              'Gratuit',
  unlock:            'Photo débloquée',
  credits:           'Crédits',
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
  unlock:            '300 crédits · paiement unique',
  credits:           'Pack de crédits · paiement unique',
  weekly:            '500 crédits / semaine',
  monthly:           '1000 crédits / mois',
  evasion:           '2000 crédits / mois',
  signature:         '7000 crédits / mois',
  prestige:          'Crédits illimités',
  lifetime_echappee: '2000 crédits / mois · À vie',
  lifetime_odyssee:  '6000 crédits / mois · À vie',
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

/** true si le plan accorde des crédits illimités → afficher « illimité » au lieu du solde brut. */
export function isUnlimitedPlan(plan) {
  return plan === 'prestige' || plan === 'lifetime_infini'
}

// Plans qui incluent l'accès Snap : Tuto Snap déverrouillé + bouton « Envoyer sur Snap »
// dans le Studio. (Le flag user_metadata.snap_tuto_unlocked s'ajoute en plus, côté
// composant, pour un abonné ayant acheté le tuto sans changer de plan.)
export const SNAP_PLANS = new Set(['signature', 'prestige', 'lifetime_odyssee', 'lifetime_infini', 'snap_tuto'])

/** true si le plan inclut l'accès Snap (tuto + partage). */
export function hasSnapAccess(plan) {
  return !!plan && SNAP_PLANS.has(plan)
}
