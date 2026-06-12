import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setValue(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return [value, ref]
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 align-middle">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6">
          <path d="M12 2l2.95 6.5L22 9.3l-5 4.6 1.3 6.9L12 17.6 5.7 20.8 7 13.9 2 9.3l7.05-.8z" />
        </svg>
      ))}
    </span>
  )
}

export default function SocialProof() {
  const [generated, genRef] = useCountUp(12847)
  const [reviews, revRef] = useCountUp(2341)

  return (
    <section className="border-y border-white/5 bg-noir-800/40">
      <div className="container-luxe grid grid-cols-1 divide-y divide-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div ref={genRef} className="flex flex-col items-center justify-center py-8 text-center">
          <span className="font-display text-3xl font-bold text-white sm:text-4xl">
            {generated.toLocaleString('fr-FR')}
          </span>
          <span className="mt-1 text-sm text-white/45">
            photos générées aujourd’hui
          </span>
        </div>

        <div ref={revRef} className="flex flex-col items-center justify-center py-8 text-center">
          <span className="flex items-center gap-2 font-display text-3xl font-bold text-white sm:text-4xl">
            4.9 <Stars />
          </span>
          <span className="mt-1 text-sm text-white/45">
            {reviews.toLocaleString('fr-FR')} avis clients
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="font-display text-3xl font-bold text-white sm:text-4xl">
            8 secondes
          </span>
          <span className="mt-1 text-sm text-white/45">
            pour bluffer tes potes
          </span>
        </div>
      </div>
    </section>
  )
}
