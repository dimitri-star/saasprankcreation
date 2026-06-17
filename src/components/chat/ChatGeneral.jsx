import { useEffect, useRef, useState } from 'react'
import { useChat } from '../../hooks/useChat.js'

function nameColor(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff
  return `hsl(${h % 360}, 70%, 65%)`
}

export default function ChatGeneral() {
  const [open, setOpen] = useState(false)
  const { messages, draft, setDraft, send, loading, username, sendError } = useChat(open)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Panneau chat */}
      {open && (
        <div className="animate-fade-in fixed bottom-[140px] right-5 z-50 flex w-80 flex-col overflow-hidden rounded-3xl border border-white/10 bg-noir-800/95 shadow-card backdrop-blur-2xl">
          {/* En-tête */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-sm font-semibold text-white">Chat Général</p>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                PUBLIC
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/30 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          {/* Pseudo de l'utilisateur */}
          {username && (
            <div className="border-b border-white/[0.04] px-4 py-1.5 text-[11px] text-white/35">
              Connecté en tant que{' '}
              <span className="font-semibold" style={{ color: nameColor(username) }}>
                {username}
              </span>
            </div>
          )}

          {/* Liste des messages */}
          <div className="flex h-72 flex-col gap-2.5 overflow-y-auto px-4 py-3">
            {loading && (
              <p className="pt-8 text-center text-xs text-white/30">Chargement…</p>
            )}
            {!loading && messages.length === 0 && (
              <p className="pt-8 text-center text-xs text-white/30">
                Sois le premier à écrire !
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-0.5">
                <span
                  className="text-[11px] font-bold"
                  style={{ color: nameColor(m.username) }}
                >
                  {m.username}
                </span>
                <p className="text-sm leading-snug text-white/75">{m.content}</p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Saisie */}
          {sendError && (
            <p className="px-4 pb-1 text-[11px] text-red-400">{sendError}</p>
          )}
          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex items-center gap-2 border-t border-white/5 p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 200))}
              onKeyDown={onKey}
              placeholder="Écrire un message…"
              className="w-full rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-bleu/50 focus:outline-none focus:ring-1 focus:ring-bleu/40"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-bleu-light to-bleu text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12 20 4l-7 16-2.5-6L4 12z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Bouton toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le Chat Général'}
        className="fixed bottom-[88px] right-5 z-50 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-noir-800/90 text-white/60 shadow-card backdrop-blur-xl transition-all duration-200 hover:border-bleu/40 hover:text-white"
      >
        {open ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
            +99
          </span>
        )}
      </button>
    </>
  )
}
