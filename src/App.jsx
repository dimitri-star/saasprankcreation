import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import AuthModal from './components/auth/AuthModal.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import Landing from './pages/Landing.jsx'
import Studio from './pages/Studio.jsx'
import Abonnement from './pages/Abonnement.jsx'
import MentionsLegales from './pages/MentionsLegales.jsx'
import Confidentialite from './pages/Confidentialite.jsx'
import Debloquer from './pages/Debloquer.jsx'
import TutoSnap from './pages/TutoSnap.jsx'
import CGV from './pages/CGV.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AuthModal />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/"                element={<Landing />}         />
          <Route path="/studio"          element={<Studio />}          />
          <Route path="/abonnement"      element={<Abonnement />}      />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cgv"             element={<CGV />}             />
          <Route path="/tuto-snap"       element={<TutoSnap />}        />
        </Route>
        {/* Paywall — standalone, sans sidebar */}
        <Route path="/debloquer" element={<Debloquer />} />
      </Routes>
    </AuthProvider>
  )
}
