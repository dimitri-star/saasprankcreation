import LegalPage from '../components/legal/LegalPage.jsx'

// Conditions Générales de Vente — obligatoires pour tout service payant en France.
// Art. L. 111-1 et suivants du Code de la consommation.
const sections = [
  {
    title: "Vendeur",
    body: [
      "ALVAREZ DIMITRI, entrepreneur individuel (micro-entreprise) — SIREN 927 669 705, SIRET 927 669 705 00018.",
      "Siège social : 31 RUE PIGNI, 31500 TOULOUSE.",
      "Contact : hello@prankcreation.app.",
    ],
  },
  {
    title: "Objet",
    body: [
      "Les présentes Conditions Générales de Vente (CGV) régissent les achats d'abonnements et de services numériques effectués sur PrankCreation (prankcreation.app).",
      "Tout achat implique l'acceptation sans réserve des présentes CGV.",
    ],
  },
  {
    title: "Description des offres",
    body: [
      "Abonnement Hebdomadaire — 1,99 € TTC / semaine. Accès au service de génération d'images par IA (5 générations incluses). Renouvellement automatique chaque semaine.",
      "Abonnement Mensuel — 2,99 € TTC / mois. Accès au service de génération d'images par IA (10 générations incluses). Renouvellement automatique chaque mois.",
      "Les prix sont indiqués en euros, toutes taxes comprises. En tant que micro-entreprise, la TVA n'est pas applicable (article 293 B du CGI).",
    ],
  },
  {
    title: "Modalités de paiement",
    body: [
      "Le paiement est effectué en ligne et de façon sécurisée via Stripe (stripe.com). Les données de carte bancaire ne transitent pas par nos serveurs.",
      "Le paiement est exigible à la souscription, puis à chaque renouvellement de période.",
    ],
  },
  {
    title: "Droit de rétractation",
    body: [
      "Conformément à l'article L. 221-28 3° du Code de la consommation, le droit de rétractation ne peut pas être exercé pour les contenus numériques fournis sur support immatériel dont l'exécution a commencé avec l'accord préalable de l'utilisateur.",
      "En souscrivant à un abonnement et en accédant au service de génération d'images, l'utilisateur reconnaît expressément renoncer à son droit de rétractation de 14 jours prévu à l'article L. 221-18 du Code de la consommation.",
    ],
  },
  {
    title: "Résiliation et remboursement",
    body: [
      "L'abonnement peut être résilié à tout moment depuis le portail de gestion accessible via les paramètres du compte. La résiliation prend effet à la fin de la période en cours ; aucune période entamée n'est remboursée.",
      "En cas d'anomalie technique imputable au service empêchant son utilisation pendant plus de 48 heures consécutives, une prolongation ou un remboursement au prorata peut être accordé sur demande à hello@prankcreation.app.",
    ],
  },
  {
    title: "Propriété intellectuelle",
    body: [
      "L'utilisateur conserve les droits sur la photo originale qu'il fournit. Les images générées par IA sont mises à disposition de l'utilisateur à titre personnel et non commercial.",
      "Toute revente, exploitation commerciale ou distribution des images générées est interdite sans autorisation écrite préalable.",
      "L'utilisateur garantit qu'il dispose des droits sur les photos fournies et de l'autorisation des personnes y figurant.",
    ],
  },
  {
    title: "Responsabilité",
    body: [
      "PrankCreation est un outil de divertissement. Les images produites sont des créations générées par IA et ne constituent pas des photographies réelles.",
      "L'utilisateur est seul responsable de l'usage des images générées. Il s'engage à ne pas les utiliser à des fins trompeuses, diffamatoires, portant atteinte à l'image d'une personne ou à tout autre droit de tiers.",
      "Notre responsabilité est limitée au montant payé par l'utilisateur au titre de la période en cours.",
    ],
  },
  {
    title: "Données personnelles",
    body: [
      "Le traitement des données est régi par la Politique de confidentialité disponible sur ce site.",
    ],
  },
  {
    title: "Droit applicable et litiges",
    body: [
      "Les présentes CGV sont soumises au droit français.",
      "En cas de litige, l'utilisateur peut recourir gratuitement à un service de médiation de la consommation. À défaut de résolution amiable, les tribunaux compétents seront ceux du ressort du siège du vendeur.",
    ],
  },
]

export default function CGV() {
  return (
    <LegalPage
      eyebrow="Conditions contractuelles"
      title="Conditions Générales de Vente"
      updated="7 juin 2026"
      sections={sections}
    />
  )
}
