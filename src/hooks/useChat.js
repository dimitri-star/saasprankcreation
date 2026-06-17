import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const ADJECTIVES = ['Super','Mega','Ultra','Fast','Dark','Flash','Wild','Pro','Epic','Real','Hyper','Cool']
const ANIMALS    = ['Shark','Wolf','Eagle','Fox','Bear','Lynx','Hawk','Tiger','Cobra','Lion','Viper','Panda']
const MAX        = 60
const RATE_MS    = 3000  // 1 message toutes les 3 secondes max

// Messages d'amorce affichés en haut du chat tant qu'il y a peu d'activité réelle
// (preuve sociale au lancement, façon Credia). Ils s'effacent naturellement en
// bas de pile quand assez de vrais messages arrivent (slice MAX).
const SEED = [
  { id: 'seed-1',  username: 'Mega_Cobra27',  content: "frère c'est trop réaliste 😭" },
  { id: 'seed-2',  username: 'Lola_Stx',      content: "j'ai bluffé ma mère avec la photo à Dubaï mdrr" },
  { id: 'seed-3',  username: 'Neo_Wolf12',    content: 'comment on fait pour un essai gratuit ?' },
  { id: 'seed-4',  username: 'Fast_Hawk13',   content: 'ça marche vraiment le snap rouge ?' },
  { id: 'seed-5',  username: 'Cool_Shark84',  content: 'le filigrane il part quand on paye ?' },
  { id: 'seed-6',  username: 'Dark_Lynx7',    content: "ouais il part direct dès que t'as pris l'abo" },
  { id: 'seed-7',  username: 'Super_Tiger43', content: 'on peut payer en paypal ?' },
  { id: 'seed-8',  username: 'Epic_Fox22',    content: 'première fois que ça rend aussi bien wsh' },
  { id: 'seed-9',  username: 'Wild_Bear9',    content: "j'ai pris signature ça vaut le coup les crédits" },
  { id: 'seed-10', username: 'Hyper_Viper5',  content: 'meilleur site de prank fr franchement' },
  { id: 'seed-11', username: 'Real_Lion31',   content: 'trop stylé la transfo voiture 🏎️' },
  { id: 'seed-12', username: 'Flash_Panda8',  content: 'vous mettez quoi comme photo vous ?' },
]

export function generateUsername(userId) {
  let h = 0
  for (const c of userId) h = (h * 31 + c.charCodeAt(0)) & 0xffffff
  return `${ADJECTIVES[h % ADJECTIVES.length]}_${ANIMALS[(h >> 4) % ANIMALS.length]}${(h % 97) + 1}`
}

export function useChat(active) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [draft, setDraft]       = useState('')
  const [loading, setLoading]   = useState(false)
  const lastAt = useRef(0)

  const username = user ? generateUsername(user.id) : null

  // Charge les derniers messages à l'ouverture
  useEffect(() => {
    if (!active) return
    setLoading(true)
    supabase
      .from('messages')
      .select('id, username, content, created_at')
      .order('created_at', { ascending: false })
      .limit(MAX)
      .then(({ data }) => {
        // Amorces en haut, puis les vrais messages (du plus ancien au plus récent).
        setMessages([...SEED, ...((data || []).reverse())])
        setLoading(false)
      })
  }, [active])

  // Abonnement Realtime (nouveaux messages en direct)
  useEffect(() => {
    if (!active) return
    const ch = supabase
      .channel('public-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        ({ new: m }) =>
          setMessages(prev => {
            if (prev.some(x => x.id === m.id)) return prev
            return [...prev.slice(-(MAX - 1)), m]
          }),
      )
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [active])

  const [sendError, setSendError] = useState(null)

  const send = useCallback(async () => {
    const text = draft.trim()
    if (!text || !user || !username) return
    const now = Date.now()
    if (now - lastAt.current < RATE_MS) return
    lastAt.current = now
    setDraft('')
    setSendError(null)

    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: user.id, username, content: text.slice(0, 200) })
      .select('id, username, content, created_at')
      .single()

    if (error) {
      console.error('[chat:send]', error)
      setSendError('Envoi échoué. Réessaie.')
      return
    }

    // Ajoute localement si Realtime ne l'a pas déjà injecté
    if (data) {
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev
        return [...prev.slice(-(MAX - 1)), data]
      })
    }
  }, [draft, user, username])

  return { messages, draft, setDraft, send, loading, username, sendError }
}
