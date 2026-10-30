import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

export const ROLES = ['partner', 'admin'] as const
export const ACCOUNT_STATUSES = ['pending', 'approved', 'rejected', 'suspended'] as const
export const BUSINESS_TYPES = ['retailer', 'distributor', 'service_centre', 'small_business', 'enterprise', 'other'] as const
export const STEP_STATUSES = ['todo', 'in_review', 'done', 'needs_changes'] as const

/** Default onboarding checklist for every new partner. Admins update each step's status. */
export const DEFAULT_ONBOARDING = [
  { key: 'business_details', label: 'Business details' },
  { key: 'kyc_documents', label: 'KYC documents' },
  { key: 'verification', label: 'Verification' },
  { key: 'agreement', label: 'Partner agreement' },
  { key: 'activation', label: 'Account activation' },
]

const stepSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    status: { type: String, enum: STEP_STATUSES, default: 'todo' },
    note: { type: String, default: '', maxlength: 500 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'partner' },
    status: { type: String, enum: ACCOUNT_STATUSES, default: 'pending' },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, default: '', trim: true, maxlength: 20 },
    business: {
      name: { type: String, default: '', trim: true, maxlength: 160 },
      type: { type: String, enum: [...BUSINESS_TYPES, ''], default: '' },
      city: { type: String, default: '', trim: true, maxlength: 80 },
      state: { type: String, default: '', trim: true, maxlength: 80 },
      gstin: { type: String, default: '', trim: true, uppercase: true, maxlength: 15 },
    },
    onboarding: { type: [stepSchema], default: () => DEFAULT_ONBOARDING.map((s) => ({ ...s })) },
    adminNote: { type: String, default: '', maxlength: 1000 },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

userSchema.index({ role: 1, status: 1, createdAt: -1 })

export type User = InferSchemaType<typeof userSchema>
export type UserDoc = HydratedDocument<User>
export const UserModel = model('User', userSchema)

/** Safe public shape of a user (never includes the password hash). */
export function publicUser(u: UserDoc) {
  return {
    id: u.id as string,
    email: u.email,
    role: u.role,
    status: u.status,
    name: u.name,
    phone: u.phone,
    business: u.business,
    onboarding: u.onboarding,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }
}
