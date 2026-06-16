import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import ChatWidget from '../chat/ChatWidget.jsx'
import ChatGeneral from '../chat/ChatGeneral.jsx'

// Coque de l'application : sidebar fixe à gauche (desktop) + contenu décalé.
// Sur mobile, la sidebar devient un drawer ouvert par le hamburger de la barre top.
export default function AppLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-noir">
      {/* Sidebar fixe — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {/* Barre top — mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/5 bg-noir-900/90 px-4 backdrop-blur-xl lg:hidden">
        <Link to="/" className="font-display text-xl font-bold text-white">
          Prank<span className="text-gradient-bleu">Creation</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 transition hover:bg-white/[0.06]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {/* Drawer — mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-noir/70 backdrop-blur-sm"
          />
          <div className="animate-fade-in absolute inset-y-0 left-0 w-64">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Contenu des pages */}
      <div className="lg:pl-64">
        <Outlet />
      </div>

      {/* Assistant flottant (global) */}
      <ChatWidget />
      {/* Chat public entre utilisateurs */}
      <ChatGeneral />
    </div>
  )
}
