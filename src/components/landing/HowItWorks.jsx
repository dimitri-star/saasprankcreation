import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'

// « Comment ça marche » — 3 étapes. Chaque étape porte un accent couleur (core
// Tailwind : sky / bleu / emerald) pour réchauffer la DA sans toucher la config.
const steps = [
  {
    n: '01',
    title: 'Uploade ta photo',
    text: 'Une photo de toi, visage net et bien éclairé. L’IA détecte le visage en un instant.',
    accent: 'sky',
    Icon: IconUpload,
  },
  {
    n: '02',
    title: 'Choisis ta transfo',
    text: 'Voyage, voiture, muscu, soirée… ou décris ta scène. 8 catégories prêtes en un clic.',
    accent: 'bleu',
    Icon: IconPin,
  },
  {
    n: '03',
    title: 'Génère & partage',
    text: 'Quelques secondes plus tard, ta photo est prête. Télécharge-la et poste-la.',
    accent: 'emerald',
    Icon: IconShare,
  },
]

// Map d'accents → classes statiques (Tailwind ne compile pas les classes calculées).
const accents = {
  sky: {
    ring: 'ring-sky-400/30',
    glow: 'bg-sky-500/15',
    text: 'text-sky-300',
    chip: 'bg-sky-500/10 text-sky-200 ring-sky-400/25',
  },
  bleu: {
    ring: 'ring-bleu/40',
    glow: 'bg-bleu/15',
    text: 'text-bleu',
    chip: 'bg-bleu/10 text-bleu ring-bleu/30',
  },
  emerald: {
    ring: 'ring-emerald-400/30',
    glow: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    chip: 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/25',
  },
}

export default function HowItWorks() {
  return (
    <section id="comment" className="py-24 sm:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Comment ça marche</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Trois étapes, <span className="text-gradient-bleu">zéro effort</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/55">
            Pas de logiciel, pas de retouche. Tu uploades, tu choisis, tu bluffes.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s, i) => {
            const a = accents[s.accent]
            return (
              <Reveal key={s.n} delay={i * 110} className="h-full">
                <article className="group glass relative flex h-full flex-col overflow-hidden rounded-2xl p-7">
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${a.glow} opacity-60`}
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ${a.ring} ${a.text}`}
                    >
                      <s.Icon />
                    </span>
                    <span className="font-display text-4xl font-bold text-white/10">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {s.text}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 text-center">
          <Link to="/studio" className="btn-bleu">
            Commencer maintenant
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* — Icônes (stroke, héritent de currentColor) — */
const svg = 'h-5 w-5'

function IconUpload() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" />
    </svg>
  )
}
