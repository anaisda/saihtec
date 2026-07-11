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

export default function TermsOfUse() {
  return (
    <LegalLayout title="Terms of Use">
      <P>These Terms of Use govern your access to and use of the SAIHTEC AB website. By accessing this website, you agree to be bound by these terms. If you do not agree, please do not use the website.</P>

      <H2>1. About This Website</H2>
      <P>This website is operated by SAIHTEC AB, a company incorporated in Sweden. It is provided for informational purposes only, to communicate the company's scientific activities, clinical programmes, and contact information.</P>

      <H2>2. No Medical Advice</H2>
      <P>The content on this website does not constitute medical advice, diagnosis, or treatment recommendations. Information about clinical programmes and scientific research is provided for informational purposes only. Always seek the advice of a qualified healthcare professional for any medical questions or decisions.</P>

      <H2>3. No Promotional Claims</H2>
      <P>Clinical programme names referenced on this website are used for identification purposes only and do not represent approved, marketed, or commercially available products. SAIHTEC AB does not make any claims of efficacy or safety beyond what has been established through peer-reviewed clinical trial publications.</P>

      <H2>4. Intellectual Property</H2>
      <P>All content on this website — including text, images, design, and code — is the property of SAIHTEC AB or its licensors and is protected by applicable intellectual property law. You may not reproduce, distribute, or use any content without prior written permission.</P>

      <H2>5. External Links</H2>
      <P>This website may contain links to third-party websites, including academic publications and partner organisations. SAIHTEC AB is not responsible for the content of external websites.</P>

      <H2>6. Limitation of Liability</H2>
      <P>To the fullest extent permitted by law, SAIHTEC AB shall not be liable for any direct or indirect damages arising from your use of, or inability to use, this website or its content.</P>

      <H2>7. Governing Law</H2>
      <P>These Terms of Use are governed by the laws of Sweden. Any disputes shall be subject to the exclusive jurisdiction of the Swedish courts.</P>

      <H2>8. Contact</H2>
      <P>For any questions regarding these terms, please contact: nadir.kadri@ki.se</P>
    </LegalLayout>
  )
}