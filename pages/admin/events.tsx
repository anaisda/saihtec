import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, Select, Textarea, SaveButton, Toast, Card, AddButton, DeleteButton } from '@/components/admin/FormComponents'

export default function AdminEvents() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/cms/content').then(r => r.json()).then(d => setData(d.events || { tagline: 'Events & Gallery', title: 'Where science', titleAccent: 'meets the world', subtitle: '', featuredEvent: {}, gallery: [] }))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/cms/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'events', data }) })
    setLoading(false)
    if (r.ok) { setSaved(true); setToast('Saved!'); setTimeout(() => { setSaved(false); setToast('') }, 3000) }
  }

  const updateFeatured = (k: string, v: string) => setData({ ...data, featuredEvent: { ...(data.featuredEvent || {}), [k]: v } })
  const updateGallery = (i: number, k: string, v: string) => {
    const g = [...data.gallery]; g[i] = { ...g[i], [k]: v }; setData({ ...data, gallery: g })
  }

  if (!data) return <AdminLayout title="Events"><div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout title="Events & Gallery">
      {toast && <Toast message={toast} />}
      <form onSubmit={save} style={{ maxWidth: 900 }}>
        {/* Section header */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Section Header</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Tag Label"><Input value={data.tagline || ''} onChange={e => setData({ ...data, tagline: e.target.value })} /></Field>
            <Field label="Subtitle"><Input value={data.subtitle || ''} onChange={e => setData({ ...data, subtitle: e.target.value })} /></Field>
            <Field label="Title"><Input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} /></Field>
            <Field label="Title Accent (italic)"><Input value={data.titleAccent || ''} onChange={e => setData({ ...data, titleAccent: e.target.value })} /></Field>
          </div>
        </Card>

        {/* Featured event */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Featured Event (large card at top)</h3>
          <Field label="Event Title"><Input value={data.featuredEvent?.title || ''} onChange={e => updateFeatured('title', e.target.value)} placeholder="SAIHTEC × Saidal Group Partnership" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Date"><Input value={data.featuredEvent?.date || ''} onChange={e => updateFeatured('date', e.target.value)} placeholder="May 2024" /></Field>
            <Field label="Location"><Input value={data.featuredEvent?.location || ''} onChange={e => updateFeatured('location', e.target.value)} placeholder="Algiers, Algeria" /></Field>
          </div>
          <Field label="Description"><Textarea value={data.featuredEvent?.description || ''} onChange={e => updateFeatured('description', e.target.value)} rows={3} /></Field>
          <Field label="Cover Image URL (direct image link)">
            <Input value={data.featuredEvent?.coverImage || ''} onChange={e => updateFeatured('coverImage', e.target.value)} placeholder="https://images.pexels.com/..." />
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem' }}>Upload your event photos to Cloudinary (free) or Imgur and paste the direct image URL here.</p>
          </Field>
          {data.featuredEvent?.coverImage && (
            <div style={{ marginTop: '0.5rem', borderRadius: 8, overflow: 'hidden', height: 160 }}>
              <img src={data.featuredEvent.coverImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </Card>

        {/* Gallery */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Photo Gallery (masonry grid)</h3>
            <AddButton onClick={() => setData({ ...data, gallery: [...data.gallery, { id: uuid(), caption: '', category: 'Conference', image: '' }] })} label="Add Photo" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
            {(data.gallery || []).map((item: any, i: number) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>PHOTO {i+1}</span>
                  <DeleteButton onClick={() => setData({ ...data, gallery: data.gallery.filter((_: any, j: number) => j !== i) })} />
                </div>
                <Field label="Caption"><Input value={item.caption} onChange={e => updateGallery(i, 'caption', e.target.value)} placeholder="Conference panel discussion" /></Field>
                <Field label="Category">
                  <Select value={item.category} onChange={e => updateGallery(i, 'category', e.target.value)}>
                    {['Conference','Lab','Partnership','Clinical','Award','Team'].map(c => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Image URL">
                  <Input value={item.image} onChange={e => updateGallery(i, 'image', e.target.value)} placeholder="https://..." />
                </Field>
                {item.image && (
                  <div style={{ marginTop: '0.4rem', borderRadius: 6, overflow: 'hidden', height: 100 }}>
                    <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        <SaveButton loading={loading} saved={saved} />
      </form>
    </AdminLayout>
  )
}