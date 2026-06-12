import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { startCheckout } from '../lib/checkout.js'

const FEATURES = [
  '1000 crédits / mois inclus',
  'Toutes les 8 catégories de transfos',
  'Téléchargement direct sans paywall',
  'Annulable en 1 clic à tout moment',
]

const AVATARS = ['🧑', '👩', '👦', '🧒', '👧']

// Prix affiché sur le CTA selon le plan choisi (aligné sur le catalogue serveur :
// weekly = 199 (1,99€), monthly = 299 (2,99€)).
const PRICE_LABEL = { weekly: '1,99€', monthly: '2,99€' }

function useCountdown(startSeconds) {
  const [remaining, setRemaining] = useState(startSeconds)
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])
  const m = String(Math.floor(remaining / 60)).padStart(2, '0')
  const s = String(remaining % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function Debloquer() {
  const [plan, setPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const { user, openAuthModal } = useAuth()
  const countdown = useCountdown(159)

  const handlePay = async () => {
    if (loading) return
    setErr(null)
    setLoading(true)
    try {
      // plan ∈ { 'weekly', 'monthly' } → priceKey du catalogue serveur.
      await startCheckout(plan)
    } catch (e) {
      if (e.code === 'auth') openAuthModal()
      else setErr(e.message)
      setLoading(false)
    }
    // En cas de succès, startCheckout redirige (pas de reset du loading).
  }

  // Paiement UNIQUE (sans abonnement) — photo seule OU pack de crédits.
  const handlePayKey = async (priceKey) => {
    if (loading) return
    setErr(null)
    setLoading(true)
    try {
      await startCheckout(priceKey)
    } catch (e) {
      if (e.code === 'auth') openAuthModal()
      else setErr(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-noir flex items-start justify-center px-4 py-10">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-bleu/10 blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Lock icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-bleu/30 bg-bleu/10">
          <svg className="h-7 w-7 text-bleu" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-center font-display text-3xl font-bold text-white">
          Ton prank t'attend<span className="text-bleu">.</span>
        </h1>
        <p className="mt-1.5 text-center text-sm text-white/50">
          Plus qu'1 clic pour le débloquer
        </p>

        {/* Countdown badge */}
        <div className="mx-auto mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            -50% sur le plan mensuel pendant{' '}
            <span className="font-mono tabular-nums">{countdown}</span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Weekly */}
          <button
            type="button"
            onClick={() => setPlan('weekly')}
            className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
              plan === 'weekly'
                ? 'border-bleu/60 bg-bleu/10 ring-1 ring-bleu/40'
                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Par semaine</span>
            <span className="mt-2 font-display text-3xl font-bold text-white">1,99€</span>
            <span className="mt-0.5 text-[11px] text-white/40">soit ~0,28€/j</span>
          </button>

          {/* Monthly — recommended */}
          <button
            type="button"
            onClick={() => setPlan('monthly')}
            className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
              plan === 'monthly'
                ? 'border-bleu/60 bg-bleu/10 ring-1 ring-bleu/40'
                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
            }`}
          >
            {/* Badge */}
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bleu px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              -50% aujourd'hui
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Par mois</span>
            <span className="mt-2 font-display text-3xl font-bold text-white">2,99€</span>
            <span className="mt-0.5 text-[11px] text-white/40 line-through">5,99€</span>
          </button>
        </div>

        {/* Features */}
        <ul className="mt-6 space-y-2.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bleu/20 text-[11px] text-bleu">✓</span>
              <span className="text-sm text-white/70">{f}</span>
            </li>
          ))}
        </ul>

        {/* Social proof */}
        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div className="flex -space-x-2">
            {AVATARS.map((a, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-noir/60 bg-white/10 text-base"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="text-xs leading-snug text-white/60">
            <span className="font-semibold text-white">10 000+ créateurs</span> ont déjà débloqué leur prank
          </p>
        </div>

        {/* Note / avis */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/55">
          <span className="text-amber-400">★★★★★</span>
          <span className="font-semibold text-white">4,9/5</span>
          <span className="text-white/40">· Noté excellent par nos créateurs</span>
        </div>

        {/* Réassurance — satisfait ou remboursé + résiliable */}
        <div className="mt-4 flex flex-col items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-3 py-1 font-semibold text-emerald-300">
            🛡️ Satisfait ou remboursé immédiatement
          </span>
          <span className="text-white/40">Résiliable à tout moment dans les paramètres</span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-bleu to-[#126b86] py-4 text-center text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-bleu/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Redirection vers le paiement…' : `Débloquer maintenant — ${PRICE_LABEL[plan]}`}
        </button>

        {err && (
          <p className="mt-3 text-center text-[11px] text-red-300/80">{err}</p>
        )}

        {/* Security footer */}
        <p className="mt-3 text-center text-[11px] text-white/30">
          🔒 Paiement 100% sécurisé via Stripe · Accès instantané
        </p>

        {/* Séparateur */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] uppercase tracking-wider text-white/30">ou</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Option paiement UNIQUE — sans abonnement (rattrape les réfractaires à l'abo) */}
        <button
          type="button"
          onClick={() => handlePayKey('unlock-photo')}
          disabled={loading}
          className="w-full rounded-2xl border border-white/12 bg-white/[0.03] py-3.5 text-center text-sm font-semibold text-white/85 transition-all hover:border-white/25 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Débloquer juste cette photo — 2,99€
        </button>
        <p className="mt-1.5 text-center text-[11px] text-white/35">
          Paiement unique · sans abonnement · 3 photos incluses
        </p>

        {/* Recharge de crédits — sans abonnement (façon Credia) */}
        <div className="mt-6">
          <p className="mb-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-white/40">
            Ou recharge des crédits — sans abonnement
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePayKey('credits-pack-1')}
              disabled={loading}
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-center transition-all hover:border-bleu/40 hover:bg-bleu/[0.06] active:scale-[0.98] disabled:opacity-60"
            >
              <span className="font-display text-lg font-bold text-white">1000 crédits</span>
              <span className="text-[11px] text-white/40">10 photos · paiement unique</span>
              <span className="mt-1.5 font-bold text-bleu">6,99€</span>
            </button>
            <button
              type="button"
              onClick={() => handlePayKey('credits-pack-2')}
              disabled={loading}
              className="relative flex flex-col items-center rounded-2xl border border-bleu/40 bg-bleu/[0.06] p-3.5 text-center transition-all hover:border-bleu/60 active:scale-[0.98] disabled:opacity-60"
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bleu px-2 py-0.5 text-[9px] font-bold uppercase text-white">+ populaire</span>
              <span className="font-display text-lg font-bold text-white">2500 crédits</span>
              <span className="text-[11px] text-white/40">25 photos · paiement unique</span>
              <span className="mt-1.5 font-bold text-bleu">14,99€</span>
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-7 text-center">
          <Link to="/studio" className="text-xs text-white/25 transition-colors hover:text-white/50">
            ← Retour au studio
          </Link>
        </div>
      </div>
    </div>
  )
}
