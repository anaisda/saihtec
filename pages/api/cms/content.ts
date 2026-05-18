import type { NextApiRequest, NextApiResponse } from 'next'
import { readContent, writeSingleSection } from '@/lib/db'
import { withAuth } from '@/lib/auth'

export default withAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const content = await readContent()
    return res.status(200).json(content)
  }
  if (req.method === 'PUT') {
    const { section, data } = req.body
    if (!section || data === undefined) return res.status(400).json({ error: 'Missing section or data' })
    await writeSingleSection(section, data)
    return res.status(200).json({ success: true })
  }
  return res.status(405).end()
})