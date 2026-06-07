import LegalPage from '../components/legal/LegalPage.jsx'

const sections = [
  {
    title: 'Éditeur du site',
    body: [
      'Le site PrankCreation est édité par ALVAREZ DIMITRI, entrepreneur individuel (micro-entreprise), immatriculé au RNE sous le numéro SIREN 927 669 705.',
      'SIRET (siège) : 927 669 705 00018 — TVA intracommunautaire : FR72927669705.',
      'Siège social : 31 RUE PIGNI, 31500 TOULOUSE.',
      'Directeur de la publication : ALVAREZ DIMITRI.',
      'Contact : hello@prankcreation.app.',
    ],
  },
  {
    title: 'Hébergement',
    body: [
      'Le site est hébergé par Vercel Inc., San Francisco, Californie, États-Unis — https://vercel.com.',
      'Les bases de données et services associés peuvent être opérés par Supabase et par les prestataires listés dans la politique de confidentialité.',
    ],
  },
  {
    title: 'Objet du service',
    body: [
      'PrankCreation est un service en ligne permettant, à partir d’une photo fournie par l’utilisateur, de générer une image ou une courte vidéo la replaçant dans une scène ou un décor de son choix à l’aide d’outils d’intelligence artificielle.',
      'Les images produites sont des créations générées par IA. Elles ne constituent pas des photographies réelles des scènes, lieux ou situations représentés.',
    ],
  },
  {
    title: 'Propriété intellectuelle',
    body: [
      'La marque, le logo, les textes, l’interface et les éléments graphiques de PrankCreation sont protégés. Toute reproduction sans autorisation est interdite.',
      'L’utilisateur conserve les droits sur la photo qu’il fournit. Il garantit disposer des droits nécessaires sur cette photo et l’autorisation des personnes y figurant.',
    ],
  },
  {
    title: 'Responsabilité',
    body: [
      'L’utilisateur est seul responsable de l’usage des images générées. Il s’engage à ne pas les utiliser à des fins trompeuses, diffamatoires, ou portant atteinte aux droits de tiers.',
      'PrankCreation ne saurait être tenu responsable des contenus créés par les utilisateurs ni de l’usage qu’ils en font.',
    ],
  },
  {
    title: 'Données personnelles & cookies',
    body: [
      'Le traitement des données personnelles est détaillé dans la Politique de confidentialité.',
      'Le site n’utilise que les cookies strictement nécessaires à son fonctionnement, sauf consentement contraire de l’utilisateur.',
    ],
  },
  {
    title: 'Droit applicable',
    body: [
      'Les présentes mentions sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux du ressort du siège de l’éditeur.',
    ],
  },
]

export default function MentionsLegales() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Mentions légales"
      updated="4 juin 2026"
      sections={sections}
    />
  )
}
