import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminScienceTeam() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.science_team || {}))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'science_team', data }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updateLead = (k: string, v: any) => setData({ ...data, lead: { ...(data.lead || {}), [k]: v } })
  const updateCredential = (i: number, v: string) => { const c = [...(data.lead?.credentials || [])]; c[i] = v; updateLead('credentials', c) }
  const updateDiscipline = (i: number, k: string, v: string) => {
    const d = [...(data.disciplines || [])]; d[i] = { ...d[i], [k]: v }; setData({ ...data, disciplines: d })
  }

  if (!data) return <AdminLayout title="Science Team"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="Science Team Section">
      {toast && <Toast message={toast} />}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        {/* Header */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Section Header</h3>
          <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Title"><Input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} /></Field>
            <Field label="Title Accent (italic)"><Input value={data.titleAccent || ''} onChange={e => setData({ ...data, titleAccent: e.target.value })} /></Field>
          </div>
          <Field label="Subtitle paragraph"><Textarea value={data.subtitle || ''} onChange={e => setData({ ...data, subtitle: e.target.value })} rows={3} /></Field>
        </Card>

        {/* Lead scientist */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Lead Scientist (large feature card)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Full Name"><Input value={data.lead?.name || ''} onChange={e => updateLead('name', e.target.value)} placeholder="Nadir Kadri" /></Field>
            <Field label="Role"><Input value={data.lead?.role || ''} onChange={e => updateLead('role', e.target.value)} placeholder="Scientific Founder & CEO" /></Field>
          </div>
          <Field label="Quote (shown in italic large text)">
            <Textarea value={data.lead?.quote || ''} onChange={e => updateLead('quote', e.target.value)} rows={3} placeholder="I built this company because..." />
          </Field>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Credentials (right column)</label>
              <AddButton onClick={() => updateLead('credentials', [...(data.lead?.credentials || []), ''])} label="Add" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(data.lead?.credentials || []).map((c: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Input value={c} onChange={e => updateCredential(i, e.target.value)} placeholder="PhD in Immunology, Karolinska Institutet" />
                  <DeleteButton onClick={() => { const creds = data.lead.credentials.filter((_: any, j: number) => j !== i); updateLead('credentials', creds) }} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Disciplines */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Research Disciplines (3-column grid + pill tags)</h3>
            <AddButton onClick={() => setData({ ...data, disciplines: [...(data.disciplines || []), { label: '', detail: '' }] })} label="Add Discipline" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
            {(data.disciplines || []).map((d: any, i: number) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>DISCIPLINE {i+1}</span>
                  <DeleteButton onClick={() => setData({ ...data, disciplines: data.disciplines.filter((_: any, j: number) => j !== i) })} />
                </div>
                <Field label="Label (pill + heading)"><Input value={d.label} onChange={e => updateDiscipline(i, 'label', e.target.value)} placeholder="Cell Biology" /></Field>
                <Field label="Detail text"><Input value={d.detail} onChange={e => updateDiscipline(i, 'detail', e.target.value)} placeholder="Isolation, expansion and characterisation..." /></Field>
              </div>
            ))}
          </div>
        </Card>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}