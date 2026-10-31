import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { z } from 'zod'
import { ACCOUNT_STATUSES, STEP_STATUSES, UserModel, publicUser } from '../models/User.js'
import { EnquiryModel, ENQUIRY_STATUSES } from '../models/Enquiry.js'
import { TicketModel } from '../models/Ticket.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { HttpError, parse } from '../middleware/errors.js'

/** Admin-only: partners, onboarding, enquiries. */
export const adminRouter = Router()
adminRouter.use(requireAuth, requireRole('admin'))

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

adminRouter.get('/stats', async (_req, res) => {
  const [byStatus, openTickets, newEnquiries, recentPartners] = await Promise.all([
    UserModel.aggregate<{ _id: string; count: number }>([
      { $match: { role: 'partner' } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    TicketModel.countDocuments({ status: 'open' }),
    EnquiryModel.countDocuments({ status: 'new' }),
    UserModel.find({ role: 'partner' }).sort({ createdAt: -1 }).limit(5).select('name email status business.name createdAt').lean(),
  ])
  const partners = Object.fromEntries(ACCOUNT_STATUSES.map((s) => [s, byStatus.find((b) => b._id === s)?.count ?? 0]))
  res.json({ partners, openTickets, newEnquiries, recentPartners })
})

/* ---------- Partners ---------- */

adminRouter.get('/partners', async (req, res) => {
  const q = z.string().trim().max(100).optional().catch(undefined).parse(req.query.q)
  const status = z.enum(ACCOUNT_STATUSES).optional().catch(undefined).parse(req.query.status)
  const filter: Record<string, unknown> = { role: 'partner' }
  if (status) filter.status = status
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i')
    filter.$or = [{ name: rx }, { email: rx }, { 'business.name': rx }, { 'business.city': rx }]
  }
  const partners = await UserModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .select('name email phone status business createdAt lastLoginAt')
    .lean()
  res.json({ partners })
})

async function loadPartner(id: string) {
  if (!isValidObjectId(id)) throw new HttpError(404, 'User not found.')
  const user = await UserModel.findOne({ _id: id, role: 'partner' })
  if (!user) throw new HttpError(404, 'User not found.')
  return user
}

adminRouter.get('/partners/:id', async (req, res) => {
  const user = await loadPartner(req.params.id)
  const tickets = await TicketModel.find({ user: user._id }).sort({ updatedAt: -1 }).limit(20).select('subject status updatedAt').lean()
  res.json({ partner: { ...publicUser(user), adminNote: user.adminNote }, tickets })
})

adminRouter.patch('/partners/:id', async (req, res) => {
  const user = await loadPartner(req.params.id)
  const body = parse(
    z.object({
      status: z.enum(ACCOUNT_STATUSES).optional(),
      adminNote: z.string().max(1000).optional(),
    }),
    req.body,
  )
  if (body.status) user.status = body.status
  if (body.adminNote !== undefined) user.adminNote = body.adminNote
  await user.save()
  res.json({ partner: { ...publicUser(user), adminNote: user.adminNote } })
})

adminRouter.patch('/partners/:id/onboarding/:key', async (req, res) => {
  const user = await loadPartner(req.params.id)
  const step = user.onboarding.find((s) => s.key === req.params.key)
  if (!step) throw new HttpError(404, 'Onboarding step not found.')
  const body = parse(z.object({ status: z.enum(STEP_STATUSES), note: z.string().max(500).optional() }), req.body)
  step.status = body.status
  if (body.note !== undefined) step.note = body.note
  step.updatedAt = new Date()
  await user.save()
  res.json({ partner: { ...publicUser(user), adminNote: user.adminNote } })
})

/* ---------- Enquiries (website contact form) ---------- */

adminRouter.get('/enquiries', async (req, res) => {
  const status = z.enum(ENQUIRY_STATUSES).optional().catch(undefined).parse(req.query.status)
  const enquiries = await EnquiryModel.find(status ? { status } : {}).sort({ createdAt: -1 }).limit(300).lean()
  res.json({ enquiries })
})

adminRouter.patch('/enquiries/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(404, 'Enquiry not found.')
  const { status } = parse(z.object({ status: z.enum(ENQUIRY_STATUSES) }), req.body)
  const enquiry = await EnquiryModel.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!enquiry) throw new HttpError(404, 'Enquiry not found.')
  res.json({ enquiry })
})
