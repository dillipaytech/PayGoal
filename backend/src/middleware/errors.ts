import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Parses and validates a request body (or query) with a zod schema; throws a 400 on failure. */
export function parse<T>(schema: ZodType<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Blocks cross-site form posts: every state-changing request must be JSON.
 * Combined with SameSite=Lax cookies and no CORS, this prevents CSRF.
 */
export function requireJson(req: Request, _res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  if (!req.is('application/json')) throw new HttpError(415, 'Requests must be sent as JSON.')
  next()
}

export function notFound(_req: Request, _res: Response) {
  throw new HttpError(404, 'Not found.')
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {}
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'form'
      fields[key] ??= issue.message
    }
    return res.status(400).json({ error: 'Please check the highlighted fields.', fields })
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })

  // Malformed JSON body
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Invalid request.' })

  console.error(err)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
}
