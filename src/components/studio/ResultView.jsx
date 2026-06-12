import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { hasSnapAccess } from '../../lib/planLabels.js'
import { testimonials } from '../../data/testimonials.js'

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

// Partage la photo via la feuille de partage native du téléphone (API Web Share).
// L'utilisateur choisit OVF Editor (ou Snapchat) → la photo y arrive déjà chargée,
// puis il enchaîne sur l'envoi en snap. Aucune API Snap ne permet l'envoi auto :
// c'est un raccourci qui évite « télécharger puis fouiller la galerie ».
async function shareToSnap(url) {
  try {
    const res  = await fetch(url)
    const blob = await res.blob()
    const file = new File([blob], `prankcreation-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'PrankCreation', text: 'Ma transfo 🔥' })
      return
    }
    // Appareil sans partage de fichier (desktop / navigateur incompatible) :
    // on télécharge et on guide vers OVF Editor.
    downloadImage(url)
    alert("Le partage direct n'est pas dispo sur cet appareil. La photo a été téléchargée — ouvre OVF Editor pour l'envoyer en Snap.")
  } catch (err) {
    if (err?.name !== 'AbortError') console.error('[shareToSnap]', err) // AbortError = feuille fermée par l'user
  }
}

export default function ResultView({ result, error, mode = 'image', image, isUnlocked = false, justUnlocked = false, onReset, generating }) {
  const { profile, user } = useAuth()
  const snapEnabled = hasSnapAccess(profile?.plan) || !!user?.user_metadata?.snap_tuto_unlocked

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

            {snapEnabled && (
              <div className="w-full space-y-1.5">
                <button
                  onClick={() => shareToSnap(result.imageUrl)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFFC00] px-4 py-3 text-base font-bold text-noir transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <IconGhost /> Envoyer sur Snap
                </button>
                <p className="text-[11px] leading-relaxed text-white/40">
                  Ouvre le partage de ton tél → choisis <span className="text-white/70">OVF Editor</span> → envoie en snap rouge.
                </p>
              </div>
            )}

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
    <div className="space-y-4">
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
            className="h-full w-full scale-110 select-none object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir/30 via-transparent to-transparent" />

          {/* Badge « N°1 réalisme » (réassurance façon concurrent) */}
          <span className="absolute left-1/2 top-3 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-amber-300/40 bg-noir/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-300 backdrop-blur-sm">
            👑 N°1 réalisme
          </span>

          {/* Badge Verrouillée */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-noir/70 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
            🔒 Verrouillée
          </span>

          {/* Cadenas centré */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bleu/40 bg-noir/25 backdrop-blur-sm">
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

          <Link
            to="/debloquer"
            className="btn-bleu w-full justify-center text-base shadow-lg shadow-bleu/30 transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-95"
          >
            ⚡ Débloquer {noun}
          </Link>

          {/* Satisfait ou remboursé */}
          <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.08] px-3 py-2 text-xs font-semibold text-emerald-300">
            🛡️ Satisfait ou remboursé immédiatement
          </div>

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

      {/* Avis clients (réassurance façon concurrent) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {testimonials.slice(0, 3).map((t) => (
          <div key={t.name} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <div className="text-xs tracking-tight text-amber-400">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
            <p className="mt-1.5 text-[12px] leading-snug text-white/70">« {t.quote} »</p>
            <p className="mt-1.5 text-[11px] font-semibold text-white/50">— {t.name}, {t.age} ans</p>
          </div>
        ))}
      </div>

      {/* Bandeau Tuto Snap Rouge — bien visible */}
      <Link
        to="/tuto-snap"
        className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600/15 to-red-500/[0.04] px-5 py-4 transition-all hover:border-red-500/50 hover:brightness-110"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-lg">🔴</span>
          <span>
            <span className="block font-display text-base font-bold text-white">Tuto Snap Rouge</span>
            <span className="block text-[12px] text-white/55">Envoie tes photos en snap rouge indétectable</span>
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-red-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">Débloquer</span>
      </Link>
    </div>
  )
}

function IconGhost() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.103 2C8.82 2 6.09 4.388 6.09 7.38c0 .322.028.637.08.944l-.895.05c-.372 0-.673.265-.673.59 0 .297.254.544.6.582l.637.07c-.16.333-.337.653-.53.953-.198.308-.416.587-.653.836-.24.251-.408.57-.408.907 0 .418.21.8.557 1.058.32.24.748.375 1.208.375.074 0 .148-.004.222-.012.304.571.888.984 1.574 1.072l-.01.041c-.143.537-.574.962-1.12 1.145l-.15.05c-.35.115-.54.468-.42.785.12.317.48.487.83.372l.15-.05c.36-.119.708-.29 1.032-.51.01.127.016.255.016.384 0 1.82 1.466 3.298 3.273 3.298 1.808 0 3.274-1.478 3.274-3.298 0-.129.005-.257.016-.384.324.22.672.391 1.032.51l.15.05c.35.115.71-.055.83-.372.12-.317-.07-.67-.42-.785l-.15-.05c-.546-.183-.977-.608-1.12-1.145l-.01-.041c.686-.088 1.27-.5 1.574-1.072.074.008.148.012.222.012.46 0 .888-.135 1.208-.375.347-.258.557-.64.557-1.058 0-.337-.168-.656-.408-.907-.237-.249-.455-.528-.653-.836-.193-.3-.37-.62-.53-.953l.637-.07c.346-.038.6-.285.6-.582 0-.325-.301-.59-.673-.59l-.895-.05c.052-.307.08-.622.08-.944C18.114 4.388 15.385 2 12.103 2z"/>
    </svg>
  )
}
