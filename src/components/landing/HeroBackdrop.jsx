import { transformations } from '../../data/transformations.js'

// Tuile « photo générée » : placeholder gradient premium (convention projet —
// pas d'URL externe), légèrement étiquetée pour l'effet galerie.
function Tile({ d }) {
  return (
    <div
      className="grain relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border border-white/5 sm:h-56 sm:w-40"
      style={{ backgroundImage: d.gradient }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[10px] font-medium text-white/75">
        <span aria-hidden>{d.flag}</span>
        <span className="tracking-wide">{d.name}</span>
      </div>
    </div>
  )
}

// Rangée défilante : items doublés pour une boucle horizontale sans couture.
function Strip({ items, animation }) {
  const loop = [...items, ...items]
  return (
    <div
      className={`flex w-max gap-3 sm:gap-4 ${animation} motion-reduce:animate-none`}
    >
      {loop.map((d, i) => (
        <Tile key={`${d.id}-${i}`} d={d} />
      ))}
    </div>
  )
}

export default function HeroBackdrop() {
  // 3 rangées décalées (ordre différent) pour un effet galerie/parallaxe.
  const rowA = transformations
  const rowB = [...transformations].reverse()
  const rowC = [...transformations.slice(3), ...transformations.slice(0, 3)]

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-noir">
      {/* Mosaïque défilante (scroll horizontal lent automatique) */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-55 sm:gap-4">
        <Strip items={rowA} animation="animate-marquee" />
        <Strip items={rowB} animation="animate-marquee-rev" />
        <Strip items={rowC} animation="animate-marquee" />
      </div>

      {/* Overlay sombre ~70 % + fondu vertical pour la lisibilité du titre */}
      <div className="absolute inset-0 bg-noir/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-noir via-noir/40 to-noir" />

      {/* Lueurs or / teal conservées (DA luxe) */}
      <div className="absolute -left-32 -top-24 h-[42rem] w-[42rem] rounded-full bg-bleu/15 blur-[140px]" />
      <div className="absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full bg-[#126b86]/15 blur-[150px]" />
    </div>
  )
}
