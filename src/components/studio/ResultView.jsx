import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Télécharge l'image générée depuis son URL distante (Replicate CDN).
async function downloadImage(url) {
  const res  = await fetch(url)
  const blob = await res.blob()
  const a    = document.createElement('a')
  a.href     = URL.createObjectURL(blob)
  a.download = `prankcreation-${Date.now()}.jpg`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ResultView({ result, error, mode = 'image', image, isUnlocked = false, justUnlocked = false, onReset, generating }) {
  // Le paywall s'applique à TOUT LE MONDE : la photo reste floutée tant que
  // l'accès n'est pas payé. Aucun aperçu "admin" — personne ne voit le rendu
  // réel sans avoir payé.
  const canUnlock = isUnlocked && !!result

  // Défloutage animé : au retour d'un paiement (justUnlocked), l'image démarre
  // floutée puis se révèle dès que l'accès est confirmé (plan rafraîchi).
  const [revealed, setRevealed] = useState(!justUnlocked)
  useEffect(() => {
    if (canUnlock && justUnlocked && !revealed) {
      const t = setTimeout(() => setRevealed(true), 250)
      return () => clearTimeout(t)
    }
  }, [canUnlock, justUnlocked, revealed])

  // Compte à rebours "urgence" façon Ravage : pousse à débloquer vite. La photo
  // n'est PAS réellement supprimée — c'est un levier de conversion visuel.
  const [secsLeft, setSecsLeft] = useState(5 * 60)
  useEffect(() => {
    const id = setInterval(() => setSecsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const countdown =
    `${String(Math.floor(secsLeft / 60)).padStart(2, '0')}:${String(secsLeft % 60).padStart(2, '0')}`

  // Compatibilité : si encore utilisé avec generating=true depuis un ancien appelant
  if (generating) return null
  if (!result && !error) return null

  /* ─── Erreur ─────────────────────────────────────────────────────────── */
  if (error && !result) {
    return (
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/[0.06] px-5 py-4">
        <span className="mt-0.5 shrink-0 text-red-400">⚠</span>
        <p className="text-sm leading-relaxed text-white/80">{error}</p>
      </div>
    )
  }

  const isVideo = result?.mode === 'video'
  const noun    = isVideo ? 'ta vidéo' : 'ta photo'

  /* ─── Résultat DÉVERROUILLÉ (abonné) ─────────────────────────────────── */
  if (canUnlock) {
    return (
      <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.02]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Photo / vidéo — défloutage animé au retour de paiement */}
          <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[400px]">
            <img
              src={result.imageUrl}
              alt="Ta transfo PrankCreation"
              className={`h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
                revealed ? 'blur-0 scale-100' : 'blur-2xl scale-110'
              }`}
            />
            {!revealed && (
              <div className="absolute inset-0 flex items-center justify-center bg-noir/30">
                <span className="animate-pulse rounded-full border border-emerald-400/30 bg-noir/70 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                  ✨ Révélation…
                </span>
              </div>
            )}
          </div>

          {/* Panneau téléchargement */}
          <div className="flex flex-col items-start justify-center gap-5 p-7">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-3 py-1 text-xs font-semibold text-emerald-300">
                ✓ Débloquée
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">
                {isVideo ? 'Ta vidéo est prête' : 'Ta photo est prête'} 🎉
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Télécharge-la et envoie-la direct sur Snap ou Insta pour bluffer tes potes.
              </p>
            </div>

            <button
              onClick={() => downloadImage(result.imageUrl)}
              className="btn-bleu w-full justify-center text-base"
            >
              ⬇ Télécharger {noun}
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="text-xs text-white/35 underline-offset-2 transition-colors hover:text-white/70 hover:underline"
              >
                ← Générer une autre transfo
              </button>
            )}

            {result.demo && (
              <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-white/35">
                Démo : rendu IA réel disponible une fois Replicate connecté.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ─── Résultat VERROUILLÉ (non payant) — paywall façon Ravage ───────── */
  return (
    <div className="overflow-hidden rounded-2xl border border-bleu/20 bg-white/[0.02]">
      {/* Bandeau urgence */}
      <div className="flex items-center justify-center gap-2 border-b border-amber-400/20 bg-amber-400/[0.07] px-4 py-2.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
        <span className="text-xs font-semibold text-amber-300">
          Supprimée dans{' '}
          <span className="font-mono tabular-nums">{countdown}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Aperçu flouté */}
        <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[400px]">
          <img
            src={result.imageUrl}
            alt=""
            aria-hidden
            draggable={false}
            className="h-full w-full scale-110 select-none object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/55 to-noir/25" />

          {/* Badge Verrouillée */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-noir/70 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
            🔒 Verrouillée
          </span>

          {/* Cadenas centré */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-bleu/40 bg-noir/60 backdrop-blur-sm">
              <svg className="h-7 w-7 text-bleu" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
          </div>
        </div>

        {/* Panneau déverrouillage */}
        <div className="flex flex-col items-start justify-center gap-5 p-7">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-3 py-1 text-xs font-semibold text-emerald-300">
              ✓ {isVideo ? 'Ta vidéo est prête' : 'Ta photo est prête'} !
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold text-white">
              Débloque {noun} pour la voir <span className="text-bleu">en clair</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Téléchargeable à vie, sans filigrane — prête à envoyer direct sur Snap ou Insta.
            </p>
          </div>

          <Link to="/debloquer" className="btn-bleu w-full justify-center text-base">
            ⚡ Débloquer {noun}
          </Link>

          <div className="flex items-center gap-2 text-xs text-white/45">
            <span className="flex items-center gap-1">
              <span className="text-amber-400">★★★★★</span> 4,9/5
            </span>
            <span>·</span>
            <span>🔒 Paiement 100% sécurisé</span>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="text-xs text-white/35 underline-offset-2 transition-colors hover:text-white/70 hover:underline"
            >
              ← Générer une autre photo
            </button>
          )}

          {result.demo && (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-white/35">
              Démo : rendu IA réel disponible une fois Replicate connecté.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
