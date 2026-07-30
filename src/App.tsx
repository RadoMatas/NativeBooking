import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/login'
import CustomerDB from './pages/CustomerDB'
import AdminDB from './pages/AdminDB'
import BookAppointment from './pages/BookAppointment'
import PrivacyPolicy from './pages/PrivacyPolicy'
import BookIntroCall from './pages/BookIntroCall'
import AdminLogin from './pages/AdminLogin'
import { BookingProvider } from './BookingContext'
import { BUSINESS_CONFIG } from './businessConfig'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function App() {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', BUSINESS_CONFIG.theme.primaryColor)
    root.style.setProperty('--card-bg', BUSINESS_CONFIG.theme.cardBg)
    root.style.setProperty('--accent-color', BUSINESS_CONFIG.theme.accentColor)
    root.style.setProperty('--accent-hover', BUSINESS_CONFIG.theme.accentHover)
    root.style.setProperty('--border-radius', BUSINESS_CONFIG.theme.borderRadius)
    root.style.setProperty('--font-family', BUSINESS_CONFIG.theme.fontFamily)

    // Update mobile status bar & overscroll tint dynamically to match branch theme
    const metaTheme = document.getElementById('meta-theme-color')
    if (metaTheme) {
      metaTheme.setAttribute('content', BUSINESS_CONFIG.theme.primaryColor || '#08080a')
    }

    // Inject theme-matched ambient radial background
    document.body.style.background = `
      radial-gradient(circle at top right, ${BUSINESS_CONFIG.theme.accentColor}18, transparent 45%),
      radial-gradient(circle at bottom left, ${BUSINESS_CONFIG.theme.accentColor}10, transparent 50%),
      ${BUSINESS_CONFIG.theme.primaryColor}
    `
  }, [])

  return (
    <BookingProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<CustomerDB />} />
          <Route path="/admin" element={<AdminDB />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/book-call" element={<BookIntroCall />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App