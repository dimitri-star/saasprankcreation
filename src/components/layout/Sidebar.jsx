import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { planLabel, isPaid, isUnlimitedPlan } from '../../lib/planLabels.js'
import { openBillingPortal } from '../../lib/billingPortal.js'

// Coque appli : navigation latérale. `onNavigate` referme le drawer mobile.
const nav = [
  { to: '/',           label: 'Accueil',     end: true, Icon: IconHome   },
  { to: '/studio',     label: 'Studio',               Icon: IconStudio },
  { to: '/abonnement', label: 'Abonnement',            Icon: IconCrown  },
  { to: '/tuto-snap',  label: 'Tuto Snap',             Icon: IconSnap   },
]

export default function Sidebar({ onNavigate }) {
  const { user, profile, openAuthModal, signOut } = useAuth()
  const [portalLoading, setPortalLoading] = useState(false)

  async function handleManageAbo() {
    setPortalLoading(true)
    try { await openBillingPortal() } catch (err) { alert(err.message) }
    finally { setPortalLoading(false) }
  }

  return (
    <div className="flex h-full flex-col border-r border-white/5 bg-noir-900/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-[68px] shrink-0 items-center px-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="font-display text-2xl font-bold tracking-tight text-white"
        >
          Prank<span className="text-gradient-bleu">Creation</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-bleu-light to-bleu text-white shadow-[0_8px_24px_-12px_rgba(59,130,246,0.8)]'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bas : état de connexion */}
      <div className="shrink-0 border-t border-white/5 p-3">
        {user ? (
          /* Connecté : avatar + email + plan + crédits + gestion abo + déco */
          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bleu/20 text-xs font-bold uppercase text-bleu">
                {user.email?.[0] ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">{user.email}</p>
                <p className="text-xs text-white/40">
                  {isPaid(profile?.plan)
                    ? <span className="text-bleu/80">{planLabel(profile.plan)}</span>
                    : 'Gratuit'}
                  {' · '}
                  {isUnlimitedPlan(profile?.plan)
                    ? 'crédits illimités'
                    : `${profile?.credits_balance ?? '…'} crédit${profile?.credits_balance !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                onClick={signOut}
                title="Se déconnecter"
                className="shrink-0 text-white/30 transition-colors hover:text-white"
              >
                <IconLogout />
              </button>
            </div>
            {/* Bouton "Gérer mon abo" — visible uniquement si abonnement Stripe actif */}
            {isPaid(profile?.plan) && (
              <button
                onClick={handleManageAbo}
                disabled={portalLoading}
                className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/80 disabled:opacity-50"
              >
                <IconSettings />
                {portalLoading ? 'Chargement…' : 'Gérer mon abonnement'}
              </button>
            )}
          </div>
        ) : (
          /* Non connecté */
          <button
            type="button"
            onClick={openAuthModal}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <IconUser />
            Se connecter
          </button>
        )}
      </div>
    </div>
  )
}

/* — Icônes (stroke 18px, currentColor) — */
const svg = 'h-[18px] w-[18px] shrink-0'

function IconHome() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /><path d="M9.5 21v-6h5v6" />
    </svg>
  )
}

function IconStudio() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l1.7 4.5L18 10l-4.3 1.5L12 16l-1.7-4.5L6 10l4.3-1.5L12 4z" />
      <path d="M18.5 14.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6z" />
    </svg>
  )
}

function IconCrown() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" /><path d="M5 21h14" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconSnap() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.103 2C8.82 2 6.09 4.388 6.09 7.38c0 .322.028.637.08.944l-.895.05c-.372 0-.673.265-.673.59 0 .297.254.544.6.582l.637.07c-.16.333-.337.653-.53.953-.198.308-.416.587-.653.836-.24.251-.408.57-.408.907 0 .418.21.8.557 1.058.32.24.748.375 1.208.375.074 0 .148-.004.222-.012.304.571.888.984 1.574 1.072l-.01.041c-.143.537-.574.962-1.12 1.145l-.15.05c-.35.115-.54.468-.42.785.12.317.48.487.83.372l.15-.05c.36-.119.708-.29 1.032-.51.01.127.016.255.016.384 0 1.82 1.466 3.298 3.273 3.298 1.808 0 3.274-1.478 3.274-3.298 0-.129.005-.257.016-.384.324.22.672.391 1.032.51l.15.05c.35.115.71-.055.83-.372.12-.317-.07-.67-.42-.785l-.15-.05c-.546-.183-.977-.608-1.12-1.145l-.01-.041c.686-.088 1.27-.5 1.574-1.072.074.008.148.012.222.012.46 0 .888-.135 1.208-.375.347-.258.557-.64.557-1.058 0-.337-.168-.656-.408-.907-.237-.249-.455-.528-.653-.836-.193-.3-.37-.62-.53-.953l.637-.07c.346-.038.6-.285.6-.582 0-.325-.301-.59-.673-.59l-.895-.05c.052-.307.08-.622.08-.944C18.114 4.388 15.385 2 12.103 2z"/>
    </svg>
  )
}

function IconSettings() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
