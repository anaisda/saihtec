import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminAbout() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.about)) }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'about', data }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  if (!data) return <AdminLayout title="About"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="About Section">
      {toast && <Toast message={toast} />}
      <form onSubmit={save} style={{ maxWidth: 800 }}>
        <Card style={{ marginBottom: '1.5rem' }}>
          <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} placeholder="Who we are" /></Field>
          <Field label="Section Title"><Input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} /></Field>
          <Field label="Highlight Quote (italic block)"><Textarea value={data.highlightQuote || ''} onChange={e => setData({ ...data, highlightQuote: e.target.value })} rows={3} /></Field>
          <Field label="Body Text"><Textarea value={data.body || ''} onChange={e => setData({ ...data, body: e.target.value })} rows={5} /></Field>
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Certifications List</h3>
            <AddButton onClick={() => setData({ ...data, certifications: [...(data.certifications || []), ''] })} label="Add Certification" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(data.certifications || []).map((c: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Input value={c} onChange={e => { const a = [...data.certifications]; a[i] = e.target.value; setData({ ...data, certifications: a }) }} placeholder="e.g. GMP Certified Facility" />
                <DeleteButton onClick={() => { const a = data.certifications.filter((_: any, j: number) => j !== i); setData({ ...data, certifications: a }) }} />
              </div>
            ))}
          </div>
        </Card>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
