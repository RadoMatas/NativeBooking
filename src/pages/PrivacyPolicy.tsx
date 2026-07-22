import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '8px' }}>
        {title}
      </h2>
      <div style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.8' }}>
        {children}
      </div>
    </div>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090b',
        color: '#f4f4f5',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        padding: '60px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '720px', width: '100%' }}>

        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#a1a1aa',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '40px',
            fontFamily: 'inherit',
          }}
        >
          ← Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981', marginBottom: '10px' }}>
            Legal
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: '#71717a' }}>
            Last updated: July 2025 · Operated by NativeBooking, Poland
          </p>
        </div>

        {section('Overview', <>
          <p>NativeBooking operates the website nativebooking.co and its subdomain demo environments (tattoo.nativebooking.co, dental.nativebooking.co, academic.nativebooking.co). This page explains what information we collect, why we collect it, and what we do with it.</p>
          <br />
          <p>We take your privacy seriously. We do not sell your data. We do not use it for advertising. We collect the minimum needed to run this service.</p>
        </>)}

        {section('What We Collect', <>
          <p><strong style={{ color: '#f4f4f5' }}>Account information</strong> — If you create an account or log in on any of our demo environments, we collect your email address and a hashed version of your password. This is stored securely by Google Firebase Authentication.</p>
          <br />
          <p><strong style={{ color: '#f4f4f5' }}>Demo booking data</strong> — If you submit a booking through one of our demo environments, the details you enter (name, contact, appointment time) are stored in Google Firestore. This data is used only to demonstrate the software and is not used for any other purpose.</p>
          <br />
          <p><strong style={{ color: '#f4f4f5' }}>Usage data</strong> — We do not run any analytics tracking. We do not use Google Analytics, Facebook Pixel, or any third-party tracking scripts.</p>
          <br />
          <p><strong style={{ color: '#f4f4f5' }}>IP addresses</strong> — When you load pages on this site, your IP address may be briefly processed by Google Firebase Hosting and Google Fonts as part of delivering the page. We do not store or log IP addresses ourselves.</p>
        </>)}

        {section('Why We Collect It', <>
          <p>We collect account information to allow you to log in and use the demo booking system. We collect demo booking data solely to show how the software works. We have no other use for this data.</p>
        </>)}

        {section('Third-Party Services', <>
          <p>We use the following third-party services. Each processes data on our behalf under their own privacy policies:</p>
          <br />
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong style={{ color: '#f4f4f5' }}>Google Firebase</strong> (Authentication + Firestore Database) — stores account credentials and demo booking data on servers operated by Google. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>Firebase Privacy Policy</a></li>
            <li><strong style={{ color: '#f4f4f5' }}>Google Fonts</strong> — delivers typography fonts. Loading a page sends your IP address to Google's font servers. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>Google Privacy Policy</a></li>
            <li><strong style={{ color: '#f4f4f5' }}>Stripe</strong> — payment processing is present in some demo environments but runs in test mode only. No real card data is ever collected or stored. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>Stripe Privacy Policy</a></li>
            <li><strong style={{ color: '#f4f4f5' }}>Vercel</strong> — hosts and delivers this website. Vercel may process request logs including IP addresses as part of standard hosting operations. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>Vercel Privacy Policy</a></li>
          </ul>
        </>)}

        {section('Cookies & Local Storage', <>
          <p>We do not use tracking cookies or advertising cookies. Firebase uses browser local storage to keep you logged in between sessions. This is functional storage necessary for the service to work — it does not track you across other websites.</p>
        </>)}

        {section('Your Rights (GDPR)', <>
          <p>If you are based in the European Union or European Economic Area, you have the following rights under the General Data Protection Regulation (GDPR):</p>
          <br />
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><strong style={{ color: '#f4f4f5' }}>Right to access</strong> — you can ask what data we hold about you.</li>
            <li><strong style={{ color: '#f4f4f5' }}>Right to deletion</strong> — you can ask us to delete your account and all associated data.</li>
            <li><strong style={{ color: '#f4f4f5' }}>Right to correction</strong> — you can ask us to correct inaccurate data.</li>
            <li><strong style={{ color: '#f4f4f5' }}>Right to object</strong> — you can object to how we process your data.</li>
          </ul>
          <br />
          <p>To exercise any of these rights, contact us at <a href="mailto:info@nativebooking.co" style={{ color: '#10b981' }}>info@nativebooking.co</a>. We will respond within 30 days.</p>
        </>)}

        {section('Data Retention', <>
          <p>Demo account data is retained until you request deletion or we periodically clear demo environments. We do not retain data longer than necessary to operate the demonstration service.</p>
        </>)}

        {section('Children', <>
          <p>This service is not directed at children under 16. We do not knowingly collect personal data from anyone under 16 years of age.</p>
        </>)}

        {section('Changes to This Policy', <>
          <p>If we make material changes to this policy we will update the date at the top of this page. Continued use of the service after changes means you accept the updated policy.</p>
        </>)}

        {section('Contact', <>
          <p>For any privacy-related questions, requests, or concerns:</p>
          <br />
          <p><strong style={{ color: '#f4f4f5' }}>NativeBooking</strong><br />Poland<br /><a href="mailto:info@nativebooking.co" style={{ color: '#10b981' }}>info@nativebooking.co</a></p>
        </>)}

      </div>
    </div>
  )
}
