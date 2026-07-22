import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import PortalHome from './pages/PortalHome'
import Login from './pages/login'
import CustomerDB from './pages/CustomerDB'
import AdminDB from './pages/AdminDB'
import BookAppointment from './pages/BookAppointment'
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
  }, [])

  return (
    <BookingProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PortalHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<CustomerDB />} />
          <Route path="/admin" element={<AdminDB />} />
          <Route path="/book" element={<BookAppointment />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App