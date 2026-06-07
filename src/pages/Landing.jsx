import Hero from '../components/landing/Hero.jsx'
import SnapTip from '../components/pricing/SnapTip.jsx'
import BeforeAfterGrid from '../components/landing/BeforeAfterGrid.jsx'
import SocialProof from '../components/landing/SocialProof.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import Faq from '../components/landing/Faq.jsx'
import Footer from '../components/landing/Footer.jsx'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-noir">
      <main>
        <Hero />
        {/* Snap rouge — juste sous le hero */}
        <div className="py-5">
          <SnapTip />
        </div>
        {/* Grille AVANT/APRÈS scrollable */}
        <BeforeAfterGrid />
        <SocialProof />
        <HowItWorks />
        {/* DestinationsGrid — désactivé, à remettre avec les vraies photos */}
        <Testimonials />
        <Faq />
        <Footer />
      </main>
    </div>
  )
}
