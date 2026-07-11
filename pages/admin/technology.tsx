import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminTechnology() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { fetch('/api/cms/content').then(r => r.json()).then(d => setCards(d.technology || [])) }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'technology', data: cards }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const update = (i: number, key: string, val: any) => { const c = [...cards]; c[i] = { ...c[i], [key]: val }; setCards(c) }
  const updateBullet = (i: number, bi: number, val: string) => {
    const c = [...cards]
    const bullets = [...(c[i].bullets || [])]
    bullets[bi] = val
    c[i] = { ...c[i], bullets }
    setCards(c)
  }
  const addBullet = (i: number) => { const c = [...cards]; c[i] = { ...c[i], bullets: [...(c[i].bullets || []), ''] }; setCards(c) }
  const removeBullet = (i: number, bi: number) => {
    const c = [...cards]
    c[i] = { ...c[i], bullets: (c[i].bullets || []).filter((_: any, j: number) => j !== bi) }
    setCards(c)
  }

  return (
    <AdminLayout title="Areas of Expertise">
      {toast && <Toast message={toast} />}
      <form onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <AddButton onClick={() => setCards([...cards, { id: uuid(), order: cards.length + 1, number: `0${cards.length + 1}`, title: '', description: '', bullets: [''] }])} label="Add Pillar" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {cards.map((c, i) => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#00B4A0', letterSpacing: '0.1em' }}>PILLAR {i + 1}</span>
                <DeleteButton onClick={() => setCards(cards.filter((_, j) => j !== i))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.75rem' }}>
                <Field label="Number"><Input value={c.number} onChange={e => update(i, 'number', e.target.value)} /></Field>
                <Field label="Title"><Input value={c.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Fundamental Research" /></Field>
              </div>
              <Field label="Short description (fallback if no bullets)"><Textarea value={c.description} onChange={e => update(i, 'description', e.target.value)} rows={2} /></Field>

              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Bullet Points</label>
                  <button type="button" onClick={() => addBullet(i)} style={{ background: 'rgba(0,180,160,0.1)', border: '1px solid rgba(0,180,160,0.25)', borderRadius: 6, padding: '0.3rem 0.7rem', color: '#00B4A0', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>+ Add Bullet</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(c.bullets || []).map((b: string, bi: number) => (
                    <div key={bi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Input value={b} onChange={e => updateBullet(i, bi, e.target.value)} placeholder="Bullet point text..." />
                      <DeleteButton onClick={() => removeBullet(i, bi)} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}