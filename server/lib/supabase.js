// Client Supabase côté serveur (service_role). Utilisé pour :
// - vérifier le JWT de l'utilisateur (auth.getUser)
// - lire/écrire les profils et générations sans restrictions RLS
// JAMAIS exposé au navigateur — service_role = accès total.
import { createClient } from '@supabase/supabase-js'

let adminClient = null

export function getAdminClient() {
  if (!adminClient) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null          // pas encore configuré → features désactivées
    adminClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return adminClient
}
