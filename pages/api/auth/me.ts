import type { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from '@/lib/auth'

export default withAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ user: (req as any).user })
})
