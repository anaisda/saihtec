import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminTeam() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(false); const [saved, setSaved] = useState(false); const [toast, setToast] = useState('')

  useEffect(() => { fetch('/api/cms/content').then(r => r.json()).then(d => setTeam(d.team || [])) }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'team', data: team }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const update = (i: number, k: string, v: string) => { const a = [...team]; a[i] = { ...a[i], [k]: v }; setTeam(a) }

  return (
    <AdminLayout title="Team Members">
      {toast && <Toast message={toast} />}
      <form onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <AddButton onClick={() => setTeam([...team, { id: uuid(), order: team.length + 1, name: '', initials: '', title: '', bio: '', linkedinUrl: '', photoUrl: '', color: '#00B4A0' }])} label="Add Member" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {team.map((m, i) => (
            <Card key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.color || '#00B4A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{m.initials || '?'}</div>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{m.name || 'New Member'}</span>
                </div>
                <DeleteButton onClick={() => setTeam(team.filter((_, j) => j !== i))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="Full Name"><Input value={m.name} onChange={e => update(i, 'name', e.target.value)} /></Field>
                <Field label="Initials (2-3 chars)"><Input value={m.initials} onChange={e => update(i, 'initials', e.target.value)} maxLength={3} /></Field>
              </div>
              <Field label="Job Title"><Input value={m.title} onChange={e => update(i, 'title', e.target.value)} /></Field>
              <Field label="Short Bio"><Textarea value={m.bio} onChange={e => update(i, 'bio', e.target.value)} rows={3} /></Field>
              <Field label="LinkedIn URL"><Input type="url" value={m.linkedinUrl} onChange={e => update(i, 'linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
              <Field label="Photo URL (or /nadir_kadri_pp.png for local files)">
                <Input value={m.photoUrl || ''} onChange={e => update(i, 'photoUrl', e.target.value)} placeholder="/nadir_kadri_pp.png or https://..." />
                {m.photoUrl && (
                  <div style={{ marginTop: '0.5rem', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                    <img src={m.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </Field>
              <Field label="Accent Color">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <input type="color" value={m.color || '#00B4A0'} onChange={e => update(i, 'color', e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer' }} />
                  <Input value={m.color || '#00B4A0'} onChange={e => update(i, 'color', e.target.value)} style={{ flex: 1 }} />
                </div>
              </Field>
            </Card>
          ))}
        </div>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
