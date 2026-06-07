// Adaptateur Replicate — google/nano-banana-pro (Gemini 3 Pro Image), 1 ou 2 photos.
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

// ── nano-banana Pro (Gemini 3 Pro Image) ───────────────────────────────────────
// Édition/compositing photoréaliste, 1 ou 2 images. resolution 2K = bon équilibre
// qualité/coût ; safety_filter_level au plus permissif (block_only_high) pour ne pas
// bloquer les transfos légitimes — le périmètre contenu est géré côté prompt.
export async function runNanoBananaPro({ image, image2, prompt }) {
  const images = image2 ? [image, image2] : [image]
  const output = await getClient().run('google/nano-banana-pro', {
    input: {
      prompt,
      image_input:         images,
      aspect_ratio:        'match_input_image', // garde le cadrage exact de la photo source
      output_format:       'jpg',
      resolution:          '2K',              // 1K | 2K | 4K — 2K suffit pour mobile
      safety_filter_level: 'block_only_high', // le plus permissif (défaut Replicate)
    },
  })
  return firstUrl(output)
}
