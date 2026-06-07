import { Link } from 'react-router-dom'
import Footer from '../landing/Footer.jsx'
import Reveal from '../Reveal.jsx'

// Coque commune aux pages légales. `sections` = [{ title, body: [paragraphes] }].
// `note` = bandeau d'avertissement honnête (ex : modèle à compléter).
export default function LegalPage({ eyebrow, title, updated, note, sections }) {
  return (
    <div className="relative min-h-screen bg-noir">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-bleu/10 blur-[150px]" />
      </div>

      <main className="container-luxe relative z-10 py-16">
        <Reveal className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> Accueil
          </Link>

          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {updated && (
            <p className="mt-3 text-sm text-white/40">
              Dernière mise à jour : {updated}
            </p>
          )}

          {note && (
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] px-5 py-4">
              <span aria-hidden className="mt-0.5 text-amber-300">⚠️</span>
              <p className="text-sm leading-relaxed text-amber-100/80">{note}</p>
            </div>
          )}

          <div className="mt-12 space-y-10">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-display text-xl font-bold text-white">
                  <span className="text-bleu/70">{String(i + 1).padStart(2, '0')}. </span>
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-white/65">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  )
}
