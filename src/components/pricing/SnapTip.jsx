import { Link } from 'react-router-dom'

// Notification compacte "Nouveau Snap rouge" — style FastPrank.
// Positionnée juste après le Hero, avant la grille AVANT/APRÈS.
export default function SnapTip() {
  return (
    <div className="mx-auto max-w-lg px-4">
      <p className="mb-2.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
        Nouveau
      </p>
      <Link
        to="/studio"
        className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]"
      >
        {/* Icône Snap rouge */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 shadow-[0_4px_16px_rgba(239,68,68,0.5)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
            <path d="M12.206 2C8.924 2 6.195 4.388 6.195 7.38c0 .322.028.637.08.944l-.895.05c-.372 0-.673.265-.673.59 0 .297.254.544.6.582l.637.07c-.16.333-.337.653-.53.953-.198.308-.416.587-.653.836-.24.251-.408.57-.408.907 0 .418.21.8.557 1.058.32.24.748.375 1.208.375.074 0 .148-.004.222-.012.304.571.888.984 1.574 1.072l-.01.041c-.143.537-.574.962-1.12 1.145l-.15.05c-.35.115-.54.468-.42.785.12.317.48.487.83.372l.15-.05c.36-.119.708-.29 1.032-.51.01.127.016.255.016.384 0 1.82 1.466 3.298 3.273 3.298 1.808 0 3.274-1.478 3.274-3.298 0-.129.005-.257.016-.384.324.22.672.391 1.032.51l.15.05c.35.115.71-.055.83-.372.12-.317-.07-.67-.42-.785l-.15-.05c-.546-.183-.977-.608-1.12-1.145l-.01-.041c.686-.088 1.27-.5 1.574-1.072.074.008.148.012.222.012.46 0 .888-.135 1.208-.375.347-.258.557-.64.557-1.058 0-.337-.168-.656-.408-.907-.237-.249-.455-.528-.653-.836-.193-.3-.37-.62-.53-.953l.637-.07c.346-.038.6-.285.6-.582 0-.325-.301-.59-.673-.59l-.895-.05c.052-.307.08-.622.08-.944C18.217 4.388 15.488 2 12.206 2z"/>
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Nouveau Snap</p>
          <p className="truncate text-xs text-white/50">
            Envoie tes images en Snap rouge indétectable
          </p>
        </div>

        <span className="shrink-0 text-[11px] text-white/30">à l'instant</span>
      </Link>
    </div>
  )
}
