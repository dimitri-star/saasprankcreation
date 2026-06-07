// Données mockées des plans d'abonnement (étape UI — pas de Stripe).
// Prix calés sur des paliers éprouvés ; l'annuel = -20% sur le mensuel.
// Le checkout Stripe réel sera branché à l'étape 6 (clé requise).

export const billingOptions = [
  { id: 'monthly', label: 'Mensuel' },
  { id: 'annual', label: 'Annuel', badge: '-20%' },
  { id: 'lifetime', label: 'À vie' },
]

export const plans = [
  {
    id: 'evasion',
    name: 'Évasion',
    tagline: 'Pour tester et bluffer tes potes',
    icon: '✦',
    popular: false,
    price: { monthly: '4,99', annual: '3,99' },
    annualBilled: '47,88 € facturés / an',
    annualSavings: '12',
    features: [
      '20 transfos / mois',
      'Toutes les 8 catégories',
      'Téléchargement direct sans paywall',
      'Champ libre pour décrire ta transfo',
    ],
    cta: 'Choisir Évasion',
  },
  {
    id: 'signature',
    name: 'Signature',
    tagline: 'Pour ceux qui postent à fond',
    icon: '❖',
    popular: true,
    price: { monthly: '9,99', annual: '7,99' },
    annualBilled: '95,88 € facturés / an',
    annualSavings: '24',
    features: [
      '70 transfos / mois',
      'Toutes les 8 catégories',
      'Téléchargement direct sans paywall',
      'Champ libre pour décrire ta transfo',
      'Tuto Snap exclusif offert',
    ],
    cta: 'Choisir Signature',
  },
  {
    id: 'prestige',
    name: 'Prestige',
    tagline: 'Pour tout faire sans aucune limite',
    icon: '◆',
    popular: false,
    price: { monthly: '19,99', annual: '15,99' },
    annualBilled: '191,88 € facturés / an',
    annualSavings: '48',
    features: [
      'Transfos illimitées',
      'Toutes les 8 catégories',
      'Téléchargement direct sans paywall',
      'Champ libre pour décrire ta transfo',
      'Tuto Snap exclusif offert',
      'Accès en avant-première aux nouvelles transfos',
    ],
    cta: 'Choisir Prestige',
  },
]

// Offres « à vie » : paiement unique, sélectionnables via la 3e option du toggle (« À vie »).
// Plusieurs paliers (du moins cher à l'illimité) pour laisser le choix. Prix & crédits =
// placeholders à valider (décision business) ; checkout Stripe = étape 6.
// NB coût : seul « Infini » est illimité — les paliers bas bornent le coût Replicate (quota/mois).
export const lifetimePlans = [
  {
    id: 'avie-echappee',
    name: 'Échappée',
    tagline: 'L’essentiel, tu paies une seule fois',
    icon: '✦',
    popular: false,
    price: '49',
    features: [
      '20 crédits / mois — à vie',
      'Qualité HD · 2K',
      'Sans filigrane',
      'Aucun abonnement, jamais',
    ],
    cta: 'Choisir Échappée',
  },
  {
    id: 'avie-odyssee',
    name: 'Odyssée',
    tagline: 'Le meilleur deal, clairement',
    icon: '❖',
    popular: true,
    price: '99',
    features: [
      '60 crédits / mois — à vie',
      'Qualité 4K Ultra',
      'Sans filigrane',
      'Génération prioritaire',
      'Le tuto Snap offert',
      'Aucun abonnement, jamais',
    ],
    cta: 'Choisir Odyssée',
  },
  {
    id: 'avie-infini',
    name: 'Infini',
    tagline: 'Tout, de ouf, pour toujours',
    icon: '∞',
    popular: false,
    price: '169',
    features: [
      'Crédits illimités — à vie',
      'Qualité 4K Ultra',
      'Sans filigrane',
      'Génération flash prioritaire',
      'Le tuto Snap offert',
      'Toutes les futures fonctionnalités incluses',
      'Support dédié prioritaire',
    ],
    cta: 'Choisir Infini',
  },
]
