import { useRef, useState } from 'react'

const MAX_BYTES = 10 * 1024 * 1024
const ACCEPTED  = ['image/jpeg', 'image/png']

// Panneau optionnel pour une 2ème photo (lieu, personne, voiture…).
// Quand présent, le modèle fusionne les deux images selon l'instruction.
export default function SecondPhotoPanel({ image2, onImage2, onReset2 }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [err, setErr] = useState('')

  const handleFile = (file) => {
    setErr('')
    if (!file) return
    if (!ACCEPTED.includes(file.type)) { setErr('JPG ou PNG uniquement.'); return }
    if (file.size > MAX_BYTES)          { setErr('10 Mo maximum.'); return }
    const reader = new FileReader()
    reader.onload = () => onImage2(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">➕</span>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
            2ème photo <span className="font-normal normal-case text-white/30">(optionnel)</span>
          </p>
        </div>
        {image2 && (
          <button onClick={onReset2} className="text-xs text-white/30 transition-colors hover:text-white/70">
            ✕ Retirer
          </button>
        )}
      </div>

      {!image2 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
          className={`flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center transition-all ${
            dragOver ? 'border-bleu/50 bg-bleu/5' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]'
          }`}
        >
          <span className="text-2xl">📎</span>
          <span className="text-xs text-white/45">
            Lieu, personne, voiture…
          </span>
          <span className="text-[11px] text-white/25">JPG, PNG · 10 Mo max</span>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-white/10">
          <img src={image2} alt="2ème photo" className="aspect-video w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/80 to-transparent px-2 pb-1.5 pt-4">
            <p className="text-[11px] text-white/60">Mode 2 photos actif — le modèle va fusionner les deux</p>
          </div>
        </div>
      )}

      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  )
}
