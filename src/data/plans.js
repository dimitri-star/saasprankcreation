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
    price: { monthly: '7,99', annual: '6,39' },
    annualBilled: '76,68 € facturés / an',
    annualSavings: '19',
    features: [
      '2000 crédits / mois',
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
    price: { monthly: '14,99', annual: '11,99' },
    annualBilled: '143,88 € facturés / an',
    annualSavings: '36',
    features: [
      '7000 crédits / mois',
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
    price: { monthly: '34,99', annual: '27,99' },
    annualBilled: '335,88 € facturés / an',
    annualSavings: '84',
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
      '2000 crédits / mois — à vie',
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
      '6000 crédits / mois — à vie',
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
