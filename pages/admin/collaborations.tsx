import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminCollaborations() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.collaborations || {}))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'collaborations', data }),
    })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updatePartner = (i: number, k: string, v: string) => {
    const p = [...(data.partners || [])]; p[i] = { ...p[i], [k]: v }; setData({ ...data, partners: p })
  }

  if (!data) return <AdminLayout title="Collaborations"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="Collaborations & Partners">
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'rgba(0,180,160,0.15)', border: '1px solid rgba(0,180,160,0.3)', borderRadius: 10, padding: '0.9rem 1.5rem', color: '#00B4A0', fontSize: '0.88rem' }}>{toast}</div>}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Section Header</h3>
          <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} placeholder="Partnerships" /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle || ''} onChange={e => setData({ ...data, subtitle: e.target.value })} rows={2} /></Field>
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Partner Cards (3-column grid)</h3>
            <AddButton onClick={() => setData({ ...data, partners: [...(data.partners||[]), { id: uuid(), name: '', type: '', country: '', desc: '' }] })} label="Add Partner" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(data.partners || []).map((p: any, i: number) => (
              <div key={p.id || i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#00B4A0' }}>{p.name || `PARTNER ${i+1}`}</span>
                  <DeleteButton onClick={() => setData({ ...data, partners: data.partners.filter((_: any, j: number) => j !== i) })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Field label="Institution Name"><Input value={p.name} onChange={e => updatePartner(i, 'name', e.target.value)} placeholder="Karolinska Institutet" /></Field>
                  <Field label="Type"><Input value={p.type} onChange={e => updatePartner(i, 'type', e.target.value)} placeholder="Academic Partner" /></Field>
                  <Field label="Country"><Input value={p.country} onChange={e => updatePartner(i, 'country', e.target.value)} placeholder="Sweden" /></Field>
                </div>
                <Field label="Description"><Textarea value={p.desc} onChange={e => updatePartner(i, 'desc', e.target.value)} rows={2} /></Field>
              </div>
            ))}
          </div>
        </Card>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}