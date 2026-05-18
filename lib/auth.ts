import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

const SECRET = process.env.JWT_SECRET || 'saihtec-super-secret-change-in-production-2026'
const COOKIE = 'saihtec_admin_token'

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export function verifyToken(token: string) {
  try { return jwt.verify(token, SECRET) as any }
  catch { return null }
}

export function getTokenFromRequest(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || '')
  return cookies[COOKIE] || null
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  }))
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  }))
}

export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenFromRequest(req)
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const user = verifyToken(token)
    if (!user) return res.status(401).json({ error: 'Token expired' })
    ;(req as any).user = user
    return handler(req, res)
  }
}
