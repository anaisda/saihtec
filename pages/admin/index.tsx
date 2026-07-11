import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card } from '@/components/admin/FormComponents'
import Link from 'next/link'

const SECTIONS = [
  { href: '/admin/settings', label: 'Site Settings', desc: 'Hero video, tagline, stats, SEO', icon: '⚙', color: '#2A5568' },
  { href: '/admin/about', label: 'About Section', desc: 'Quote, body, certifications', icon: '◎', color: '#4F7BE0' },
  { href: '/admin/technology', label: 'Technology Cards', desc: '6 science cards', icon: '⬡', color: '#9B6FF0' },
  { href: '/admin/pipeline', label: 'Pipeline Programs', desc: 'Clinical programs & phases', icon: '◈', color: '#2A5568' },
  { href: '/admin/team', label: 'Team Members', desc: 'Profiles, bios, LinkedIn', icon: '◯', color: '#4F7BE0' },
  { href: '/admin/investors', label: 'Investors', desc: 'Metrics, highlights, pitch text', icon: '◈', color: '#9B6FF0' },
  { href: '/admin/collaborations', label: 'Collaborations', desc: 'Partner cards & descriptions', icon: '◉', color: '#2A5568' },
  { href: '/admin/science-team', label: 'Science Team', desc: 'Lead scientist, disciplines', icon: '◎', color: '#4F7BE0' },
  { href: '/admin/media', label: 'Media Hub', desc: 'Publications, talks, press', icon: '◻', color: '#9B6FF0' },
  { href: '/admin/events', label: 'Events & Gallery', desc: 'Photos, featured event', icon: '◈', color: '#2A5568' },
  { href: '/admin/publications', label: 'Publications List', desc: 'Scientific papers & DOI links', icon: '◻', color: '#4F7BE0' },
  { href: '/admin/news', label: 'News & Press', desc: 'Articles & press releases', icon: '◈', color: '#9B6FF0' },
  { href: '/admin/faq', label: 'FAQ', desc: 'Questions & answers', icon: '?', color: '#2A5568' },
  { href: '/admin/messages', label: 'Messages', desc: 'Contact form submissions', icon: '✉', color: '#4F7BE0' },
]

export default function AdminDashboard() {
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(setContent).catch(() => {})
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem' }}>
          Welcome back 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
          Manage all SAIHTEC website content from here. Changes go live instantly.
        </p>
      </div>

      {/* Quick stats */}
      {content && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Team Members', value: content.team?.length || 0 },
            { label: 'Publications', value: content.publications?.length || 0 },
            { label: 'Pipeline Programs', value: content.pipeline?.length || 0 },
            { label: 'News Articles', value: content.news?.length || 0 },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '1.2rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 300, color: '#00B4A0', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Section grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '1.5rem', cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${s.color}40`; el.style.background = `${s.color}08`; el.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.background = 'rgba(255,255,255,0.02)'; el.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '0.8rem', color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff', marginBottom: '0.3rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick link to site */}
      <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(0,180,160,0.05)', border: '1px solid rgba(0,180,160,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.2rem' }}>Your website is live</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>All changes are reflected immediately on the public site.</div>
        </div>
        <a href="/" target="_blank" style={{ background: '#00B4A0', color: '#fff', padding: '0.6rem 1.4rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.83rem', fontWeight: 500 }}>
          ↗ Open Site
        </a>
      </div>
    </AdminLayout>
  )
}