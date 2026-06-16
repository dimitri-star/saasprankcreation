export default function PlanCard({ plan, billing, onSelect, currentPlan }) {
  const price = plan.price[billing]
  // plan.id = 'evasion' | 'signature' | 'prestige' ; profile.plan = même valeur.
  const isCurrent = !!currentPlan && currentPlan === plan.id

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-5 transition-all duration-300 ${
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

      <div className="mt-4 flex items-end gap-1.5">
        <span className="font-display text-4xl font-bold leading-none text-white">
          {price} €
        </span>
        <span className="mb-1 text-sm text-white/45">/ mois</span>
        {billing === 'annual' && (
          <span className="mb-1.5 text-sm text-white/35 line-through decoration-white/30">
            {plan.price.monthly}
          </span>
        )}
      </div>
      <div className="mt-2 flex h-5 items-center gap-2">
        {billing === 'annual' ? (
          <>
            <span className="text-xs text-white/35">{plan.annualBilled}</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
              −{plan.annualSavings} €/an
            </span>
          </>
        ) : (
          <span className="text-xs text-white/35">Sans engagement · résiliable en 1 clic</span>
        )}
      </div>

      <div className="my-4 hairline" />

      {/* Crédits mis en avant (façon Credia, en bleu) */}
      <div className="mb-3 rounded-xl border border-bleu/40 bg-gradient-to-b from-bleu/[0.16] to-bleu/[0.03] px-4 py-2.5 text-center shadow-[0_0_30px_-10px] shadow-bleu/50">
        <span className="font-display text-xl font-bold text-white">{plan.credits}</span>
      </div>

      {/* Tuto Snap Rouge inclus (façon Credia, en rouge) */}
      {plan.snapTuto && (
        <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-red-500/35 bg-red-500/[0.08] px-3.5 py-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm">🔴</span>
          <span className="text-[13px] font-bold text-white">Tutoriel Snap Rouge inclus</span>
        </div>
      )}

      <ul className="flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
            <span className="mt-0.5 shrink-0 text-bleu">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="mt-7 w-full rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] py-3 text-center text-sm font-semibold text-emerald-300">
          ✓ Abonnement actuel
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
