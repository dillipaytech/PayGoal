/** Small fetch wrapper for the PayGoal API (same origin, session cookie). */

export class ApiError extends Error {
  status: number
  fields: Record<string, string>
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const method = options.method ?? (options.body === undefined ? 'GET' : 'POST')
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(options.body ?? {}),
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Something went wrong.', data.fields ?? {})
  return data as T
}

/* ---------- Shared types (mirror the server responses) ---------- */

export type Role = 'partner' | 'admin'
export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type StepStatus = 'todo' | 'in_review' | 'done' | 'needs_changes'
export type TicketStatus = 'open' | 'answered' | 'closed'
export type EnquiryStatus = 'new' | 'contacted' | 'closed'

export const BUSINESS_TYPES = [
  { value: 'retailer', label: 'Retailer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'service_centre', label: 'Service centre' },
  { value: 'small_business', label: 'Small business' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'other', label: 'Other' },
] as const

export type Business = { name: string; type: string; city: string; state: string; gstin: string }
export type OnboardingStep = { key: string; label: string; status: StepStatus; note: string; updatedAt: string }

export type User = {
  id: string
  email: string
  role: Role
  status: AccountStatus
  name: string
  phone: string
  business: Business
  onboarding: OnboardingStep[]
  createdAt: string
  lastLoginAt?: string
  adminNote?: string
}

export type TicketMessage = { _id: string; authorName: string; fromStaff: boolean; body: string; createdAt: string }
export type TicketSummary = {
  _id: string
  subject: string
  status: TicketStatus
  category: string
  updatedAt: string
  createdAt?: string
  user?: { _id: string; name: string; email: string; business?: { name: string } }
}
export type Ticket = TicketSummary & {
  messages: TicketMessage[]
  user: string | { _id: string; name: string; email: string; phone?: string; business?: { name: string } }
}

export type Enquiry = {
  _id: string
  name: string
  company: string
  email: string
  phone: string
  interest: string
  message: string
  status: EnquiryStatus
  createdAt: string
}

export const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const formatDateTime = (d?: string) =>
  d
    ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
    : '—'
