// Options de paiement UNIQUE (SANS abonnement) — partagé /debloquer + /abonnement.
// Façon « Recharge de crédits » Credia : débloque juste la photo, ou achète un
// pack de crédits, sans s'abonner. `onBuy(priceKey)` lance le checkout côté page
// (gère busy/auth), `loading` désactive les boutons pendant la redirection Stripe.
export default function NoSubOptions({ onBuy, loading }) {
  return (
    <div className="mx-auto w-full max-w-md">
      {/* Séparateur */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="whitespace-nowrap text-[11px] uppercase tracking-wider text-white/30">
          ou sans abonnement
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* Débloquer juste cette photo */}
      <button
        type="button"
        onClick={() => onBuy('unlock-photo')}
        disabled={loading}
        className="w-full rounded-2xl border border-white/12 bg-white/[0.03] py-3.5 text-center text-sm font-semibold text-white/85 transition-all hover:border-white/25 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Débloquer juste cette photo — 2,99€
      </button>
      <p className="mt-1.5 text-center text-[11px] text-white/35">
        Paiement unique · 3 photos incluses
      </p>

      {/* Recharge de crédits */}
      <div className="mt-5">
        <p className="mb-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-white/40">
          Recharge de crédits — sans abonnement
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onBuy('credits-pack-1')}
            disabled={loading}
            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-center transition-all hover:border-bleu/40 hover:bg-bleu/[0.06] active:scale-[0.98] disabled:opacity-60"
          >
            <span className="font-display text-lg font-bold text-white">1000 crédits</span>
            <span className="text-[11px] text-white/40">10 photos · paiement unique</span>
            <span className="mt-1.5 font-bold text-bleu">6,99€</span>
          </button>
          <button
            type="button"
            onClick={() => onBuy('credits-pack-2')}
            disabled={loading}
            className="relative flex flex-col items-center rounded-2xl border border-bleu/40 bg-bleu/[0.06] p-3.5 text-center transition-all hover:border-bleu/60 active:scale-[0.98] disabled:opacity-60"
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bleu px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              + populaire
            </span>
            <span className="font-display text-lg font-bold text-white">2500 crédits</span>
            <span className="text-[11px] text-white/40">25 photos · paiement unique</span>
            <span className="mt-1.5 font-bold text-bleu">14,99€</span>
          </button>
        </div>
      </div>
    </div>
  )
}
