import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json')
const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json')

export function readContent() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

export function writeContent(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function readAdmin() {
  if (!fs.existsSync(ADMIN_FILE)) {
    // Default admin — CHANGE PASSWORD ON FIRST LOGIN
    const bcrypt = require('bcryptjs')
    const hash = bcrypt.hashSync('admin123', 10)
    const defaults = { users: [{ id: '1', email: 'admin@saihtec.com', password: hash, name: 'Admin', role: 'superadmin' }] }
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaults, null, 2))
    return defaults
  }
  return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'))
}

export function writeAdmin(data: any) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2), 'utf-8')
}
