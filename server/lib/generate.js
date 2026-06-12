// Cœur métier de la génération — partagé entre l'adaptateur dev (plugin Vite)
// et l'adaptateur prod (fonction Vercel). Aucune dépendance HTTP ici : entrée
// = objet { image, image2?, prompt }, sortie = { imageUrl, mode }.
// Routage : nano-banana standard (Gemini 2.5 Flash Image) pour 1 OU 2 photos.
// Validation côté serveur SYSTÉMATIQUE.
import { runNanoBanana } from './replicate.js'

// Erreur typée : l'adaptateur HTTP mappe `status`/`code` vers la réponse.
export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

const MAX_PROMPT = 200

// Décode un data URL → { buffer, mime }. Valide le type (JPG/PNG/WebP).
function dataUrlToImage(dataUrl) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(dataUrl)
  if (!match) throw new ApiError(400, 'bad_image', 'Image invalide — JPG ou PNG attendu.')
  return { buffer: Buffer.from(match[2], 'base64'), mime: match[1] }
}

// Prompt mode 1 photo (nano-banana Pro) — l'utilisateur tape une phrase simple
// (ex: "remplace par une Lamborghini"), le serveur l'enrichit. Ce qui rend
// nano-banana réaliste : langage "vraie photo" + intégration lumière/ombres/
// perspective + anti-CGI. On PRÉSERVE la lumière d'origine (pas de jour forcé).
function buildPrompt(instruction) {
  return (
    `Edit this real photo. ${instruction.trim()}. ` +
    `Apply the change fully and realistically: if it replaces an object, vehicle, outfit or setting, ` +
    `transform it completely into the new one — its real shape, proportions, materials and fine details, not just a logo or small part. ` +
    `Blend it naturally into the scene: match the original lighting, shadows, reflections and perspective so it looks like it was really there. ` +
    `Keep the same person, face and identity, the same pose, framing and camera angle, ` +
    `and any visible text or license plates unchanged. ` +
    `Keep the original lighting, time of day and ambiance of the scene. ` +
    `It must look like an authentic, unedited photograph — natural colors and textures, no CGI or 3D-render look, no over-smoothing.`
  )
}

// Mode 2 photos : composer/fusionner les deux images selon l'instruction.
function buildDoublePrompt(instruction) {
  return (
    `Using BOTH provided images, follow this instruction precisely: ${instruction.trim()}. ` +
    `Blend or composite them realistically, keeping the original lighting and ambiance. ` +
    `Photorealistic, looks like a real photo.`
  )
}

export async function generate({ image, image2, prompt }) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new ApiError(400, 'no_prompt', 'Décris ta transfo avant de générer.')
  }
  if (typeof image !== 'string' || !image.startsWith('data:image/')) {
    throw new ApiError(400, 'no_image', 'Ajoute une photo (JPG ou PNG) avant de générer.')
  }
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new ApiError(503, 'no_key', 'Génération non configurée : clé Replicate absente.')
  }

  const hasSecond   = typeof image2 === 'string' && image2.startsWith('data:image/')
  const instruction = prompt.slice(0, MAX_PROMPT)
  const fullPrompt  = hasSecond
    ? buildDoublePrompt(instruction)
    : buildPrompt(instruction)

  const img1 = dataUrlToImage(image)
  const img2 = hasSecond ? dataUrlToImage(image2) : null

  try {
    // nano-banana standard pour tout : 1 photo (édition) ou 2 photos (compositing).
    const imageUrl = await runNanoBanana({
      image:  img1.buffer,
      image2: img2?.buffer,
      prompt: fullPrompt,
    })
    return { imageUrl, mode: 'photo' }
  } catch (err) {
    const status = err?.response?.status ?? err?.status
    if (status === 401 || status === 403) {
      throw new ApiError(502, 'bad_key', 'Clé Replicate invalide ou non autorisée.')
    }
    if (status === 402) {
      throw new ApiError(
        402,
        'replicate_billing',
        'Solde Replicate insuffisant. Ajoute des crédits sur replicate.com/account/billing.',
      )
    }
    console.error('[generate] génération échouée — status:', status, '| message:', err?.message)
    throw new ApiError(502, 'generation_failed', 'La génération a échoué. Réessaie dans un instant.')
  }
}
