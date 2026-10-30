import { Schema, model } from 'mongoose'

export const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'] as const

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: '', trim: true, maxlength: 160 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
    phone: { type: String, default: '', trim: true, maxlength: 20 },
    interest: { type: String, default: '', trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'new' },
  },
  { timestamps: true },
)

enquirySchema.index({ status: 1, createdAt: -1 })

export const EnquiryModel = model('Enquiry', enquirySchema)
