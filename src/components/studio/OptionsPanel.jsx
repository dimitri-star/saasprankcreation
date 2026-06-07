export default function OptionsPanel({ onGenerate, canGenerate, generating }) {
  return (
    <div className="glass flex h-full flex-col rounded-2xl p-5">
      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || generating}
          className="btn-bleu w-full disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {generating ? 'Génération…' : 'Générer ma photo →'}
        </button>
        <p className="mt-3 text-center text-xs text-white/35">
          {canGenerate
            ? 'Résultat en ~15 s · débloqué avec un abonnement'
            : 'Ajoute une photo et décris ta scène'}
        </p>
      </div>
    </div>
  )
}
