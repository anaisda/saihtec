import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminInvestors() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.investors || {}))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'investors', data }),
    })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updateMetric = (i: number, k: string, v: string) => {
    const m = [...(data.metrics || [])]; m[i] = { ...m[i], [k]: v }; setData({ ...data, metrics: m })
  }
  const updateHighlight = (i: number, k: string, v: string) => {
    const h = [...(data.highlights || [])]; h[i] = { ...h[i], [k]: v }; setData({ ...data, highlights: h })
  }

  if (!data) return <AdminLayout title="Investors"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="Investor Relations">
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'rgba(0,180,160,0.15)', border: '1px solid rgba(0,180,160,0.3)', borderRadius: 10, padding: '0.9rem 1.5rem', color: '#00B4A0', fontSize: '0.88rem' }}>{toast}</div>}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        {/* Main text */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Section Text</h3>
          <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} placeholder="Investor Relations" /></Field>
          <Field label="Title (before accent)"><Input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} placeholder="A compelling investment in " /></Field>
          <Field label="Title Accent (italic, navy)"><Input value={data.titleAccent || ''} onChange={e => setData({ ...data, titleAccent: e.target.value })} placeholder="regenerative medicine" /></Field>
          <Field label="Body Text"><Textarea value={data.body || ''} onChange={e => setData({ ...data, body: e.target.value })} rows={4} /></Field>
        </Card>

        {/* Metrics */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Metric Cards (2×2 grid)</h3>
            <AddButton onClick={() => setData({ ...data, metrics: [...(data.metrics||[]), { number: '', label: '', desc: '' }] })} label="Add Metric" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {(data.metrics || []).map((m: any, i: number) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#00B4A0', letterSpacing: '0.1em' }}>METRIC {i+1}</span>
                  <DeleteButton onClick={() => setData({ ...data, metrics: data.metrics.filter((_: any, j: number) => j !== i) })} />
                </div>
                <Field label="Big Number/Text"><Input value={m.number} onChange={e => updateMetric(i, 'number', e.target.value)} placeholder="€2.4B" /></Field>
                <Field label="Label"><Input value={m.label} onChange={e => updateMetric(i, 'label', e.target.value)} /></Field>
                <Field label="Description"><Input value={m.desc} onChange={e => updateMetric(i, 'desc', e.target.value)} /></Field>
              </div>
            ))}
          </div>
        </Card>

        {/* Highlights */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Investment Highlights (3 columns)</h3>
            <AddButton onClick={() => setData({ ...data, highlights: [...(data.highlights||[]), { icon: '⚗', title: '', desc: '' }] })} label="Add Highlight" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(data.highlights || []).map((h: any, i: number) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#00B4A0' }}>HIGHLIGHT {i+1}</span>
                  <DeleteButton onClick={() => setData({ ...data, highlights: data.highlights.filter((_: any, j: number) => j !== i) })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 2fr', gap: '0.75rem' }}>
                  <Field label="Icon (emoji)"><Input value={h.icon} onChange={e => updateHighlight(i, 'icon', e.target.value)} /></Field>
                  <Field label="Title"><Input value={h.title} onChange={e => updateHighlight(i, 'title', e.target.value)} /></Field>
                  <Field label="Description"><Input value={h.desc} onChange={e => updateHighlight(i, 'desc', e.target.value)} /></Field>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}