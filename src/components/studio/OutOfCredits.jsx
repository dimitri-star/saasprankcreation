import { Link } from 'react-router-dom'

// Affiché quand un abonné métré tombe à 0 crédit (réponse serveur 402 no_credits).
// Propose les 3 sorties autonomes : recharger des crédits, changer de forfait,
// ou attendre le renouvellement de l'abonnement.
export default function OutOfCredits({ message }) {
  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-500/[0.08] p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-white">
        <span>⚡</span> Crédits épuisés
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
        {message || 'Tu as utilisé tous tes crédits. Recharge-en ou passe à une offre supérieure pour continuer à générer.'}
      </p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <Link to="/abonnement#sans-abonnement" className="btn-bleu flex-1 justify-center text-sm">
          ⚡ Recharger des crédits
        </Link>
        <Link to="/abonnement" className="btn-ghost flex-1 justify-center text-sm">
          Changer de forfait
        </Link>
      </div>
      <p className="mt-3 text-[11px] text-white/40">
        Ou attends le renouvellement de ton abonnement : tes crédits se rechargent automatiquement.
      </p>
    </div>
  )
}
