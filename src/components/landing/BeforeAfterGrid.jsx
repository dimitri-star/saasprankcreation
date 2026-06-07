// Grille AVANT/APRÈS défilante — marquee infini de gauche à droite.
const PAIRS = [
  {
    id: 'p1',
    before: 'https://i.ibb.co/n8B7C8jX/IMG-9769.jpg',
    after:  'https://i.ibb.co/twYLY5mq/IMG-9770.jpg',
  },
  {
    id: 'p2',
    before: 'https://i.ibb.co/cSt4L1KS/IMG-9771.png',
    after:  'https://i.ibb.co/MkHFNJZn/IMG-9772.jpg',
  },
  {
    id: 'p3',
    before: 'https://i.ibb.co/4g1DTf5W/IMG-9773.jpg',
    after:  'https://i.ibb.co/5hTc39q4/IMG-9774.jpg',
  },
  {
    id: 'p4',
    before: 'https://i.ibb.co/DD67TGVz/IMG-9775.jpg',
    after:  'https://i.ibb.co/MD9ZypM8/IMG-9776.jpg',
  },
  {
    id: 'p5',
    before: 'https://i.ibb.co/qMvxc8zq/IMG-9777.jpg',
    after:  'https://i.ibb.co/TqxGQpD6/IMG-9778.jpg',
  },
]

// Dupliquer pour le loop seamless
const DOUBLED = [...PAIRS, ...PAIRS]

function Badge({ label, color = 'neutral' }) {
  const cls = color === 'green'
    ? 'bg-emerald-500 text-white'
    : 'bg-black/55 text-white/85 backdrop-blur-sm'
  return (
    <span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  )
}

function Pair({ pair }) {
  return (
    <div className="flex shrink-0 flex-col gap-1.5 w-[220px] sm:w-[260px]">
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
        <Badge label="Avant" />
        <img src={pair.before} alt="Avant" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
        <Badge label="Après" color="green" />
        <img src={pair.after} alt="Après" className="h-full w-full object-cover" loading="lazy" />
      </div>
    </div>
  )
}

export default function BeforeAfterGrid() {
  return (
    <section id="showcase" className="py-10 overflow-hidden">
      {/* Conteneur marquee — animation CSS pure, pause au survol */}
      <div
        className="flex gap-3"
        style={{
          width: 'max-content',
          animation: 'marquee 28s linear infinite',
        }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
      >
        {DOUBLED.map((pair, i) => (
          <Pair key={`${pair.id}-${i}`} pair={pair} />
        ))}
      </div>
    </section>
  )
}
