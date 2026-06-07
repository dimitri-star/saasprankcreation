import { useState } from 'react'
import { faqs } from '../../data/faq.js'
import Reveal from '../Reveal.jsx'

// Accordéon FAQ réutilisable. `tag` filtre les questions (ex: 'pricing' sur /abonnement).
// Un seul panneau ouvert à la fois ; transition de hauteur via grid-rows (pas de JS de mesure).
export default function Faq({
  tag = null,
  id = 'faq',
  eyebrow = 'FAQ',
  title = 'Tout ce qu’on te demande',
}) {
  const items = tag ? faqs.filter((f) => f.tags?.includes(tag)) : faqs
  const [open, setOpen] = useState(null)

  return (
    <section id={id} className="py-24 sm:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {items.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? 'border-bleu/30 bg-bleu/[0.04]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <span className="font-medium text-white">{f.q}</span>
                    <span
                      aria-hidden
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-base transition-all duration-300 ${
                        isOpen
                          ? 'rotate-45 border-bleu/40 text-bleu'
                          : 'border-white/15 text-white/50'
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-white/65 sm:px-6">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
