import { useState, useEffect } from 'react'

// Compteur « preuve sociale » : nb de générations du jour (façon Credia).
// Factice mais crédible : base ancrée sur la date (stable dans la journée) +
// progression au fil des heures + petit incrément live (effet « ça bouge »).
function baseForToday() {
  const d = new Date()
  const seed = d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate()
  const daily = 18000 + (seed % 6000)                 // 18 000–24 000 selon le jour
  return daily + d.getHours() * 540 + d.getMinutes() * 9
}

const AVATARS = ['🧑🏻', '🧑🏽', '🧑🏼']

export default function GeneratedToday({ className = '' }) {
  const [n, setN] = useState(baseForToday)

  useEffect(() => {
    const tick = () => setN((v) => v + 1)
    let id = setInterval(tick, 4000 + Math.random() * 4000) // +1 toutes les ~4-8 s
    return () => clearInterval(id)
  }, [])

  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`}>
      <span className="flex -space-x-2">
        {AVATARS.map((e, i) => (
          <span
            key={i}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-noir bg-noir-700 text-xs"
          >
            {e}
          </span>
        ))}
      </span>
      <p className="text-sm text-white/60">
        <span className="font-bold text-bleu">{n.toLocaleString('fr-FR')}</span>{' '}
        personnes ont généré une photo / vidéo aujourd’hui
      </p>
    </div>
  )
}
