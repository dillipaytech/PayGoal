import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { api, ApiError, formatDateTime, type Ticket, type TicketStatus } from '../lib/api'
import { useAuth } from './auth'
import { useResource } from './useResource'
import { Button, Card, Field, Notice, PageHeader, Select, Spinner, StatusBadge, Textarea } from './ui'
import { company } from '../content'

/** A single support ticket conversation. Used by both users and admins. */
export default function TicketThread() {
  const { id } = useParams()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const back = isAdmin ? '/admin/tickets' : '/dashboard/support'
  const { data, setData, error, loading } = useResource<{ ticket: Ticket }>(`/tickets/${id}`)
  const [reply, setReply] = useState('')
  const [replyError, setReplyError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <Spinner />
  if (error || !data) return <Notice>{error || 'Ticket not found.'}</Notice>
  const t = data.ticket
  const owner = typeof t.user === 'object' ? t.user : null

  const send = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setReplyError('')
    try {
      const res = await api<{ ticket: Ticket }>(`/tickets/${t._id}/messages`, { body: { body: reply } })
      setData({ ticket: { ...res.ticket, user: t.user } })
      setReply('')
    } catch (err) {
      setReplyError((err as ApiError).fields?.body ?? (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const setStatus = async (status: TicketStatus) => {
    try {
      const res = await api<{ ticket: Ticket }>(`/tickets/${t._id}`, { method: 'PATCH', body: { status } })
      setData({ ticket: { ...res.ticket, user: t.user } })
    } catch (err) {
      setReplyError((err as Error).message)
    }
  }

  return (
    <div className="space-y-8">
      <Link to={back} className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-ink hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> All tickets
      </Link>
      <PageHeader
        title={t.subject}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <StatusBadge status={t.status} />
            <span className="capitalize">{t.category}</span>
            {owner && (
              <span>
                · {owner.name} ({owner.business?.name || owner.email})
              </span>
            )}
          </span>
        }
        actions={
          isAdmin ? (
            <Select aria-label="Ticket status" value={t.status} onChange={(e) => setStatus(e.target.value as TicketStatus)} className="!w-40">
              <option value="open">Open</option>
              <option value="answered">Answered</option>
              <option value="closed">Closed</option>
            </Select>
          ) : t.status !== 'closed' ? (
            <Button variant="ghost" onClick={() => setStatus('closed')}>
              Close ticket
            </Button>
          ) : null
        }
      />

      <ol className="space-y-4">
        {t.messages.map((m) => (
          <li key={m._id} className={`flex ${m.fromStaff ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[42rem] rounded-2xl px-5 py-4 ${m.fromStaff ? 'border border-ink/[0.08] bg-ivory-card' : 'bg-ink text-snow'}`}>
              <p className={`text-xs font-semibold ${m.fromStaff ? 'text-emerald-deep' : 'text-gold'}`}>
                {m.authorName} · <span className="font-normal opacity-80">{formatDateTime(m.createdAt)}</span>
              </p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{m.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {t.status === 'closed' && !isAdmin ? (
        <Notice tone="info">
          This ticket is closed. <Link to="/dashboard/support" className="font-semibold underline">Open a new ticket</Link> if you need more help.
        </Notice>
      ) : (
        <Card>
          <form onSubmit={send} noValidate className="space-y-4">
            <Field label={isAdmin ? `Reply as ${company.brand} Support` : 'Add a reply'} error={replyError}>
              {(id, d) => <Textarea id={id} value={reply} onChange={(e) => setReply(e.target.value)} aria-invalid={!!replyError} aria-describedby={d} />}
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={busy} disabled={!reply.trim()}>
                Send reply
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
