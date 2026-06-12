// Options de paiement UNIQUE (SANS abonnement) — partagé /debloquer + /abonnement.
// Façon « Recharge de crédits » Credia (mais en bleu) : débloque juste la photo, ou
// achète un pack de crédits, sans s'abonner. `onBuy(priceKey)` lance le checkout côté
// page (gère busy/auth), `loading` désactive les boutons pendant la redirection Stripe.
export default function NoSubOptions({ onBuy, loading }) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-bleu/25 bg-gradient-to-b from-bleu/[0.07] to-white/[0.01] p-5 shadow-[0_0_70px_-30px] shadow-bleu/60 sm:p-7">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-bleu">
          Sans abonnement
        </p>
        <p className="mb-6 mt-1.5 text-center text-sm text-white/55">
          Pas envie de t'abonner ? Débloque juste ta photo, ou recharge des crédits.
        </p>

        {/* Débloquer juste cette photo */}
        <button
          type="button"
          onClick={() => onBuy('unlock-photo')}
          disabled={loading}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-4 transition-all hover:border-bleu/50 hover:bg-bleu/[0.07] active:scale-[0.99] disabled:opacity-60"
        >
          <span className="text-left">
            <span className="block text-base font-bold text-white">Débloquer juste cette photo</span>
            <span className="block text-[12px] text-white/45">Paiement unique · 3 photos incluses</span>
          </span>
          <span className="shrink-0 rounded-full bg-bleu px-4 py-2 text-sm font-bold text-white">2,99€</span>
        </button>

        {/* Recharge de crédits */}
        <p className="mb-3 mt-7 text-center text-[11px] font-bold uppercase tracking-wider text-white/45">
          Ou recharge des crédits
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onBuy('credits-pack-1')}
            disabled={loading}
            className="flex flex-col items-center rounded-2xl border border-bleu/30 bg-gradient-to-b from-bleu/[0.12] to-bleu/[0.02] p-5 text-center transition-all hover:border-bleu/60 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            <span className="font-display text-4xl font-bold leading-none text-white">1000</span>
            <span className="mt-1 text-sm font-bold text-bleu">crédits</span>
            <span className="mt-2 text-[11px] text-white/45">10 photos · une fois</span>
            <span className="mt-3 rounded-full bg-white/10 px-4 py-1.5 text-base font-bold text-white">6,99€</span>
          </button>
          <button
            type="button"
            onClick={() => onBuy('credits-pack-2')}
            disabled={loading}
            className="relative flex flex-col items-center rounded-2xl border-2 border-bleu/60 bg-gradient-to-b from-bleu/[0.20] to-bleu/[0.04] p-5 text-center shadow-[0_0_45px_-15px] shadow-bleu/70 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bleu px-3 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              + populaire
            </span>
            <span className="font-display text-4xl font-bold leading-none text-white">2500</span>
            <span className="mt-1 text-sm font-bold text-bleu">crédits</span>
            <span className="mt-2 text-[11px] text-white/45">25 photos · une fois</span>
            <span className="mt-3 rounded-full bg-bleu px-4 py-1.5 text-base font-bold text-white">14,99€</span>
          </button>
        </div>
      </div>
    </div>
  )
}
