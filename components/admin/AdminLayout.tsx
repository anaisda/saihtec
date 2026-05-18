import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
  { href: '/admin/about', label: 'About', icon: '◎' },
  { href: '/admin/technology', label: 'Technology', icon: '⬡' },
  { href: '/admin/pipeline', label: 'Pipeline', icon: '◈' },
  { href: '/admin/team', label: 'Team', icon: '◯' },
  { href: '/admin/investors', label: 'Investors', icon: '◈' },
  { href: '/admin/collaborations', label: 'Collaborations', icon: '◉' },
  { href: '/admin/science-team', label: 'Science Team', icon: '◎' },
  { href: '/admin/media', label: 'Media Hub', icon: '◻' },
  { href: '/admin/events', label: 'Events & Gallery', icon: '◈' },
  { href: '/admin/publications', label: 'Publications', icon: '◻' },
  { href: '/admin/news', label: 'News', icon: '◈' },
  { href: '/admin/faq', label: 'FAQ', icon: '?' },
  { href: '/admin/messages', label: 'Messages', icon: '✉' },
  { href: '/admin/settings/password', label: 'Change Password', icon: '🔒' },
]

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) router.push('/admin/login'); return r.json() })
      .then(d => d.user && setUser(d.user))
      .catch(() => router.push('/admin/login'))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const S = {
    sidebar: {
      width: sidebarOpen ? 240 : 64,
      minWidth: sidebarOpen ? 240 : 64,
      background: '#0D0F12',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      height: '100vh',
      position: 'sticky' as const,
      top: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'width 0.3s ease, min-width 0.3s ease',
      overflow: 'hidden',
    },
  }

  return (
    <>
      <Head><title>{title ? `${title} — SAIHTEC Admin` : 'SAIHTEC Admin'}</title></Head>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#080A0C', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          {/* Logo */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: 28, height: 28, border: '1.5px solid #00B4A0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00B4A0' }} />
            </div>
            {sidebarOpen && <span style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>SAIHTEC</span>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
            {NAV.map(item => {
              const active = router.pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 1.2rem',
                  color: active ? '#00B4A0' : 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: active ? 500 : 300,
                  background: active ? 'rgba(0,180,160,0.08)' : 'transparent',
                  borderLeft: active ? '2px solid #00B4A0' : '2px solid transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}
                >
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && item.label}
                </Link>
              )
            })}
          </nav>

          {/* User + Toggle */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {sidebarOpen && user && (
              <div style={{ marginBottom: '0.75rem', padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{user.email}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setSidebarOpen(o => !o)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '0.5rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
                {sidebarOpen ? '◀' : '▶'}
              </button>
              {sidebarOpen && (
                <button onClick={logout} style={{ flex: 1, background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.15)', borderRadius: 6, padding: '0.5rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {/* Topbar */}
          <div style={{ padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 500 }}>{title || 'Dashboard'}</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href="/" target="_blank" style={{ fontSize: '0.8rem', color: '#00B4A0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ↗ View Site
              </a>
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: '2rem', flex: 1 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}