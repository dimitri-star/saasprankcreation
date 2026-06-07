import LegalPage from '../components/legal/LegalPage.jsx'

// Politique de confidentialité (RGPD). Décrit les flux de données PRÉVUS par la stack
// (Replicate / Supabase / Stripe / Vercel).
const sections = [
  {
    title: 'Responsable du traitement',
    body: [
      "Le responsable du traitement des données est ALVAREZ DIMITRI, entrepreneur individuel (micro-entreprise) — SIRET 927 669 705 00018, 31 RUE PIGNI, 31500 TOULOUSE.",
      "Pour toute question relative à tes données : hello@prankcreation.app.",
    ],
  },
  {
    title: 'Données que nous collectons',
    body: [
      "Compte : adresse e-mail et informations de connexion.",
      "Photos : les images que tu uploades pour générer tes photos, ainsi que les images générées.",
      "Paiement : gérées par Stripe. Nous ne stockons pas tes numéros de carte ; seules des informations de facturation (statut d'abonnement, identifiant client) sont conservées.",
      "Usage : données techniques de fonctionnement (logs, type d'appareil) à des fins de sécurité et d'amélioration.",
    ],
  },
  {
    title: 'Pourquoi nous les utilisons',
    body: [
      "Fournir le service : analyser ta photo et générer les images demandées.",
      "Gérer ton compte, ton abonnement et tes crédits.",
      "Assurer le support client et répondre à tes demandes.",
      "Améliorer la qualité du service et garantir sa sécurité.",
      "Respecter nos obligations légales (facturation, comptabilité).",
    ],
  },
  {
    title: 'Bases légales',
    body: [
      "Exécution du contrat (fourniture du service et gestion de l'abonnement).",
      "Consentement (traitement de la photo que tu choisis d'uploader).",
      "Intérêt légitime (sécurité, prévention de la fraude, amélioration).",
      "Obligation légale (conservation des documents de facturation).",
    ],
  },
  {
    title: 'Sous-traitants & destinataires',
    body: [
      "Replicate — génération des images par IA (traitement de la photo fournie).",
      "Supabase — authentification et stockage des données de compte.",
      "Stripe — traitement des paiements et de la facturation.",
      "Vercel — hébergement du site.",
      "Certains prestataires sont situés hors Union européenne ; les transferts sont encadrés par des garanties appropriées (clauses contractuelles types).",
    ],
  },
  {
    title: 'Durée de conservation',
    body: [
      "Tes photos et images générées : conservées le temps nécessaire au service ; tu peux les supprimer à tout moment depuis ton compte.",
      "Données de compte : conservées tant que ton compte est actif.",
      "Données de facturation : conservées selon les durées légales applicables.",
    ],
  },
  {
    title: 'Tes droits',
    body: [
      "Conformément au RGPD, tu disposes des droits d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité de tes données.",
      "Tu peux exercer ces droits en écrivant à hello@prankcreation.app.",
      "Tu peux également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
    ],
  },
  {
    title: 'Sécurité',
    body: [
      "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger tes données (chiffrement des échanges, accès restreints).",
      "Aucun système n'étant infaillible, nous ne pouvons garantir une sécurité absolue, mais nous nous engageons à réagir rapidement en cas d'incident.",
    ],
  },
  {
    title: 'Âge minimum',
    body: [
      "Le service est destiné à un public majeur. Si tu as entre 15 et 18 ans, l'accord d'un représentant légal peut être requis. Le service n'est pas destiné aux moins de 15 ans.",
    ],
  },
  {
    title: 'Modifications',
    body: [
      "Cette politique peut évoluer. En cas de changement important, nous t'en informerons via le site ou par e-mail. La date de dernière mise à jour figure en haut de cette page.",
    ],
  },
]

export default function Confidentialite() {
  return (
    <LegalPage
      eyebrow="Vie privée"
      title="Politique de confidentialité"
      updated="4 juin 2026"
      sections={sections}
    />
  )
}
