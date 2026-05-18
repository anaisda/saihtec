import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Select, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminPublications() {
  const [pubs, setPubs] = useState<any[]>([])
  const [loading, setLoading] = useState(false); const [saved, setSaved] = useState(false); const [toast, setToast] = useState('')

  useEffect(() => { fetch('/api/cms/content').then(r => r.json()).then(d => setPubs(d.publications || [])) }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'publications', data: pubs }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const update = (i: number, k: string, v: string) => { const a = [...pubs]; a[i] = { ...a[i], [k]: v }; setPubs(a) }

  return (
    <AdminLayout title="Publications">
      {toast && <Toast message={toast} />}
      <form onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <AddButton onClick={() => setPubs([{ id: uuid(), year: new Date().getFullYear().toString(), title: '', authors: '', journal: '', url: '', urlType: 'PubMed' }, ...pubs])} label="Add Publication" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {pubs.map((p, i) => (
            <Card key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#00B4A0', fontStyle: 'italic' }}>{p.year}</span>
                <DeleteButton onClick={() => setPubs(pubs.filter((_, j) => j !== i))} />
              </div>
              <Field label="Paper Title">
                <Textarea value={p.title} onChange={e => update(i, 'title', e.target.value)} rows={2} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '0.75rem' }}>
                <Field label="Authors"><Input value={p.authors} onChange={e => update(i, 'authors', e.target.value)} placeholder="Kadri N, et al." /></Field>
                <Field label="Journal & Volume"><Input value={p.journal} onChange={e => update(i, 'journal', e.target.value)} /></Field>
                <Field label="Year"><Input value={p.year} onChange={e => update(i, 'year', e.target.value)} maxLength={4} /></Field>
                <Field label="Link Type">
                  <Select value={p.urlType} onChange={e => update(i, 'urlType', e.target.value)}>
                    {['PubMed', 'DOI', 'PDF', 'Journal'].map(o => <option key={o}>{o}</option>)}
                  </Select>
                </Field>
              </div>
              <Field label="External URL"><Input type="url" value={p.url} onChange={e => update(i, 'url', e.target.value)} placeholder="https://pubmed.ncbi.nlm.nih.gov/..." /></Field>
            </Card>
          ))}
        </div>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}
