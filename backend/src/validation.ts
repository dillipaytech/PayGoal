import { z } from 'zod'
import { BUSINESS_TYPES } from './models/User.js'

const email = z.string().trim().toLowerCase().email('Enter a valid email address.').max(200)
const phone = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+\d\s()-]*$/, 'Use digits, spaces and + only.')
  .optional()
  .default('')
const password = z.string().min(8, 'Use at least 8 characters.').max(200)
const gstin = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^$|^[0-9]{2}[A-Z0-9]{13}$/, 'Enter a valid 15-character GSTIN, or leave it empty.')
  .optional()
  .default('')

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  email,
  phone,
  password,
  businessName: z.string().trim().min(2, 'Enter your business name.').max(160),
  businessType: z.enum(BUSINESS_TYPES, { message: 'Choose a business type.' }),
  city: z.string().trim().max(80).optional().default(''),
  state: z.string().trim().max(80).optional().default(''),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.').max(200),
})

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  phone,
  business: z.object({
    name: z.string().trim().min(2, 'Enter your business name.').max(160),
    type: z.enum(BUSINESS_TYPES, { message: 'Choose a business type.' }),
    city: z.string().trim().max(80).optional().default(''),
    state: z.string().trim().max(80).optional().default(''),
    gstin,
  }),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.'),
  newPassword: password,
})

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  company: z.string().trim().max(160).optional().default(''),
  email,
  phone,
  interest: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters).').max(3000),
  // Honeypot: real people leave this empty; bots fill it in.
  website: z.string().max(0).optional().default(''),
})

export const ticketCreateSchema = z.object({
  subject: z.string().trim().min(4, 'Add a short subject.').max(160),
  category: z.enum(['onboarding', 'technical', 'account', 'general']).default('general'),
  message: z.string().trim().min(5, 'Describe your question.').max(5000),
})

export const ticketReplySchema = z.object({
  body: z.string().trim().min(1, 'Write a message.').max(5000),
})
