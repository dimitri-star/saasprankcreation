import { useState } from 'react'
import { plans, billingOptions } from '../data/plans.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { startCheckout } from '../lib/checkout.js'
import { savePendingCheckout, useResumeCheckout } from '../hooks/usePendingCheckout.js'
import { openBillingPortal } from '../lib/billingPortal.js'
import { planLabel, PLAN_CREDITS_LABEL, isPaid, isUnlimitedPlan } from '../lib/planLabels.js'
import PlanCard from '../components/pricing/PlanCard.jsx'
import TrustBadges from '../components/landing/TrustBadges.jsx'
import Faq from '../components/landing/Faq.jsx'
import Footer from '../components/landing/Footer.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Abonnement() {
  const [billing, setBilling] = useState('annual')
  const [notice, setNotice] = useState(null)
  const [payingKey, setPayingKey] = useState(null)  // priceKey en cours → spinner ciblé
  const [portalLoading, setPortalLoading] = useState(false)
  const { openAuthModal, profile } = useAuth()
  const currentPlan = profile?.plan ?? null

  // Après connexion (clic « payer » sans compte → inscription), reprend le paiement
  // automatiquement → redirection Stripe directe (plus besoin de re-cliquer le plan).
  useResumeCheckout(setNotice)

  // Démarre le paiement Stripe pour un `priceKey` du catalogue serveur.
  // setPayingKey AVANT l'appel réseau → le bouton affiche « Redirection… »
  // instantanément (le cold-start serverless + l'appel Stripe prennent ~1-3 s).
  const pay = async (priceKey) => {
    if (payingKey) return
    setNotice(null)
    setPayingKey(priceKey)
    try {
      await startCheckout(priceKey) // succès → redirection Stripe (la page quitte)
    } catch (e) {
      if (e.code === 'auth') {
        savePendingCheckout(priceKey)
        openAuthModal()
        setNotice('Connecte-toi, ton paiement reprend tout seul juste après.')
      } else {
        setNotice(e.message)
      }
      setPayingKey(null)
    }
  }

  // billing ∈ { 'monthly', 'annual' } → priceKey ex. « signature_annual ».
  const handleSelect = (plan) => pay(`${plan.id}_${billing}`)

  const handleManageAbo = async () => {
    setPortalLoading(true)
    try { await openBillingPortal() } catch (err) { setNotice(err.message) }
    finally { setPortalLoading(false) }
  }

  return (
    <div className="relative min-h-screen bg-noir">
      {/* Fond ambiant */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-bleu/10 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#126b86]/10 blur-[150px]" />
      </div>

      <main className="container-luxe relative z-10 py-16">
        {/* Hero */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Abonnement</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choisis ton <span className="text-gradient-bleu">plan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-white/55">
            Débloque toutes tes transfos sans limite. Change de plan ou résilie
            quand tu veux.
          </p>
        </Reveal>

        {/* Satisfait ou remboursé + résiliable (réassurance façon Credia) */}
        <Reveal className="mx-auto mt-5 max-w-md text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] px-4 py-1.5 text-sm font-semibold text-emerald-300">
            🛡️ Satisfait ou remboursé immédiatement
          </span>
          <p className="mt-2 text-xs text-white/45">Abonnement résiliable à tout moment dans les paramètres</p>
        </Reveal>

        {/* ── Bandeau « abonnement actuel » (utilisateur payant) ── */}
        {isPaid(currentPlan) && (
          <Reveal className="mx-auto mt-8 flex max-w-lg items-center justify-between gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg text-emerald-300">✓</span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Plan actuel&nbsp;: {planLabel(currentPlan)}
                </p>
                <p className="text-xs text-white/50">
                  {PLAN_CREDITS_LABEL[currentPlan] ?? ''}
                  {isUnlimitedPlan(currentPlan)
                    ? ''
                    : ` · ${profile?.credits_balance ?? '…'} crédits restants`}
                </p>
              </div>
            </div>
            <button
              onClick={handleManageAbo}
              disabled={portalLoading}
              className="shrink-0 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {portalLoading ? 'Chargement…' : 'Gérer / Annuler'}
            </button>
          </Reveal>
        )}

        {/* Bandeau offre de lancement */}
        <Reveal className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.07] px-5 py-2.5 text-center">
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
            −17 %
          </span>
          <span className="text-sm text-white/70">
            2 mois offerts sur tous les plans annuels
          </span>
        </Reveal>

        {/* Toggle de facturation */}
        <div className="mt-9 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {billingOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setBilling(opt.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  billing === opt.id
                    ? 'bg-gradient-to-b from-bleu-light to-bleu text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {opt.label}
                {opt.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      billing === opt.id
                        ? 'bg-noir/20 text-white'
                        : 'bg-bleu/15 text-bleu'
                    }`}
                  >
                    {opt.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cartes — l'option « À vie » du toggle remplace les 3 tiers par les offres paiement unique */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 80} className="h-full">
              <PlanCard
                plan={plan}
                billing={billing}
                onSelect={handleSelect}
                currentPlan={currentPlan}
                loading={payingKey === `${plan.id}_${billing}`}
              />
            </Reveal>
          ))}
        </div>

        {/* Réassurance */}
        <Reveal className="mx-auto mt-10 max-w-4xl">
          <TrustBadges />
        </Reveal>

        {notice && (
          <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-bleu/20 bg-bleu/[0.05] px-5 py-4">
            <span className="mt-0.5 text-bleu">✦</span>
            <p className="text-sm leading-relaxed text-white/75">{notice}</p>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-white/35">
          Paiement sécurisé · Sans engagement · Résiliable en 1 clic
        </p>
      </main>

      <Faq
        tag="pricing"
        eyebrow="Questions fréquentes"
        title="Avant de t’abonner"
      />

      <Footer />
    </div>
  )
}
