import { useState, useEffect, useRef } from 'react'

// Notifications « live » (preuve sociale, façon Credia) : fait défiler des
// événements d'activité en bas à gauche pour donner l'impression qu'il y a du
// monde qui s'abonne / génère en ce moment. Contenu factice, anonymisé (initiales).
const NAMES = [
  'j.m43', 'lucas_92', 'sarah.k', 'tom_1', 'inès.b', 'noah75', 'léa.m', 'enzo_',
  'manon.c', 'hugo93', 'jade_x', 'rayan.s', 'clara.l', 'dylan_', 'maeva.p',
  'théo28', 'sofia.r', 'ethan_', 'camille.b', 'nina_x', 'yanis.k', 'lola.d',
]

// plan = mis en avant en bleu (abonnement). Les events « abo » sont dupliqués
// pour tomber plus souvent (objectif conversion).
const EVENTS = [
  { text: "s'est abonné", plan: 'Découverte' },
  { text: "s'est abonné", plan: 'Essentiel' },
  { text: "s'est abonné", plan: 'Essentiel' },
  { text: "s'est abonné", plan: 'Ultimate' },
  { text: 'vient de débloquer sa photo' },
  { text: 'a généré une transfo 🏎️' },
  { text: 'a généré une photo à Dubaï 🌴' },
  { text: 'a généré une transfo muscle 💪' },
  { text: 'a pris un pack de crédits' },
  { text: 'a envoyé son snap rouge 🔴' },
]
const AGOS = ['À l’instant', 'À l’instant', 'À l’instant', 'il y a 1 min', 'il y a 2 min']

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function LiveActivity() {
  const [item, setItem] = useState(null)
  const [show, setShow] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    let alive = true
    const push = (fn, ms) => timers.current.push(setTimeout(fn, ms))

    const loop = () => {
      if (!alive) return
      setItem({ name: pick(NAMES), ev: pick(EVENTS), ago: pick(AGOS) })
      setShow(true)
      push(() => setShow(false), 4200)                          // visible ~4,2 s
      push(loop, 4200 + 1500 + Math.random() * 2500)            // pause puis suivant
    }
    push(loop, 2500)                                            // 1re notif après 2,5 s

    return () => { alive = false; timers.current.forEach(clearTimeout); timers.current = [] }
  }, [])

  if (!item) return null

  return (
    <div
      aria-hidden
      className={`fixed bottom-5 left-5 z-40 max-w-[300px] transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-x-2 translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-noir-800/95 px-4 py-3 shadow-card backdrop-blur-xl">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-bleu-light to-bleu text-white">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" /><path d="M5 21h14" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm leading-snug text-white">
            <span className="font-bold">{item.name}</span> {item.ev.text}
            {item.ev.plan && <> : <span className="font-bold text-bleu">{item.ev.plan}</span></>}
          </p>
          <p className="text-[11px] text-white/40">{item.ago}</p>
        </div>
      </div>
    </div>
  )
}
