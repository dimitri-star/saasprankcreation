import { useCallback, useRef, useState } from 'react'
import { transformations, featuredSliderIds } from '../../data/transformations.js'
import Reveal from '../Reveal.jsx'

const featured = featuredSliderIds.map((id) =>
  transformations.find((d) => d.id === id),
)

// Silhouette « sujet » identique sur les 2 calques : la personne reste,
// seul le décor change quand on déplace le curseur.
function Subject() {
  return (
    <svg
      viewBox="0 0 120 150"
      className="absolute bottom-0 left-1/2 h-[72%] -translate-x-1/2"
      aria-hidden
    >
      <defs>
        <linearGradient id="subj" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="40" r="26" fill="url(#subj)" />
      <path
        d="M14 150 C14 104 32 84 60 84 C88 84 106 104 106 150 Z"
        fill="url(#subj)"
      />
    </svg>
  )
}

export default function BeforeAfterSlider() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)
  const dest = featured[activeIdx]

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    updateFromClientX(e.clientX)
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    updateFromClientX(e.clientX)
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <section id="showcase" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">La révélation</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Une photo banale.
            <br />
            <span className="text-gradient-bleu">Un résultat de ouf.</span>
          </h2>
          <p className="mt-5 text-white/55">
            Glisse le curseur pour voir la transformation. Ton visage reste
            intact — seul le décor change.
          </p>
        </Reveal>

        {/* Onglets transformations */}
        <Reveal delay={120} className="mt-10 flex flex-wrap justify-center gap-2.5">
          {featured.map((d, i) => (
            <button
              key={d.id}
              onClick={() => {
                setActiveIdx(i)
                setPos(50)
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                i === activeIdx
                  ? 'border-bleu/60 bg-bleu/10 text-white'
                  : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
              }`}
            >
              <span className="mr-1.5">{d.flag}</span>
              {d.name}
            </button>
          ))}
        </Reveal>

        {/* Comparateur */}
        <Reveal delay={200} className="mx-auto mt-10 max-w-3xl">
          <div
            ref={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="relative h-[440px] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/10 shadow-card sm:h-[540px]"
            style={{ touchAction: 'none' }}
          >
            {/* APRÈS (dessous) */}
            <div className="absolute inset-0" style={{ background: dest.gradient }}>
              <div className="grain absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              <Subject />
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-md">
                Après · {dest.flag} {dest.name}
              </div>
              <div className="absolute bottom-4 right-4 font-display text-sm italic text-white/70">
                Prank<span className="text-bleu">Creation</span>
              </div>
            </div>

            {/* AVANT (dessus, clippé à gauche du curseur) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] via-[#2a2a2c] to-[#1d1d1f]" />
              <div className="grain absolute inset-0" />
              <Subject />
              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur-md">
                Avant
              </div>
            </div>

            {/* Poignée */}
            <div
              className="absolute inset-y-0 z-10 w-px bg-white/80"
              style={{ left: `${pos}%` }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-bleu backdrop-blur-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 7L4 12L9 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 7L20 12L15 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-white/35">
            Aperçu illustratif — la génération photo réelle arrive dans le Studio.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
