// Adaptateur Replicate — google/nano-banana (Gemini 2.5 Flash Image), 1 ou 2 photos.
//
// Tous les Buffers sont auto-uploadés par le SDK Replicate (≤100 Mio) puis
// remplacés par une URL interne — jamais d'URL client acceptée (anti-SSRF).
// `useFileOutput: false` => sorties = URLs simples (strings).
import Replicate from 'replicate'

let client = null
function getClient() {
  if (!client) {
    client = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      useFileOutput: false,
    })
  }
  return client
}

// Normalise la sortie Replicate en une URL string, quel que soit le format
// (string seule, tableau d'URLs, ou objet FileOutput résiduel).
function firstUrl(output) {
  const value = Array.isArray(output) ? output[0] : output
  if (typeof value === 'string') return value
  if (value && typeof value.url === 'function') return String(value.url())
  return String(value)
}

// ── nano-banana standard (Gemini 2.5 Flash Image) ───────────────────────────────
// Édition/compositing photoréaliste préservant le visage, 1 ou 2 images.
// ~0,039 $/image (vs ~0,13 $ pour la version « Pro » 2K) → ~70 % moins cher pour un
// rendu très proche sur du mobile/Snap. Schéma vérifié via l'API Replicate : le modèle
// standard accepte prompt + image_input + aspect_ratio + output_format (PAS de
// resolution / safety_filter_level, propres à la version Pro).
export async function runNanoBanana({ image, image2, prompt }) {
  const images = image2 ? [image, image2] : [image]
  const output = await getClient().run('google/nano-banana', {
    input: {
      prompt,
      image_input:   images,
      aspect_ratio:  'match_input_image', // garde le cadrage exact de la photo source
      output_format: 'jpg',
    },
  })
  return firstUrl(output)
}
