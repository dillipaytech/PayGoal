import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { EnquiryModel } from '../models/Enquiry.js'
import { parse } from '../middleware/errors.js'
import { enquirySchema } from '../validation.js'

/** Public: the website's contact form. */
export const enquiryRouter = Router()

const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'You have sent several messages already. Please try again a little later.' },
})

enquiryRouter.post('/', enquiryLimiter, async (req, res) => {
  const { website, ...data } = parse(enquirySchema, req.body)
  // Honeypot filled in: pretend success, store nothing.
  if (!website) await EnquiryModel.create(data)
  res.status(201).json({ ok: true })
})
