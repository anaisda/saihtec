import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Select, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setNews(d.news || []))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'news', data: news }),
    })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const update = (id: string, k: string, v: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, [k]: v } : n))
  }

  const makeSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const addArticle = () => {
    const id = uuid()
    const newArticle = {
      id, title: '', slug: '', date: new Date().toISOString().split('T')[0],
      category: 'Company News', excerpt: '', body: '', coverImage: '',
    }
    setNews(prev => [newArticle, ...prev])
    setExpanded(id)
  }

  const S = { // styles
    label: { display: 'block', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' } as React.CSSProperties,
    inp: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'system-ui,sans-serif', outline: 'none' } as React.CSSProperties,
  }

  return (
    <AdminLayout title="News & Articles">
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'rgba(0,180,160,0.15)', border: '1px solid rgba(0,180,160,0.3)', borderRadius: 10, padding: '0.9rem 1.5rem', color: '#00B4A0', fontSize: '0.88rem', fontWeight: 500 }}>
          {toast}
        </div>
      )}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>
              {news.length} article{news.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button type="button" onClick={addArticle} style={{ background: 'rgba(0,180,160,0.1)', border: '1px solid rgba(0,180,160,0.25)', borderRadius: 8, padding: '0.65rem 1.4rem', color: '#00B4A0', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            + New Article
          </button>
        </div>

        {news.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: 'rgba(255,255,255,0.25)', fontSize: '0.92rem' }}>
            No articles yet. Click "New Article" to add your first post.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {news.map((article) => (
            <div key={article.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Collapsed header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === article.id ? null : article.id)}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  {/* Category pill */}
                  <span style={{ padding: '0.2rem 0.7rem', borderRadius: 100, fontSize: '0.65rem', letterSpacing: '0.06em', background: 'rgba(0,180,160,0.12)', color: '#00B4A0', flexShrink: 0 }}>
                    {article.category || 'Draft'}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title || <em style={{ color: 'rgba(255,255,255,0.3)' }}>Untitled</em>}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{article.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{expanded === article.id ? '▲' : '▼'}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); setNews(prev => prev.filter(n => n.id !== article.id)) }}
                    style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.18)', borderRadius: 6, padding: '0.3rem 0.7rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded editor */}
              {expanded === article.id && (
                <div style={{ padding: '0 1.4rem 1.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                  {/* Row 1: Title + Date + Category */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 150px 180px', gap: '0.75rem', marginBottom: '0.9rem' }}>
                    <div>
                      <label style={S.label}>Title</label>
                      <input value={article.title} onChange={e => { update(article.id, 'title', e.target.value); if (!article.slug) update(article.id, 'slug', makeSlug(e.target.value)) }} placeholder="Article title..." style={S.inp}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                    </div>
                    <div>
                      <label style={S.label}>Date</label>
                      <input type="date" value={article.date} onChange={e => update(article.id, 'date', e.target.value)} style={S.inp}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                    </div>
                    <div>
                      <label style={S.label}>Category</label>
                      <select value={article.category} onChange={e => update(article.id, 'category', e.target.value)} style={{ ...S.inp, cursor: 'pointer' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                        {['Company News', 'Clinical Trial', 'Publication', 'Partnership', 'Event', 'Press Release', 'Award'].map(c => (
                          <option key={c} style={{ background: '#0D0F12' }}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Slug */}
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={S.label}>URL Slug</label>
                    <input value={article.slug} onChange={e => update(article.id, 'slug', e.target.value)} placeholder="auto-generated-from-title" style={{ ...S.inp, fontFamily: 'monospace', fontSize: '0.82rem' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                  </div>

                  {/* Cover image */}
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={S.label}>Cover Image URL (Cloudinary, Imgur, or any direct .jpg/.png link)</label>
                    <input value={article.coverImage || ''} onChange={e => update(article.id, 'coverImage', e.target.value)} placeholder="https://..." style={S.inp}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                    {article.coverImage && (
                      <div style={{ marginTop: '0.5rem', borderRadius: 6, overflow: 'hidden', height: 100 }}>
                        <img src={article.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={S.label}>Excerpt (shown on homepage card)</label>
                    <textarea value={article.excerpt} onChange={e => update(article.id, 'excerpt', e.target.value)} rows={2} placeholder="Short summary shown on the news card..." style={{ ...S.inp, resize: 'vertical' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                  </div>

                  {/* Body */}
                  <div>
                    <label style={S.label}>Full Article Body</label>
                    <textarea value={article.body || ''} onChange={e => update(article.id, 'body', e.target.value)} rows={10} placeholder="Full article text..." style={{ ...S.inp, resize: 'vertical', lineHeight: 1.7 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}