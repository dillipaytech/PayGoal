import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { z } from 'zod'
import { TicketModel, TICKET_STATUSES } from '../models/Ticket.js'
import { requireAuth } from '../middleware/auth.js'
import { HttpError, parse } from '../middleware/errors.js'
import { ticketCreateSchema, ticketReplySchema } from '../validation.js'
import { BRAND } from '../config.js'

/** Support tickets. Partners see their own; admins see all. */
export const ticketRouter = Router()
ticketRouter.use(requireAuth)

async function loadTicket(id: string, userId: string, isAdmin: boolean) {
  if (!isValidObjectId(id)) throw new HttpError(404, 'Ticket not found.')
  const ticket = await TicketModel.findById(id)
  if (!ticket || (!isAdmin && String(ticket.user) !== userId)) throw new HttpError(404, 'Ticket not found.')
  return ticket
}

ticketRouter.get('/', async (req, res) => {
  const isAdmin = req.user!.role === 'admin'
  const status = z.enum(TICKET_STATUSES).optional().catch(undefined).parse(req.query.status)
  const filter: Record<string, unknown> = isAdmin ? {} : { user: req.user!._id }
  if (status) filter.status = status

  const tickets = await TicketModel.find(filter)
    .sort({ updatedAt: -1 })
    .limit(200)
    .select('subject status category user updatedAt createdAt')
    .populate(isAdmin ? { path: 'user', select: 'name email business.name' } : [])
    .lean()
  res.json({ tickets })
})

ticketRouter.post('/', async (req, res) => {
  if (req.user!.role !== 'partner') throw new HttpError(403, 'Only users can open tickets.')
  const body = parse(ticketCreateSchema, req.body)
  const ticket = await TicketModel.create({
    user: req.user!._id,
    subject: body.subject,
    category: body.category,
    messages: [{ author: req.user!._id, authorName: req.user!.name, fromStaff: false, body: body.message }],
  })
  res.status(201).json({ ticket })
})

ticketRouter.get('/:id', async (req, res) => {
  const isAdmin = req.user!.role === 'admin'
  const ticket = await loadTicket(req.params.id, req.user!.id, isAdmin)
  if (isAdmin) await ticket.populate({ path: 'user', select: 'name email phone business.name' })
  res.json({ ticket })
})

ticketRouter.post('/:id/messages', async (req, res) => {
  const isAdmin = req.user!.role === 'admin'
  const ticket = await loadTicket(req.params.id, req.user!.id, isAdmin)
  if (ticket.status === 'closed' && !isAdmin) throw new HttpError(400, 'This ticket is closed. Please open a new one.')

  const { body } = parse(ticketReplySchema, req.body)
  ticket.messages.push({ author: req.user!._id, authorName: isAdmin ? `${BRAND} Support` : req.user!.name, fromStaff: isAdmin, body })
  ticket.status = isAdmin ? 'answered' : 'open'
  await ticket.save()
  res.status(201).json({ ticket })
})

ticketRouter.patch('/:id', async (req, res) => {
  const isAdmin = req.user!.role === 'admin'
  const ticket = await loadTicket(req.params.id, req.user!.id, isAdmin)
  const { status } = parse(z.object({ status: z.enum(TICKET_STATUSES) }), req.body)
  // Partners may only close their own tickets; admins can set any status.
  if (!isAdmin && status !== 'closed') throw new HttpError(403, 'You can only close a ticket.')
  ticket.status = status
  await ticket.save()
  res.json({ ticket })
})
