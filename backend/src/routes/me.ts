import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { UserModel, publicUser } from '../models/User.js'
import { TicketModel } from '../models/Ticket.js'
import { requireAuth } from '../middleware/auth.js'
import { HttpError, parse } from '../middleware/errors.js'
import { passwordSchema, profileSchema } from '../validation.js'

/** The signed-in user's own account (partners and admins). */
export const meRouter = Router()
meRouter.use(requireAuth)

meRouter.get('/overview', async (req, res) => {
  const user = req.user!
  const [openTickets, recentTickets] = await Promise.all([
    TicketModel.countDocuments({ user: user._id, status: { $ne: 'closed' } }),
    TicketModel.find({ user: user._id }).sort({ updatedAt: -1 }).limit(5).select('subject status category updatedAt').lean(),
  ])
  res.json({ user: publicUser(user), openTickets, recentTickets })
})

meRouter.put('/profile', async (req, res) => {
  const body = parse(profileSchema, req.body)
  const user = req.user!
  user.name = body.name
  user.phone = body.phone
  user.business = body.business
  await user.save()
  res.json({ user: publicUser(user) })
})

meRouter.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = parse(passwordSchema, req.body)
  const user = await UserModel.findById(req.user!._id).select('+passwordHash')
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new HttpError(400, 'Your current password is incorrect.')
  }
  user.passwordHash = await bcrypt.hash(newPassword, 12)
  await user.save()
  res.json({ ok: true })
})
