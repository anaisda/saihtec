import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { readAdmin } from '@/lib/db'
import { signToken, setAuthCookie } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })

  const admin = readAdmin()
  const user = admin.users.find((u: any) => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role })
  setAuthCookie(res, token)
  return res.status(200).json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
}
