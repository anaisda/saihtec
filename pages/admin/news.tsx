import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { SaveButton } from '@/components/admin/FormComponents'

// ─── TYPES ──────────────────────────────────────
type BlockType = 'text' | 'image' | 'video'
interface Block { id: string; type: BlockType; content?: string; url?: string; caption?: string }
interface Article {
  id: string; title: string; slug: string; date: string; category: string
  excerpt: string; body: string; coverImage: string; videoUrl: string; blocks: Block[]
}

// ─── SHARED STYLES ──────────────────────────────
const INP: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
  padding: '0.75rem 1rem', color: '#fff', fontSize: '0.88rem',
  fontFamily: 'system-ui,sans-serif', outline: 'none',
}
const LBL: React.CSSProperties = {
  display: 'block', fontSize: '0.68rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem',
}
const focus = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.45)')
const blur  = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')

// ─── BLOCK EDITOR ───────────────────────────────
function BlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  block: Block; onChange: (b: Block) => void; onDelete: () => void
  onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean
}) {
  const blockColors: Record<BlockType, string> = { text: '#6B8EA0', image: '#7A9E7E', video: '#9B7A9E' }
  const color = blockColors[block.type]

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.06)`, borderLeft: `3px solid ${color}40`, borderRadius: 10, padding: '1rem 1.1rem', marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color, fontWeight: 500 }}>
          {block.type === 'text' ? '¶ Text block' : block.type === 'image' ? '🖼 Image block' : '▶ Video block'}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {!isFirst && (
            <button type="button" onClick={onMoveUp} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '0.25rem 0.55rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.7rem' }}>↑</button>
          )}
          {!isLast && (
            <button type="button" onClick={onMoveDown} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '0.25rem 0.55rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.7rem' }}>↓</button>
          )}
          <button type="button" onClick={onDelete} style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.18)', borderRadius: 6, padding: '0.25rem 0.6rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.7rem' }}>Remove</button>
        </div>
      </div>

      {block.type === 'text' && (
        <textarea
          value={block.content || ''}
          onChange={e => onChange({ ...block, content: e.target.value })}
          rows={5}
          placeholder="Write paragraph text here. Use a blank line between paragraphs."
          style={{ ...INP, resize: 'vertical', lineHeight: 1.7 }}
          onFocus={focus} onBlur={blur}
        />
      )}

      {block.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div>
            <label style={LBL}>Image URL</label>
            <input
              value={block.url || ''}
              onChange={e => onChange({ ...block, url: e.target.value })}
              placeholder="https://... (Cloudinary, Pexels, Imgur, etc.)"
              style={INP} onFocus={focus} onBlur={blur}
            />
          </div>
          {block.url && (
            <div style={{ borderRadius: 8, overflow: 'hidden', maxHeight: 200 }}>
              <img src={block.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          <div>
            <label style={LBL}>Caption (optional)</label>
            <input
              value={block.caption || ''}
              onChange={e => onChange({ ...block, caption: e.target.value })}
              placeholder="Image caption..."
              style={INP} onFocus={focus} onBlur={blur}
            />
          </div>
        </div>
      )}

      {block.type === 'video' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div>
            <label style={LBL}>Video URL</label>
            <input
              value={block.url || ''}
              onChange={e => onChange({ ...block, url: e.target.value })}
              placeholder="YouTube, Vimeo, or direct .mp4 URL"
              style={INP} onFocus={focus} onBlur={blur}
            />
            <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)' }}>
              Supports: youtube.com/watch?v=… · youtu.be/… · vimeo.com/… · direct .mp4
            </div>
          </div>
          <div>
            <label style={LBL}>Caption (optional)</label>
            <input
              value={block.caption || ''}
              onChange={e => onChange({ ...block, caption: e.target.value })}
              placeholder="Video caption..."
              style={INP} onFocus={focus} onBlur={blur}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ADD BLOCK BUTTONS ──────────────────────────
function AddBlockBar({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const btns: { type: BlockType; label: string; color: string }[] = [
    { type: 'text',  label: '+ Text',  color: '#6B8EA0' },
    { type: 'image', label: '+ Image', color: '#7A9E7E' },
    { type: 'video', label: '+ Video', color: '#9B7A9E' },
  ]
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
      {btns.map(b => (
        <button key={b.type} type="button" onClick={() => onAdd(b.type)}
          style={{ background: `${b.color}12`, border: `1px solid ${b.color}30`, borderRadius: 8, padding: '0.5rem 1rem', color: b.color, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${b.color}22` }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${b.color}12` }}
        >{b.label}</button>
      ))}
    </div>
  )
}

// ─── ARTICLE EDITOR ─────────────────────────────
function ArticleEditor({ article, onChange, onDelete }: {
  article: Article; onChange: (a: Article) => void; onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const update = (k: keyof Article, v: any) => onChange({ ...article, [k]: v })

  const makeSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const addBlock = (type: BlockType) => {
    const block: Block = { id: uuid(), type }
    onChange({ ...article, blocks: [...(article.blocks || []), block] })
  }

  const updateBlock = (idx: number, block: Block) => {
    const blocks = [...(article.blocks || [])]
    blocks[idx] = block
    onChange({ ...article, blocks })
  }

  const deleteBlock = (idx: number) => {
    const blocks = [...(article.blocks || [])]
    blocks.splice(idx, 1)
    onChange({ ...article, blocks })
  }

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const blocks = [...(article.blocks || [])]
    const to = idx + dir
    if (to < 0 || to >= blocks.length) return
    ;[blocks[idx], blocks[to]] = [blocks[to], blocks[idx]]
    onChange({ ...article, blocks })
  }

  const blocks = article.blocks || []
  const blockCount = blocks.length

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Collapsed header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <span style={{ padding: '0.2rem 0.7rem', borderRadius: 100, fontSize: '0.65rem', letterSpacing: '0.06em', background: 'rgba(0,180,160,0.12)', color: '#00B4A0', flexShrink: 0 }}>
            {article.category || 'Draft'}
          </span>
          <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {article.title || <em style={{ color: 'rgba(255,255,255,0.3)' }}>Untitled</em>}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{article.date}</span>
          {blockCount > 0 && (
            <span style={{ fontSize: '0.68rem', color: 'rgba(0,180,160,0.6)', flexShrink: 0 }}>{blockCount} block{blockCount !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{expanded ? '▲' : '▼'}</span>
          <button type="button"
            onClick={e => { e.stopPropagation(); onDelete() }}
            style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.18)', borderRadius: 6, padding: '0.3rem 0.7rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>
            Delete
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ padding: '0 1.4rem 1.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>

          {/* Row 1: Title + Date + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 150px 200px', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div>
              <label style={LBL}>Title</label>
              <input value={article.title}
                onChange={e => { update('title', e.target.value); if (!article.slug) update('slug', makeSlug(e.target.value)) }}
                placeholder="Article title..." style={INP} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LBL}>Date</label>
              <input type="date" value={article.date} onChange={e => update('date', e.target.value)} style={INP} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LBL}>Category</label>
              <select value={article.category} onChange={e => update('category', e.target.value)} style={{ ...INP, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                {['Company News', 'Clinical Trial', 'Publication', 'Partnership', 'Event', 'Press Release', 'Award'].map(c => (
                  <option key={c} style={{ background: '#0D0F12' }}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={LBL}>URL Slug (used in /news/slug)</label>
            <input value={article.slug} onChange={e => update('slug', e.target.value)} placeholder="auto-generated-from-title"
              style={{ ...INP, fontFamily: 'monospace', fontSize: '0.82rem' }} onFocus={focus} onBlur={blur} />
          </div>

          {/* Cover Image */}
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={LBL}>Cover Image URL</label>
            <input value={article.coverImage || ''} onChange={e => update('coverImage', e.target.value)}
              placeholder="https://... (shown as thumbnail on homepage)" style={INP} onFocus={focus} onBlur={blur} />
            {article.coverImage && (
              <div style={{ marginTop: '0.5rem', borderRadius: 6, overflow: 'hidden', height: 100 }}>
                <img src={article.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* Featured Video URL */}
          <div style={{ marginBottom: '0.9rem', padding: '1rem', background: 'rgba(155,122,158,0.06)', border: '1px solid rgba(155,122,158,0.15)', borderRadius: 10 }}>
            <label style={{ ...LBL, color: '#9B7A9E' }}>Featured Video URL (replaces cover image in article header)</label>
            <input value={article.videoUrl || ''} onChange={e => update('videoUrl', e.target.value)}
              placeholder="YouTube, Vimeo, or .mp4 URL — leave empty to use cover image" style={INP} onFocus={focus} onBlur={blur} />
            <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
              Supports: youtube.com/watch?v=… · youtu.be/… · vimeo.com/… · direct .mp4 link
            </div>
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={LBL}>Excerpt (shown on homepage card)</label>
            <textarea value={article.excerpt} onChange={e => update('excerpt', e.target.value)} rows={2}
              placeholder="Short summary shown on the news card..." style={{ ...INP, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
          </div>

          {/* Content Blocks */}
          <div style={{ marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <label style={{ ...LBL, margin: 0 }}>Article Content Blocks</label>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>Build your article by adding text, images, and video blocks below</span>
            </div>

            {blocks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 10, color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                No content blocks yet. Use the buttons below to add text, images, or videos.
              </div>
            )}

            {blocks.map((block, idx) => (
              <BlockEditor
                key={block.id}
                block={block}
                onChange={b => updateBlock(idx, b)}
                onDelete={() => deleteBlock(idx)}
                onMoveUp={() => moveBlock(idx, -1)}
                onMoveDown={() => moveBlock(idx, 1)}
                isFirst={idx === 0}
                isLast={idx === blocks.length - 1}
              />
            ))}

            <AddBlockBar onAdd={addBlock} />
          </div>

          {/* Legacy body field */}
          <details style={{ marginTop: '0.6rem' }}>
            <summary style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', userSelect: 'none', marginBottom: '0.5rem' }}>
              Legacy plain-text body (used if no blocks above)
            </summary>
            <textarea value={article.body || ''} onChange={e => update('body', e.target.value)} rows={6}
              placeholder="Plain text article body (fallback if no blocks are added)..." style={{ ...INP, resize: 'vertical', lineHeight: 1.7, marginTop: '0.5rem' }} onFocus={focus} onBlur={blur} />
          </details>
        </div>
      )}
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────
export default function AdminNews() {
  const [news, setNews] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => {
      const raw: any[] = d.news || []
      setNews(raw.map(n => ({ ...n, videoUrl: n.videoUrl || '', blocks: n.blocks || [] })))
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'news', data: news }),
    })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
    else setToast('Error saving — please try again.')
  }

  const addArticle = () => {
    const id = uuid()
    const article: Article = {
      id, title: '', slug: '', date: new Date().toISOString().split('T')[0],
      category: 'Company News', excerpt: '', body: '', coverImage: '', videoUrl: '', blocks: [],
    }
    setNews(prev => [article, ...prev])
  }

  return (
    <AdminLayout title="News & Articles">
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'rgba(0,180,160,0.15)', border: '1px solid rgba(0,180,160,0.3)', borderRadius: 10, padding: '0.9rem 1.5rem', color: '#00B4A0', fontSize: '0.88rem', fontWeight: 500 }}>
          {toast}
        </div>
      )}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>
            {news.length} article{news.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '0.7rem' }}>
            <button type="button" onClick={addArticle}
              style={{ background: 'rgba(0,180,160,0.1)', border: '1px solid rgba(0,180,160,0.25)', borderRadius: 8, padding: '0.65rem 1.4rem', color: '#00B4A0', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>
              + New Article
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
          <strong style={{ color: 'rgba(255,255,255,0.45)' }}>Tip:</strong> Click any article to expand its editor. Each article can have a cover image, an optional featured video, and rich content blocks (text, images, videos) for the full article page.
        </div>

        {news.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: 'rgba(255,255,255,0.25)', fontSize: '0.92rem' }}>
            No articles yet. Click "+ New Article" to add your first post.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {news.map((article) => (
            <ArticleEditor
              key={article.id}
              article={article}
              onChange={updated => setNews(prev => prev.map(n => n.id === updated.id ? updated : n))}
              onDelete={() => setNews(prev => prev.filter(n => n.id !== article.id))}
            />
          ))}
        </div>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
