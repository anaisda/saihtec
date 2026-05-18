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

  const update = (i: number, key: string, val: string) => { const c = [...cards]; c[i] = { ...c[i], [key]: val }; setCards(c) }

  return (
    <AdminLayout title="Technology Cards">
      {toast && <Toast message={toast} />}
      <form onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <AddButton onClick={() => setCards([...cards, { id: uuid(), order: cards.length + 1, number: `0${cards.length + 1}`, title: '', description: '' }])} label="Add Card" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {cards.map((c, i) => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#00B4A0', letterSpacing: '0.1em' }}>CARD {i + 1}</span>
                <DeleteButton onClick={() => setCards(cards.filter((_, j) => j !== i))} />
              </div>
              <Field label="Display Number (e.g. 01)"><Input value={c.number} onChange={e => update(i, 'number', e.target.value)} /></Field>
              <Field label="Title"><Input value={c.title} onChange={e => update(i, 'title', e.target.value)} /></Field>
              <Field label="Description"><Textarea value={c.description} onChange={e => update(i, 'description', e.target.value)} rows={4} /></Field>
            </Card>
          ))}
        </div>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
