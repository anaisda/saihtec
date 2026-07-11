import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card } from '@/components/admin/FormComponents'

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cms/messages').then(r => r.json()).then(d => setMessages(d.messages || [])).catch(() => setMessages([]))
  }, [])

  const deleteMsg = async (id: string) => {
    await fetch(`/api/cms/messages?id=${id}`, { method: 'DELETE' })
    setMessages(messages.filter(m => m.id !== id))
  }

  return (
    <AdminLayout title="Contact Messages">
      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
          No messages yet. Contact form submissions will appear here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map(m => (
            <Card key={m.id} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,180,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: '#00B4A0', fontWeight: 600 }}>
                    {m.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{m.email} · {m.type} · {m.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{expanded === m.id ? '▲' : '▼'}</span>
                  <button onClick={e => { e.stopPropagation(); deleteMsg(m.id) }} style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.15)', borderRadius: 5, padding: '0.3rem 0.6rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>Delete</button>
                </div>
              </div>
              {expanded === m.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {m.message}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
