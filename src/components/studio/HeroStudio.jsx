import { Link } from 'react-router-dom'
import { useStudio } from '../../hooks/useStudio.js'
import UploadPanel from './UploadPanel.jsx'
import PromptPanel from './PromptPanel.jsx'
import ResultView from './ResultView.jsx'
import GeneratingOverlay from './GeneratingOverlay.jsx'

export default function HeroStudio() {
  const {
    image, setImage, prompt, setPrompt,
    mode, generating, result, error,
    canGenerate, handleGenerate, reset,
  } = useStudio()

  const showOverlay = generating
  const showResult  = !generating && !!result
  const showPanels  = !generating && !result

  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-noir/40 p-4 text-left shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-5">

      {/* ── Panneaux studio ── */}
      {showPanels && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UploadPanel image={image} onImage={setImage} onReset={reset} />
            <PromptPanel prompt={prompt} onPrompt={setPrompt} />
          </div>

          <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-xs text-white/40 sm:text-left">
              Génère ta photo · résultat débloqué dès 1,99€/sem
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                to="/studio"
                className="order-2 text-center text-sm text-white/55 transition-colors hover:text-white sm:order-1"
              >
                Studio complet →
              </Link>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || generating}
                className="btn-bleu order-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:order-2"
              >
                Générer ma photo <span aria-hidden>→</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/[0.06] px-4 py-3">
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
          onReset={reset}
        />
      )}
    </div>
  )
}
