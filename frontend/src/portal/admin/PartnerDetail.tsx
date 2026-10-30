import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { api, BUSINESS_TYPES, formatDate, formatDateTime, type AccountStatus, type StepStatus, type TicketSummary, type User } from '../../lib/api'
import { useResource } from '../useResource'
import { onboardingProgress, OnboardingSteps, ProgressBar } from '../shared'
import { Button, Card, Field, Notice, PageHeader, Select, Spinner, StatusBadge, Textarea } from '../ui'

type Data = { partner: User; tickets: TicketSummary[] }

function StepEditor({ partnerId, stepKey, status, note, onSaved }: { partnerId: string; stepKey: string; status: StepStatus; note: string; onSaved: (u: User) => void }) {
  const [s, setS] = useState(status)
  const [n, setN] = useState(note)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const dirty = s !== status || n !== note

  const save = async () => {
    setBusy(true)
    setErr('')
    try {
      const { partner } = await api<{ partner: User }>(`/admin/partners/${partnerId}/onboarding/${stepKey}`, { method: 'PATCH', body: { status: s, note: n } })
      onSaved(partner)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select aria-label="Step status" value={s} onChange={(e) => setS(e.target.value as StepStatus)} className="!w-auto !py-1.5 text-sm">
        <option value="todo">To do</option>
        <option value="in_review">In review</option>
        <option value="needs_changes">Needs changes</option>
        <option value="done">Done</option>
      </Select>
      <input
        aria-label="Note shown to partner"
        placeholder="Note shown to the partner (optional)"
        value={n}
        onChange={(e) => setN(e.target.value)}
        maxLength={500}
        className="min-w-0 flex-1 rounded-xl border border-ink/15 bg-white px-3 py-1.5 text-sm focus:border-emerald-deep focus:ring-2 focus:ring-emerald/25 focus:outline-none"
      />
      {dirty && (
        <Button onClick={save} loading={busy} className="!py-1.5">
          Save
        </Button>
      )}
      {err && <span className="text-sm text-red-700">{err}</span>}
    </div>
  )
}

export default function AdminPartnerDetail() {
  const { id } = useParams()
  const { data, setData, error, loading } = useResource<Data>(`/admin/partners/${id}`)
  const [note, setNote] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [busy, setBusy] = useState('')

  if (loading) return <Spinner />
  if (error || !data) return <Notice>{error || 'Partner not found.'}</Notice>
  const p = data.partner
  const progress = onboardingProgress(p.onboarding)
  const update = (partner: User) => setData({ ...data, partner })

  const patch = async (body: { status?: AccountStatus; adminNote?: string }, label: string) => {
    setBusy(label)
    setMsg(null)
    try {
      const { partner } = await api<{ partner: User }>(`/admin/partners/${p.id}`, { method: 'PATCH', body })
      update(partner)
      setMsg({ tone: 'success', text: `${label} saved.` })
    } catch (e) {
      setMsg({ tone: 'error', text: (e as Error).message })
    } finally {
      setBusy('')
    }
  }

  const statusActions: { status: AccountStatus; label: string; variant: 'primary' | 'ghost' | 'danger' }[] = [
    { status: 'approved', label: 'Approve', variant: 'primary' },
    { status: 'pending', label: 'Mark pending', variant: 'ghost' },
    { status: 'rejected', label: 'Reject', variant: 'danger' },
    { status: 'suspended', label: 'Suspend', variant: 'danger' },
  ]

  const details: [string, string][] = [
    ['Contact', p.name],
    ['Email', p.email],
    ['Phone', p.phone || '—'],
    ['Business type', BUSINESS_TYPES.find((t) => t.value === p.business.type)?.label ?? '—'],
    ['Location', [p.business.city, p.business.state].filter(Boolean).join(', ') || '—'],
    ['GSTIN', p.business.gstin || '—'],
    ['Joined', formatDate(p.createdAt)],
    ['Last login', formatDateTime(p.lastLoginAt)],
  ]

  return (
    <div className="space-y-8">
      <Link to="/admin/partners" className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-ink hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> All partners
      </Link>
      <PageHeader title={p.business.name || p.name} description={<StatusBadge status={p.status} />} />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <Card title="Details">
            <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-3 text-sm">
              {details.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-slate-ink">{k}</dt>
                  <dd className="min-w-0 font-medium break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Account status">
            <div className="flex flex-wrap gap-2">
              {statusActions
                .filter((a) => a.status !== p.status)
                .map((a) => (
                  <Button key={a.status} variant={a.variant} loading={busy === a.label} onClick={() => patch({ status: a.status }, a.label)}>
                    {a.label}
                  </Button>
                ))}
            </div>
            <p className="mt-3 text-xs text-slate-ink">Suspended partners cannot log in.</p>
          </Card>

          <Card title="Internal note">
            <Field label="Only visible to admins">
              {(fid) => <Textarea id={fid} value={note ?? p.adminNote ?? ''} onChange={(e) => setNote(e.target.value)} maxLength={1000} />}
            </Field>
            <div className="mt-3 flex justify-end">
              <Button variant="dark" disabled={note === null} loading={busy === 'Note'} onClick={() => patch({ adminNote: note ?? '' }, 'Note')}>
                Save note
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Onboarding">
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-slate-ink">
                <span>Progress</span>
                <span className="font-semibold text-ink">
                  {progress.done} of {progress.total}
                </span>
              </div>
              <ProgressBar pct={progress.pct} label="Onboarding progress" />
            </div>
            <OnboardingSteps
              steps={p.onboarding}
              renderActions={(s) => (
                <StepEditor key={`${s.key}-${s.updatedAt}`} partnerId={p.id} stepKey={s.key} status={s.status} note={s.note} onSaved={update} />
              )}
            />
          </Card>

          <Card title="Support tickets">
            {data.tickets.length === 0 ? (
              <p className="text-sm text-slate-ink">No tickets from this partner.</p>
            ) : (
              <ul className="divide-y divide-ink/[0.07]">
                {data.tickets.map((t) => (
                  <li key={t._id}>
                    <Link to={`/admin/tickets/${t._id}`} className="flex items-center justify-between gap-4 py-3 hover:text-emerald-deep">
                      <span className="truncate font-medium">{t.subject}</span>
                      <StatusBadge status={t.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
