import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Field, Input, SaveButton, Toast, Card } from '@/components/admin/FormComponents'

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' as 'success' | 'error' })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setToast({ msg: 'Passwords do not match', type: 'error' }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3000); return
    }
    if (form.newPassword.length < 8) {
      setToast({ msg: 'Password must be at least 8 characters', type: 'error' }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3000); return
    }
    setLoading(true)
    const r = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) })
    const data = await r.json()
    setLoading(false)
    if (r.ok) {
      setToast({ msg: 'Password changed successfully!', type: 'success' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setToast({ msg: data.error || 'Failed', type: 'error' })
    }
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  return (
    <AdminLayout title="Change Password">
      {toast.msg && <Toast message={toast.msg} type={toast.type} />}
      <form onSubmit={save} style={{ maxWidth: 500 }}>
        <Card>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 500 }}>Update Admin Password</h3>
          <Field label="Current Password"><Input type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} required /></Field>
          <Field label="New Password"><Input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required minLength={8} /></Field>
          <Field label="Confirm New Password"><Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required /></Field>
          <div style={{ marginTop: '1rem' }}><SaveButton loading={loading} /></div>
        </Card>
      </form>
    </AdminLayout>
  )
}
