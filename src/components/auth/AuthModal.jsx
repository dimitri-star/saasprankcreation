// Modal login / inscription. Déclenché depuis la sidebar ou quand une
// génération nécessite d'être connecté. 3 crédits offerts à l'inscription.
import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth()
  const [mode, setMode]       = useState('login')  // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(null)

  if (!authModalOpen) return null

  const reset = () => { setError(null); setSuccess(null) }
  const switchMode = () => { setMode(m => m === 'login' ? 'signup' : 'login'); reset() }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    reset()
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        closeAuthModal()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Compte créé 🎉 Vérifie ton email pour confirmer, puis connecte-toi.')
      }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Invalid login')) setError('Email ou mot de passe incorrect.')
      else if (msg.includes('already registered')) setError('Cet email est déjà utilisé.')
      else if (msg.includes('Password should')) setError('Mot de passe trop court (6 caractères min).')
      else setError(msg || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  // Connexion / inscription via Google (OAuth). Supabase redirige vers Google
  // puis revient sur la page courante ; onAuthStateChange récupère la session.
  // Prérequis dashboard : provider Google activé dans Supabase + URL de callback
  // configurée côté Google Cloud (voir notes de mise en service).
  const handleGoogle = async () => {
    setLoading(true)
    reset()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname },
      })
      if (error) throw error
      // Succès → le navigateur part vers Google (on ne reset pas le loading).
    } catch (err) {
      setError(err.message || 'Connexion Google impossible.')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-noir-900 p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-lg text-white/30 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <p className="eyebrow mb-2 text-xs">
            {mode === 'signup' ? '3 crédits offerts' : 'Bon retour'}
          </p>
          <h2 className="font-display text-2xl font-bold text-white">
            {mode === 'login' ? 'Connexion' : 'Créer mon compte'}
          </h2>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-noir transition hover:bg-white/90 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          Continuer avec Google
        </button>

        {/* Séparateur */}
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/30">ou</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Ton email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-bleu/50 focus:ring-1 focus:ring-bleu/30"
          />
          <input
            type="password"
            placeholder="Mot de passe (6 caractères min)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-bleu/50 focus:ring-1 focus:ring-bleu/30"
          />

          {error   && <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
          {success && <p className="rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-bleu w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-5 text-center text-sm text-white/40">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
          <button type="button" onClick={switchMode} className="text-bleu-light hover:underline">
            {mode === 'login' ? 'Inscris-toi' : 'Connecte-toi'}
          </button>
        </p>
      </div>
    </div>
  )
}
