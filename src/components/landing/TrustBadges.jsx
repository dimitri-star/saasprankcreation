// Bandeau de réassurance réutilisable (paiement, engagement, RGPD, satisfaction).
// Front pur : ce sont des promesses produit, pas des statuts techniques branchés.
const badges = [
  { Icon: IconLock, label: 'Paiement sécurisé', sub: 'Chiffré via Stripe' },
  { Icon: IconShield, label: 'Données protégées', sub: 'Conforme RGPD' },
  { Icon: IconBolt, label: 'Sans engagement', sub: 'Résiliable en 1 clic' },
  { Icon: IconHeart, label: 'Satisfait ou aidé', sub: 'Support réactif' },
]

export default function TrustBadges({ className = '' }) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}
    >
      {badges.map(({ Icon, label, sub }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
            <Icon />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white">{label}</span>
            <span className="block truncate text-xs text-white/40">{sub}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

const svg = 'h-[18px] w-[18px]'

function IconLock() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
    </svg>
  )
}
