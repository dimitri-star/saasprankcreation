import { useEffect, useState } from 'react'
import { useStudio } from '../hooks/useStudio.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import UploadPanel from '../components/studio/UploadPanel.jsx'
import PromptPanel from '../components/studio/PromptPanel.jsx'
import OptionsPanel from '../components/studio/OptionsPanel.jsx'
import ResultView from '../components/studio/ResultView.jsx'
import GeneratingOverlay from '../components/studio/GeneratingOverlay.jsx'
import SecondPhotoPanel from '../components/studio/SecondPhotoPanel.jsx'
import { planLabel, PLAN_CREDITS_LABEL, isPaid } from '../lib/planLabels.js'

export default function Studio() {
  const {
    image, setImage, image2, setImage2,
    prompt, setPrompt,
    mode,
    generating, result, error, canGenerate, handleGenerate, reset, restorePending,
  } = useStudio()

  const { profile, refreshProfile } = useAuth()

  // Retour de paiement Stripe (?checkout=success) : recharge le profil (le webhook
  // crédite côté serveur, possiblement avec un léger décalage) + bannière de succès.
  // Restaure aussi la photo générée AVANT le paiement → défloutage animé.
  const [paid, setPaid] = useState(false)
  const [justUnlocked, setJustUnlocked] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') !== 'success') return
    setPaid(true)
    refreshProfile?.()
    if (restorePending?.()) setJustUnlocked(true) // photo en attente → animer la révélation
    const t1 = setTimeout(() => refreshProfile?.(), 3000) // rattrape le webhook async
    const t2 = setTimeout(() => setPaid(false), 7000)
    window.history.replaceState({}, '', '/studio')         // évite le re-déclenchement
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // États d'affichage
  const showOverlay = generating
  const showResult  = !generating && !!result
  const showPanels  = !generating && !result

  return (
    <div className="relative min-h-screen bg-noir">
      {/* Fond ambiant */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-bleu/10 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#126b86]/10 blur-[150px]" />
      </div>

      <header className="relative z-10 border-b border-white/5">
        <div className="container-luxe flex h-[68px] items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-xl font-bold text-white">Studio</span>
            {showPanels && (
              <span className="hidden text-sm text-white/40 sm:inline">· Compose ta transfo</span>
            )}
            {showResult && (
              <button
                onClick={reset}
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                ← Nouvelle transfo
              </button>
            )}
          </div>
          {showPanels && (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm">
              <span className="text-bleu">◆</span>
              <span className="text-white/80">{profile ? `${profile.credits_balance ?? 0} crédit${profile.credits_balance !== 1 ? 's' : ''}` : '3 crédits'}</span>
            </div>
          )}
        </div>
      </header>

      <main className="container-luxe relative z-10 py-7">
        {/* ── Bannière retour de paiement ── */}
        {paid && (
          <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/[0.08] px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-emerald-300">✓</span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Paiement réussi
                  {profile?.plan && profile.plan !== 'free'
                    ? ` — plan ${planLabel(profile.plan)}`
                    : ''}
                  &nbsp;!
                </p>
                <p className="mt-0.5 text-sm text-white/70">
                  {profile?.plan && profile.plan !== 'free'
                    ? `${PLAN_CREDITS_LABEL[profile.plan] ?? ''} · ${profile.credits_balance ?? '…'} crédits disponibles maintenant.`
                    : 'Tes crédits arrivent dans quelques secondes…'}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Upload ta photo ci-dessous, choisis une transfo et clique sur Générer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Panneaux studio ── */}
        {showPanels && (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr_330px]">
              <div className="flex flex-col gap-4">
                <UploadPanel image={image} onImage={setImage} onReset={reset} />
                <SecondPhotoPanel image2={image2} onImage2={setImage2} onReset2={() => setImage2(null)} />
              </div>
              <PromptPanel prompt={prompt} onPrompt={setPrompt} />
              <OptionsPanel
                onGenerate={handleGenerate}
                canGenerate={canGenerate}
                generating={generating}
              />
            </div>
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/[0.06] px-5 py-4">
                <span className="mt-0.5 shrink-0 text-red-400">⚠</span>
                <p className="text-sm leading-relaxed text-white/80">{error}</p>
              </div>
            )}
          </>
        )}

        {/* ── Animation de génération ── */}
        {showOverlay && <GeneratingOverlay image={image} mode={mode} />}

        {/* ── Résultat ── */}
        {showResult && (
          <ResultView
            result={result}
            mode={mode}
            image={image}
            isUnlocked={isPaid(profile?.plan)}
            justUnlocked={justUnlocked}
            onReset={reset}
          />
        )}
      </main>
    </div>
  )
}
