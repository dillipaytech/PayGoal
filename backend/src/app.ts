import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.js'
import { enquiryRouter } from './routes/enquiries.js'
import { meRouter } from './routes/me.js'
import { ticketRouter } from './routes/tickets.js'
import { adminRouter } from './routes/admin.js'
import { errorHandler, notFound, requireJson } from './middleware/errors.js'

/**
 * PayGoal API. Everything is mounted under /api.
 * Deliberately contains NO payment, wallet or money-transfer features.
 */
export function createApp() {
  const app = express()

  app.set('trust proxy', 1) // behind nginx: use the real client IP for rate limiting
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())
  app.use('/api', requireJson)

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRouter)
  app.use('/api/enquiries', enquiryRouter)
  app.use('/api/me', meRouter)
  app.use('/api/tickets', ticketRouter)
  app.use('/api/admin', adminRouter)

  app.use(notFound)
  app.use(errorHandler)
  return app
}
