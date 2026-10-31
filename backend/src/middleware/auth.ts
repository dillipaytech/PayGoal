import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BRAND, config } from '../config.js'
import { UserModel, type UserDoc } from '../models/User.js'
import { HttpError } from './errors.js'

const COOKIE = 'pg_session'

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDoc
  }
}

/** Issues the session as an httpOnly cookie (not readable by JavaScript). */
export function setSession(res: Response, user: UserDoc) {
  const token = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: `${config.sessionDays}d`,
  })
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: config.sessionDays * 24 * 60 * 60 * 1000,
  })
}

export function clearSession(res: Response) {
  res.clearCookie(COOKIE, { httpOnly: true, secure: config.cookieSecure, sameSite: 'lax', path: '/' })
}

/** Loads the signed-in user from the session cookie. Rejects missing, invalid or suspended sessions. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE] as string | undefined
  if (!token) throw new HttpError(401, 'Please log in.')

  let payload: jwt.JwtPayload
  try {
    payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload
  } catch {
    throw new HttpError(401, 'Your session has expired. Please log in again.')
  }

  const user = await UserModel.findById(payload.sub)
  if (!user) throw new HttpError(401, 'Please log in.')
  if (user.status === 'suspended') throw new HttpError(403, `This account is suspended. Please contact ${BRAND}.`)
  req.user = user
  next()
}

export function requireRole(role: 'admin' | 'partner') {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.role !== role) throw new HttpError(403, 'You do not have access to this.')
    next()
  }
}
