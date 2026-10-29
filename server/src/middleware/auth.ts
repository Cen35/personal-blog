import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export type AuthRequest = Request & { user?: { id: number; username: string } }

function readToken(req: Request) {
  const header = req.headers.authorization
  return header?.startsWith('Bearer ') ? header.slice(7) : null
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = readToken(req)
  if (token) {
    try { req.user = jwt.verify(token, env.JWT_SECRET) as { id: number; username: string } } catch { /* visitor remains anonymous */ }
  }
  next()
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = readToken(req)
  if (!token) return res.status(401).json({ message: '请先登录后再继续。' })
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as { id: number; username: string }
    next()
  } catch {
    return res.status(401).json({ message: '登录状态已失效，请重新登录。' })
  }
}

