import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'

export default function Footer() {
  return (
    <footer className="relative">
      {/* Bandeau CTA final */}
      <div className="container-luxe">
        <Reveal className="grain relative isolate overflow-hidden rounded-[2rem] border border-white/10 px-8 py-16 text-center sm:py-20">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-noir-700 to-noir" />
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-bleu/20 blur-[120px]" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#126b86]/20 blur-[120px]" />
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Tes potes vont halluciner.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/55">
            3 créations offertes. Sans carte bancaire. Choisis une transfo,
            uploade ta photo, balance.
          </p>
          <Link to="/studio" className="btn-bleu mt-9">
            Essayer gratuitement
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>

      {/* Pied de page */}
      <div className="container-luxe mt-20 border-t border-white/5 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="font-display text-xl font-bold text-white">
            Prank<span className="text-gradient-bleu">Creation</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-white/50">
            <a href="#destinations" className="hover:text-white">Catégories</a>
            <a href="#showcase" className="hover:text-white">Exemples</a>
            <a href="#avis" className="hover:text-white">Avis</a>
            <Link to="/abonnement" className="hover:text-white">Tarifs</Link>
            <Link to="/studio" className="hover:text-white">Studio</Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40 sm:justify-center">
          <Link to="/mentions-legales" className="hover:text-white">Mentions légales</Link>
          <span aria-hidden className="text-white/15">·</span>
          <Link to="/confidentialite" className="hover:text-white">Politique de confidentialité</Link>
          <span aria-hidden className="text-white/15">·</span>
          <Link to="/cgv" className="hover:text-white">CGV</Link>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-white/30 sm:flex-row">
          <p>© {new Date().getFullYear()} PrankCreation. Tous droits réservés.</p>
          <p>Images générées par IA à partir de ta propre photo.</p>
        </div>
      </div>
    </footer>
  )
}
