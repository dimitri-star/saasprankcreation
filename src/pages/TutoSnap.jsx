import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { startCheckout } from '../lib/checkout.js'
import { savePendingCheckout, useResumeCheckout } from '../hooks/usePendingCheckout.js'
import { hasSnapAccess } from '../lib/planLabels.js'

const STEPS = [
  {
    num: '01',
    title: 'Génère et télécharge ta photo',
    body: 'Dans le Studio PrankCreation, génère ta transfo et clique sur "Télécharger ta photo". Elle atterrit dans la galerie de ton téléphone.',
    icon: '📸',
  },
  {
    num: '02',
    title: 'Installe l\'app OVF Editor',
    body: 'C\'est elle qui fait passer ta photo pour une vraie capture live (et pas un "média chargé depuis la galerie"). Sur iPhone : App Store → cherche "OVF Editor". Sur Android : l\'équivalent est Snaptroid (installation en APK). C\'est gratuit.',
    icon: '⬇️',
  },
  {
    num: '03',
    title: 'Importe ta photo dans l\'app',
    body: 'Ouvre OVF Editor, autorise l\'accès aux photos, puis sélectionne la transfo que tu viens de télécharger. C\'est tout ce dont l\'app a besoin.',
    icon: '🖼️',
  },
  {
    num: '04',
    title: 'Envoie vers Snapchat depuis l\'app',
    body: 'Cherche le bouton "Envoyer / Partager vers Snapchat" (le libellé varie selon la version de l\'app). OVF Editor ouvre alors Snap avec ta photo déjà chargée — comme si tu venais de la prendre à l\'instant, sans le bandeau "média chargé".',
    icon: '👻',
  },
  {
    num: '05',
    title: 'Envoie en snap rouge',
    body: 'Dans Snap, appuie sur le timer en haut à droite et règle-le sur une durée courte (1 à 3 s). Choisis ton destinataire → Envoie. Ton pote reçoit un vrai snap rouge qui disparaît.',
    icon: '🔴',
  },
]

const BONUS = [
  'Ne mets JAMAIS la photo en story avant de l\'envoyer en snap rouge — ça crée un lien public entre les deux.',
  'Garde le timer court (1 à 3 s) : ton pote n\'a pas le temps d\'analyser l\'image de près.',
  'Évite d\'envoyer exactement la même image à plusieurs potes en même temps — ça sent le montage.',
  'Cadrage naturel : pas de bord blanc ni de zone trop nette qui trahirait un montage.',
]

// Carte step réelle (déverrouillée)
function StepCard({ step }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-xl">
          {step.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-red-400/70">{step.num}</span>
            <h3 className="text-sm font-semibold text-white">{step.title}</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{step.body}</p>
        </div>
      </div>
    </div>
  )
}

export default function TutoSnap() {
  const { user, profile, openAuthModal, refreshProfile } = useAuth()
  const unlocked = hasSnapAccess(profile?.plan) || !!user?.user_metadata?.snap_tuto_unlocked
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [params] = useSearchParams()

  // Après connexion, reprend l'achat du tuto automatiquement → redirection Stripe.
  useResumeCheckout(setErr)

  // Dès que l'utilisateur est chargé → rafraîchit user_metadata (snap_tuto_unlocked).
  // Doit attendre user.id : la session Supabase arrive en async après le montage.
  useEffect(() => {
    if (user?.id) refreshProfile?.()
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Retour Stripe après paiement : retry 3s pour rattraper un webhook lent.
  useEffect(() => {
    if (params.get('checkout') !== 'success' || !user?.id) return
    const t = setTimeout(() => refreshProfile?.(), 3000)
    return () => clearTimeout(t)
  }, [user?.id, params]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBuySnap = async () => {
    if (loading) return
    setErr(null)
    setLoading(true)
    try {
      await startCheckout('snap-tuto')
    } catch (e) {
      if (e.code === 'auth') { savePendingCheckout('snap-tuto'); openAuthModal() }
      else setErr(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-noir">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-red-500/10 blur-[160px]" />
      </div>

      <main className="container-luxe relative z-10 py-14">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 shadow-[0_8px_32px_rgba(239,68,68,0.4)]">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" aria-hidden>
              <path d="M12.206 2C8.924 2 6.195 4.388 6.195 7.38c0 .322.028.637.08.944l-.895.05c-.372 0-.673.265-.673.59 0 .297.254.544.6.582l.637.07c-.16.333-.337.653-.53.953-.198.308-.416.587-.653.836-.24.251-.408.57-.408.907 0 .418.21.8.557 1.058.32.24.748.375 1.208.375.074 0 .148-.004.222-.012.304.571.888.984 1.574 1.072l-.01.041c-.143.537-.574.962-1.12 1.145l-.15.05c-.35.115-.54.468-.42.785.12.317.48.487.83.372l.15-.05c.36-.119.708-.29 1.032-.51.01.127.016.255.016.384 0 1.82 1.466 3.298 3.273 3.298 1.808 0 3.274-1.478 3.274-3.298 0-.129.005-.257.016-.384.324.22.672.391 1.032.51l.15.05c.35.115.71-.055.83-.372.12-.317-.07-.67-.42-.785l-.15-.05c-.546-.183-.977-.608-1.12-1.145l-.01-.041c.686-.088 1.27-.5 1.574-1.072.074.008.148.012.222.012.46 0 .888-.135 1.208-.375.347-.258.557-.64.557-1.058 0-.337-.168-.656-.408-.907-.237-.249-.455-.528-.653-.836-.193-.3-.37-.62-.53-.953l.637-.07c.346-.038.6-.285.6-.582 0-.325-.301-.59-.673-.59l-.895-.05c.052-.307.08-.622.08-.944C18.217 4.388 15.488 2 12.206 2z"/>
            </svg>
          </div>
          <p className="eyebrow text-red-400">Technique exclusive</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">
            Le snap rouge <span className="text-red-400">indétectable</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55">
            Envoie ta photo générée en snap rouge qui disparaît — ton pote ne verra jamais
            que c'est une image IA. 5 étapes simples, avec une app gratuite.
          </p>
          {unlocked && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-semibold text-emerald-300">
              ✓ Inclus dans ton plan
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="mx-auto mt-12 max-w-xl">
          {unlocked ? (
            /* Déverrouillé : toutes les étapes visibles */
            <div className="space-y-4">
              {STEPS.map((step) => <StepCard key={step.num} step={step} />)}
            </div>
          ) : (
            /* Verrouillé : page de vente attractive (façon Credia, en rouge/bleu) */
            <div className="space-y-5">
              {/* Carte valeur — ce que tu obtiens */}
              <div className="rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-500/[0.08] to-white/[0.01] p-6 shadow-[0_0_55px_-20px] shadow-red-500/50">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">Accès à vie</span>
                  <span className="font-display text-3xl font-bold text-white">2,99€</span>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {[
                    'La vraie méthode « snap rouge » sans média chargé',
                    '100 % indétectable — ton pote n’y voit que du feu',
                    'Les 5 étapes pas à pas + le Plan B garanti',
                    'Les astuces pour ne jamais te faire griller',
                    'Accès à vie · paiement unique',
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA principal */}
              <button
                onClick={handleBuySnap}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-4 text-base font-bold text-white shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-60"
              >
                {loading ? 'Redirection…' : '🔴 Débloquer pour 2,99€'}
              </button>
              <p className="text-center text-[11px] text-white/35">
                Paiement unique · accès immédiat · 100 % sécurisé
              </p>
              {err && <p className="text-center text-xs text-red-300/80">{err}</p>}

              <div className="text-center">
                <button
                  onClick={() => refreshProfile?.()}
                  className="text-xs text-white/40 underline-offset-2 transition-colors hover:text-white/70 hover:underline"
                >
                  J'ai déjà payé — activer mon accès
                </button>
              </div>

              {/* Upsell — déjà inclus avec un abonnement */}
              <div className="rounded-2xl border border-bleu/25 bg-bleu/[0.04] p-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                  <span className="text-bleu">✦</span> Déjà inclus avec un abonnement
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Signature — 14,99€/mois</p>
                      <p className="text-[12px] text-white/45">Snap Rouge inclus + 7000 crédits/mois</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Prestige — 34,99€/mois</p>
                      <p className="text-[12px] text-white/45">Snap Rouge inclus + crédits illimités</p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/abonnement"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-bleu py-3 text-sm font-bold text-white transition-all hover:brightness-110"
                >
                  Voir les abonnements →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Plan B garanti + avertissement honnête — uniquement si déverrouillé */}
        {unlocked && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-sky-400/20 bg-sky-500/[0.05] p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-300">
              🛟 Plan B garanti — si l'app ne marche pas
            </p>
            <p className="text-sm leading-relaxed text-white/65">
              Snapchat met parfois à jour son appli et bloque ces outils. Si OVF Editor
              affiche quand même « média chargé », passe par la{' '}
              <span className="font-semibold text-white">méthode 2 écrans</span> : affiche
              ta photo en plein écran sur un 2ᵉ téléphone (ou ton PC), puis photographie cet
              écran avec l'appareil photo de Snap. C'est une vraie capture live à 100 %,
              impossible à détecter — pense juste à éviter les reflets.
            </p>
            <p className="mt-4 text-[11px] leading-relaxed text-white/35">
              ⚠️ Ces techniques contournent les règles de Snapchat : utilise-les avec bon sens.
              Teste toujours sur ton propre compte (note perso) avant d'envoyer à un pote.
            </p>
          </div>
        )}

        {/* Bonus tips — uniquement si déverrouillé */}
        {unlocked && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-400/20 bg-amber-500/[0.05] p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-400">
              💡 Astuces pour ne pas se faire griller
            </p>
            <ul className="space-y-3">
              {BONUS.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-white/65">
                  <span className="mt-0.5 shrink-0 text-amber-400">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/studio" className="btn-bleu inline-flex px-10">
            Générer ma transfo maintenant →
          </Link>
        </div>
      </main>
    </div>
  )
}
