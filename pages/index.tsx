import React, { useEffect, useRef, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { readContent } from '@/lib/db'

// ─── TYPES ────────────────────────────────────
interface Content {
  settings: any; about: any; technology: any[]; pipeline: any[]
  team: any[]; publications: any[]; news: any[]; faq: any
  media: any; events: any; science_team: any; investors: any; collaborations: any
}

// ─── LOGO ────────────────────────────────────
function Logo({ size = 42, light = false }: { size?: number; light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}>
      <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${light ? 'rgba(214,228,232,0.3)' : 'rgba(28,61,74,0.15)'}`, flexShrink: 0 }}>
        <img src="/logo.png" alt="SAIHTEC" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontFamily: 'Cormorant,serif', fontSize: size > 40 ? '1.35rem' : '1.1rem', fontWeight: 500, color: light ? 'var(--cream)' : 'var(--navy)', letterSpacing: '0.14em' }}>SAIHTEC</div>
        <div style={{ fontSize: '0.5rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: light ? 'rgba(214,228,232,0.45)' : 'var(--stone)', fontWeight: 300 }}>Nordic Cell Innovations</div>
      </div>
    </div>
  )
}

// ─── NAVBAR ────────────────────────────────────
const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Science', href: '#science' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Research', href: '#publications' },
  { label: 'News', href: '#news' },
]

function Navbar({ scrolled }: { scrolled: boolean }) {
  const [hovered, setHovered] = React.useState<string | null>(null)
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 990,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.2rem 2rem',
      pointerEvents: 'none',
    }}>
      {/* Floating pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0',
        background: scrolled ? 'rgba(245,240,232,0.97)' : 'rgba(245,240,232,0.88)',
        backdropFilter: 'blur(24px)',
        borderRadius: 100,
        border: '1px solid rgba(28,61,74,0.1)',
        boxShadow: scrolled
          ? '0 8px 40px rgba(28,61,74,0.12), 0 1px 0 rgba(255,255,255,0.8) inset'
          : '0 4px 24px rgba(28,61,74,0.08), 0 1px 0 rgba(255,255,255,0.6) inset',
        padding: '0.4rem 0.4rem 0.4rem 1.2rem',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'all',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Logo left */}
        <a href="/" style={{ textDecoration: 'none', marginRight: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(28,61,74,0.12)' }}>
            <img src="/logo.png" alt="SAIHTEC" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <span style={{ fontFamily: 'Cormorant,serif', fontSize: '1.05rem', fontWeight: 500, color: 'var(--navy)', letterSpacing: '0.12em' }}>SAIHTEC</span>
        </a>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'rgba(28,61,74,0.12)', marginRight: '0.5rem' }} />

        {/* Nav links */}
        {NAV_ITEMS.map(item => (
          <a key={item.href} href={item.href}
            style={{
              display: 'block', padding: '0.5rem 0.9rem',
              color: hovered === item.href ? 'var(--navy)' : 'var(--navy-dim)',
              textDecoration: 'none', fontSize: '0.83rem', fontWeight: 300,
              letterSpacing: '0.03em', borderRadius: 100,
              background: hovered === item.href ? 'rgba(28,61,74,0.06)' : 'transparent',
              transition: 'all 0.25s ease', position: 'relative',
            }}
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered(null)}
          >{item.label}</a>
        ))}

        {/* CTA button */}
        <a href="#contact" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--navy)', color: 'var(--cream)',
          padding: '0.62rem 1.4rem', borderRadius: 100,
          fontSize: '0.82rem', fontWeight: 400, textDecoration: 'none',
          letterSpacing: '0.02em', marginLeft: '0.5rem',
          transition: 'all 0.3s ease', flexShrink: 0,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-mid)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
        >Get in touch</a>
      </div>
    </nav>
  )
}

// ─── HERO ────────────────────────────────
function Hero({ s }: { s: any }) {
  const vid = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    vid.current?.play().catch(() => {})
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const words = ['cellular', 'MSC', 'regenerative']
  const [wordIdx, setWordIdx] = useState(0)
  const [fade, setFade] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setFade(true) }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'grid', gridTemplateColumns: '52% 48%', overflow: 'hidden' }}>
      {/* ── Left panel ── */}
      <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '7rem 5rem 5rem', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
        {/* Animated background ink rings */}
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: '140%', height: '140%', pointerEvents: 'none', zIndex: 0, opacity: 0.03 }}>
          {[300,240,180,120,60].map((r, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: r * 2, height: r * 2,
              marginLeft: -r, marginTop: -r,
              borderRadius: '50%', border: '1px solid var(--navy)',
              animation: `ringPulse ${3 + i * 0.7}s ease-in-out ${i * 0.3}s infinite`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '2.2rem',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
            <div style={{ width: 28, height: 1, background: 'var(--navy)', opacity: 0.4 }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--navy-dim)' }}>{s.heroTagline}</span>
          </div>

          {/* Headline */}
          <h1 className="serif" style={{
            fontSize: 'clamp(3.8rem,6vw,7rem)', fontWeight: 300, lineHeight: 1.02,
            letterSpacing: '-0.02em', color: 'var(--navy)',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.25s',
          }}>
            The future<br />
            of{' '}
            <span style={{
              fontStyle: 'italic', color: 'var(--navy-mid)',
              opacity: fade ? 1 : 0,
              transition: 'opacity 0.4s ease',
              display: 'inline-block',
            }}>
              {words[wordIdx]}
            </span>
            <br />
            therapy.
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop: '2rem', fontSize: '1rem', color: 'var(--navy-dim)',
            lineHeight: 1.85, maxWidth: 390, fontWeight: 300,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.45s',
          }}>{s.heroSubtitle}</p>

          {/* CTAs */}
          <div style={{
            marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.6s',
          }}>
            <a href="#pipeline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--navy)', color: 'var(--cream)', padding: '0.9rem 2.2rem', borderRadius: 100, fontSize: '0.85rem', fontWeight: 400, textDecoration: 'none', transition: 'all 0.35s ease', boxShadow: '0 4px 20px rgba(28,61,74,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(28,61,74,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(28,61,74,0.2)' }}
            >Clinical programmes</a>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--navy)', padding: '0.9rem 2.2rem', borderRadius: 100, border: '1px solid rgba(28,61,74,0.2)', fontSize: '0.85rem', fontWeight: 300, textDecoration: 'none', transition: 'all 0.35s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.2)' }}
            >Contact us</a>
          </div>

          {/* Scroll line */}
          <div style={{
            position: 'absolute', right: '-2rem', bottom: '4rem',
            writingMode: 'vertical-rl', display: 'flex', alignItems: 'center', gap: '0.8rem',
            fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)',
            opacity: loaded ? 1 : 0, transition: 'opacity 1s 1.2s',
          }}>
            Scroll
            <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom,var(--stone),transparent)', animation: 'sp 2.2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* ── Right panel — video ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <video ref={vid} autoPlay muted loop playsInline
          src={s.heroVideoUrl || 'https://videos.pexels.com/video-files/8325997/8325997-hd_1920_1080_30fps.mp4'}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(0.75)', transition: 'filter 1.5s ease' }} />
        {/* Cream gradient overlap */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--cream) 0%, rgba(245,240,232,0.15) 30%, transparent 60%)' }} />
        {/* Horizontal line overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(28,61,74,0.025) 80px)', pointerEvents: 'none' }} />

        {/* Swedish flag identity card — glass morphism */}
        <div style={{
          position: 'absolute', bottom: '3rem', right: '2.5rem',
          borderRadius: 20, overflow: 'hidden',
          minWidth: 260,
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.9s',
          boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
        }}>
          {/* Swedish flag as background */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: '#006AA7' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '34%', width: '15%', background: '#FECC02' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', height: '20%', background: '#FECC02' }} />
          </div>
          {/* Glass overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,44,62,0.72)', backdropFilter: 'blur(4px)' }} />
          {/* Content */}
          <div style={{ position: 'relative', padding: '1.8rem 2rem' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(254,204,2,0.7)', marginBottom: '0.8rem' }}>Stockholm, Sweden</div>
            <p className="serif" style={{ fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(245,240,232,0.92)', lineHeight: 1.4, marginBottom: '1.2rem' }}>
              Swedish science.<br />Global impact.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'GMP Certified · EU ATMP',
                'ISCT Committee 2025–2028',
                '57 peer-reviewed publications',
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(254,204,2,0.7)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(214,228,232,0.7)', fontWeight: 300 }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top-right corner: floating year tag */}
        <div style={{
          position: 'absolute', top: '8rem', right: '2.5rem',
          fontFamily: 'Cormorant,serif', fontSize: '0.85rem', fontStyle: 'italic',
          color: 'rgba(245,240,232,0.45)', letterSpacing: '0.08em',
          opacity: loaded ? 1 : 0, transition: 'opacity 1s 1.4s',
        }}>Stockholm, Sweden · Est. 2020</div>
      </div>

      <style>{`
        @keyframes ringPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes badgePulse { 0%,100%{opacity:0.7} 50%{opacity:1;box-shadow:0 0 8px rgba(28,61,74,0.3)} }
        @keyframes sp { 0%,100%{height:32px;opacity:.3} 50%{height:54px;opacity:.7} }
      `}</style>
    </section>
  )
}

// ─── STATS BAR ────────────────────────────────
function StatsBar({ stats }: { stats: any[] }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ background: 'var(--navy)', display: 'grid', gridTemplateColumns: `repeat(${stats.length},1fr)`, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle animated gradient sweep */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(214,228,232,0.03) 50%, transparent 70%)', animation: 'statsSweep 4s ease-in-out infinite', pointerEvents: 'none' }} />
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '3rem 3.5rem', position: 'relative',
          borderRight: i < stats.length - 1 ? '1px solid rgba(214,228,232,0.06)' : 'none',
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
          transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
          cursor: 'default',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(214,228,232,0.04)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent' }}
        >
          {/* Animated top line */}
          <div style={{ position: 'absolute', top: 0, left: '3.5rem', right: '3.5rem', height: 1, background: 'linear-gradient(to right, transparent, rgba(214,228,232,0.15), transparent)', transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.3}s` }} />
          <div className="serif" style={{ fontSize: '3rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {s.number}<span style={{ fontSize: '1.6rem', color: 'rgba(214,228,232,0.4)', letterSpacing: '0' }}>{s.suffix}</span>
          </div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.38)' }}>{s.label}</div>
        </div>
      ))}
      <style>{`@keyframes statsSweep{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}`}</style>
    </div>
  )
}


// ─── SWEDEN PANEL ────────────────────────────────
function SwedenPanel() {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '6rem', height: 420, overflow: 'hidden' }}>
      {/* Left — lab photo with overlay text */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=900"
          alt="" style={{ width: '100%', height: '115%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.82)', display: 'block', marginTop: '-7%', transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        />
        {/* Dark gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,61,74,0.65) 0%, transparent 55%)' }} />
        {/* Photo credit bottom left */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.5)', marginBottom: '0.4rem' }}>GMP Facility</div>
          <p className="serif" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(245,240,232,0.85)', lineHeight: 1.4 }}>
            Clinical-grade manufacturing under EU ATMP guidelines
          </p>
        </div>
      </div>

      {/* Right — Sweden identity panel */}
      <div style={{ background: 'var(--navy)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Swedish flag as abstract geometry */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', pointerEvents: 'none', overflow: 'hidden', opacity: 0.06 }}>
          {/* Horizontal yellow cross of Swedish flag — stylised */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 80, marginTop: -40, background: '#F9D84A' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', width: 80, background: '#F9D84A' }} />
        </div>

        {/* Top: country */}
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Mini Swedish flag */}
            <div style={{ width: 36, height: 24, borderRadius: 3, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid rgba(214,228,232,0.2)' }}>
              <div style={{ position: 'absolute', inset: 0, background: '#006AA7' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: '18%', background: '#FECC02' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: '24%', background: '#FECC02' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.4)', marginBottom: '0.15rem' }}>Incorporated</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--cream)', fontWeight: 300 }}>Kingdom of Sweden</div>
            </div>
          </div>
          <div style={{ width: 32, height: 1, background: 'rgba(214,228,232,0.15)', marginBottom: '1.5rem' }} />
          <div className="serif" style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Built in<br /><em style={{ fontStyle: 'italic', color: 'rgba(214,228,232,0.6)' }}>Stockholm.</em><br />Reaching the world.
          </div>
        </div>

        {/* Bottom: 3 facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { label: 'Academic partner', value: 'Karolinska Institutet' },
            { label: 'Regulatory framework', value: 'EU ATMP · GMP Certified' },
            { label: 'Committee role', value: 'ISCT MSC 2025–2028' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              paddingTop: '0.7rem', borderTop: '1px solid rgba(214,228,232,0.07)',
              opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(12px)',
              transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s`,
            }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.35)' }}>{item.label}</span>
              <span style={{ fontSize: '0.83rem', color: 'rgba(245,240,232,0.7)', textAlign: 'right', maxWidth: '55%' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── NEWS SECTION ────────────────────────────────
function NewsSection({ news }: { news: any[] }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const LAB_IMGS = [
    'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/3786215/pexels-photo-3786215.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=700',
    'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=700',
  ]

  const CAT_STYLE: Record<string, { bg: string; color: string }> = {
    'Clinical Trial': { bg: 'var(--navy)', color: 'var(--cream)' },
    'Publication':    { bg: 'rgba(28,61,74,0.08)', color: 'var(--navy)' },
    'Partnership':    { bg: 'rgba(28,61,74,0.08)', color: 'var(--navy)' },
    'Event':          { bg: '#1A1200', color: '#E8B060' },
    'Press Release':  { bg: 'rgba(28,61,74,0.06)', color: 'var(--navy-dim)' },
    'Company News':   { bg: 'var(--navy)', color: 'var(--cream)' },
    'Award':          { bg: '#1A0800', color: '#E8A040' },
  }



  const featured = news[0]
  const rest = news.slice(1, 4)

  return (
    <section id="news" style={{ background: 'var(--linen)', padding: '8rem 0' }}>
      <div style={{ padding: '0 6rem', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
              <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />News & Updates
            </div>
            <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300 }}>
              Latest <em style={{ fontStyle: 'italic' }}>news</em>
            </h2>
          </div>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2px', marginBottom: '2px' }}>
          {/* Featured — large */}
          <div style={{
            position: 'relative', overflow: 'hidden', height: 520,
            opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1)' }}
          >
            <img src={featured.coverImage || LAB_IMGS[0]} alt={featured.title}
              style={{ width: '100%', height: '115%', objectFit: 'cover', filter: 'saturate(0.6) brightness(0.75)', display: 'block', marginTop: '-7%', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,61,74,0.85) 0%, rgba(28,61,74,0.2) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', alignItems: 'center' }}>
                {featured.category && <span style={{ padding: '0.25rem 0.85rem', borderRadius: 100, fontSize: '0.68rem', letterSpacing: '0.06em', background: 'rgba(245,240,232,0.15)', color: 'rgba(245,240,232,0.9)', backdropFilter: 'blur(8px)' }}>{featured.category}</span>}
                <span style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.5)' }}>{featured.date}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.25, marginBottom: '0.8rem' }}>{featured.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(245,240,232,0.6)', lineHeight: 1.7 }}>{featured.excerpt}</p>
              <div style={{ marginTop: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)', borderBottom: '1px solid rgba(245,240,232,0.2)', paddingBottom: '0.2rem', transition: 'color 0.3s, border-color 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,240,232,0.5)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,232,0.6)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,240,232,0.2)' }}
              >Read more</div>
            </div>
          </div>

          {/* Right column — stacked 3 items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {rest.slice(0,3).map((article, i) => {
              const cat = CAT_STYLE[article.category] || CAT_STYLE['Company News']
              const imgSrc = article.coverImage || LAB_IMGS[(i + 1) % LAB_IMGS.length]
              return (
                <div key={article.id} style={{
                  flex: 1, position: 'relative', overflow: 'hidden', minHeight: 168,
                  opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)',
                  transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${0.12 + i * 0.1}s`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1.06)'; (e.currentTarget as HTMLElement).style.zIndex = '2' }}
                onMouseLeave={e => { const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.zIndex = '1' }}
                >
                  <img src={imgSrc} alt={article.title}
                    style={{ width: '100%', height: '120%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.7)', display: 'block', marginTop: '-10%', transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,61,74,0.75) 0%, rgba(28,61,74,0.3) 60%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {article.category && <span style={{ padding: '0.2rem 0.7rem', borderRadius: 100, fontSize: '0.65rem', letterSpacing: '0.06em', background: 'rgba(245,240,232,0.12)', color: 'rgba(245,240,232,0.85)', backdropFilter: 'blur(6px)' }}>{article.category}</span>}
                      <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.4)' }}>{article.date}</span>
                    </div>
                    <h4 className="serif" style={{ fontSize: '1.05rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.35 }}>{article.title}</h4>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ────────────────────────────────────
function About({ a }: { a: any }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const tr = (delay: number): React.CSSProperties => ({ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(32px)', transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` })
  return (
    <section id="about" style={{ background: 'var(--cream)', padding: '8rem 0', overflow: 'hidden' }}>
      {/* Sweden origin editorial panel */}
      <SwedenPanel />
      <div ref={ref} style={{ padding: '0 6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7rem', maxWidth: 1400, margin: '0 auto' }}>
        {/* Left */}
        <div>
          <div style={{ ...tr(0), display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />
            {a.tagline}
          </div>
          <h2 className="serif" style={{ ...tr(0.1), fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.1 }} dangerouslySetInnerHTML={{ __html: a.title }} />
          <div style={{ ...tr(0.2), marginTop: '2rem', borderLeft: '2px solid var(--navy)', paddingLeft: '1.5rem' }}>
            <p className="serif" style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--navy-mid)', lineHeight: 1.6 }}>"{a.highlightQuote}"</p>
          </div>
          {/* Vision & Mission */}
          <div style={{ ...tr(0.3), marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[{ label: 'Vision', text: a.vision, dark: true }, { label: 'Mission', text: a.mission, dark: false }].map((item, i) => (
              <div key={i} style={{ padding: '1.4rem', borderRadius: 12, background: item.dark ? 'var(--navy)' : 'var(--ice-lt)', border: item.dark ? 'none' : '1px solid rgba(28,61,74,0.08)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: item.dark ? 'rgba(214,228,232,0.45)' : 'var(--stone)', marginBottom: '0.6rem' }}>{item.label}</div>
                <p className="serif" style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.55, color: item.dark ? 'var(--cream)' : 'var(--navy)', fontWeight: 300 }}>{item.text}</p>
                <div style={{ position: 'absolute', bottom: '-0.5rem', right: '0.8rem', fontFamily: 'Cormorant,serif', fontSize: '4.5rem', fontWeight: 300, lineHeight: 1, color: item.dark ? 'rgba(214,228,232,0.06)' : 'rgba(28,61,74,0.04)', pointerEvents: 'none' }}>{item.label[0]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div>
          <p style={{ ...tr(0.15), color: 'var(--navy-dim)', lineHeight: 1.9, fontSize: '1rem', marginBottom: '2rem' }}>{a.body}</p>
          <div style={{ ...tr(0.25), marginBottom: '2rem' }}>
            {(a.certifications || []).map((c: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(28,61,74,0.07)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--navy)', flexShrink: 0, opacity: 0.6 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--navy-mid)' }}>{c}</span>
              </div>
            ))}
          </div>
          <a href="#science" style={{ ...tr(0.3), display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--navy)', padding: '0.85rem 2rem', borderRadius: 100, border: '1px solid rgba(28,61,74,0.2)', fontSize: '0.85rem', fontWeight: 300, textDecoration: 'none', transition: 'all 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
          >Our technology platform</a>
        </div>
      </div>
    </section>
  )
}

// ─── TECHNOLOGY ────────────────────────────────
const TECH_IMGS = [
  'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=900',
]
function Technology({ cards }: { cards: any[] }) {
  return (
    <section id="science" style={{ background: 'var(--linen)', padding: '0' }}>
      <div style={{ padding: '6rem 6rem 4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Our Science
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '4rem' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.1, maxWidth: 500 }}>Advanced <em style={{ fontStyle: 'italic' }}>stem cell</em> technology platform</h2>
          <p style={{ color: 'var(--navy-dim)', fontSize: '0.92rem', maxWidth: 280, textAlign: 'right', lineHeight: 1.75 }}>Six integrated pillars spanning discovery through clinical delivery.</p>
        </div>
      </div>
      {/* Alternating image/text rows for first 3 */}
      {cards.slice(0, 3).map((c, i) => {
        const isEven = i % 2 === 0
        return (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(28,61,74,0.07)' }}>
            {isEven ? (
              <>
                <div style={{ height: 380, overflow: 'hidden' }}>
                  <img src={TECH_IMGS[i]} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7)', display: 'block', transition: 'transform 0.9s ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--cream)' }}>
                  <div className="serif" style={{ fontSize: '4rem', fontWeight: 300, color: 'rgba(28,61,74,0.06)', lineHeight: 1, marginBottom: '1rem' }}>{c.number}</div>
                  <h3 className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '1rem', color: 'var(--navy)' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--navy-dim)', lineHeight: 1.8 }}>{c.description}</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--linen)' }}>
                  <div className="serif" style={{ fontSize: '4rem', fontWeight: 300, color: 'rgba(28,61,74,0.06)', lineHeight: 1, marginBottom: '1rem' }}>{c.number}</div>
                  <h3 className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '1rem', color: 'var(--navy)' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--navy-dim)', lineHeight: 1.8 }}>{c.description}</p>
                </div>
                <div style={{ height: 380, overflow: 'hidden' }}>
                  <img src={TECH_IMGS[i]} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7)', display: 'block', transition: 'transform 0.9s ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                  />
                </div>
              </>
            )}
          </div>
        )
      })}
      {/* Remaining cards as grid */}
      {cards.length > 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid rgba(28,61,74,0.07)' }}>
          {cards.slice(3).map((c, i) => (
            <div key={c.id} style={{ padding: '3rem 3.5rem', borderRight: i < cards.slice(3).length - 1 ? '1px solid rgba(28,61,74,0.07)' : 'none', background: 'var(--cream)', transition: 'background 0.3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ice-lt)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--cream)'}
            >
              <div className="serif" style={{ fontSize: '3rem', fontWeight: 300, color: 'rgba(28,61,74,0.07)', lineHeight: 1, marginBottom: '1rem' }}>{c.number}</div>
              <h3 className="serif" style={{ fontSize: '1.35rem', fontWeight: 300, marginBottom: '0.6rem', color: 'var(--navy)' }}>{c.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--navy-dim)', lineHeight: 1.75 }}>{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── PIPELINE ────────────────────────────────
function Pipeline({ programs }: { programs: any[] }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const STATUS: Record<string, { bg: string; color: string }> = {
    'Active':    { bg: 'var(--navy)', color: 'var(--cream)' },
    'Completed': { bg: 'rgba(28,61,74,0.1)', color: 'var(--navy-mid)' },
    'Recruiting':{ bg: '#1A1200', color: '#E8B060' },
    'Planned':   { bg: 'rgba(28,61,74,0.06)', color: 'var(--stone)' },
  }
  return (
    <section id="pipeline" style={{ background: 'var(--cream)', padding: '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Clinical Programmes
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '4rem' }}>
          Translating science into <em style={{ fontStyle: 'italic' }}>clinical reality</em>
        </h2>
        <div ref={ref}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 120px', gap: '2rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(28,61,74,0.12)' }}>
            {['Programme', 'Development Stage', 'Indication', 'Status'].map(h => (
              <div key={h} style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)' }}>{h}</div>
            ))}
          </div>
          {programs.map((p, i) => {
            const st = STATUS[p.status] || STATUS['Planned']
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 120px', gap: '2rem', alignItems: 'center', padding: '2rem 0', borderBottom: '1px solid rgba(28,61,74,0.05)', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(-20px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.2}s` }}>
                <div>
                  <div className="serif" style={{ fontSize: '1.15rem', fontWeight: 400, color: 'var(--navy)', marginBottom: '0.2rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--stone)' }}>{p.subtitle}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-dim)', marginBottom: '0.5rem' }}>{p.phase}</div>
                  <div style={{ height: 2, background: 'rgba(28,61,74,0.08)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--navy)', borderRadius: 1, width: vis ? `${p.phasePercent}%` : '0%', transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.6}s` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                    {['Pre-clinical', 'Phase I', 'Phase II', 'Phase III'].map(ph => (
                      <span key={ph} style={{ fontSize: '0.58rem', color: 'var(--stone)', letterSpacing: '0.03em' }}>{ph}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--navy-mid)' }}>{p.indication}</div>
                <div>
                  <span style={{ display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: 100, fontSize: '0.7rem', letterSpacing: '0.04em', background: st.bg, color: st.color }}>{p.status}</span>
                </div>
              </div>
            )
          })}
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.6 }}>
          All programmes listed are investigator-initiated clinical trials conducted in collaboration with academic medical institutions. Programme names are for identification purposes only and do not represent marketed products.
        </p>
      </div>
    </section>
  )
}

// ─── QUOTE BAND ────────────────────────────────
function QuoteBand() {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
      <img src="https://images.pexels.com/photos/3825569/pexels-photo-3825569.jpeg?auto=compress&cs=tinysrgb&w=1600" alt=""
        style={{ width: '100%', height: '110%', objectFit: 'cover', filter: 'brightness(0.25) saturate(0.4)', display: 'block', marginTop: '-5%', transition: 'transform 0.1s linear' }} />
      {/* Diagonal overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(28,61,74,0.4) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 10rem', textAlign: 'center', gap: '1.8rem' }}>
        {/* Animated line */}
        <div style={{ width: vis ? 60 : 0, height: 1, background: 'rgba(245,240,232,0.35)', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        <p className="serif" style={{
          fontSize: 'clamp(1.8rem,3vw,3rem)', fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(245,240,232,0.92)', lineHeight: 1.35, maxWidth: 820,
          opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)',
          transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s',
        }}>
          "Every cell we produce brings us one step closer to a patient receiving a treatment that was not possible before."
        </p>
        <div style={{ opacity: vis ? 1 : 0, transition: 'opacity 1s 0.7s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 1, height: 24, background: 'rgba(245,240,232,0.2)' }} />
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>Dr. Nadir Kadri — Founder, SAIHTEC AB</div>
        </div>
        <div style={{ width: vis ? 60 : 0, height: 1, background: 'rgba(245,240,232,0.35)', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s' }} />
      </div>
    </div>
  )
}

// ─── TEAM ────────────────────────────────────
function Team({ team }: { team: any[] }) {
  return (
    <section id="team" style={{ background: 'var(--linen)', padding: '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Scientific Leadership
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '4rem' }}>
          The science behind <em style={{ fontStyle: 'italic' }}>SAIHTEC</em>
        </h2>
        {/* Featured founder card */}
        {team[0] && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', background: 'var(--navy)', borderRadius: 20, overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', minHeight: 380 }}>
              <img src="/nadir_kadri_pp.png" alt={team[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.35) brightness(0.7)', display: 'block', position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, var(--navy) 100%)' }} />
            </div>
            <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
              <div>
                <div className="serif" style={{ fontSize: '1.6rem', fontWeight: 400, color: 'var(--cream)', marginBottom: '0.3rem' }}>{team[0].name}</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.45)' }}>{team[0].title}</div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(245,240,232,0.65)', lineHeight: 1.8 }}>{team[0].bio}</p>
              {team[0].linkedinUrl && (
                <a href={team[0].linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'rgba(214,228,232,0.45)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ice)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(214,228,232,0.45)')}
                >LinkedIn profile</a>
              )}
            </div>
          </div>
        )}
        {/* Additional team members */}
        {team.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {team.slice(1).map((m, i) => (
              <div key={m.id} style={{ border: '1px solid rgba(28,61,74,0.08)', borderRadius: 14, overflow: 'hidden', background: 'var(--cream)', transition: 'all 0.35s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ height: 200, background: 'var(--ice-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="serif" style={{ fontSize: '2rem', color: 'var(--navy-dim)', opacity: 0.4 }}>{m.initials}</div>
                </div>
                <div style={{ padding: '1.4rem' }}>
                  <div className="serif" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--navy)', marginBottom: '0.2rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: 'var(--stone)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>{m.title}</div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--navy-dim)', lineHeight: 1.7 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── PUBLICATIONS ────────────────────────────────
function Publications({ publications }: { publications: any[] }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <section id="publications" style={{ background: 'var(--cream)', padding: '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
              <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Research Output
            </div>
            <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300 }}>Selected <em style={{ fontStyle: 'italic' }}>publications</em></h2>
          </div>
          <a href="https://orcid.org/0000-0003-2623-4094" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--navy-dim)', textDecoration: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', paddingBottom: '0.2rem', transition: 'color 0.3s, border-color 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy-dim)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.15)' }}
          >View all on ORCID</a>
        </div>
        <div ref={ref}>
          {publications.map((p, i) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', gap: '2rem', alignItems: 'start', padding: '1.8rem 0', borderBottom: '1px solid rgba(28,61,74,0.06)', textDecoration: 'none', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(16px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s` }}>
              <div className="serif" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--stone)', paddingTop: '0.1rem' }}>{p.year}</div>
              <div>
                <div className="serif" style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.45, marginBottom: '0.4rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>{p.authors} — <em>{p.journal}</em></div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--stone)', paddingTop: '0.1rem', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
              >{p.urlType}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── NEWS ────────────────────────────────────
function News({ news }: { news: any[] }) {

  const NEWS_IMGS = ['https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=700','https://images.pexels.com/photos/3786215/pexels-photo-3786215.jpeg?auto=compress&cs=tinysrgb&w=700','https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=700']
  const CAT: Record<string,{bg:string;color:string}> = {
    'Clinical Trial':{ bg:'var(--navy)', color:'var(--cream)' },
    'Publication':{ bg:'rgba(28,61,74,0.08)', color:'var(--navy)' },
    'Press Release':{ bg:'rgba(28,61,74,0.06)', color:'var(--navy-dim)' },
    'Company News':{ bg:'var(--navy)', color:'var(--cream)' },
    'Partnership':{ bg:'rgba(28,61,74,0.08)', color:'var(--navy)' },
  }
  return (
    <section id="news" style={{ background: 'var(--linen)', padding: '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />News & Updates
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, marginBottom: '3rem' }}>
          Latest <em style={{ fontStyle: 'italic' }}>news</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {news.slice(0, 6).map((n, i) => {
            const cat = CAT[n.category] || CAT['Company News']
            return (
              <div key={n.id} style={{ border: '1px solid rgba(28,61,74,0.08)', borderRadius: 14, overflow: 'hidden', background: 'var(--cream)', transition: 'all 0.35s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(28,61,74,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img src={NEWS_IMGS[i % NEWS_IMGS.length]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.65)', display: 'block', transition: 'transform 0.8s ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '1.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', alignItems: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.67rem', letterSpacing: '0.06em', background: cat.bg, color: cat.color }}>{n.category}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--stone)' }}>{n.date}</span>
                  </div>
                  <h4 className="serif" style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.35, marginBottom: '0.6rem', color: 'var(--navy)' }}>{n.title}</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--navy-dim)', lineHeight: 1.7 }}>{n.excerpt}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ────────────────────────────────────
function FAQ({ data }: { data: any }) {
  const [open, setOpen] = useState<string | null>(null)
  if (!data?.items?.length) return null
  return (
    <section id="faq" style={{ background: 'var(--cream)', padding: '8rem 6rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />{data.tagline}
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, marginBottom: '3rem' }}>
          Common <em style={{ fontStyle: 'italic' }}>questions</em>
        </h2>
        {data.items.map((item: any) => (
          <div key={item.id} style={{ borderTop: '1px solid rgba(28,61,74,0.07)' }}>
            <button onClick={() => setOpen(open === item.id ? null : item.id)} style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', textAlign: 'left', gap: '2rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span className="serif" style={{ fontSize: '1.05rem', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.35 }}>{item.q}</span>
              <span style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid rgba(28,61,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', color: open === item.id ? 'var(--cream)' : 'var(--navy-dim)', background: open === item.id ? 'var(--navy)' : 'transparent', transform: open === item.id ? 'rotate(45deg)' : 'none', transition: 'all 0.3s ease' }}>+</span>
            </button>
            <div style={{ maxHeight: open === item.id ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
              <p style={{ paddingBottom: '1.5rem', color: 'var(--navy-dim)', fontSize: '0.93rem', lineHeight: 1.85 }}>{item.a}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(28,61,74,0.07)' }} />
      </div>
    </section>
  )
}

// ─── CONTACT ────────────────────────────────────
function Contact({ email }: { email: string }) {
  const [form, setForm] = useState({ name: '', email: '', type: 'General Inquiry', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setLoading(false); setSent(true)
  }
  const inp: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', padding: '0.85rem 0', color: 'var(--navy)', fontSize: '0.93rem', fontFamily: 'inherit', outline: 'none', fontWeight: 300, transition: 'border-color 0.3s' }
  return (
    <section id="contact" style={{ background: 'var(--navy)', padding: '0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 640 }}>
        {/* Left */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 500 }}>
          <img src="https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=900" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) brightness(0.6)', display: 'block', position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, var(--navy) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '4rem', left: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.45)', marginBottom: '1rem' }}>
              <span style={{ display: 'block', width: 20, height: 1, background: 'rgba(214,228,232,0.3)' }} />Get in touch
            </div>
            <h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
              Ready to<br /><em style={{ fontStyle: 'italic', color: 'rgba(214,228,232,0.6)' }}>collaborate?</em>
            </h2>
          </div>
        </div>
        {/* Right */}
        <div style={{ padding: '6rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[{ label: 'Email', val: email }, { label: 'Location', val: 'Stockholm, Sweden' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.35)', width: 60, flexShrink: 0 }}>{item.label}</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(245,240,232,0.7)' }}>{item.val}</span>
              </div>
            ))}
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(214,228,232,0.08)', marginBottom: '2rem' }} />
          {sent ? (
            <div>
              <div className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '0.5rem' }}>Message received.</div>
              <p style={{ color: 'rgba(214,228,232,0.5)', fontSize: '0.9rem' }}>We will respond within two business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
              {[{ l: 'Full Name', k: 'name', t: 'text', p: 'Dr. Jane Smith' }, { l: 'Email Address', k: 'email', t: 'email', p: 'jane@institution.edu' }].map(field => (
                <div key={field.k}>
                  <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.35)', marginBottom: '0.3rem' }}>{field.l}</label>
                  <input type={field.t} placeholder={field.p} value={(form as any)[field.k]} onChange={e => setForm(f => ({ ...f, [field.k]: e.target.value }))} required style={{ ...inp, color: 'var(--cream)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(214,228,232,0.4)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,61,74,0.15)')} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.35)', marginBottom: '0.3rem' }}>Inquiry Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inp, cursor: 'pointer', color: 'var(--cream)' }}>
                  {['General Inquiry', 'Clinical Collaboration', 'Research Partnership', 'Investor Relations', 'Press & Media'].map(o => <option key={o} style={{ background: 'var(--navy)' }}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.35)', marginBottom: '0.3rem' }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} required placeholder="Tell us about your project or inquiry..." style={{ ...inp, resize: 'vertical', color: 'var(--cream)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(214,228,232,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,61,74,0.15)')} />
              </div>
              <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: 'var(--cream)', color: 'var(--navy)', border: 'none', borderRadius: 100, padding: '0.95rem 2.5rem', fontSize: '0.88rem', fontWeight: 400, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', transition: 'all 0.3s ease', width: 'fit-content' }}
                onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background = 'var(--ice)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--cream)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >{loading ? 'Sending...' : 'Send message'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ────────────────────────────────────
function Footer() {
  const cols = [
    { title: 'Company', links: [{ label: 'About', href: '#about' }, { label: 'Scientific Leadership', href: '#team' }, { label: 'Technology', href: '#science' }] },
    { title: 'Research', links: [{ label: 'Clinical Programmes', href: '#pipeline' }, { label: 'Publications', href: '#publications' }, { label: 'News', href: '#news' }] },
    { title: 'Legal', links: [{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'Terms of Use', href: '/terms' }] },
  ]
  return (
    <footer style={{ background: '#0A1A22', padding: '4.5rem 6rem 3rem', borderTop: '1px solid rgba(214,228,232,0.05)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '3.5rem' }}>
        <div>
          <Logo size={46} light />
          <p style={{ color: 'rgba(245,240,232,0.3)', fontSize: '0.86rem', lineHeight: 1.8, maxWidth: 280, marginTop: '1.2rem' }}>
            SAIHTEC AB — a Swedish biotechnology company dedicated to the clinical translation of mesenchymal stromal cell therapy. Stockholm, Sweden.
          </p>
          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(214,228,232,0.2)', letterSpacing: '0.04em' }}>nadir.kadri@ki.se</span>
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.3)', marginBottom: '1.2rem' }}>{col.title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {col.links.map(l => (
                <li key={l.label}>
                  <a href={l.href} style={{ color: 'rgba(245,240,232,0.28)', fontSize: '0.86rem', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.75)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.28)')}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(214,228,232,0.06)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(214,228,232,0.18)', fontSize: '0.76rem' }}>© 2026 SAIHTEC AB. All rights reserved.</span>
        <span style={{ color: 'rgba(214,228,232,0.12)', fontSize: '0.74rem' }}>Stockholm, Sweden · Developed by Baina Agency</span>
      </div>
    </footer>
  )
}

// ─── MAIN PAGE ────────────────────────────────────
export default function Home({ content }: { content: Content }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)

    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('scroll', fn)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const { settings, about, technology, pipeline, team, publications, news, faq } = content

  return (
    <>
      <Head>
        <title>{settings.seoTitle}</title>
        <meta name="description" content={settings.seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={settings.seoTitle} />
        <meta property="og:description" content={settings.seoDescription} />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Navbar scrolled={scrolled} />
      <main>
        <Hero s={settings} />
        <StatsBar stats={settings.stats || []} />
        <About a={about} />
        <Technology cards={technology || []} />
        <Pipeline programs={pipeline || []} />
        <QuoteBand />
        <Team team={team || []} />
        <Publications publications={publications || []} />
        <NewsSection news={news || []} />
        <FAQ data={faq} />
        <Contact email={settings.contactEmail || 'nadir.kadri@ki.se'} />
      </main>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const content = await readContent()
  return {
    props: {
      content: {
        settings: content.settings || {},
        about: content.about || {},
        technology: content.technology || [],
        pipeline: content.pipeline || [],
        team: content.team || [],
        publications: content.publications || [],
        news: content.news || [],
        faq: content.faq || null,
        media: content.media || null,
        events: content.events || null,
        science_team: content.science_team || null,
        investors: content.investors || null,
        collaborations: content.collaborations || null,
      }
    }
  }
}