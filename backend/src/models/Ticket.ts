import { Schema, model } from 'mongoose'

export const TICKET_STATUSES = ['open', 'answered', 'closed'] as const
export const TICKET_CATEGORIES = ['onboarding', 'technical', 'account', 'general'] as const

const messageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    fromStaff: { type: Boolean, default: false },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const ticketSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, enum: TICKET_CATEGORIES, default: 'general' },
    status: { type: String, enum: TICKET_STATUSES, default: 'open' },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
)

ticketSchema.index({ status: 1, updatedAt: -1 })

export const TicketModel = model('Ticket', ticketSchema)
