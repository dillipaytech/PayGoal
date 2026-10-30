import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { UserModel, publicUser } from '../models/User.js'
import { clearSession, requireAuth, setSession } from '../middleware/auth.js'
import { HttpError, parse } from '../middleware/errors.js'
import { loginSchema, signupSchema } from '../validation.js'

export const authRouter = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' },
})

// Compared against when the email does not exist, so response time doesn't reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('paygoal-timing-guard', 12)

authRouter.post('/signup', authLimiter, async (req, res) => {
  const body = parse(signupSchema, req.body)

  if (await UserModel.exists({ email: body.email })) {
    throw new HttpError(409, 'An account with this email already exists. Try logging in.')
  }

  const user = await UserModel.create({
    email: body.email,
    passwordHash: await bcrypt.hash(body.password, 12),
    role: 'partner',
    status: 'pending',
    name: body.name,
    phone: body.phone,
    business: { name: body.businessName, type: body.businessType, city: body.city, state: body.state },
  })
  // Business details were given at signup, so the first onboarding step is complete.
  const first = user.onboarding.find((s) => s.key === 'business_details')
  if (first) first.status = 'done'
  user.lastLoginAt = new Date()
  await user.save()

  setSession(res, user)
  res.status(201).json({ user: publicUser(user) })
})

authRouter.post('/login', authLimiter, async (req, res) => {
  const { email, password } = parse(loginSchema, req.body)
  const user = await UserModel.findOne({ email }).select('+passwordHash')

  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !ok) throw new HttpError(401, 'Incorrect email or password.')
  if (user.status === 'suspended') throw new HttpError(403, 'This account is suspended. Please contact PayGoal.')

  user.lastLoginAt = new Date()
  await user.save()
  setSession(res, user)
  res.json({ user: publicUser(user) })
})

authRouter.post('/logout', (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user!) })
})
