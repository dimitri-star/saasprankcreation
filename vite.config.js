import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devApi from './server/dev-api.js'

export default defineConfig({
  // devApi : sert POST /api/generate dans le serveur de dev (Replicate).
  // En prod, c'est la fonction Vercel api/generate.js qui prend le relais.
  plugins: [react(), devApi()],
  server: {
    host: true,
  },
})

