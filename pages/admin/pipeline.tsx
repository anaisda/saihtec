import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Select, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminPipeline() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(false); const [saved, setSaved] = useState(false); const [toast, setToast] = useState('')

  useEffect(() => { fetch('/api/cms/content').then(r => r.json()).then(d => setPrograms(d.pipeline || [])) }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'pipeline', data: programs }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const update = (i: number, k: string, v: any) => { const a = [...programs]; a[i] = { ...a[i], [k]: v }; setPrograms(a) }

  return (
    <AdminLayout title="Pipeline Programs">
      {toast && <Toast message={toast} />}
      <form onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <AddButton onClick={() => setPrograms([...programs, { id: uuid(), order: programs.length + 1, name: '', subtitle: '', phase: 'Pre-clinical', phasePercent: 10, indication: '', status: 'Planned' }])} label="Add Program" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {programs.map((p, i) => (
            <Card key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#00B4A0', letterSpacing: '0.1em' }}>PROGRAM {i + 1}</span>
                <DeleteButton onClick={() => setPrograms(programs.filter((_, j) => j !== i))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                <Field label="Program Name"><Input value={p.name} onChange={e => update(i, 'name', e.target.value)} placeholder="BoostB4™" /></Field>
                <Field label="Subtitle (cell type)"><Input value={p.subtitle} onChange={e => update(i, 'subtitle', e.target.value)} placeholder="Bone Marrow MSC" /></Field>
                <Field label="Indication"><Input value={p.indication} onChange={e => update(i, 'indication', e.target.value)} /></Field>
                <Field label="Phase Label">
                  <Select value={p.phase} onChange={e => update(i, 'phase', e.target.value)}>
                    {['Pre-clinical', 'Phase I', 'Phase I/II', 'Phase II', 'Phase II/III', 'Phase III', 'Approved'].map(o => <option key={o}>{o}</option>)}
                  </Select>
                </Field>
                <Field label={`Phase Progress: ${p.phasePercent}%`}>
                  <input type="range" min={0} max={100} value={p.phasePercent} onChange={e => update(i, 'phasePercent', +e.target.value)} style={{ width: '100%', accentColor: '#00B4A0', marginTop: '0.5rem' }} />
                </Field>
                <Field label="Status">
                  <Select value={p.status} onChange={e => update(i, 'status', e.target.value)}>
                    {['Active', 'Recruiting', 'Planned', 'Completed', 'Paused'].map(o => <option key={o}>{o}</option>)}
                  </Select>
                </Field>
              </div>
            </Card>
          ))}
        </div>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
