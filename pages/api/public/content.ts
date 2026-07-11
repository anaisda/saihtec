import type { NextApiRequest, NextApiResponse } from 'next'
import { readContent } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  const content = await readContent()
  return res.status(200).json(content)
}