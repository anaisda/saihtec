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

// ─── RESPONSIVE HOOK ────────────────────────────────
function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}
function useIsSmall() {
  return useIsMobile(560)
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
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: light ? 'rgba(214,228,232,0.6)' : 'var(--navy-dim)', fontWeight: 300 }}>Nordic Cell Innovations</div>
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
  const [hovered, setHovered] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile(860)

  useEffect(() => { setMenuOpen(false) }, [isMobile])

  if (isMobile) {
    return (
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 990, padding: '1rem 1.2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled || menuOpen ? 'rgba(245,240,232,0.97)' : 'rgba(245,240,232,0.9)',
          backdropFilter: 'blur(20px)', borderRadius: menuOpen ? 20 : 100,
          border: '1px solid rgba(28,61,74,0.1)',
          boxShadow: '0 4px 24px rgba(28,61,74,0.1)',
          padding: '0.6rem 0.6rem 0.6rem 1rem',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <a href="/" style={{ textDecoration: 'none' }}><Logo size={32} /></a>
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none',
            background: menuOpen ? 'var(--navy)' : 'rgba(28,61,74,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s ease',
          }}>
            <div style={{ position: 'relative', width: 16, height: 12 }}>
              <span style={{ position: 'absolute', left: 0, top: menuOpen ? 5 : 0, width: 16, height: 1.5, background: menuOpen ? 'var(--cream)' : 'var(--navy)', transform: menuOpen ? 'rotate(45deg)' : 'none', transition: 'all 0.3s ease' }} />
              <span style={{ position: 'absolute', left: 0, top: 5, width: 16, height: 1.5, background: menuOpen ? 'var(--cream)' : 'var(--navy)', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s ease' }} />
              <span style={{ position: 'absolute', left: 0, top: menuOpen ? 5 : 10, width: 16, height: 1.5, background: menuOpen ? 'var(--cream)' : 'var(--navy)', transform: menuOpen ? 'rotate(-45deg)' : 'none', transition: 'all 0.3s ease' }} />
            </div>
          </button>
        </div>
        {menuOpen && (
          <div style={{
            marginTop: '0.5rem', background: 'rgba(245,240,232,0.98)', backdropFilter: 'blur(20px)',
            borderRadius: 18, border: '1px solid rgba(28,61,74,0.1)', boxShadow: '0 8px 32px rgba(28,61,74,0.12)',
            padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.2rem',
            animation: 'fadeIn 0.25s ease',
          }}>
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ padding: '0.85rem 1rem', color: 'var(--navy)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 300, borderRadius: 10 }}>{item.label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ marginTop: '0.3rem', textAlign: 'center', background: 'var(--navy)', color: 'var(--cream)', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.92rem', fontWeight: 400, textDecoration: 'none' }}>Get in touch</a>
          </div>
        )}
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
      </nav>
    )
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 990,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.2rem 2rem',
      pointerEvents: 'none',
    }}>
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
        maxWidth: '94vw',
      }}>
        <a href="/" style={{ textDecoration: 'none', marginRight: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(28,61,74,0.12)' }}>
            <img src="/logo.png" alt="SAIHTEC" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <span style={{ fontFamily: 'Cormorant,serif', fontSize: '1.05rem', fontWeight: 500, color: 'var(--navy)', letterSpacing: '0.12em' }}>SAIHTEC</span>
        </a>

        <div style={{ width: 1, height: 18, background: 'rgba(28,61,74,0.12)', marginRight: '0.5rem' }} />

        {NAV_ITEMS.map(item => (
          <a key={item.href} href={item.href}
            style={{
              display: 'block', padding: '0.5rem 0.9rem',
              color: hovered === item.href ? 'var(--navy)' : 'var(--navy-dim)',
              textDecoration: 'none', fontSize: '0.83rem', fontWeight: 300,
              letterSpacing: '0.03em', borderRadius: 100,
              background: hovered === item.href ? 'rgba(28,61,74,0.06)' : 'transparent',
              transition: 'all 0.25s ease', position: 'relative', whiteSpace: 'nowrap',
            }}
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered(null)}
          >{item.label}</a>
        ))}

        <a href="#contact" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'var(--navy)', color: 'var(--cream)',
          padding: '0.62rem 1.4rem', borderRadius: 100,
          fontSize: '0.82rem', fontWeight: 400, textDecoration: 'none',
          letterSpacing: '0.02em', marginLeft: '0.5rem',
          transition: 'all 0.3s ease', flexShrink: 0, whiteSpace: 'nowrap',
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
  const isMobile = useIsMobile(860)
  useEffect(() => {
    vid.current?.play().catch(() => {})
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const words = ['cellular', 'MSC', 'translational']
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
    <section style={{ position: 'relative', minHeight: isMobile ? 'auto' : '100vh', display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '52% 48%', overflow: 'hidden' }}>
      {/* ── Left panel ── */}
      <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: isMobile ? '6.5rem 1.4rem 3rem' : '7rem 5rem 5rem', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: isMobile ? '1.3rem' : '2.2rem',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
            <div style={{ width: 24, height: 1, background: 'var(--navy)', opacity: 0.4 }} />
            <span style={{ fontSize: isMobile ? '0.62rem' : '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy-dim)' }}>{s.heroTagline}</span>
          </div>

          <h1 className="serif" style={{
            fontSize: isMobile ? 'clamp(2.6rem,11vw,3.6rem)' : 'clamp(3.8rem,6vw,7rem)', fontWeight: 300, lineHeight: 1.04,
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

          {s.heroManifesto && (
            <p className="serif" style={{
              marginTop: isMobile ? '1.2rem' : '1.6rem', fontSize: isMobile ? '1rem' : '1.15rem', fontStyle: 'italic',
              color: 'var(--navy-mid)', fontWeight: 300,
              opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
              transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.38s',
            }}>{s.heroManifesto}</p>
          )}

          <p style={{
            marginTop: isMobile ? '1.1rem' : '1.4rem', fontSize: isMobile ? '0.92rem' : '1rem', color: 'var(--navy-dim)',
            lineHeight: 1.85, maxWidth: 420, fontWeight: 300,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.45s',
          }}>{s.heroSubtitle}</p>

          <div style={{
            marginTop: isMobile ? '1.7rem' : '2.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.6s',
          }}>
            <a href="#pipeline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--navy)', color: 'var(--cream)', padding: isMobile ? '0.8rem 1.6rem' : '0.9rem 2.2rem', borderRadius: 100, fontSize: isMobile ? '0.82rem' : '0.85rem', fontWeight: 400, textDecoration: 'none', transition: 'all 0.35s ease', boxShadow: '0 4px 20px rgba(28,61,74,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(28,61,74,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(28,61,74,0.2)' }}
            >Clinical programmes</a>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--navy)', padding: isMobile ? '0.8rem 1.6rem' : '0.9rem 2.2rem', borderRadius: 100, border: '1px solid rgba(28,61,74,0.2)', fontSize: isMobile ? '0.82rem' : '0.85rem', fontWeight: 300, textDecoration: 'none', transition: 'all 0.35s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.2)' }}
            >Contact us</a>
          </div>

          {!isMobile && (
            <div style={{
              position: 'absolute', right: '-2rem', bottom: '4rem',
              writingMode: 'vertical-rl', display: 'flex', alignItems: 'center', gap: '0.8rem',
              fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)',
              opacity: loaded ? 1 : 0, transition: 'opacity 1s 1.2s',
            }}>
              Scroll
              <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom,var(--stone),transparent)', animation: 'sp 2.2s ease-in-out infinite' }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel — video ── */}
      <div style={{ position: 'relative', overflow: 'hidden', height: isMobile ? '62vw' : 'auto', minHeight: isMobile ? 280 : undefined }}>
        <video ref={vid} autoPlay muted loop playsInline
          src={s.heroVideoUrl || 'https://videos.pexels.com/video-files/8325997/8325997-hd_1920_1080_30fps.mp4'}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(0.75)', transition: 'filter 1.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom, transparent 60%, var(--cream) 100%)' : 'linear-gradient(to right, var(--cream) 0%, rgba(245,240,232,0.15) 30%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(28,61,74,0.025) 80px)', pointerEvents: 'none' }} />

        {/* Swedish flag identity card */}
        <div style={{
          position: 'absolute', bottom: isMobile ? '1rem' : '3rem', right: isMobile ? '1rem' : '2.5rem', left: isMobile ? '1rem' : 'auto',
          borderRadius: 18, overflow: 'hidden',
          minWidth: isMobile ? undefined : 260,
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.9s',
          boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: '#006AA7' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '34%', width: '15%', background: '#FECC02' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', height: '20%', background: '#FECC02' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,44,62,0.72)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', padding: isMobile ? '1.3rem 1.4rem' : '1.8rem 2rem' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(254,204,2,0.7)', marginBottom: '0.7rem' }}>Stockholm, Sweden</div>
            <p className="serif" style={{ fontSize: isMobile ? '1.05rem' : '1.2rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(245,240,232,0.92)', lineHeight: 1.4, marginBottom: '1rem' }}>
              Swedish science.<br />Global impact.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                'EU ATMP Expertise',
                'ISCT Committee 2025–2028',
                '57 peer-reviewed publications',
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(254,204,2,0.7)', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.74rem' : '0.78rem', color: 'rgba(214,228,232,0.7)', fontWeight: 300 }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isMobile && (
          <div style={{
            position: 'absolute', top: '8rem', right: '2.5rem',
            fontFamily: 'Cormorant,serif', fontSize: '0.85rem', fontStyle: 'italic',
            color: 'rgba(245,240,232,0.45)', letterSpacing: '0.08em',
            opacity: loaded ? 1 : 0, transition: 'opacity 1s 1.4s',
          }}>Stockholm, Sweden · Est. 2020</div>
        )}
      </div>

      <style>{`
        @keyframes ringPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes sp { 0%,100%{height:32px;opacity:.3} 50%{height:54px;opacity:.7} }
      `}</style>
    </section>
  )
}

// ─── STATS BAR ────────────────────────────────
function StatsBar({ stats }: { stats: any[] }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isSmall = useIsSmall()
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ background: 'var(--navy)', display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2,1fr)' : `repeat(${stats.length},1fr)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(214,228,232,0.03) 50%, transparent 70%)', animation: 'statsSweep 4s ease-in-out infinite', pointerEvents: 'none' }} />
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: isSmall ? '1.6rem 1.3rem' : '3rem 3.5rem', position: 'relative',
          borderRight: (isSmall ? i % 2 === 0 : i < stats.length - 1) ? '1px solid rgba(214,228,232,0.06)' : 'none',
          borderBottom: isSmall && i < stats.length - 2 ? '1px solid rgba(214,228,232,0.06)' : 'none',
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
          transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
          cursor: 'default',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(214,228,232,0.04)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent' }}
        >
          <div style={{ position: 'absolute', top: 0, left: isSmall ? '1.3rem' : '3.5rem', right: isSmall ? '1.3rem' : '3.5rem', height: 1, background: 'linear-gradient(to right, transparent, rgba(214,228,232,0.15), transparent)', transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.3}s` }} />
          <div className="serif" style={{ fontSize: isSmall ? '2rem' : '3rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {s.number}<span style={{ fontSize: isSmall ? '1.2rem' : '1.6rem', color: 'rgba(214,228,232,0.6)', letterSpacing: '0' }}>{s.suffix}</span>
          </div>
          <div style={{ fontSize: isSmall ? '0.65rem' : '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.62)' }}>{s.label}</div>
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
  const isMobile = useIsMobile(860)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', marginBottom: isMobile ? '3.5rem' : '6rem', height: isMobile ? 'auto' : 420, overflow: 'hidden' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: isMobile ? 260 : 'auto' }}>
        <img src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=900"
          alt="" style={{ width: '100%', height: '115%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.82)', display: 'block', marginTop: '-7%', transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,61,74,0.65) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: isMobile ? '1.3rem' : '2rem', right: isMobile ? '1.3rem' : '2rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.5)', marginBottom: '0.4rem' }}>Translational Research</div>
          <p className="serif" style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(245,240,232,0.85)', lineHeight: 1.4 }}>
            From the bench to the clinic, under EU ATMP guidelines
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--navy)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: isMobile ? '2rem 1.3rem' : '3rem', position: 'relative', overflow: 'hidden', gap: isMobile ? '1.6rem' : 0 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', pointerEvents: 'none', overflow: 'hidden', opacity: 0.06 }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 80, marginTop: -40, background: '#F9D84A' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', width: 80, background: '#F9D84A' }} />
        </div>

        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.3rem' }}>
            <div style={{ width: 36, height: 24, borderRadius: 3, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid rgba(214,228,232,0.2)' }}>
              <div style={{ position: 'absolute', inset: 0, background: '#006AA7' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: '18%', background: '#FECC02' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: '24%', background: '#FECC02' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.65)', marginBottom: '0.15rem' }}>Incorporated</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--cream)', fontWeight: 300 }}>Kingdom of Sweden</div>
            </div>
          </div>
          <div style={{ width: 32, height: 1, background: 'rgba(214,228,232,0.15)', marginBottom: '1.3rem' }} />
          <div className="serif" style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Built in<br /><em style={{ fontStyle: 'italic', color: 'rgba(214,228,232,0.8)' }}>Stockholm.</em><br />Reaching the world.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { label: 'Academic origin', value: 'Karolinska Institutet' },
            { label: 'Regulatory framework', value: 'EU ATMP Expertise' },
            { label: 'Committee role', value: 'ISCT MSC 2025–2028' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              paddingTop: '0.7rem', borderTop: '1px solid rgba(214,228,232,0.07)',
              opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(12px)',
              transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s`,
            }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.62)' }}>{item.label}</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.88)', textAlign: 'right', maxWidth: '55%' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ABOUT ────────────────────────────────────
function About({ a }: { a: any }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile(860)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const tr = (delay: number): React.CSSProperties => ({ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(32px)', transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` })
  return (
    <section id="about" style={{ background: 'var(--cream)', padding: isMobile ? '4rem 0' : '8rem 0', overflow: 'hidden' }}>
      <SwedenPanel />
      <div ref={ref} style={{ padding: isMobile ? '0 1.4rem' : '0 6rem', display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', gap: isMobile ? '2.5rem' : '7rem', maxWidth: 1400, margin: '0 auto' }}>
        <div>
          <div style={{ ...tr(0), display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />
            {a.tagline}
          </div>
          <h2 className="serif" style={{ ...tr(0.1), fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.15 }} dangerouslySetInnerHTML={{ __html: a.title }} />
          <div style={{ ...tr(0.2), marginTop: '1.7rem', borderLeft: '2px solid var(--navy)', paddingLeft: '1.3rem' }}>
            <p className="serif" style={{ fontSize: isMobile ? '1.05rem' : '1.15rem', fontStyle: 'italic', color: 'var(--navy-mid)', lineHeight: 1.6 }}>"{a.highlightQuote}"</p>
          </div>
          <div style={{ ...tr(0.3), marginTop: '1.7rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
            {[{ label: 'Vision', text: a.vision, dark: true }, { label: 'Mission', text: a.mission, dark: false }].map((item, i) => (
              <div key={i} style={{ padding: '1.3rem', borderRadius: 12, background: item.dark ? 'var(--navy)' : 'var(--ice-lt)', border: item.dark ? 'none' : '1px solid rgba(28,61,74,0.08)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: item.dark ? 'rgba(214,228,232,0.65)' : 'var(--navy-dim)', marginBottom: '0.6rem' }}>{item.label}</div>
                <p className="serif" style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.55, color: item.dark ? 'var(--cream)' : 'var(--navy)', fontWeight: 300 }}>{item.text}</p>
                <div style={{ position: 'absolute', bottom: '-0.5rem', right: '0.8rem', fontFamily: 'Cormorant,serif', fontSize: '4.5rem', fontWeight: 300, lineHeight: 1, color: item.dark ? 'rgba(214,228,232,0.06)' : 'rgba(28,61,74,0.04)', pointerEvents: 'none' }}>{item.label[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ ...tr(0.15), color: 'var(--navy-dim)', lineHeight: 1.9, fontSize: isMobile ? '0.92rem' : '1rem', marginBottom: '1.7rem' }}>{a.body}</p>
          <div style={{ ...tr(0.25), marginBottom: '1.7rem' }}>
            {(a.certifications || []).map((c: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(28,61,74,0.07)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--navy)', flexShrink: 0, opacity: 0.6 }} />
                <span style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: 'var(--navy-mid)' }}>{c}</span>
              </div>
            ))}
          </div>
          <a href="#science" style={{ ...tr(0.3), display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--navy)', padding: '0.85rem 2rem', borderRadius: 100, border: '1px solid rgba(28,61,74,0.2)', fontSize: '0.85rem', fontWeight: 300, textDecoration: 'none', transition: 'all 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
          >Our areas of expertise</a>
        </div>
      </div>
    </section>
  )
}

// ─── TECHNOLOGY (Areas of Expertise) ────────────────────────────────
const TECH_IMGS = [
  'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3786215/pexels-photo-3786215.jpeg?auto=compress&cs=tinysrgb&w=900',
]
function Technology({ cards }: { cards: any[] }) {
  const isMobile = useIsMobile(860)
  return (
    <section id="science" style={{ background: 'var(--linen)', padding: '0' }}>
      <div style={{ padding: isMobile ? '4rem 1.4rem 2.5rem' : '6rem 6rem 4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Areas of Expertise
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: isMobile ? '1rem' : '4rem' }}>
          <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.15, maxWidth: 500 }}>Translating <em style={{ fontStyle: 'italic' }}>MSC science</em> into clinical evidence</h2>
          <p style={{ color: 'var(--navy-dim)', fontSize: isMobile ? '0.88rem' : '0.92rem', maxWidth: 280, textAlign: isMobile ? 'left' : 'right', lineHeight: 1.75 }}>Three integrated pillars spanning fundamental research through clinical delivery.</p>
        </div>
      </div>
      {cards.map((c, i) => {
        const isEven = i % 2 === 0
        const img = TECH_IMGS[i % TECH_IMGS.length]
        const textBlock = (
          <div style={{ padding: isMobile ? '2.2rem 1.4rem' : '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: isEven ? 'var(--cream)' : 'var(--linen)' }}>
            <div className="serif" style={{ fontSize: isMobile ? '2.6rem' : '4rem', fontWeight: 300, color: 'rgba(28,61,74,0.06)', lineHeight: 1, marginBottom: '0.8rem' }}>{c.number}</div>
            <h3 className="serif" style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 300, marginBottom: '1rem', color: 'var(--navy)' }}>{c.title}</h3>
            {Array.isArray(c.bullets) && c.bullets.length > 0 ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {c.bullets.map((b: string, bi: number) => (
                  <li key={bi} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--navy)', opacity: 0.5, flexShrink: 0, marginTop: '0.45rem' }} />
                    <span style={{ fontSize: isMobile ? '0.86rem' : '0.92rem', color: 'var(--navy-dim)', lineHeight: 1.7 }}>{b}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: isMobile ? '0.86rem' : '0.95rem', color: 'var(--navy-dim)', lineHeight: 1.8 }}>{c.description}</p>
            )}
          </div>
        )
        const imgBlock = (
          <div style={{ height: isMobile ? 220 : 380, overflow: 'hidden' }}>
            <img src={img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7)', display: 'block', transition: 'transform 0.9s ease' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
            />
          </div>
        )
        return (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: '1px solid rgba(28,61,74,0.07)' }}>
            {isMobile ? (<>{imgBlock}{textBlock}</>) : (isEven ? (<>{imgBlock}{textBlock}</>) : (<>{textBlock}{imgBlock}</>))}
          </div>
        )
      })}
    </section>
  )
}

// ─── PIPELINE ────────────────────────────────
function Pipeline({ programs }: { programs: any[] }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile(760)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const STATUS: Record<string, { bg: string; color: string }> = {
    'Active':    { bg: 'var(--navy)', color: 'var(--cream)' },
    'Completed': { bg: 'rgba(28,61,74,0.12)', color: 'var(--navy)' },
    'Recruiting':{ bg: '#1A1200', color: '#E8B060' },
    'Planned':   { bg: 'rgba(28,61,74,0.1)', color: 'var(--navy-mid)' },
  }
  const rowHover = (e: React.MouseEvent, enter: boolean) => {
    const el = e.currentTarget as HTMLElement
    el.style.background = enter ? 'rgba(28,61,74,0.025)' : 'transparent'
  }
  return (
    <section id="pipeline" style={{ background: 'var(--cream)', padding: isMobile ? '4rem 1.4rem' : '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Clinical Programmes
        </div>
        <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: isMobile ? '2rem' : '4rem' }}>
          Translating science into <em style={{ fontStyle: 'italic' }}>clinical reality</em>
        </h2>
        <div ref={ref}>
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 140px', gap: '2rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(28,61,74,0.14)' }}>
              {['Programme', 'Development Stage', 'Indication', 'Status'].map(h => (
                <div key={h} style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--navy-dim)', fontWeight: 400 }}>{h}</div>
              ))}
            </div>
          )}
          {programs.map((p, i) => {
            const st = STATUS[p.status] || STATUS['Planned']
            const href = p.slug ? `/pipeline/${p.slug}` : undefined
            if (isMobile) {
              const Inner = (
                <div style={{ padding: '1.6rem 0.6rem', borderBottom: '1px solid rgba(28,61,74,0.08)', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(16px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.2}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div>
                      <div className="serif" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--navy)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--navy-dim)', marginTop: '0.1rem' }}>{p.subtitle}</div>
                    </div>
                    <span style={{ display: 'inline-block', padding: '0.28rem 0.8rem', borderRadius: 100, fontSize: '0.68rem', letterSpacing: '0.03em', background: st.bg, color: st.color, flexShrink: 0 }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--navy-mid)', marginBottom: '0.7rem' }}>{p.indication}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-dim)', marginBottom: '0.5rem' }}>{p.phase}</div>
                  <div style={{ height: 3, background: 'rgba(28,61,74,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--navy)', borderRadius: 2, width: vis ? `${p.phasePercent}%` : '0%', transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.6}s` }} />
                  </div>
                  {href && <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: 'var(--navy-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>Learn more →</div>}
                </div>
              )
              return href
                ? <a key={p.id} href={href} style={{ display: 'block', textDecoration: 'none' }}>{Inner}</a>
                : <div key={p.id}>{Inner}</div>
            }
            const RowInner = (
              <>
                <div>
                  <div className="serif" style={{ fontSize: '1.15rem', fontWeight: 400, color: 'var(--navy)', marginBottom: '0.25rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--navy-dim)' }}>{p.subtitle}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--navy-dim)', marginBottom: '0.5rem', fontWeight: 400 }}>{p.phase}</div>
                  <div style={{ height: 3, background: 'rgba(28,61,74,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--navy)', borderRadius: 2, width: vis ? `${p.phasePercent}%` : '0%', transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.6}s` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    {['Pre-clinical', 'Phase I', 'Phase II', 'Phase III'].map(ph => (
                      <span key={ph} style={{ fontSize: '0.62rem', color: 'var(--navy-dim)', letterSpacing: '0.03em' }}>{ph}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--navy-mid)', fontWeight: 300 }}>{p.indication}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: 100, fontSize: '0.72rem', letterSpacing: '0.04em', background: st.bg, color: st.color }}>{p.status}</span>
                  {href && <span style={{ fontSize: '0.72rem', color: 'var(--navy-dim)', opacity: 0, transition: 'opacity 0.2s' }} className="pipeline-arrow">→</span>}
                </div>
              </>
            )
            const rowStyle: React.CSSProperties = {
              display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 140px', gap: '2rem',
              alignItems: 'center', padding: '2rem 0.6rem', borderBottom: '1px solid rgba(28,61,74,0.06)',
              opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(-20px)',
              transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.2}s`,
              textDecoration: 'none', borderRadius: 4,
            }
            return href
              ? <a key={p.id} href={href} style={{ ...rowStyle, cursor: 'pointer' }}
                  onMouseEnter={e => { rowHover(e, true); const arr = (e.currentTarget as HTMLElement).querySelector('.pipeline-arrow') as HTMLElement; if (arr) arr.style.opacity = '1' }}
                  onMouseLeave={e => { rowHover(e, false); const arr = (e.currentTarget as HTMLElement).querySelector('.pipeline-arrow') as HTMLElement; if (arr) arr.style.opacity = '0' }}
                >{RowInner}</a>
              : <div key={p.id} style={rowStyle}>{RowInner}</div>
          })}
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.82rem', color: 'var(--navy-dim)', lineHeight: 1.7 }}>
          All programmes listed are investigator-initiated clinical trials conducted in collaboration with academic and clinical partners. Programme names are for identification purposes only and do not represent marketed products.
        </p>
      </div>
    </section>
  )
}

// ─── QUOTE BAND ────────────────────────────────
function QuoteBand() {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile(860)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative', height: isMobile ? 360 : 500, overflow: 'hidden' }}>
      <img src="https://images.pexels.com/photos/3825569/pexels-photo-3825569.jpeg?auto=compress&cs=tinysrgb&w=1600" alt=""
        style={{ width: '100%', height: '110%', objectFit: 'cover', filter: 'brightness(0.25) saturate(0.4)', display: 'block', marginTop: '-5%', transition: 'transform 0.1s linear' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(28,61,74,0.4) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 1.6rem' : '0 10rem', textAlign: 'center', gap: isMobile ? '1.2rem' : '1.8rem' }}>
        <div style={{ width: vis ? 60 : 0, height: 1, background: 'rgba(245,240,232,0.35)', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        <p className="serif" style={{
          fontSize: isMobile ? 'clamp(1.3rem,6vw,1.7rem)' : 'clamp(1.8rem,3vw,3rem)', fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(245,240,232,0.92)', lineHeight: 1.35, maxWidth: 820,
          opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)',
          transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s',
        }}>
          "We discover. We translate. We advance cell therapies — one scientific insight at a time."
        </p>
        <div style={{ opacity: vis ? 1 : 0, transition: 'opacity 1s 0.7s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 1, height: 24, background: 'rgba(245,240,232,0.2)' }} />
          <div style={{ fontSize: isMobile ? '0.66rem' : '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.65)', textAlign: 'center' }}>Dr. Nadir Kadri — Founder, SAIHTEC AB</div>
        </div>
        <div style={{ width: vis ? 60 : 0, height: 1, background: 'rgba(245,240,232,0.35)', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s' }} />
      </div>
    </div>
  )
}

// ─── TEAM ────────────────────────────────────
function Team({ team }: { team: any[] }) {
  const isMobile = useIsMobile(860)
  return (
    <section id="team" style={{ background: 'var(--linen)', padding: isMobile ? '4rem 1.4rem' : '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Scientific Leadership
        </div>
        <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: isMobile ? '2rem' : '4rem' }}>
          The science behind <em style={{ fontStyle: 'italic' }}>SAIHTEC</em>
        </h2>
        {team[0] && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', background: 'var(--navy)', borderRadius: 20, overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', minHeight: isMobile ? 220 : 380 }}>
              <img src={team[0].photoUrl || '/nadir_kadri_pp.png'} alt={team[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom, transparent 40%, var(--navy) 100%)' : 'linear-gradient(to right, transparent 55%, var(--navy) 100%)' }} />
            </div>
            <div style={{ padding: isMobile ? '1.8rem 1.4rem' : '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.3rem' }}>
              <div>
                <div className="serif" style={{ fontSize: isMobile ? '1.35rem' : '1.6rem', fontWeight: 400, color: 'var(--cream)', marginBottom: '0.3rem' }}>{team[0].name}</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.65)' }}>{team[0].title}</div>
              </div>
              <p style={{ fontSize: isMobile ? '0.86rem' : '0.9rem', color: 'rgba(245,240,232,0.82)', lineHeight: 1.8 }}>{team[0].bio}</p>
              {team[0].linkedinUrl && (
                <a href={team[0].linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'rgba(214,228,232,0.65)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ice)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(214,228,232,0.65)')}
                >LinkedIn profile</a>
              )}
            </div>
          </div>
        )}
        {team.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '1.3rem' }}>
            {team.slice(1).map((m, i) => (
              <div key={m.id} style={{ border: '1px solid rgba(28,61,74,0.08)', borderRadius: 14, overflow: 'hidden', background: 'var(--cream)', transition: 'all 0.35s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ height: 180, background: 'var(--ice-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="serif" style={{ fontSize: '2rem', color: 'var(--navy-dim)', opacity: 0.5 }}>{m.initials}</div>
                </div>
                <div style={{ padding: '1.4rem' }}>
                  <div className="serif" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--navy)', marginBottom: '0.2rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.74rem', letterSpacing: '0.06em', color: 'var(--navy-dim)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>{m.title}</div>
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
  const isMobile = useIsMobile(700)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <section id="publications" style={{ background: 'var(--cream)', padding: isMobile ? '4rem 1.4rem' : '8rem 6rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: isMobile ? '2rem' : '3rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
              <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Research Output
            </div>
            <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300 }}>Selected <em style={{ fontStyle: 'italic' }}>publications</em></h2>
          </div>
          <a href="https://orcid.org/0000-0003-2623-4094" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--navy-dim)', textDecoration: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', paddingBottom: '0.2rem', transition: 'color 0.3s, border-color 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy-dim)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.15)' }}
          >View all on ORCID</a>
        </div>
        <div ref={ref}>
          {publications.map((p, i) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '60px 1fr 80px', gap: isMobile ? '0.4rem' : '2rem', alignItems: isMobile ? 'flex-start' : 'start', padding: isMobile ? '1.4rem 0' : '1.8rem 0', borderBottom: '1px solid rgba(28,61,74,0.06)', textDecoration: 'none', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(16px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s` }}>
              <div className="serif" style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--navy)', order: isMobile ? -1 : 0 }}>{p.year}</div>
              <div>
                <div className="serif" style={{ fontSize: isMobile ? '0.95rem' : '1rem', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.45, marginBottom: '0.4rem' }}>{p.title}</div>
                <div style={{ fontSize: isMobile ? '0.76rem' : '0.8rem', color: 'var(--navy-dim)' }}>{p.authors} — <em>{p.journal}</em></div>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right', fontSize: '0.78rem', color: 'var(--navy-dim)', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--navy-dim)')}
              >{p.urlType}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── NEWS SECTION ────────────────────────────────
function NewsSection({ news }: { news: any[] }) {
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile(860)
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
  ]

  const CAT_STYLE: Record<string, { bg: string; color: string }> = {
    'Clinical Trial': { bg: 'var(--navy)', color: 'var(--cream)' },
    'Publication':    { bg: 'rgba(28,61,74,0.08)', color: 'var(--navy)' },
    'Partnership':    { bg: 'rgba(28,61,74,0.08)', color: 'var(--navy)' },
    'Press Release':  { bg: 'rgba(28,61,74,0.06)', color: 'var(--navy-dim)' },
    'Company News':   { bg: 'var(--navy)', color: 'var(--cream)' },
  }

  if (!news || news.length === 0) return null

  const featured = news[0]
  const rest = news.slice(1, 4)

  return (
    <section id="news" style={{ background: 'var(--linen)', padding: isMobile ? '4rem 0' : '8rem 0' }}>
      <div style={{ padding: isMobile ? '0 1.4rem' : '0 6rem', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: isMobile ? '2rem' : '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />News & Updates
          </div>
          <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300 }}>
            Latest <em style={{ fontStyle: 'italic' }}>news</em>
          </h2>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: '2px', marginBottom: '2px' }}>
          <a href={`/news/${featured.slug}`} style={{
            display: 'block', textDecoration: 'none',
            position: 'relative', overflow: 'hidden', height: isMobile ? 340 : 520,
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
            <div style={{ position: 'absolute', bottom: isMobile ? '1.4rem' : '2.5rem', left: isMobile ? '1.4rem' : '2.5rem', right: isMobile ? '1.4rem' : '2.5rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {featured.category && <span style={{ padding: '0.25rem 0.85rem', borderRadius: 100, fontSize: '0.68rem', letterSpacing: '0.06em', background: 'rgba(245,240,232,0.15)', color: 'rgba(245,240,232,0.9)', backdropFilter: 'blur(8px)' }}>{featured.category}</span>}
                <span style={{ fontSize: '0.74rem', color: 'rgba(245,240,232,0.72)' }}>{featured.date}</span>
              </div>
              <h3 className="serif" style={{ fontSize: isMobile ? '1.2rem' : 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.25, marginBottom: '0.7rem' }}>{featured.title}</h3>
              <p style={{ fontSize: '0.87rem', color: 'rgba(245,240,232,0.78)', lineHeight: 1.7 }}>{featured.excerpt}</p>
              <div style={{ marginTop: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(245,240,232,0.88)', borderBottom: '1px solid rgba(245,240,232,0.45)', paddingBottom: '0.2rem' }}>Read article →</div>
            </div>
          </a>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'column', gap: '2px' }}>
            {rest.slice(0,3).map((article, i) => {
              const cat = CAT_STYLE[article.category] || CAT_STYLE['Company News']
              const imgSrc = article.coverImage || LAB_IMGS[(i + 1) % LAB_IMGS.length]
              return (
                <a key={article.id} href={`/news/${article.slug}`} style={{
                  display: 'block', textDecoration: 'none',
                  flex: 1, position: 'relative', overflow: 'hidden', minHeight: isMobile ? 130 : 168,
                  opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)',
                  transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${0.12 + i * 0.1}s`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1.06)' }}
                onMouseLeave={e => { const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1)' }}
                >
                  <img src={imgSrc} alt={article.title}
                    style={{ width: '100%', height: '120%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.7)', display: 'block', marginTop: '-10%', transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,61,74,0.75) 0%, rgba(28,61,74,0.3) 60%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, padding: isMobile ? '1.1rem 1.3rem' : '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {article.category && <span style={{ padding: '0.2rem 0.7rem', borderRadius: 100, fontSize: '0.62rem', letterSpacing: '0.06em', background: 'rgba(245,240,232,0.12)', color: 'rgba(245,240,232,0.85)', backdropFilter: 'blur(6px)' }}>{article.category}</span>}
                      <span style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.4)' }}>{article.date}</span>
                    </div>
                    <h4 className="serif" style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.35 }}>{article.title}</h4>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ────────────────────────────────────
function FAQ({ data }: { data: any }) {
  const [open, setOpen] = useState<string | null>(null)
  const isMobile = useIsMobile(700)
  if (!data?.items?.length) return null
  return (
    <section id="faq" style={{ background: 'var(--cream)', padding: isMobile ? '4rem 1.4rem' : '8rem 6rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--navy)', opacity: 0.5 }} />{data.tagline}
        </div>
        <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(2rem,8vw,2.6rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, marginBottom: isMobile ? '2rem' : '3rem' }}>
          Common <em style={{ fontStyle: 'italic' }}>questions</em>
        </h2>
        {data.items.map((item: any) => (
          <div key={item.id} style={{ borderTop: '1px solid rgba(28,61,74,0.07)' }}>
            <button onClick={() => setOpen(open === item.id ? null : item.id)} style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '1.2rem 0' : '1.5rem 0', textAlign: 'left', gap: '1.2rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span className="serif" style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.35 }}>{item.q}</span>
              <span style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid rgba(28,61,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', color: open === item.id ? 'var(--cream)' : 'var(--navy-dim)', background: open === item.id ? 'var(--navy)' : 'transparent', transform: open === item.id ? 'rotate(45deg)' : 'none', transition: 'all 0.3s ease' }}>+</span>
            </button>
            <div style={{ maxHeight: open === item.id ? 600 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
              <p style={{ paddingBottom: '1.5rem', color: 'var(--navy-dim)', fontSize: isMobile ? '0.86rem' : '0.93rem', lineHeight: 1.85 }}>{item.a}</p>
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
  const isMobile = useIsMobile(860)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setLoading(false); setSent(true)
  }
  const inp: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', padding: '0.85rem 0', color: 'var(--navy)', fontSize: '0.93rem', fontFamily: 'inherit', outline: 'none', fontWeight: 300, transition: 'border-color 0.3s' }
  return (
    <section id="contact" style={{ background: 'var(--navy)', padding: '0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : 640 }}>
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? 220 : 500 }}>
          <img src="https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=900" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) brightness(0.6)', display: 'block', position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom, transparent 30%, var(--navy) 100%)' : 'linear-gradient(to right, transparent 50%, var(--navy) 100%)' }} />
          <div style={{ position: 'absolute', bottom: isMobile ? '1.6rem' : '4rem', left: isMobile ? '1.6rem' : '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.65)', marginBottom: '0.8rem' }}>
              <span style={{ display: 'block', width: 18, height: 1, background: 'rgba(214,228,232,0.4)' }} />Get in touch
            </div>
            <h2 className="serif" style={{ fontSize: isMobile ? 'clamp(1.8rem,8vw,2.4rem)' : 'clamp(2.5rem,4vw,4rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.15 }}>
              Ready to<br /><em style={{ fontStyle: 'italic', color: 'rgba(214,228,232,0.78)' }}>collaborate?</em>
            </h2>
          </div>
        </div>
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '6rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[{ label: 'Email', val: email }, { label: 'Location', val: 'Stockholm, Sweden' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.2rem', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.67rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.62)', width: 60, flexShrink: 0 }}>{item.label}</span>
                <span style={{ fontSize: '0.92rem', color: 'rgba(245,240,232,0.88)', wordBreak: 'break-word' }}>{item.val}</span>
              </div>
            ))}
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(214,228,232,0.08)', marginBottom: '2rem' }} />
          {sent ? (
            <div>
              <div className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '0.5rem' }}>Message received.</div>
              <p style={{ color: 'rgba(214,228,232,0.72)', fontSize: '0.9rem' }}>We will respond within two business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[{ l: 'Full Name', k: 'name', t: 'text', p: 'Dr. Jane Smith' }, { l: 'Email Address', k: 'email', t: 'email', p: 'jane@institution.edu' }].map(field => (
                <div key={field.k}>
                  <label style={{ display: 'block', fontSize: '0.67rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.62)', marginBottom: '0.3rem' }}>{field.l}</label>
                  <input type={field.t} placeholder={field.p} value={(form as any)[field.k]} onChange={e => setForm(f => ({ ...f, [field.k]: e.target.value }))} required style={{ ...inp, color: 'var(--cream)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(214,228,232,0.4)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,61,74,0.15)')} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.67rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.62)', marginBottom: '0.3rem' }}>Inquiry Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inp, cursor: 'pointer', color: 'var(--cream)' }}>
                  {['General Inquiry', 'Research Collaboration', 'Clinical Partnership', 'Investor Relations', 'Press & Media'].map(o => <option key={o} style={{ background: 'var(--navy)' }}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.67rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.62)', marginBottom: '0.3rem' }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} required placeholder="Tell us about your project or inquiry..." style={{ ...inp, resize: 'vertical', color: 'var(--cream)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(214,228,232,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,61,74,0.15)')} />
              </div>
              <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: 'var(--cream)', color: 'var(--navy)', border: 'none', borderRadius: 100, padding: '0.95rem 2.5rem', fontSize: '0.88rem', fontWeight: 400, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', transition: 'all 0.3s ease', width: isMobile ? '100%' : 'fit-content' }}
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
  const isMobile = useIsMobile(700)
  const cols = [
    { title: 'Company', links: [{ label: 'About', href: '#about' }, { label: 'Scientific Leadership', href: '#team' }, { label: 'Areas of Expertise', href: '#science' }] },
    { title: 'Research', links: [{ label: 'Clinical Programmes', href: '#pipeline' }, { label: 'Publications', href: '#publications' }, { label: 'News', href: '#news' }] },
    { title: 'Legal', links: [{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'Terms of Use', href: '/terms' }] },
  ]
  return (
    <footer style={{ background: '#0A1A22', padding: isMobile ? '3rem 1.4rem 2rem' : '4.5rem 6rem 3rem', borderTop: '1px solid rgba(214,228,232,0.05)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? '2rem' : '4rem', marginBottom: isMobile ? '2rem' : '3.5rem' }}>
        <div>
          <Logo size={46} light />
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.86rem', lineHeight: 1.8, maxWidth: 280, marginTop: '1.2rem' }}>
            SAIHTEC AB — a Swedish biotechnology company translating mesenchymal stromal cell (MSC) science from discovery to clinical application.
          </p>
          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'rgba(214,228,232,0.48)', letterSpacing: '0.04em' }}>nadir.kadri@ki.se</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : undefined, gap: isMobile ? '1.5rem' : 0, gridColumn: isMobile ? '1' : undefined }}>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,228,232,0.5)', marginBottom: '1rem' }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} style={{ color: 'rgba(245,240,232,0.52)', fontSize: '0.86rem', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.88)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.52)')}
                    >{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(214,228,232,0.06)', paddingTop: '1.6rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.5rem' : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
        <span style={{ color: 'rgba(214,228,232,0.42)', fontSize: '0.76rem' }}>© 2026 SAIHTEC AB. All rights reserved.</span>
        <span style={{ color: 'rgba(214,228,232,0.32)', fontSize: '0.74rem' }}>Stockholm, Sweden · Developed by Baina Agency</span>
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
      <main style={{ overflowX: 'hidden' }}>
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
  try {
    const content = readContent()
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
          media: null, events: null, science_team: null, investors: null, collaborations: null,
        }
      }
    }
  } catch (error) {
    console.error('getServerSideProps error:', error)
    return {
      props: {
        content: {
          settings: { heroTagline: 'Stockholm, Sweden', heroTitle: 'The future of cellular therapy starts here.', heroSubtitle: 'SAIHTEC AB translates MSC science from discovery to clinical application.', heroVideoUrl: 'https://videos.pexels.com/video-files/8325997/8325997-hd_1920_1080_30fps.mp4', stats: [], seoTitle: 'SAIHTEC AB', seoDescription: 'SAIHTEC AB', contactEmail: 'nadir.kadri@ki.se' },
          about: { tagline: 'Who we are', title: 'SAIHTEC AB', highlightQuote: '', body: '', certifications: [], vision: '', mission: '' },
          technology: [], pipeline: [], team: [], publications: [], news: [], faq: null,
          media: null, events: null, science_team: null, investors: null, collaborations: null,
        }
      }
    }
  }
}