import { Link } from 'react-router-dom'
import { transformations } from '../../data/transformations.js'
import Reveal from '../Reveal.jsx'

export default function DestinationsGrid() {
  return (
    <section id="destinations" className="py-24 sm:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">8 transformations · et bien plus</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            En quoi tu veux te transformer ?
          </h2>
          <p className="mt-5 text-white/55">
            Choisis une catégorie, uploade ta photo, l’IA s’occupe du reste.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {transformations.map((d, i) => (
            <Reveal key={d.id} delay={(i % 4) * 90}>
              <Link
                to="/studio"
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:border-bleu/40 hover:shadow-bleu"
              >
                {/* Photo de fond + fallback gradient */}
                {d.imgSrc ? (
                  <img
                    src={d.imgSrc}
                    alt={d.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{ background: d.gradient }}
                  />
                )}
                <div className="grain absolute inset-0" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
