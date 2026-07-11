import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { readContent } from '@/lib/db'

const MSGS_FILE = path.join(process.cwd(), 'data', 'messages.json')

function saveMessage(msg: any) {
  let data = { messages: [] as any[] }
  if (fs.existsSync(MSGS_FILE)) data = JSON.parse(fs.readFileSync(MSGS_FILE, 'utf-8'))
  data.messages = [msg, ...data.messages]
  fs.writeFileSync(MSGS_FILE, JSON.stringify(data, null, 2))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, type, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  // Save to admin inbox
  saveMessage({ id: uuid(), name, email, type, message, date: new Date().toISOString().split('T')[0], read: false })

  // Send email via Resend if API key set
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { settings } = readContent()
      await resend.emails.send({
        from: 'SAIHTEC Website <noreply@resend.dev>',
        to: settings.contactEmail || 'info@saihtec.com',
        replyTo: email,
        subject: `[${type}] New inquiry from ${name}`,
        html: `<div style="font-family:sans-serif;max-width:580px"><h2>New Inquiry</h2><p><b>From:</b> ${name} (${email})</p><p><b>Type:</b> ${type}</p><hr/><p>${message}</p></div>`,
      })
    } catch (err) { console.error('Email error:', err) }
  }

  return res.status(200).json({ success: true })
}
