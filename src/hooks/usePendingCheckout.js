import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { startCheckout } from '../lib/checkout.js'

// priceKey mémorisé quand l'user clique « payer » SANS être connecté (→ modale d'auth).
// sessionStorage survit à la redirection OAuth Google (même onglet).
const KEY = 'pc_pending_checkout'

export function savePendingCheckout(priceKey) {
  try { sessionStorage.setItem(KEY, priceKey) } catch { /* quota : on ignore */ }
}

// Reprend AUTOMATIQUEMENT le paiement après connexion : dès que l'user est connecté,
// si un priceKey était en attente (clic « payer » → inscription), on relance le
// checkout → redirection Stripe DIRECTE. Plus besoin de re-cliquer le plan.
export function useResumeCheckout(onError) {
  const { user } = useAuth()
  useEffect(() => {
    if (!user) return
    let pending = null
    try { pending = sessionStorage.getItem(KEY) } catch { /* noop */ }
    if (!pending) return
    try { sessionStorage.removeItem(KEY) } catch { /* noop */ } // retiré AVANT → pas de boucle
    startCheckout(pending).catch((e) => onError?.(e?.message))
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps
}
