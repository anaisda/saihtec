import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminFAQ() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.faq || { tagline: 'Frequently Asked', items: [] }))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'faq', data }),
    })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updateItem = (i: number, k: string, v: string) => {
    const items = [...(data.items || [])]; items[i] = { ...items[i], [k]: v }; setData({ ...data, items })
  }

  if (!data) return <AdminLayout title="FAQ"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="FAQ">
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'rgba(0,180,160,0.15)', border: '1px solid rgba(0,180,160,0.3)', borderRadius: 10, padding: '0.9rem 1.5rem', color: '#00B4A0', fontSize: '0.88rem' }}>{toast}</div>}
      <form onSubmit={save} style={{ maxWidth: 800 }}>
        <Card style={{ marginBottom: '1.5rem' }}>
          <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} placeholder="Frequently Asked" /></Field>
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Questions & Answers</h3>
            <AddButton onClick={() => setData({ ...data, items: [...(data.items||[]), { id: uuid(), q: '', a: '' }] })} label="Add Q&A" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(data.items || []).map((item: any, i: number) => (
              <div key={item.id || i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#00B4A0' }}>Q&A {i+1}</span>
                  <DeleteButton onClick={() => setData({ ...data, items: data.items.filter((_: any, j: number) => j !== i) })} />
                </div>
                <Field label="Question">
                  <Input value={item.q} onChange={e => updateItem(i, 'q', e.target.value)} placeholder="What types of MSCs does SAIHTEC manufacture?" />
                </Field>
                <Field label="Answer">
                  <Textarea value={item.a} onChange={e => updateItem(i, 'a', e.target.value)} rows={3} placeholder="Detailed answer..." />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}