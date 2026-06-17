import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const ADJECTIVES = ['Super','Mega','Ultra','Fast','Dark','Flash','Wild','Pro','Epic','Real','Hyper','Cool']
const ANIMALS    = ['Shark','Wolf','Eagle','Fox','Bear','Lynx','Hawk','Tiger','Cobra','Lion','Viper','Panda']
const MAX        = 60
const RATE_MS    = 3000  // 1 message toutes les 3 secondes max

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
        if (data) setMessages(data.reverse())
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
