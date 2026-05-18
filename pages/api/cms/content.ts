import type { NextApiRequest, NextApiResponse } from 'next'
import { readContent, writeContent } from '@/lib/db'
import { withAuth } from '@/lib/auth'

export default withAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(readContent())
  }
  if (req.method === 'PUT') {
    const current = readContent()
    const { section, data } = req.body
    if (!section || !data) return res.status(400).json({ error: 'Missing section or data' })
    const updated = { ...current, [section]: data }
    writeContent(updated)
    return res.status(200).json({ success: true })
  }
  return res.status(405).end()
})
