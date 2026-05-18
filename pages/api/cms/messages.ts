import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { withAuth } from '@/lib/auth'

const MSGS_FILE = path.join(process.cwd(), 'data', 'messages.json')

function readMessages() {
  if (!fs.existsSync(MSGS_FILE)) { fs.writeFileSync(MSGS_FILE, JSON.stringify({ messages: [] })); return { messages: [] } }
  return JSON.parse(fs.readFileSync(MSGS_FILE, 'utf-8'))
}
function writeMessages(data: any) { fs.writeFileSync(MSGS_FILE, JSON.stringify(data, null, 2)) }

export default withAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return res.status(200).json(readMessages())
  if (req.method === 'DELETE') {
    const { id } = req.query
    const data = readMessages()
    data.messages = data.messages.filter((m: any) => m.id !== id)
    writeMessages(data)
    return res.status(200).json({ success: true })
  }
  return res.status(405).end()
})
