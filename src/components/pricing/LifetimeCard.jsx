// Carte « à vie » : paiement unique (pas de toggle mensuel/annuel).
// Style calé sur PlanCard ; badge « Le plus choisi » pour le palier populaire.
// plan.id = 'avie-echappee' etc. → profile.plan = 'lifetime_echappee' etc.
const LIFETIME_MAP = {
  'avie-echappee': 'lifetime_echappee',
  'avie-odyssee':  'lifetime_odyssee',
  'avie-infini':   'lifetime_infini',
}

export default function LifetimeCard({ plan, onSelect, currentPlan }) {
  const isCurrent = !!currentPlan && LIFETIME_MAP[plan.id] === currentPlan
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 ${
        plan.popular
          ? 'border-bleu/40 bg-gradient-to-b from-bleu/[0.08] to-white/[0.02] shadow-bleu backdrop-blur-xl'
          : 'glass hover:border-white/20'
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          ✓ Votre plan actuel
        </span>
      )}
      {!isCurrent && plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-bleu-light to-bleu px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Le plus choisi
        </span>
      )}

      <div className="mb-1 flex items-center gap-2">
        <span className="text-bleu">{plan.icon}</span>
        <h3 className="font-display text-2xl font-bold text-white">{plan.name}</h3>
      </div>
      <p className="text-sm text-white/45">{plan.tagline}</p>

      <div className="mt-6 flex items-end gap-1.5">
        <span className="font-display text-5xl font-bold leading-none text-white">
          {plan.price} €
        </span>
        <span className="mb-1 text-sm text-white/45">une fois</span>
      </div>
      <div className="mt-2 flex h-5 items-center">
        <span className="rounded-full bg-bleu/15 px-2 py-0.5 text-[11px] font-semibold text-bleu ring-1 ring-bleu/25">
          Paiement unique · à vie
        </span>
      </div>

      <div className="my-6 hairline" />

      <ul className="flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
            <span className="mt-0.5 shrink-0 text-bleu">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="mt-7 w-full rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] py-3 text-center text-sm font-semibold text-emerald-300">
          ✓ Accès à vie activé
        </div>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          className={`mt-7 w-full ${plan.popular ? 'btn-bleu' : 'btn-ghost'}`}
        >
          {plan.cta}
        </button>
      )}
    </div>
  )
}
