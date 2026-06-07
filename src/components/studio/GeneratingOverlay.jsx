import { useEffect, useRef, useState } from 'react'

// Barre de progression simulée (ease-out, plafonnée à 92 %).
function useProgress() {
  const [pct, setPct] = useState(0)
  const raf = useRef(null)
  const start = useRef(null)

  useEffect(() => {
    start.current = null
    const DURATION = 28_000
    function tick(now) {
      if (!start.current) start.current = now
      const elapsed = now - start.current
      const raw = 1 - Math.pow(1 - Math.min(elapsed / DURATION, 1), 3)
      setPct(Math.round(raw * 92))
      if (elapsed < DURATION) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return pct
}

const STEPS = [
  { label: 'Photo analysée',          threshold: 0  },
  { label: 'Scène construite',        threshold: 12 },
  { label: 'Transformation en cours', threshold: 28 },
  { label: 'Finalisation',            threshold: 60 },
]

const MESSAGES = [
  'Analyse de ta photo…',
  'Construction de la scène…',
  'La magie opère ✨',
  'Ton résultat va être dingue 👀',
]

export default function GeneratingOverlay({ image, mode = 'image' }) {
  const pct = useProgress()
  const msgIdx = pct < 15 ? 0 : pct < 35 ? 1 : pct < 65 ? 2 : 3

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center gap-8 py-10">
      {/* Photo avec effets */}
      <div className="relative">
        {/* Halo extérieur animé */}
        <div className="absolute -inset-10 animate-pulse rounded-full bg-bleu/15 blur-3xl" />

        {/* Cadre photo style téléphone */}
        <div className="relative h-80 w-60 overflow-hidden rounded-[2rem] border border-bleu/40 shadow-[0_0_80px_-10px_rgba(59,130,246,0.5)]">
          {image ? (
            <img
              src={image}
              alt=""
              aria-hidden
              draggable={false}
              className="h-full w-full scale-110 select-none object-cover blur-md"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-bleu/30 to-noir" />
          )}

          {/* Calque sombre */}
          <div className="absolute inset-0 bg-noir/50" />

          {/* Compteur % */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-7xl font-bold tabular-nums text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
              {pct}%
            </span>
          </div>
        </div>

        {/* Anneau rotatif SVG */}
        <div className="pointer-events-none absolute -inset-4">
          <svg
            className="h-full w-full"
            style={{ animation: 'spin 2.5s linear infinite' }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="2.5" />
            <circle
              cx="50" cy="50" r="47"
              fill="none"
              stroke="rgb(59,130,246)"
              strokeWidth="2.5"
              strokeDasharray="55 240"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Second anneau contre-rotatif */}
        <div className="pointer-events-none absolute -inset-7">
          <svg
            className="h-full w-full opacity-40"
            style={{ animation: 'spin 4s linear infinite reverse' }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50" cy="50" r="47"
              fill="none"
              stroke="rgb(99,179,255)"
              strokeWidth="1.5"
              strokeDasharray="20 280"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Message dynamique */}
      <p className="animate-pulse text-center text-base font-medium text-white/80">
        {MESSAGES[msgIdx]}
      </p>

      {/* Barre de progression */}
      <div className="w-full max-w-[260px]">
        <div className="mb-2 flex items-center justify-between text-xs text-white/40">
          <span>Réalisme du rendu</span>
          <span className="tabular-nums text-white/70">{pct} %</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-bleu transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] text-white/30">
          {mode === 'video' ? '~1 à 2 minutes' : '~10 à 30 secondes'}
        </p>
      </div>

      {/* Étapes */}
      <div className="flex w-full max-w-[260px] flex-col gap-2.5">
        {STEPS.map((step, i) => {
          const visible  = pct >= step.threshold
          const nextThr  = STEPS[i + 1]?.threshold
          const isDone   = nextThr !== undefined && pct >= nextThr

          return (
            <div
              key={step.label}
              className={`flex items-center gap-2.5 text-sm transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-20'}`}
            >
              <span className={`shrink-0 ${isDone ? 'text-emerald-400' : visible ? 'text-bleu' : 'text-white/20'}`}>
                {isDone ? (
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4.5 8.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : visible ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <div className="h-4 w-4 rounded-full border border-white/20" />
                )}
              </span>
              <span className={isDone ? 'text-white/55' : visible ? 'text-white font-medium' : 'text-white/20'}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
