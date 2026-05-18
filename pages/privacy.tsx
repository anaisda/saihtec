import Head from 'next/head'
import Link from 'next/link'

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{title} — SAIHTEC AB</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ fontFamily: 'DM Sans,sans-serif', background: 'var(--cream)', minHeight: '100vh', color: 'var(--navy)' }}>
        {/* Mini nav */}
        <nav style={{ borderBottom: '1px solid rgba(28,61,74,0.07)', padding: '1.2rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(28,61,74,0.12)' }}>
              <img src="/logo.png" alt="SAIHTEC" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <span style={{ fontFamily: 'Cormorant,serif', fontSize: '1.1rem', fontWeight: 500, color: 'var(--navy)', letterSpacing: '0.12em' }}>SAIHTEC</span>
          </Link>
          <Link href="/" style={{ fontSize: '0.83rem', color: 'var(--navy-dim)', textDecoration: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', paddingBottom: '0.1rem' }}>← Back to site</Link>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '5rem 2rem 8rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '1rem' }}>Legal</div>
          <h1 style={{ fontFamily: 'Cormorant,serif', fontSize: 'clamp(2.5rem,4vw,3.5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '0.5rem' }}>{title}</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--stone)', marginBottom: '3.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(28,61,74,0.07)' }}>Last updated: May 2026</p>
          <div style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--navy-dim)' }}>{children}</div>
        </div>

        {/* Footer strip */}
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

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <P>SAIHTEC AB ("SAIHTEC", "we", "us", or "our") is committed to protecting the privacy of individuals who visit our website and interact with our services. This Privacy Policy describes how we collect, use, and protect personal information in accordance with the General Data Protection Regulation (GDPR) and applicable Swedish data protection law.</P>

      <H2>1. Data Controller</H2>
      <P>SAIHTEC AB is the data controller for personal data collected through this website. Our contact address is: nadir.kadri@ki.se</P>

      <H2>2. What Data We Collect</H2>
      <P>When you use the contact form on our website, we collect: your full name, email address, the nature of your inquiry, and the message you provide. We do not collect sensitive personal data and we do not use tracking pixels, advertising cookies, or third-party analytics tools.</P>

      <H2>3. How We Use Your Data</H2>
      <P>We use the information you provide solely to respond to your inquiry. We do not share your personal data with third parties, sell it, or use it for marketing purposes without your explicit consent.</P>

      <H2>4. Legal Basis</H2>
      <P>We process your data on the basis of legitimate interests (Article 6(1)(f) GDPR) — specifically, to respond to enquiries from researchers, clinicians and partners — and, where applicable, on the basis of your consent.</P>

      <H2>5. Data Retention</H2>
      <P>Contact form submissions are retained for a maximum of 24 months from the date of receipt, after which they are permanently deleted unless an ongoing professional relationship requires longer retention.</P>

      <H2>6. Your Rights</H2>
      <P>Under the GDPR, you have the right to access, correct, or request deletion of your personal data at any time. You may also object to processing or request data portability. To exercise any of these rights, please contact us at: nadir.kadri@ki.se</P>

      <H2>7. Cookies</H2>
      <P>This website uses only technically necessary cookies required for the website to function. We do not use analytics or advertising cookies. See our Cookie Policy for details.</P>

      <H2>8. Changes to This Policy</H2>
      <P>We may update this Privacy Policy from time to time. The date of the most recent revision is shown at the top of this page. Continued use of the website after any change constitutes acceptance of the revised policy.</P>
    </LegalLayout>
  )
}