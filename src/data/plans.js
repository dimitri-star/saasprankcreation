// Données mockées des plans d'abonnement (étape UI — pas de Stripe).
// Prix calés sur des paliers éprouvés ; l'annuel = -20% sur le mensuel.
// Le checkout Stripe réel sera branché à l'étape 6 (clé requise).

export const billingOptions = [
  { id: 'monthly', label: 'Mensuel' },
  { id: 'annual', label: 'Annuel', badge: '2 mois offerts' },
]

export const plans = [
  {
    id: 'evasion',
    name: 'Découverte',
    tagline: 'Parfait pour tester et bluffer tes potes',
    icon: '✦',
    popular: false,
    price: { monthly: '9,90', annual: '9,90' },
    priceStruck: '11,90',
    annualBilled: '99 € facturés / an',
    annualSavings: '20',
    credits: '2000 crédits / mois',
    creditsNote: 'Parfait pour explorer et tester tes idées',
    snapTuto: false,
    features: [
      'Photos IA ultra-réalistes',
      'Ton visage préservé dans chaque scène',
      'Toutes les catégories (voyage, voiture, muscle, soirée…)',
      'Téléchargement sans filigrane',
      'Champ libre pour décrire ta transfo',
      'Accès au chat communauté',
      'Sans engagement · résiliable en 1 clic',
    ],
    cta: 'Choisir Découverte',
  },
  {
    id: 'signature',
    name: 'Essentiel',
    tagline: 'Le meilleur choix pour poster à fond',
    icon: '❖',
    popular: true,
    price: { monthly: '19,90', annual: '19,90' },
    priceStruck: '24,90',
    annualBilled: '199 € facturés / an',
    annualSavings: '40',
    credits: '5000 crédits / mois',
    creditsBonus: '+2000 crédits offerts',
    creditsNote: 'Le meilleur choix pour les passionnés',
    snapTuto: true,
    features: [
      'Tout ce qu’il y a dans Découverte',
      '3,5× plus de crédits chaque mois',
      'Tutoriel Snap Rouge inclus',
      'Rendu parmi les plus réalistes du marché',
      'Accès au chat communauté',
      'Support par chat réactif',
      'Résiliable à tout moment',
    ],
    cta: 'Choisir Essentiel',
  },
  {
    id: 'prestige',
    name: 'Ultimate',
    tagline: 'Pour les créateurs sans aucune limite',
    icon: '◆',
    popular: false,
    price: { monthly: '39,90', annual: '39,90' },
    priceStruck: '49,90',
    annualBilled: '399 € facturés / an',
    annualSavings: '80',
    credits: 'Crédits illimités',
    creditsNote: 'Pour les créateurs sans limites',
    snapTuto: true,
    features: [
      'Tout ce qu’il y a dans Essentiel',
      'Crédits ILLIMITÉS chaque mois',
      'Tutoriel Snap Rouge inclus',
      'Photos indiscernables d’une vraie photo',
      'Nouvelles transfos en avant-première',
      'Support dédié',
    ],
    cta: 'Choisir Ultimate',
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
