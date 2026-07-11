import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Select, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminMedia() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.media || { tagline: 'Knowledge & Media', title: 'One place for all our', titleAccent: 'scientific output', subtitle: '', items: [] }))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'media', data }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updateItem = (i: number, k: string, v: string) => {
    const items = [...data.items]; items[i] = { ...items[i], [k]: v }; setData({ ...data, items })
  }

  if (!data) return <AdminLayout title="Media Hub"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="Media Hub">
      {toast && <Toast message={toast} />}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Section Header</h3>
          <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} /></Field>
          <Field label="Title"><Input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} /></Field>
          <Field label="Title Accent (italic)"><Input value={data.titleAccent || ''} onChange={e => setData({ ...data, titleAccent: e.target.value })} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle || ''} onChange={e => setData({ ...data, subtitle: e.target.value })} rows={2} /></Field>
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Media Items (Publications, Talks, Press Releases)</h3>
            <AddButton onClick={() => { const id = uuid(); setData({ ...data, items: [{ id, type: 'Publication', title: '', authors: '', venue: '', year: new Date().getFullYear().toString(), url: '', tag: 'Peer-Reviewed' }, ...data.items] }); setExpanded(id) }} label="Add Item" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.items || []).map((item: any, i: number) => (
              <Card key={item.id} style={{ padding: '0.9rem 1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: 100, background: 'rgba(0,180,160,0.1)', color: '#00B4A0', letterSpacing: '0.06em' }}>{item.type}</span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>{item.title || 'Untitled'}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>{item.year}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{expanded === item.id ? '▲' : '▼'}</span>
                    <DeleteButton onClick={() => setData({ ...data, items: data.items.filter((_: any, j: number) => j !== i) })} />
                  </div>
                </div>
                {expanded === item.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Field label="Type">
                        <Select value={item.type} onChange={e => updateItem(i, 'type', e.target.value)}>
                          {['Publication', 'Talk', 'Press Release'].map(t => <option key={t}>{t}</option>)}
                        </Select>
                      </Field>
                      <Field label="Tag (e.g. Peer-Reviewed)"><Input value={item.tag || ''} onChange={e => updateItem(i, 'tag', e.target.value)} /></Field>
                      <Field label="Year"><Input value={item.year} onChange={e => updateItem(i, 'year', e.target.value)} maxLength={4} /></Field>
                    </div>
                    <Field label="Title"><Textarea value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} rows={2} /></Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <Field label="Author(s)"><Input value={item.authors} onChange={e => updateItem(i, 'authors', e.target.value)} placeholder="Kadri N, et al." /></Field>
                      <Field label="Venue / Journal / Event"><Input value={item.venue} onChange={e => updateItem(i, 'venue', e.target.value)} /></Field>
                    </div>
                    <Field label="Link URL"><Input type="url" value={item.url || ''} onChange={e => updateItem(i, 'url', e.target.value)} placeholder="https://pubmed.ncbi..." /></Field>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}