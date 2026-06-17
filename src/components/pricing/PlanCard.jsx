export default function PlanCard({ plan, billing, onSelect, currentPlan, loading = false }) {
  const price = plan.price[billing]
  // plan.id = 'evasion' | 'signature' | 'prestige' ; profile.plan = même valeur.
  const isCurrent = !!currentPlan && currentPlan === plan.id

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5 ${
        plan.popular
          ? 'border-bleu/50 bg-gradient-to-b from-bleu/[0.10] to-white/[0.02] shadow-bleu backdrop-blur-xl'
          : 'glass hover:border-bleu/30 hover:shadow-bleu'
      }`}
    >
      {/* Glow pulsé sur l'offre la plus choisie (attire l'œil, façon Credia) */}
      {plan.popular && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-bleu/[0.12] via-transparent to-transparent animate-pulse"
        />
      )}

      {isCurrent && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          ✓ Votre plan actuel
        </span>
      )}
      {!isCurrent && plan.popular && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-bleu-light to-bleu px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_-4px_rgba(59,130,246,0.8)]">
          ★ Le plus choisi
        </span>
      )}

      <div className="relative mb-1 flex items-center gap-2">
        <span className="text-bleu transition-transform duration-300 group-hover:scale-125">{plan.icon}</span>
        <h3 className="font-display text-2xl font-bold text-white">{plan.name}</h3>
      </div>
      <p className="relative text-sm text-white/45">{plan.tagline}</p>

      {/* Prix façon Credia : gros prix /mois, total annuel discret en petit gris */}
      <div className="relative mt-4">
        {billing === 'annual' && (
          <span className="mb-0.5 block text-sm text-white/30 line-through decoration-white/25">
            {plan.price.monthly} € / mois
          </span>
        )}
        <div className="flex items-end gap-1">
          <span className="font-display text-5xl font-bold leading-none text-white">{price}</span>
          <span className="mb-1 text-xl font-bold text-white">€</span>
          <span className="mb-1.5 text-sm text-white/45">/mois</span>
        </div>
        <span className="mt-1.5 block text-[11px] text-white/30">
          {billing === 'annual' ? plan.annualBilled : 'Sans engagement · résiliable en 1 clic'}
        </span>
      </div>

      <div className="relative my-4 hairline" />

      {/* Crédits mis en avant (façon Credia, en bleu) */}
      <div className="relative mb-3 rounded-xl border border-bleu/40 bg-gradient-to-b from-bleu/[0.16] to-bleu/[0.03] px-4 py-2.5 text-center shadow-[0_0_30px_-10px] shadow-bleu/50">
        <span className="font-display text-xl font-bold text-white">{plan.credits}</span>
      </div>

      {/* Tuto Snap Rouge inclus (façon Credia, en rouge) */}
      {plan.snapTuto && (
        <div className="relative mb-3 flex items-center gap-2.5 rounded-xl border border-red-500/35 bg-red-500/[0.08] px-3.5 py-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm">🔴</span>
          <span className="text-[13px] font-bold text-white">Tutoriel Snap Rouge inclus</span>
        </div>
      )}

      <ul className="relative flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
            <span className="mt-0.5 shrink-0 text-bleu">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="relative mt-6 w-full rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] py-3 text-center text-sm font-semibold text-emerald-300">
          ✓ Abonnement actuel
        </div>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          disabled={loading}
          className={`relative mt-6 w-full ${plan.popular ? 'btn-bleu' : 'btn-ghost'} transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Redirection…
            </span>
          ) : (
            plan.cta
          )}
        </button>
      )}

      {/* Satisfait ou remboursé — discret, sous chaque carte (façon Credia) */}
      {!isCurrent && (
        <p className="relative mt-2 text-center text-[10px] font-semibold uppercase tracking-wide text-emerald-300/60">
          🛡️ Satisfait ou remboursé
        </p>
      )}
    </div>
  )
}
