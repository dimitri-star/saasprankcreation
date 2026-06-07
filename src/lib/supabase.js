// Client Supabase côté navigateur (clé anon — conçue pour être publique,
// protégée par les politiques RLS). Utilisé pour l'auth et les lectures
// côté client (profil, galerie).
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
