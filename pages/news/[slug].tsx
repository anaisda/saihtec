import React, { useEffect, useState, useRef } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { readContent } from '@/lib/db'

// ─── VIDEO HELPER ─────────────────────────────────────
function getVideoInfo(url: string): { type: 'youtube' | 'vimeo' | 'direct' | null; src: string } {
  if (!url) return { type: null, src: '' }
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/)
  if (yt) return { type: 'youtube', src: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&autoplay=0` }
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
        {info.type === 'direct' ? (
          <video src={info.src} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <iframe src={info.src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        )}
      </div>
      {caption && <figcaption style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--stone)', textAlign: 'center', fontStyle: 'italic' }}>{caption}</figcaption>}
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
                {block.caption && <figcaption style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--stone)', textAlign: 'center', fontStyle: 'italic' }}>{block.caption}</figcaption>}
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
        <div style={{ fontSize: '0.46rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: light ? 'rgba(214,228,232,0.45)' : 'var(--stone)', fontWeight: 300 }}>Nordic Cell Innovations</div>
      </div>
    </div>
  )
}

// ─── NAVBAR ────────────────────────────────────────────
function ArticleNav() {
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
        <a href="/#news" style={{ fontSize: '0.82rem', color: 'var(--navy-dim)', fontWeight: 300, letterSpacing: '0.02em', textDecoration: 'none', padding: '0.5rem 0.7rem', borderRadius: 100, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(28,61,74,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--navy-dim)' }}
        >← All news</a>
        <a href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--navy)', color: 'var(--cream)', padding: '0.55rem 1.2rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 400, textDecoration: 'none', letterSpacing: '0.02em', transition: 'all 0.3s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-mid)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
        >Get in touch</a>
      </div>
    </nav>
  )
}

// ─── FOOTER ────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#0A1A22', padding: '3rem 2rem', borderTop: '1px solid rgba(214,228,232,0.05)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', textAlign: 'center' }}>
        <Logo light />
        <p style={{ color: 'rgba(245,240,232,0.25)', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: 360 }}>
          SAIHTEC AB — Swedish biotechnology translating MSC science to clinical application.
        </p>
        <div style={{ borderTop: '1px solid rgba(214,228,232,0.06)', paddingTop: '1.2rem', width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ color: 'rgba(214,228,232,0.18)', fontSize: '0.74rem' }}>© 2026 SAIHTEC AB. All rights reserved.</span>
          <span style={{ color: 'rgba(214,228,232,0.12)', fontSize: '0.72rem' }}>Stockholm, Sweden · Developed by Baina Agency</span>
        </div>
      </div>
    </footer>
  )
}

// ─── RELATED ARTICLES ──────────────────────────────────
function RelatedArticles({ articles }: { articles: any[] }) {
  if (!articles.length) return null
  return (
    <section style={{ background: 'var(--linen)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '2rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: 'var(--navy)', opacity: 0.5 }} />More articles
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(articles.length, 3)}, 1fr)`, gap: '1.2rem' }}>
          {articles.slice(0, 3).map((a) => (
            <a key={a.id} href={`/news/${a.slug}`} style={{ display: 'block', textDecoration: 'none', borderRadius: 14, overflow: 'hidden', background: 'var(--cream)', border: '1px solid rgba(28,61,74,0.08)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.08)' }}
            >
              {a.coverImage && (
                <div style={{ height: 160, overflow: 'hidden' }}>
                  <img src={a.coverImage} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7)', display: 'block', transition: 'transform 0.6s ease' }} />
                </div>
              )}
              <div style={{ padding: '1.2rem' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--stone)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{a.category} · {a.date}</div>
                <h4 className="serif" style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.4 }}>{a.title}</h4>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ARTICLE PAGE ──────────────────────────────────────
interface Props {
  article: any
  related: any[]
  settings: any
}

export default function ArticlePage({ article, related, settings }: Props) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  const heroVideo = getVideoInfo(article.videoUrl || '')
  const hasBlocks = article.blocks && article.blocks.length > 0
  const hasContent = hasBlocks || (article.body && article.body.trim())

  const CAT_COLORS: Record<string, string> = {
    'Clinical Trial': 'rgba(28,61,74,0.9)',
    'Publication': 'rgba(28,61,74,0.7)',
    'Partnership': 'rgba(28,61,74,0.8)',
    'Company News': 'rgba(28,61,74,0.9)',
    'Press Release': 'rgba(28,61,74,0.6)',
  }

  return (
    <>
      <Head>
        <title>{article.title} — SAIHTEC AB</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.coverImage && <meta property="og:image" content={article.coverImage} />}
        <link rel="icon" href="/logo.png" />
      </Head>

      <ArticleNav />

      <main style={{ overflowX: 'hidden', background: 'var(--cream)' }}>

        {/* ── Hero ── */}
        <div style={{ position: 'relative', height: heroVideo.type ? 'auto' : 560, minHeight: 420, overflow: heroVideo.type ? 'visible' : 'hidden' }}>

          {/* Cover image or video background */}
          {heroVideo.type ? (
            <div style={{ paddingTop: '5rem', background: 'var(--navy)' }}>
              <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem 0' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.25rem 0.9rem', borderRadius: 100, fontSize: '0.68rem', letterSpacing: '0.06em', background: 'rgba(245,240,232,0.12)', color: 'rgba(245,240,232,0.85)', backdropFilter: 'blur(8px)' }}>{article.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.4)' }}>{article.date}</span>
                </div>
                <h1 className="serif" style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: '1.2rem', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>{article.title}</h1>
                {article.excerpt && <p className="serif" style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'rgba(214,228,232,0.7)', lineHeight: 1.65, maxWidth: 660 }}>{article.excerpt}</p>}
              </div>
              <div style={{ maxWidth: 900, margin: '2rem auto 0', padding: '0 2rem' }}>
                <VideoEmbed url={article.videoUrl} />
              </div>
            </div>
          ) : (
            <>
              {article.coverImage && (
                <img src={article.coverImage} alt={article.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.6)', display: 'block' }} />
              )}
              {!article.coverImage && <div style={{ position: 'absolute', inset: 0, background: 'var(--navy)' }} />}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,61,74,0.9) 0%, rgba(28,61,74,0.4) 50%, rgba(28,61,74,0.25) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(1.5rem,5vw,4rem)', paddingTop: '7rem', maxWidth: 900, margin: '0 auto', width: '100%', left: 0, right: 0 }}>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.25rem 0.9rem', borderRadius: 100, fontSize: '0.68rem', letterSpacing: '0.06em', background: 'rgba(245,240,232,0.12)', color: 'rgba(245,240,232,0.85)', backdropFilter: 'blur(8px)' }}>{article.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.45)' }}>{article.date}</span>
                </div>
                <h1 className="serif" style={{
                  fontSize: 'clamp(1.8rem,5vw,3.4rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: '1rem',
                  opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
                  transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
                }}>{article.title}</h1>
                {article.excerpt && (
                  <p className="serif" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(214,228,232,0.72)', lineHeight: 1.65, maxWidth: 640 }}>{article.excerpt}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Article body ── */}
        {hasContent && (
          <article style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.2rem,4vw,2rem)' }}>
            <BlockRenderer blocks={article.blocks} body={article.body} />
          </article>
        )}

        {/* ── Placeholder if no content ── */}
        {!hasContent && (
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--stone)', fontSize: '0.92rem' }}>Full article coming soon.</p>
          </div>
        )}

        {/* ── Back link ── */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 2rem 4rem' }}>
          <a href="/#news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--navy-dim)', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid rgba(28,61,74,0.15)', paddingBottom: '0.15rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy-dim)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,61,74,0.15)' }}
          >← Back to all news</a>
        </div>

        <RelatedArticles articles={related} />
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string
    const content = readContent()
    const news: any[] = content.news || []
    const article = news.find((n: any) => n.slug === slug)
    if (!article) return { notFound: true }
    const related = news.filter((n: any) => n.id !== article.id)
    return { props: { article, related, settings: content.settings || {} } }
  } catch {
    return { notFound: true }
  }
}
