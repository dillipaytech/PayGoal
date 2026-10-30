/* Small UI kit for the partner and admin portal. */
import { useId, type ComponentProps, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-medium text-ink md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[0.95rem] text-slate-ink">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode }) {
  return (
    <section className={`card-light p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && <h2 className="text-xl font-medium text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

type FieldProps = { label: string; error?: string; hint?: ReactNode; children: (id: string, describedBy?: string) => ReactNode }

export function Field({ label, error, hint, children }: FieldProps) {
  const id = useId()
  const msgId = `${id}-msg`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="mt-1.5">{children(id, error || hint ? msgId : undefined)}</div>
      {error ? (
        <p id={msgId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={msgId} className="mt-1.5 text-xs text-slate-ink">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const control =
  'w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-slate-ink/60 transition-colors focus:border-emerald-deep focus:outline-none focus:ring-2 focus:ring-emerald/25 aria-[invalid=true]:border-red-600'

export const Input = ({ className = '', ...p }: ComponentProps<'input'>) => <input className={`${control} ${className}`} {...p} />
export const Textarea = ({ className = '', ...p }: ComponentProps<'textarea'>) => (
  <textarea className={`${control} min-h-28 ${className}`} {...p} />
)
export const Select = ({ className = '', ...p }: ComponentProps<'select'>) => <select className={`${control} ${className}`} {...p} />

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'dark' | 'ghost' | 'danger'; loading?: boolean }

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...p }: ButtonProps) {
  const styles = {
    primary: 'bg-[image:var(--gradient-emerald)] text-ink shadow-[0_8px_24px_-12px_rgb(16_185_129/0.7)]',
    dark: 'bg-ink text-snow hover:bg-ink-card',
    ghost: 'border border-ink/15 text-ink hover:border-gold-deep bg-transparent',
    danger: 'border border-red-700/30 text-red-700 hover:bg-red-50 bg-transparent',
  }[variant]
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[transform,background-color,border-color] duration-300 hover:-translate-y-px disabled:pointer-events-none disabled:opacity-60 ${styles} ${className}`}
      disabled={disabled || loading}
      {...p}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function Notice({ tone = 'error', children }: { tone?: 'error' | 'success' | 'info'; children: ReactNode }) {
  if (!children) return null
  const styles = {
    error: 'border-red-700/20 bg-red-50 text-red-800',
    success: 'border-emerald-deep/20 bg-emerald/10 text-emerald-deep',
    info: 'border-gold-deep/25 bg-gold/10 text-ink',
  }[tone]
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex gap-2.5 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

const BADGE: Record<string, string> = {
  // account
  pending: 'bg-gold/20 text-gold-deep',
  approved: 'bg-emerald/15 text-emerald-deep',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-ink/10 text-ink',
  // onboarding
  todo: 'bg-ink/[0.06] text-slate-ink',
  in_review: 'bg-gold/20 text-gold-deep',
  done: 'bg-emerald/15 text-emerald-deep',
  needs_changes: 'bg-red-100 text-red-800',
  // tickets / enquiries
  open: 'bg-gold/20 text-gold-deep',
  answered: 'bg-emerald/15 text-emerald-deep',
  closed: 'bg-ink/[0.06] text-slate-ink',
  new: 'bg-gold/20 text-gold-deep',
  contacted: 'bg-emerald/15 text-emerald-deep',
}

export const statusLabel = (s: string) =>
  ({ todo: 'To do', in_review: 'In review', needs_changes: 'Needs changes', done: 'Done' })[s] ?? s.charAt(0).toUpperCase() + s.slice(1)

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${BADGE[status] ?? 'bg-ink/10 text-ink'}`}>
      {statusLabel(status)}
    </span>
  )
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-ink text-emerald-2">{icon}</span>
      <p className="mt-4 font-display text-xl text-ink">{title}</p>
      {children && <div className="mt-2 max-w-sm text-sm text-slate-ink">{children}</div>}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-ink" role="status">
      <Loader2 className="size-5 animate-spin text-emerald-deep" aria-hidden="true" />
      {label}
    </div>
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ivory">
      <Spinner />
    </div>
  )
}
