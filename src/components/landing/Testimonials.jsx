import { testimonials, ratingSummary } from '../../data/testimonials.js'
import Reveal from '../Reveal.jsx'

// Étoiles pleines/vides selon la note (sur 5).
function Stars({ value, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${className} ${i <= value ? 'text-bleu' : 'text-white/15'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 2.5z" />
        </svg>
      ))}
    </span>
  )
}

export default function Testimonials() {
  return (
    <section id="avis" className="py-24 sm:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Ils y ont cru</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Personne n’a vu la différence
          </h2>

          {/* Note agrégée */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 backdrop-blur-md">
            <Stars value={Math.round(ratingSummary.average)} />
            <span className="text-sm text-white/70">
              <span className="font-semibold text-white">
                {ratingSummary.average.toLocaleString('fr-FR')}/5
              </span>{' '}
              · {ratingSummary.count.toLocaleString('fr-FR')} avis
            </span>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 110}>
              <figure className="glass flex h-full flex-col rounded-2xl p-7">
                <Stars value={t.rating} />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-white/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-bleu-light to-bleu-dark font-display text-sm font-bold text-white">
                    {t.initials}
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-white">{t.name}</span>
                    <span className="text-white/40">, {t.age} ans</span>
                    <span className="block text-xs text-bleu/70">{t.tag}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
