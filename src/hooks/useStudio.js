import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'

// Logique métier du Studio partagée entre /studio et HeroStudio.
// Persistance éphémère du résultat verrouillé. Survit à la redirection Stripe
// (même onglet) → permet de restaurer + défloutera la photo au retour de paiement.
const PENDING_KEY = 'pc_pending_result'
const savePending  = (r) => { try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(r)) } catch { /* quota dépassé : on ignore */ } }
const clearPending = ()  => { try { sessionStorage.removeItem(PENDING_KEY) } catch { /* noop */ } }

export function useStudio() {
  const { openAuthModal, refreshProfile } = useAuth()

  const [image,      setImage]      = useState(null)
  const [image2,     setImage2]     = useState(null)
  const [prompt,     setPrompt]     = useState('')
  const [mode,       setMode]       = useState('image')   // 'image' | 'video'
  const [generating, setGenerating] = useState(false)
  const [result,     setResult]     = useState(null)      // { imageUrl, mode, locked, demo }
  const [error,      setError]      = useState(null)
  const [noCredits,  setNoCredits]  = useState(false)  // abonné métré tombé à 0 crédit

  // Au montage : restaure la photo EN ATTENTE de déblocage (sessionStorage) si aucun
  // résultat courant. Permet de RETROUVER la photo floutée en revenant en arrière
  // depuis /abonnement (le state local est sinon perdu au démontage du composant).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY)
      if (raw) setResult((cur) => cur ?? JSON.parse(raw))
    } catch { /* sessionStorage indispo : on ignore */ }
  }, [])

  const canGenerate = !!image && prompt.trim().length > 0

  const handleGenerate = async () => {
    if (!canGenerate || generating) return

    // Vérifie la session AVANT de lancer — compte obligatoire pour générer.
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? null
    if (!token) {
      openAuthModal()
      return
    }

    setGenerating(true)
    setError(null)
    setNoCredits(false)
    setResult(null)

    try {
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ image, image2: image2 || undefined, prompt: prompt.trim(), mode }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        // Pas de clé Replicate → démo verrouillée (parcours utilisable)
        if (data.error === 'no_key') {
          const r = { imageUrl: image, mode, locked: true, demo: true }
          savePending(r)
          setResult(r)
          return
        }
        // Plus de crédits (essais gratuits épuisés OU abonné à 0) → message serveur différencié.
        if (data.error === 'no_credits') {
          setError(data.message || 'Crédits épuisés.')
          setNoCredits(true)
          refreshProfile?.()   // resynchronise le compteur (header) avec le solde réel
          return
        }
        // Compte Replicate vide (billing)
        if (data.error === 'replicate_billing') {
          setError('Solde Replicate insuffisant — recharge ton compte sur replicate.com/account/billing.')
          return
        }
        setError(data.message || 'La génération a échoué. Réessaie dans un instant.')
        return
      }

      // Rendu réel — verrouillé derrière l'abonnement jusqu'à Stripe (étape C).
      const r = { imageUrl: data.imageUrl, mode, genMode: data.mode, locked: true, demo: false }
      savePending(r)
      setResult(r)
      refreshProfile?.()   // MAJ du solde de crédits après le débit côté serveur
    } catch {
      setError('Connexion impossible au service de génération. Vérifie ta connexion et réessaie.')
    } finally {
      setGenerating(false)
    }
  }

  const reset = () => {
    setImage(null)
    setImage2(null)
    setResult(null)
    setError(null)
    setNoCredits(false)
    clearPending()
  }

  // Restaure la photo mise en attente avant le paiement (appelé au retour Stripe).
  // Retourne true si une photo a été restaurée.
  const restorePending = () => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY)
      if (!raw) return false
      setResult(JSON.parse(raw))
      clearPending()
      return true
    } catch { return false }
  }

  return {
    image,      setImage,
    image2,     setImage2,
    prompt,     setPrompt,
    mode,       setMode,
    generating,
    result,
    error,
    noCredits,
    canGenerate,
    handleGenerate,
    reset,
    restorePending,
  }
}
