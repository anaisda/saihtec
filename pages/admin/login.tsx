import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (r.ok) router.push('/admin') })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error); setLoading(false); return }
      router.push('/admin')
    } catch {
      setError('Server error')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>SAIHTEC Admin</title></Head>
      <div style={{ minHeight: '100vh', background: '#080A0C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ width: 400 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, border: '1.5px solid #00B4A0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00B4A0' }} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', letterSpacing: '0.1em' }}>SAIHTEC</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Content Management System</div>
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2.5rem' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#fff', marginBottom: '1.8rem' }}>Sign in to Admin</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.8rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="admin@saihtec.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.8rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="••••••••" />
              </div>
              {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.2)', borderRadius: 8, padding: '0.7rem 1rem', color: '#ff6b6b', fontSize: '0.85rem' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: '#00B4A0', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem', fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', fontFamily: 'inherit' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)' }}>
            Default: admin@saihtec.com / admin123
          </p>
        </div>
      </div>
    </>
  )
}
