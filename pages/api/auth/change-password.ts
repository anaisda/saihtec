import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { readAdmin, writeAdmin } from '@/lib/db'
import { withAuth } from '@/lib/auth'

export default withAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { currentPassword, newPassword } = req.body
  const user = (req as any).user
  const admin = readAdmin()
  const dbUser = admin.users.find((u: any) => u.id === user.id)
  if (!dbUser) return res.status(404).json({ error: 'User not found' })
  const valid = await bcrypt.compare(currentPassword, dbUser.password)
  if (!valid) return res.status(401).json({ error: 'Current password is wrong' })
  if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  dbUser.password = await bcrypt.hash(newPassword, 12)
  writeAdmin(admin)
  return res.status(200).json({ success: true })
})