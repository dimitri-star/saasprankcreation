import { useRef, useState } from 'react'

const MAX_BYTES  = 10 * 1024 * 1024 // 10 Mo (vérification locale)
const MAX_DIM    = 1280              // px — garde sous ~1 Mo base64 (limite Vercel : 4,5 Mo)
const JPEG_Q     = 0.85
const ACCEPTED   = ['image/jpeg', 'image/png', 'image/webp']

// Redimensionne + compresse côté client avant envoi (Vercel limite le body à 4,5 Mo).
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale  = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_Q))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function UploadPanel({ image, onImage, onReset }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    setError('')
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      setError('Format non supporté — JPG ou PNG uniquement.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Fichier trop lourd — 10 Mo maximum.')
      return
    }
    try {
      const dataUrl = await compressImage(file)
      onImage(dataUrl)
    } catch {
      setError('Impossible de lire cette image. Réessaie avec un autre fichier.')
    }
  }

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">📸</span>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
          Ta photo
        </h2>
      </div>

      {!image ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          className={`flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-12 text-center transition-all duration-300 ${
            dragOver
              ? 'border-bleu/60 bg-bleu/5'
              : 'border-white/15 hover:border-white/30 hover:bg-white/[0.02]'
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
            ⬆️
          </span>
          <span className="text-sm font-medium text-white/80">
            Lâche ton selfie ici
          </span>
          <span className="text-xs text-white/40">ou clique pour parcourir</span>
          <span className="mt-2 text-[11px] text-white/30">
            JPG, PNG · 10 Mo max
          </span>
        </button>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            <img
              src={image}
              alt="Aperçu de ta photo"
              className="aspect-square w-full object-cover"
            />
            <button
              onClick={onReset}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:bg-black/70"
              aria-label="Changer de photo"
            >
              ✕
            </button>
          </div>

          {/* Photo chargée et prête. L'édition préservant l'identité (nano-banana)
              se fait côté serveur au moment de la génération — on n'affiche donc
              pas de « visage détecté » qu'on n'a pas vérifié. */}
          <div className="mt-4">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-sm text-emerald-300">
              <span>✓</span> Photo prête
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
