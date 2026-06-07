import { useEffect, useState } from 'react'
import HeroStudio from '../studio/HeroStudio.jsx'

// Socle partagé avec SocialProof (« photos générées aujourd'hui »).
const COUNTER_BASE = 12847

// Photos générées — défilent en fond derrière le titre hero.
const HERO_PHOTOS = [
  'https://i.ibb.co/dwCW6pHY/landing-1-after.jpg',
  'https://i.ibb.co/JWNsWpdK/landing-1-before.jpg',
  'https://i.ibb.co/mVXr0cfT/landing-2-after.jpg',
  'https://i.ibb.co/pjcJXFZ4/landing-4-after.jpg',
  'https://i.ibb.co/8LQQsQZD/landing-4-before.jpg',
  'https://i.ibb.co/xKsRbt23/landing-6-after.jpg',
  'https://i.ibb.co/1t5QKSBg/landing-6-before.jpg',
  'https://i.ibb.co/MDXDZs53/landing-7-after.jpg',
  'https://i.ibb.co/V0hw3TTR/landing-7-before.jpg',
]
// Doubler pour loop seamless (même logique que le marquee AVANT/APRÈS)
const DOUBLED_HERO = [...HERO_PHOTOS, ...HERO_PHOTOS]

// 4 rangées avec vitesses et directions alternées
const ROWS = [
  { speed: 48, reverse: false },
  { speed: 36, reverse: true  },
  { speed: 54, reverse: false },
  { speed: 40, reverse: true  },
]

// Compteur « live » simulé : grimpe de quelques unités à intervalle irrégulier.
function useLiveCounter(base) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    let timer
    const schedule = () => {
      timer = setTimeout(
        () => {
          setValue((v) => v + 1 + Math.floor(Math.random() * 3))
          schedule()
        },
        2200 + Math.random() * 3000,
      )
    }
    schedule()
    return () => clearTimeout(timer)
  }, [base])
  return value
}

export default function Hero() {
  const liveCount = useLiveCounter(COUNTER_BASE)

  return (
    <section className="grain relative isolate overflow-hidden">
      {/* ── Fond défilant : bande de photos centrée, petite et subtile ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grille de cartes 4:3 derrière le titre */}
        <div className="absolute inset-x-0 top-20 flex flex-col gap-3 opacity-[0.28]">
          {ROWS.map(({ speed, reverse }, row) => (
            <div key={row} className="relative h-52 overflow-hidden">
              <div
                className="absolute inset-y-0 flex gap-3"
                style={{
                  width: 'max-content',
                  animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
                }}
              >
                {DOUBLED_HERO.map((src, i) => (
                  <div key={i} className="relative h-52 aspect-[4/3] shrink-0 overflow-hidden rounded-2xl">
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Overlay léger — on veut voir les photos */}
        <div className="absolute inset-0 bg-noir/30" />
        {/* Fondu haut/bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/80 via-transparent to-noir/80" />
      </div>

      <div className="container-luxe relative flex min-h-screen flex-col items-center justify-center pt-28 pb-20 text-center">
        {/* Badge live */}
        <div className="animate-fade-in inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bleu opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bleu" />
          </span>
          <span className="text-xs font-medium tracking-wide text-white/70">
            L'appli qui bluffe tes potes
          </span>
        </div>

        {/* Titre principal */}
        <h1
          className="animate-fade-up mt-8 max-w-5xl font-display text-6xl font-bold leading-[1.05] tracking-tight text-blue-200 sm:text-7xl md:text-8xl lg:text-[6.5rem] pb-4"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}
        >
          Bluffe tes potes
          <br />
          avec une seule{' '}
          <span className="inline-block text-gradient-bleu italic py-2 px-1">
            photo
          </span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-xl text-balance text-base leading-relaxed text-white/60 sm:text-lg"
          style={{ animationDelay: '120ms' }}
        >
          L'IA te met où tu veux : en voyage, au volant d'une supercar,
          musclé ou en pleine soirée. Bluffant, en quelques secondes — sans
          bouger de ton canap'.
        </p>

        {/* Studio embarqué */}
        <div
          className="animate-fade-up mt-10 w-full max-w-4xl"
          style={{ animationDelay: '240ms' }}
        >
          <HeroStudio />
        </div>

        <a
          href="#showcase"
          className="animate-fade-up mt-6 text-sm text-white/55 transition-colors hover:text-white"
          style={{ animationDelay: '340ms' }}
        >
          ou voir des exemples →
        </a>

        <div
          className="animate-fade-up mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md"
          style={{ animationDelay: '420ms' }}
        >
          <span aria-hidden className="text-sm leading-none">🔥</span>
          <span className="text-sm text-white/60">
            <span className="font-semibold tabular-nums text-bleu">
              {liveCount.toLocaleString('fr-FR')}
            </span>{' '}
            photos générées aujourd'hui
          </span>
        </div>
      </div>

      {/* Dégradé de transition vers la section suivante */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-noir" />
    </section>
  )
}
