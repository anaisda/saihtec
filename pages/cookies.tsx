import Head from 'next/head'
import Link from 'next/link'

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Head><title>{title} — SAIHTEC AB</title><meta name="robots" content="noindex" /></Head>
      <div style={{ fontFamily: 'DM Sans,sans-serif', background: 'var(--cream)', minHeight: '100vh', color: 'var(--navy)' }}>
        <nav style={{ borderBottom: '1px solid rgba(28,61,74,0.07)', padding: '1.2rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(28,61,74,0.12)' }}><img src="/logo.png" alt="SAIHTEC" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            <span style={{ fontFamily: 'Cormorant,serif', fontSize: '1.1rem', fontWeight: 500, color: 'var(--navy)', letterSpacing: '0.12em' }}>SAIHTEC</span>
          </Link>
          <Link href="/" style={{ fontSize: '0.83rem', color: 'var(--navy-dim)', textDecoration: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', paddingBottom: '0.1rem' }}>← Back to site</Link>
        </nav>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '5rem 2rem 8rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '1rem' }}>Legal</div>
          <h1 style={{ fontFamily: 'Cormorant,serif', fontSize: 'clamp(2.5rem,4vw,3.5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '0.5rem' }}>{title}</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--stone)', marginBottom: '3.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(28,61,74,0.07)' }}>Last updated: May 2026</p>
          <div style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--navy-dim)' }}>{children}</div>
        </div>
        <div style={{ borderTop: '1px solid rgba(28,61,74,0.07)', padding: '1.5rem 4rem', display: 'flex', gap: '2rem', fontSize: '0.8rem' }}>
          <Link href="/privacy" style={{ color: 'var(--stone)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/cookies" style={{ color: 'var(--stone)', textDecoration: 'none' }}>Cookie Policy</Link>
          <Link href="/terms" style={{ color: 'var(--stone)', textDecoration: 'none' }}>Terms of Use</Link>
        </div>
      </div>
    </>
  )
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: 'Cormorant,serif', fontSize: '1.5rem', fontWeight: 400, color: 'var(--navy)', marginTop: '2.5rem', marginBottom: '0.8rem' }}>{children}</h2>
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: '1.1rem' }}>{children}</p>
}

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy">
      <P>This Cookie Policy explains how SAIHTEC AB uses cookies and similar technologies on our website (saihtec.com). We are committed to transparency about our data practices.</P>

      <H2>1. What Are Cookies?</H2>
      <P>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites function correctly and to provide information to website owners.</P>

      <H2>2. Cookies We Use</H2>
      <P>This website uses only strictly necessary cookies. These are cookies required for the website to function properly and cannot be switched off. They include session cookies that remember your preferences during a single visit. We do not use analytics cookies, advertising cookies, social media tracking cookies, or any third-party cookies.</P>

      <H2>3. Cookies We Do Not Use</H2>
      <P>We do not use Google Analytics, Facebook Pixel, or any other third-party tracking or advertising technology. Your browsing of this website is not tracked across other websites.</P>

      <H2>4. Your Choices</H2>
      <P>Because we only use strictly necessary cookies, no cookie consent banner is required. If you wish, you can configure your browser to block all cookies; however, this may affect the functionality of the website.</P>

      <H2>5. Changes to This Policy</H2>
      <P>We may update this Cookie Policy from time to time. The date of the most recent revision is shown at the top of this page.</P>

      <H2>6. Contact</H2>
      <P>If you have any questions about our use of cookies, please contact us at: nadir.kadri@ki.se</P>
    </LegalLayout>
  )
}