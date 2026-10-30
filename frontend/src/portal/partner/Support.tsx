import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { LifeBuoy, Plus } from 'lucide-react'
import { api, ApiError, formatDate, type TicketSummary } from '../../lib/api'
import { useResource } from '../useResource'
import { Button, Card, EmptyState, Field, Input, Notice, PageHeader, Select, Spinner, StatusBadge, Textarea } from '../ui'

const CATEGORIES = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'technical', label: 'Technical' },
  { value: 'account', label: 'Account' },
  { value: 'general', label: 'General' },
]

export default function PartnerSupport() {
  const navigate = useNavigate()
  const { data, error, loading } = useResource<{ tickets: TicketSummary[] }>('/tickets')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', category: 'general', message: '' })
  const [fields, setFields] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFields({})
    setFormError('')
    try {
      const { ticket } = await api<{ ticket: { _id: string } }>('/tickets', { body: form })
      navigate(`/dashboard/support/${ticket._id}`)
    } catch (err) {
      setFields((err as ApiError).fields ?? {})
      setFormError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support"
        description="Ask our team anything about onboarding, your account or technical questions."
        actions={
          !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="size-4" aria-hidden="true" /> New ticket
            </Button>
          )
        }
      />

      {showForm && (
        <Card title="New ticket">
          <form onSubmit={submit} noValidate className="space-y-5">
            <Notice>{formError}</Notice>
            <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
              <Field label="Subject" error={fields.subject}>
                {(id, d) => <Input id={id} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} aria-invalid={!!fields.subject} aria-describedby={d} />}
              </Field>
              <Field label="Category">
                {(id) => (
                  <Select id={id} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
            <Field label="Message" error={fields.message} hint="Please don't include passwords or identity document numbers.">
              {(id, d) => <Textarea id={id} rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!fields.message} aria-describedby={d} />}
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={busy}>
                Submit ticket
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Your tickets">
        {loading ? (
          <Spinner />
        ) : error ? (
          <Notice>{error}</Notice>
        ) : !data?.tickets.length ? (
          <EmptyState icon={<LifeBuoy className="size-5" />} title="No tickets yet">
            When you open a ticket, you can follow the conversation here.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-ink/[0.07]">
            {data.tickets.map((t) => (
              <li key={t._id}>
                <Link to={`/dashboard/support/${t._id}`} className="flex items-center justify-between gap-4 py-4 hover:text-emerald-deep">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{t.subject}</span>
                    <span className="text-xs text-slate-ink capitalize">
                      {t.category} · Updated {formatDate(t.updatedAt)}
                    </span>
                  </span>
                  <StatusBadge status={t.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
