import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, currentUserRole } from '../auth'
import { BUSINESS_CONFIG } from '../businessConfig'
import Logo from '../components/Logo'
import { UsersIcon, SettingsIcon } from '../components/ui/Icons'
import { Tabs } from '@base-ui/react/tabs'
import { motion } from 'motion/react'
import { useNotification } from '../components/ui/NotificationStack'
import { AnimatedButton } from '../components/ui/AnimatedButton'
import { PageWrapper } from '../components/ui/PageWrapper'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { notify } = useNotification()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoggingIn(true)

    let ok = false
    if (isSignUpMode) {
      ok = await register(email, password)
    } else {
      ok = await login(email, password)
    }
    setIsLoggingIn(false)

    if (!ok) {
      notify(
        isSignUpMode
          ? 'Registration failed (password must be at least 6 characters, or email is already registered).'
          : 'Invalid email or password.',
        'error'
      )
      return
    }

    if (currentUserRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  const handleDemoLogin = async (role: 'customer' | 'admin') => {
    setIsLoggingIn(true)
    const demoEmail    = role === 'admin' ? 'admin@test.com'    : 'customer@test.com'
    const demoPassword = role === 'admin' ? 'admin123'          : 'cust123'
    const ok = await login(demoEmail, demoPassword)
    setIsLoggingIn(false)

    if (!ok) {
      notify('Demo login failed — please try again.', 'error')
      return
    }

    if (currentUserRole === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <PageWrapper>
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      {/* Demo Disclaimer Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '9999px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.75)',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        }}
      >
        <span style={{ fontSize: '14px' }}>⚡</span>
        <span>Live product demo — all data is simulated for demonstration purposes only.</span>
      </div>

        <Tabs.Root 
          defaultValue="signin" 
          onValueChange={(val) => setIsSignUpMode(val === 'signup')}
          style={{ width: '100%', maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}
        >
          <Tabs.List style={{ 
            display: 'flex', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '4px',
            marginBottom: '24px',
            position: 'relative'
          }}>
            {['signin', 'signup'].map((tabValue) => {
              const isActive = (tabValue === 'signup') === isSignUpMode;
              return (
                <Tabs.Tab 
                  key={tabValue}
                  value={tabValue} 
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'color 0.2s ease'
                  }}
                >
                  {tabValue === 'signin' ? 'Sign In' : 'Sign Up'}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--accent-color)',
                        borderRadius: '8px',
                        zIndex: -1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>

          <Tabs.Panel value={isSignUpMode ? 'signup' : 'signin'}>
            <form
              onSubmit={handleSubmit}
              className="premium-card"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <Logo size="large" />
                </div>
                <h1 style={{ fontSize: '32px', marginBottom: '6px' }}>
                  {isSignUpMode ? 'Create Account' : BUSINESS_CONFIG.name}
                </h1>
                <p style={{ fontSize: '15px' }}>
                  {isSignUpMode ? 'Join us and start booking your sessions.' : BUSINESS_CONFIG.tagline}
                </p>
              </div>



        {/* Quick Demo Persona Access */}
        {!isSignUpMode && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--accent-color)',
                }}
              >
                ⚡ Instant Test-Drive
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                No password required
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                disabled={isLoggingIn}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 12px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex' }}>
                  <UsersIcon size={18} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Client Test-Drive</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Customer Reservation View</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoggingIn}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', display: 'flex' }}>
                  <SettingsIcon size={18} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Manager Board</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Admin Control Panel</div>
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        {!isSignUpMode && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or sign in manually
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. customer@test.com"
            autoComplete="off"
            required
            disabled={isLoggingIn}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
            required
            disabled={isLoggingIn}
          />
        </div>

        <AnimatedButton type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoggingIn}>
          {isLoggingIn
            ? isSignUpMode
              ? 'Creating Account...'
              : 'Signing In...'
            : isSignUpMode
            ? 'Create Account'
            : 'Sign In'}
        </AnimatedButton>

        {/* Back to Portal */}
        <a
          href="https://nativebooking.co"
          style={{ textDecoration: 'none', width: '100%', display: 'block', marginTop: '12px' }}
        >
          <AnimatedButton
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
          >
            ← Back to Industry Portal
          </AnimatedButton>
        </a>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
       <AnimatedButton
  type="button"
  onClick={() => setIsSignUpMode(!isSignUpMode)}
  className="btn-link"
  style={{
    background: 'none',
    border: 'none',
    color: 'var(--accent-color)',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
    fontFamily: 'inherit',
  }}
>
  {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
</AnimatedButton>
        </div>

        {/* Watermark */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            letterSpacing: '0.03em',
            fontWeight: 600,
          }}
        >
          Powered by NativeBooking Software ⚡
        </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <a
                  href="/privacy"
                  style={{ fontSize: '11px', color: 'var(--text-secondary)', textDecoration: 'underline', opacity: 0.7 }}
                >
                  Privacy Policy
                </a>
              </div>
            </form>
          </Tabs.Panel>
        </Tabs.Root>
    </div>
 </PageWrapper>     
)
}