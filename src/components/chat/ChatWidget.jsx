import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Assistant guidé (front pur). Réponses scriptées par mots-clés — PAS un LLM.
// Honnête : étiqueté « assistant guidé », l'IA conversationnelle réelle viendra
// avec une clé (LLM). L'UI est prête à recevoir un vrai backend à la place de `answerFor`.

const intents = [
  {
    keys: ['prix', 'tarif', 'coût', 'cout', 'abonnement', 'combien', 'payer', 'euro'],
    a: 'Trois plans : Évasion 7,99 €, Signature 14,99 € et Prestige 34,99 €/mois. L’annuel te fait économiser 20 %. Tu veux voir le détail ?',
    action: { label: 'Voir les tarifs', to: '/abonnement' },
  },
  {
    keys: ['visage', 'face', 'réaliste', 'realiste', 'identité', 'identite', 'ressemble'],
    a: 'On garde ton visage et on te place dans la scène de ton choix — voiture de luxe, plage musclé, soirée, ski… Le but : un rendu crédible et indétectable. Meilleure photo de départ = meilleur résultat.',
  },
  {
    keys: ['temps', 'durée', 'duree', 'rapide', 'long', 'attendre', 'secondes'],
    a: 'Ça prend de quelques secondes à environ une minute selon la qualité (Standard, HD, 4K Ultra).',
  },
  {
    keys: ['résilier', 'resilier', 'annuler', 'engagement', 'stopper', 'arrêter', 'arreter'],
    a: 'Sans engagement : tu résilies en un clic depuis ton compte. L’accès reste actif jusqu’à la fin de la période payée.',
  },
  {
    keys: ['privé', 'prive', 'données', 'donnees', 'rgpd', 'confidential', 'sécur', 'secur'],
    a: 'Tes photos servent uniquement à générer tes images et tu peux les supprimer quand tu veux. Détails dans la politique de confidentialité.',
    action: { label: 'Politique de confidentialité', to: '/confidentialite' },
  },
  {
    keys: ['crédit', 'credit', 'génération', 'generation', 'combien de photo'],
    a: 'Chaque génération coûte 100 crédits, quelle que soit la qualité. Ton plan recharge tes crédits chaque mois.',
  },
  {
    keys: ['bonjour', 'salut', 'hello', 'coucou', 'hey', 'yo'],
    a: 'Salut 👋 Je suis l’assistant PrankCreation. Pose-moi une question, ou choisis-en une ci-dessous.',
  },
  {
    keys: ['snap', 'snapchat', 'story', 'technique', 'rouge'],
    a: 'Le mode Snap rouge te laisse envoyer ta photo générée sur Snapchat comme si tu venais de la prendre, l’air indétectable. Ça se passe directement dans le Studio.',
    action: { label: 'Ouvrir le Studio', to: '/studio' },
  },
]

const fallback =
  'Je suis un assistant guidé (réponses préenregistrées). Choisis une question ci-dessous, ou écris-nous à hello@prankcreation.app — le chat IA en direct arrive bientôt.'

function answerFor(text) {
  const t = text.toLowerCase()
  const hit = intents.find((i) => i.keys.some((k) => t.includes(k)))
  return hit ? { a: hit.a, action: hit.action } : { a: fallback, action: null }
}

const quickReplies = [
  'Combien ça coûte ?',
  'Le visage est-il préservé ?',
  'Combien de temps ?',
  'Puis-je résilier ?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Salut 👋 Je suis l’assistant PrankCreation. Une question sur les transfos pour bluffer tes potes, les prix ou la confidentialité ?',
      action: null,
    },
  ])
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const send = (text) => {
    const clean = text.trim()
    if (!clean) return
    const { a, action } = answerFor(clean)
    setMessages((m) => [
      ...m,
      { from: 'user', text: clean, action: null },
      { from: 'bot', text: a, action: action ?? null },
    ])
    setDraft('')
  }

  return (
    <>
      {/* Bulle flottante */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-bleu-light to-bleu text-white shadow-[0_18px_45px_-12px_rgba(59,130,246,0.7)] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {open ? <IconClose /> : <IconChat />}
      </button>

      {/* Panneau */}
      {open && (
        <div className="animate-fade-in fixed bottom-24 left-4 right-4 z-40 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-noir-800/95 shadow-card backdrop-blur-2xl sm:left-auto sm:right-5 sm:w-[370px]">
          {/* En-tête */}
          <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-bleu-light to-bleu-dark font-display font-bold text-white">
              IA
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Assistant PrankCreation</p>
              <p className="flex items-center gap-1.5 text-xs text-white/45">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                En ligne · réponses guidées
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-gradient-to-b from-bleu-light to-bleu text-white'
                      : 'border border-white/10 bg-white/[0.04] text-white/80'
                  }`}
                >
                  {m.text}
                  {m.action && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate(m.action.to)
                        setOpen(false)
                      }}
                      className="mt-2 block w-full rounded-lg border border-bleu/30 bg-bleu/10 px-3 py-1.5 text-xs font-semibold text-bleu transition-colors hover:bg-bleu/20"
                    >
                      {m.action.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Réponses rapides */}
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/65 transition-colors hover:border-bleu/40 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Saisie */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
            className="flex items-center gap-2 border-t border-white/5 p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écris ta question…"
              className="w-full rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-bleu/50 focus:outline-none focus:ring-1 focus:ring-bleu/40"
            />
            <button
              type="submit"
              aria-label="Envoyer"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-bleu-light to-bleu text-white transition-transform hover:scale-105 active:scale-95"
            >
              <IconSend />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function IconChat() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-5.4A8 8 0 1 1 21 11.5z" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12 20 4l-7 16-2.5-6L4 12z" />
    </svg>
  )
}
