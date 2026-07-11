import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card } from '@/components/admin/FormComponents'

export default function AdminSettings() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.settings)) }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'settings', data }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Settings saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updateStat = (i: number, key: string, val: string) => {
    const stats = [...data.stats]
    stats[i] = { ...stats[i], [key]: val }
    setData({ ...data, stats })
  }

  if (!data) return <AdminLayout title="Site Settings"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="Site Settings">
      {toast && <Toast message={toast} />}
      <form onSubmit={save} style={{ maxWidth: 800 }}>
        {/* Hero */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Hero Section</h3>
          <Field label="Tag Line (top small text)">
            <Input value={data.heroTagline || ''} onChange={e => setData({ ...data, heroTagline: e.target.value })} placeholder="Regenerative Medicine · Sweden · GMP Certified" />
          </Field>
          <Field label="Hero Title">
            <Textarea value={data.heroTitle || ''} onChange={e => setData({ ...data, heroTitle: e.target.value })} rows={3} placeholder="The future of cellular therapy starts here." />
          </Field>
          <Field label="Hero Subtitle">
            <Textarea value={data.heroSubtitle || ''} onChange={e => setData({ ...data, heroSubtitle: e.target.value })} rows={3} />
          </Field>
          <Field label="Background Video URL (direct .mp4 link)">
            <Input value={data.heroVideoUrl || ''} onChange={e => setData({ ...data, heroVideoUrl: e.target.value })} placeholder="https://videos.pexels.com/..." />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem' }}>
              Free HD lab videos: videos.pexels.com — search "laboratory" or "stem cell" → right-click video → Copy video address
            </p>
          </Field>
        </Card>

        {/* Stats */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Stats Bar (4 numbers)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
            {(data.stats || []).map((s: any, i: number) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#00B4A0', marginBottom: '0.8rem', letterSpacing: '0.1em' }}>STAT {i + 1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div><Label_>Number</Label_><Input value={s.number} onChange={e => updateStat(i, 'number', e.target.value)} /></div>
                  <div><Label_>Suffix</Label_><Input value={s.suffix} onChange={e => updateStat(i, 'suffix', e.target.value)} /></div>
                </div>
                <Label_>Label</Label_><Input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} />
              </div>
            ))}
          </div>
        </Card>

        {/* SEO */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SEO & Contact</h3>
          <Field label="SEO Title"><Input value={data.seoTitle || ''} onChange={e => setData({ ...data, seoTitle: e.target.value })} /></Field>
          <Field label="SEO Description"><Textarea value={data.seoDescription || ''} onChange={e => setData({ ...data, seoDescription: e.target.value })} rows={2} /></Field>
          <Field label="Contact Email (receives form submissions)"><Input type="email" value={data.contactEmail || ''} onChange={e => setData({ ...data, contactEmail: e.target.value })} /></Field>
        </Card>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}

function Label_({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{children}</div>
}
