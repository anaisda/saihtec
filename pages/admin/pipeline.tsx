import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { SaveButton } from '@/components/admin/FormComponents'

// ─── TYPES ──────────────────────────────────────
type BlockType = 'text' | 'image' | 'video'
interface Block { id: string; type: BlockType; content?: string; url?: string; caption?: string }
interface Program {
  id: string; order: number; name: string; slug: string; subtitle: string
  phase: string; phasePercent: number; indication: string; status: string
  summary: string; coverImage: string; videoUrl: string; blocks: Block[]
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
  const colors: Record<BlockType, string> = { text: '#6B8EA0', image: '#7A9E7E', video: '#9B7A9E' }
  const color = colors[block.type]

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.06)`, borderLeft: `3px solid ${color}40`, borderRadius: 10, padding: '1rem 1.1rem', marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color, fontWeight: 500 }}>
          {block.type === 'text' ? '¶ Text' : block.type === 'image' ? '🖼 Image' : '▶ Video'}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {!isFirst && <button type="button" onClick={onMoveUp} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '0.25rem 0.55rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.7rem' }}>↑</button>}
          {!isLast  && <button type="button" onClick={onMoveDown} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '0.25rem 0.55rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.7rem' }}>↓</button>}
          <button type="button" onClick={onDelete} style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.18)', borderRadius: 6, padding: '0.25rem 0.6rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.7rem' }}>Remove</button>
        </div>
      </div>

      {block.type === 'text' && (
        <textarea value={block.content || ''} onChange={e => onChange({ ...block, content: e.target.value })}
          rows={5} placeholder="Write paragraph text here. Blank line = new paragraph."
          style={{ ...INP, resize: 'vertical', lineHeight: 1.7 }} onFocus={focus} onBlur={blur} />
      )}

      {block.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div>
            <label style={LBL}>Image URL</label>
            <input value={block.url || ''} onChange={e => onChange({ ...block, url: e.target.value })}
              placeholder="https://... (Cloudinary, Pexels, Imgur, etc.)"
              style={INP} onFocus={focus} onBlur={blur} />
          </div>
          {block.url && (
            <div style={{ borderRadius: 8, overflow: 'hidden', maxHeight: 180 }}>
              <img src={block.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          <div>
            <label style={LBL}>Caption (optional)</label>
            <input value={block.caption || ''} onChange={e => onChange({ ...block, caption: e.target.value })}
              placeholder="Image caption..." style={INP} onFocus={focus} onBlur={blur} />
          </div>
        </div>
      )}

      {block.type === 'video' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div>
            <label style={LBL}>Video URL</label>
            <input value={block.url || ''} onChange={e => onChange({ ...block, url: e.target.value })}
              placeholder="YouTube, Vimeo, or direct .mp4 URL"
              style={INP} onFocus={focus} onBlur={blur} />
            <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)' }}>
              Supports: youtube.com/watch?v=… · youtu.be/… · vimeo.com/… · direct .mp4
            </div>
          </div>
          <div>
            <label style={LBL}>Caption (optional)</label>
            <input value={block.caption || ''} onChange={e => onChange({ ...block, caption: e.target.value })}
              placeholder="Video caption..." style={INP} onFocus={focus} onBlur={blur} />
          </div>
        </div>
      )}
    </div>
  )
}

function AddBlockBar({ onAdd }: { onAdd: (t: BlockType) => void }) {
  const btns: { type: BlockType; label: string; color: string }[] = [
    { type: 'text', label: '+ Text', color: '#6B8EA0' },
    { type: 'image', label: '+ Image', color: '#7A9E7E' },
    { type: 'video', label: '+ Video', color: '#9B7A9E' },
  ]
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
      {btns.map(b => (
        <button key={b.type} type="button" onClick={() => onAdd(b.type)}
          style={{ background: `${b.color}12`, border: `1px solid ${b.color}30`, borderRadius: 8, padding: '0.5rem 1rem', color: b.color, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${b.color}22`}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${b.color}12`}
        >{b.label}</button>
      ))}
    </div>
  )
}

// ─── PROGRAM EDITOR ─────────────────────────────
function ProgramEditor({ program, index, onChange, onDelete }: {
  program: Program; index: number; onChange: (p: Program) => void; onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const up = (k: keyof Program, v: any) => onChange({ ...program, [k]: v })

  const makeSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const blocks = program.blocks || []

  const addBlock = (type: BlockType) =>
    onChange({ ...program, blocks: [...blocks, { id: uuid(), type }] })

  const updateBlock = (i: number, b: Block) => {
    const next = [...blocks]; next[i] = b; onChange({ ...program, blocks: next })
  }

  const deleteBlock = (i: number) => {
    const next = [...blocks]; next.splice(i, 1); onChange({ ...program, blocks: next })
  }

  const moveBlock = (i: number, dir: -1 | 1) => {
    const next = [...blocks]; const to = i + dir
    if (to < 0 || to >= next.length) return
    ;[next[i], next[to]] = [next[to], next[i]]
    onChange({ ...program, blocks: next })
  }

  const statusColor: Record<string, string> = {
    Active: '#00B4A0', Completed: '#8AABB5', Recruiting: '#E8B060', Planned: 'rgba(255,255,255,0.35)'
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)', flexShrink: 0 }}>#{index + 1}</span>
          <span style={{ padding: '0.18rem 0.65rem', borderRadius: 100, fontSize: '0.64rem', letterSpacing: '0.05em', background: `${statusColor[program.status] || 'rgba(255,255,255,0.1)'}18`, color: statusColor[program.status] || 'rgba(255,255,255,0.4)', flexShrink: 0, border: `1px solid ${statusColor[program.status] || 'rgba(255,255,255,0.1)'}30` }}>
            {program.status}
          </span>
          <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {program.name || <em style={{ color: 'rgba(255,255,255,0.3)' }}>Unnamed programme</em>}
          </span>
          {blocks.length > 0 && <span style={{ fontSize: '0.68rem', color: 'rgba(0,180,160,0.6)', flexShrink: 0 }}>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{expanded ? '▲' : '▼'}</span>
          <button type="button" onClick={e => { e.stopPropagation(); onDelete() }}
            style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.18)', borderRadius: 6, padding: '0.3rem 0.7rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 1.4rem 1.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>

          {/* Row 1: Name + Subtitle + Indication */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div>
              <label style={LBL}>Programme Name</label>
              <input value={program.name}
                onChange={e => { up('name', e.target.value); if (!program.slug) up('slug', makeSlug(e.target.value)) }}
                placeholder="MSC in Knee Osteoarthritis" style={INP} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LBL}>Cell Type / Subtitle</label>
              <input value={program.subtitle} onChange={e => up('subtitle', e.target.value)}
                placeholder="Bone Marrow MSC" style={INP} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LBL}>Indication</label>
              <input value={program.indication} onChange={e => up('indication', e.target.value)}
                placeholder="Knee Osteoarthritis (OA)" style={INP} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          {/* Row 2: Phase + Progress + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div>
              <label style={LBL}>Phase Label</label>
              <select value={program.phase} onChange={e => up('phase', e.target.value)} style={{ ...INP, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                {['Pre-clinical', 'Phase I', 'Phase I/II', 'Phase I/IIa', 'Phase II', 'Phase II/III', 'Phase III', 'Approved'].map(o => (
                  <option key={o} style={{ background: '#0D0F12' }}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={LBL}>Phase Progress: {program.phasePercent}%</label>
              <input type="range" min={0} max={100} value={program.phasePercent} onChange={e => up('phasePercent', +e.target.value)}
                style={{ width: '100%', accentColor: '#00B4A0', marginTop: '1rem' }} />
            </div>
            <div>
              <label style={LBL}>Status</label>
              <select value={program.status} onChange={e => up('status', e.target.value)} style={{ ...INP, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                {['Active', 'Recruiting', 'Planned', 'Completed', 'Paused'].map(o => (
                  <option key={o} style={{ background: '#0D0F12' }}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={LBL}>URL Slug (used in /pipeline/slug)</label>
            <input value={program.slug || ''} onChange={e => up('slug', e.target.value)}
              placeholder="auto-generated-from-name" style={{ ...INP, fontFamily: 'monospace', fontSize: '0.82rem' }} onFocus={focus} onBlur={blur} />
          </div>

          {/* Cover image */}
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={LBL}>Cover Image URL</label>
            <input value={program.coverImage || ''} onChange={e => up('coverImage', e.target.value)}
              placeholder="https://... (shown as hero background on programme page)" style={INP} onFocus={focus} onBlur={blur} />
            {program.coverImage && (
              <div style={{ marginTop: '0.5rem', borderRadius: 6, overflow: 'hidden', height: 100 }}>
                <img src={program.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* Featured video */}
          <div style={{ marginBottom: '0.9rem', padding: '1rem', background: 'rgba(155,122,158,0.06)', border: '1px solid rgba(155,122,158,0.15)', borderRadius: 10 }}>
            <label style={{ ...LBL, color: '#9B7A9E' }}>Featured Video URL (optional — shown in programme header)</label>
            <input value={program.videoUrl || ''} onChange={e => up('videoUrl', e.target.value)}
              placeholder="YouTube, Vimeo, or .mp4 URL" style={INP} onFocus={focus} onBlur={blur} />
            <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
              Supports: youtube.com/watch?v=… · youtu.be/… · vimeo.com/… · direct .mp4
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={LBL}>Programme Summary (shown in hero)</label>
            <textarea value={program.summary || ''} onChange={e => up('summary', e.target.value)} rows={3}
              placeholder="Short overview shown in the programme hero section..."
              style={{ ...INP, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
          </div>

          {/* Content Blocks */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <label style={{ ...LBL, margin: 0 }}>Article Content Blocks</label>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>Build the full programme page with text, images, and videos</span>
            </div>

            {blocks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 10, color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                No content blocks yet. Add text, images, or videos below.
              </div>
            )}

            {blocks.map((block, i) => (
              <BlockEditor key={block.id} block={block}
                onChange={b => updateBlock(i, b)}
                onDelete={() => deleteBlock(i)}
                onMoveUp={() => moveBlock(i, -1)}
                onMoveDown={() => moveBlock(i, 1)}
                isFirst={i === 0} isLast={i === blocks.length - 1}
              />
            ))}

            <AddBlockBar onAdd={addBlock} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────
export default function AdminPipeline() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => {
      const raw: any[] = d.pipeline || []
      setPrograms(raw.map(p => ({
        ...p,
        slug: p.slug || '',
        summary: p.summary || '',
        coverImage: p.coverImage || '',
        videoUrl: p.videoUrl || '',
        blocks: p.blocks || [],
      })))
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'pipeline', data: programs }),
    })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
    else setToast('Error saving — please try again.')
  }

  const addProgram = () => {
    const id = uuid()
    setPrograms(prev => [...prev, {
      id, order: prev.length + 1, name: '', slug: '', subtitle: '',
      phase: 'Pre-clinical', phasePercent: 10, indication: '', status: 'Planned',
      summary: '', coverImage: '', videoUrl: '', blocks: [],
    }])
  }

  return (
    <AdminLayout title="Clinical Programmes">
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'rgba(0,180,160,0.15)', border: '1px solid rgba(0,180,160,0.3)', borderRadius: 10, padding: '0.9rem 1.5rem', color: '#00B4A0', fontSize: '0.88rem', fontWeight: 500 }}>
          {toast}
        </div>
      )}
      <form onSubmit={save} style={{ maxWidth: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>
            {programs.length} programme{programs.length !== 1 ? 's' : ''}
          </div>
          <button type="button" onClick={addProgram}
            style={{ background: 'rgba(0,180,160,0.1)', border: '1px solid rgba(0,180,160,0.25)', borderRadius: 8, padding: '0.65rem 1.4rem', color: '#00B4A0', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>
            + Add Programme
          </button>
        </div>

        <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
          <strong style={{ color: 'rgba(255,255,255,0.45)' }}>Tip:</strong> Each programme gets its own page at <code style={{ color: 'rgba(0,180,160,0.7)' }}>/pipeline/[slug]</code>. Set the slug, add a cover image, and build the article with content blocks. Clicking a programme row on the homepage navigates to its detail page.
        </div>

        {programs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: 'rgba(255,255,255,0.25)', fontSize: '0.92rem' }}>
            No programmes yet. Click "+ Add Programme" to create your first.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {programs.map((p, i) => (
            <ProgramEditor
              key={p.id}
              program={p}
              index={i}
              onChange={updated => setPrograms(prev => prev.map(x => x.id === updated.id ? updated : x))}
              onDelete={() => setPrograms(prev => prev.filter(x => x.id !== p.id))}
            />
          ))}
        </div>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
