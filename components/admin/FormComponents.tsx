import React from 'react'

const inputBase: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
  padding: '0.75rem 1rem', color: '#fff', fontSize: '0.88rem',
  fontFamily: 'system-ui,sans-serif', outline: 'none',
  transition: 'border-color 0.2s',
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>{children}</label>
}

export function Input({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} style={{ ...inputBase, ...style }}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.5)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
  )
}

export function Textarea({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} style={{ ...inputBase, resize: 'vertical', minHeight: 100, ...style }}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.5)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
  )
}

export function Select({ style, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ ...inputBase, cursor: 'pointer', ...style }}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,180,160,0.5)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function SaveButton({ loading, saved }: { loading?: boolean; saved?: boolean }) {
  return (
    <button type="submit" disabled={loading} style={{
      background: saved ? '#1a5c52' : '#00B4A0', color: '#fff', border: 'none',
      borderRadius: 8, padding: '0.75rem 2rem', fontSize: '0.88rem', fontWeight: 500,
      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
      transition: 'all 0.3s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      {loading ? '⟳ Saving...' : saved ? '✓ Saved!' : '↑ Save Changes'}
    </button>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.5rem', ...style }}>
      {children}
    </div>
  )
}

export function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      background: type === 'success' ? 'rgba(0,180,160,0.15)' : 'rgba(220,50,50,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(0,180,160,0.3)' : 'rgba(220,50,50,0.3)'}`,
      borderRadius: 10, padding: '0.9rem 1.5rem',
      color: type === 'success' ? '#00B4A0' : '#ff6b6b',
      fontSize: '0.88rem', fontWeight: 500,
    }}>{message}</div>
  )
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.2)', borderRadius: 6, padding: '0.4rem 0.8rem', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>
      Delete
    </button>
  )
}

export function AddButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} style={{ background: 'rgba(0,180,160,0.08)', border: '1px solid rgba(0,180,160,0.2)', borderRadius: 8, padding: '0.6rem 1.2rem', color: '#00B4A0', cursor: 'pointer', fontSize: '0.83rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      + {label || 'Add'}
    </button>
  )
}
