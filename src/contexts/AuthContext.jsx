// Contexte d'authentification global. Fournit :
// - user, profile (avec credits_balance), loading
// - openAuthModal / closeAuthModal / authModalOpen
// - signOut, refreshProfile (après une génération)
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [profile, setProfile]         = useState(null)   // { credits_balance, plan }
  const [loading, setLoading]         = useState(true)
  const [authModalOpen, setAuthModal] = useState(false)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('credits_balance, plan')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const openAuthModal  = () => setAuthModal(true)
  const closeAuthModal = () => setAuthModal(false)
  const signOut        = () => supabase.auth.signOut()
  const refreshProfile = async () => {
    if (!user) return
    // Recharge le profil + rafraîchit la session pour avoir user_metadata à jour
    await fetchProfile(user.id)
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUser(data.user)
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      authModalOpen, openAuthModal, closeAuthModal,
      signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
