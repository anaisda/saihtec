import React, { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { readContent } from '@/lib/db'

// ─── VIDEO HELPER ─────────────────────────────────────
function getVideoInfo(url: string): { type: 'youtube' | 'vimeo' | 'direct' | null; src: string } {
  if (!url) return { type: null, src: '' }
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/)
  if (yt) return { type: 'youtube', src: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1` }
  const vi = url.match(/vimeo\.com\/(\d+)/)
  if (vi) return { type: 'vimeo', src: `https://player.vimeo.com/video/${vi[1]}` }
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: 'direct', src: url }
  return { type: null, src: '' }
}

function VideoEmbed({ url, caption }: { url: string; caption?: string }) {
  const info = getVideoInfo(url)
  if (!info.type) return null
  return (
    <figure style={{ margin: '2.5rem 0' }}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000', borderRadius: 12, overflow: 'hidden' }}>
        {info.type === 'direct'
          ? <video src={info.src} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
          : <iframe src={info.src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        }
      </div>
      {caption && <figcaption style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--navy-dim)', textAlign: 'center', fontStyle: 'italic' }}>{caption}</figcaption>}
    </figure>
  )
}

// ─── BLOCK RENDERER ────────────────────────────────────
function BlockRenderer({ blocks, body }: { blocks?: any[]; body?: string }) {
  if (blocks && blocks.length > 0) {
    return (
      <>
        {blocks.map((block: any, i: number) => {
          if (block.type === 'text') {
            return (
              <div key={i}>
                {(block.content || '').split(/\n\n+/).filter(Boolean).map((para: string, pi: number) => (
                  <p key={pi} style={{ fontSize: '1.05rem', color: 'var(--navy-dim)', lineHeight: 1.9, marginBottom: '1.4rem', fontWeight: 300 }}>{para}</p>
                ))}
              </div>
            )
          }
          if (block.type === 'image') {
            return (
              <figure key={i} style={{ margin: '2.5rem 0' }}>
                <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <img src={block.url} alt={block.caption || ''} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                {block.caption && <figcaption style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--navy-dim)', textAlign: 'center', fontStyle: 'italic' }}>{block.caption}</figcaption>}
              </figure>
            )
          }
          if (block.type === 'video') {
            return <VideoEmbed key={i} url={block.url} caption={block.caption} />
          }
          return null
        })}
      </>
    )
  }
  if (body) {
    return (
      <>
        {body.split(/\n\n+/).filter(Boolean).map((para, i) => (
          <p key={i} style={{ fontSize: '1.05rem', color: 'var(--navy-dim)', lineHeight: 1.9, marginBottom: '1.4rem', fontWeight: 300 }}>{para}</p>
        ))}
      </>
    )
  }
  return null
}

// ─── LOGO ─────────────────────────────────────────────
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${light ? 'rgba(214,228,232,0.3)' : 'rgba(28,61,74,0.15)'}`, flexShrink: 0 }}>
        <img src="/logo.png" alt="SAIHTEC" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontFamily: 'Cormorant,serif', fontSize: '1.15rem', fontWeight: 500, color: light ? 'var(--cream)' : 'var(--navy)', letterSpacing: '0.14em' }}>SAIHTEC</div>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: light ? 'rgba(214,228,232,0.6)' : 'var(--navy-dim)', fontWeight: 300 }}>Nordic Cell Innovations</div>
      </div>
    </div>
  )
}

// ─── NAVBAR ────────────────────────────────────────────
function PipelineNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 990, padding: '1.1rem 2rem', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.5rem', pointerEvents: 'all',
        background: scrolled ? 'rgba(245,240,232,0.97)' : 'rgba(245,240,232,0.88)',
        backdropFilter: 'blur(24px)', borderRadius: 100,
        border: '1px solid rgba(28,61,74,0.1)',
        boxShadow: scrolled ? '0 8px 40px rgba(28,61,74,0.12)' : '0 4px 24px rgba(28,61,74,0.08)',
        padding: '0.4rem 0.6rem 0.4rem 1rem',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}><Logo /></a>
        <div style={{ width: 1, height: 18, background: 'rgba(28,61,74,0.12)' }} />
        <a href="/#pipeline" style={{ fontSize: '0.82rem', color: 'var(--navy-dim)', fontWeight: 300, letterSpacing: '0.02em', textDecoration: 'none', padding: '0.5rem 0.7rem', borderRadius: 100, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(28,61,74,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--navy-dim)' }}
        >← Pipeline</a>
        <a href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--navy)', color: 'var(--cream)', padding: '0.55rem 1.2rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 400, textDecoration: 'none', transition: 'all 0.3s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-mid)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
        >Get in touch</a>
      </div>
    </nav>
  )
}

// ─── PHASE BAR ─────────────────────────────────────────
function PhaseBar({ percent, phase }: { percent: number; phase: string }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t) }, [])
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'baseline' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(214,228,232,0.72)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Development stage</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 300 }}>{phase}</span>
      </div>
      <div style={{ height: 3, background: 'rgba(214,228,232,0.12)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--ice)', borderRadius: 2, width: animated ? `${percent}%` : '0%', transition: 'width 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
        {['Pre-clinical', 'Phase I', 'Phase II', 'Phase III'].map(ph => (
          <span key={ph} style={{ fontSize: '0.65rem', color: 'rgba(214,228,232,0.5)' }}>{ph}</span>
        ))}
      </div>
    </div>
  )
}

// ─── RELATED PROGRAMS ─────────────────────────────────
function RelatedPrograms({ programs }: { programs: any[] }) {
  if (!programs.length) return null
  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    'Active':    { bg: 'rgba(245,240,232,0.1)', color: 'var(--cream)' },
    'Completed': { bg: 'rgba(245,240,232,0.08)', color: 'rgba(245,240,232,0.72)' },
    'Planned':   { bg: 'rgba(245,240,232,0.06)', color: 'rgba(245,240,232,0.55)' },
  }
  return (
    <section style={{ background: 'var(--linen)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '2rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: 'var(--navy)', opacity: 0.5 }} />Other programmes
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(programs.length, 2)}, 1fr)`, gap: '1.2rem' }}>
          {programs.slice(0, 2).map(p => {
            const st = STATUS_COLORS[p.status] || STATUS_COLORS['Planned']
            return (
              <a key={p.id} href={p.slug ? `/pipeline/${p.slug}` : '/#pipeline'} style={{ display: 'block', textDecoration: 'none', borderRadius: 16, overflow: 'hidden', background: 'var(--navy)', border: '1px solid rgba(28,61,74,0.15)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(28,61,74,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                {p.coverImage && (
                  <div style={{ height: 140, overflow: 'hidden' }}>
                    <img src={p.coverImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) brightness(0.6)', display: 'block' }} />
                  </div>
                )}
                <div style={{ padding: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div className="serif" style={{ fontSize: '1.05rem', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.3 }}>{p.name}</div>
                    <span style={{ padding: '0.2rem 0.7rem', borderRadius: 100, fontSize: '0.65rem', background: st.bg, color: st.color, flexShrink: 0, marginLeft: '0.6rem' }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(214,228,232,0.65)', marginBottom: '0.4rem' }}>{p.indication}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(214,228,232,0.5)' }}>{p.phase}</div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#0A1A22', padding: '3rem 2rem', borderTop: '1px solid rgba(214,228,232,0.05)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', textAlign: 'center' }}>
        <Logo light />
        <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: 360 }}>
          SAIHTEC AB — Swedish biotechnology translating MSC science to clinical application.
        </p>
        <div style={{ borderTop: '1px solid rgba(214,228,232,0.06)', paddingTop: '1.2rem', width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ color: 'rgba(214,228,232,0.42)', fontSize: '0.74rem' }}>© 2026 SAIHTEC AB. All rights reserved.</span>
          <span style={{ color: 'rgba(214,228,232,0.32)', fontSize: '0.72rem' }}>Stockholm, Sweden · Developed by Baina Agency</span>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────
interface Props { program: any; related: any[] }

export default function PipelinePage({ program, related }: Props) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  const STATUS: Record<string, { bg: string; color: string }> = {
    'Active':    { bg: 'rgba(245,240,232,0.15)', color: 'var(--cream)' },
    'Completed': { bg: 'rgba(245,240,232,0.1)', color: 'rgba(245,240,232,0.8)' },
    'Recruiting':{ bg: 'rgba(232,176,96,0.2)', color: '#E8B060' },
    'Planned':   { bg: 'rgba(245,240,232,0.07)', color: 'rgba(245,240,232,0.6)' },
  }
  const st = STATUS[program.status] || STATUS['Planned']
  const hasContent = (program.blocks && program.blocks.length > 0) || (program.body && program.body.trim())
  const heroVideo = program.videoUrl ? program.videoUrl : null

  return (
    <>
      <Head>
        <title>{program.name} — Clinical Programmes — SAIHTEC AB</title>
        <meta name="description" content={program.summary || program.indication} />
        <link rel="icon" href="/logo.png" />
      </Head>

      <PipelineNav />

      <main style={{ overflowX: 'hidden', background: 'var(--cream)' }}>

        {/* ── Hero ── */}
        <div style={{ position: 'relative', minHeight: 480, overflow: 'hidden' }}>
          {program.coverImage && !heroVideo && (
            <img src={program.coverImage} alt={program.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.45) brightness(0.5)', display: 'block' }} />
          )}
          {!program.coverImage && !heroVideo && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--navy) 0%, #0a1e28 100%)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,61,74,0.92) 0%, rgba(28,61,74,0.55) 50%, rgba(28,61,74,0.3) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(6rem,12vw,9rem) 2rem 3.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(214,228,232,0.55)' }}>
              <a href="/" style={{ color: 'rgba(214,228,232,0.55)', textDecoration: 'none' }}>Home</a>
              <span>/</span>
              <a href="/#pipeline" style={{ color: 'rgba(214,228,232,0.55)', textDecoration: 'none' }}>Pipeline</a>
              <span>/</span>
              <span style={{ color: 'rgba(214,228,232,0.8)' }}>{program.name}</span>
            </div>

            {/* Meta badges */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ padding: '0.28rem 0.9rem', borderRadius: 100, fontSize: '0.7rem', letterSpacing: '0.06em', background: st.bg, color: st.color, backdropFilter: 'blur(8px)' }}>{program.status}</span>
              <span style={{ padding: '0.28rem 0.9rem', borderRadius: 100, fontSize: '0.7rem', background: 'rgba(245,240,232,0.08)', color: 'rgba(245,240,232,0.78)', backdropFilter: 'blur(8px)' }}>{program.indication}</span>
            </div>

            {/* Title */}
            <h1 className="serif" style={{
              fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.15,
              opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}>{program.name}</h1>

            {program.subtitle && (
              <div style={{ fontSize: '1rem', color: 'rgba(214,228,232,0.72)', fontWeight: 300 }}>{program.subtitle}</div>
            )}

            {/* Phase bar */}
            <div style={{ maxWidth: 480, marginTop: '0.5rem' }}>
              <PhaseBar percent={program.phasePercent || 0} phase={program.phase || ''} />
            </div>

            {program.summary && (
              <p className="serif" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(214,228,232,0.78)', lineHeight: 1.65, maxWidth: 640, marginTop: '0.5rem' }}>
                {program.summary}
              </p>
            )}
          </div>

          {/* Featured video below hero if present */}
          {heroVideo && (
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 2rem 3rem' }}>
              <VideoEmbed url={heroVideo} />
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {hasContent && (
          <article style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.2rem,4vw,2rem)' }}>
            <BlockRenderer blocks={program.blocks} body={program.body} />
          </article>
        )}

        {!hasContent && (
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--navy-dim)', fontSize: '0.95rem' }}>Detailed programme information coming soon.</p>
          </div>
        )}

        {/* ── Back link ── */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 2rem 4rem' }}>
          <a href="/#pipeline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--navy-dim)', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid rgba(28,61,74,0.2)', paddingBottom: '0.15rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy-dim)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.2)' }}
          >← Back to all programmes</a>
        </div>

        <RelatedPrograms programs={related} />
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string
    const content = readContent()
    const pipeline: any[] = content.pipeline || []
    const program = pipeline.find((p: any) => p.slug === slug)
    if (!program) return { notFound: true }
    const related = pipeline.filter((p: any) => p.id !== program.id)
    return { props: { program, related } }
  } catch {
    return { notFound: true }
  }
}
