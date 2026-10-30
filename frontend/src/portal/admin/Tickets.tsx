import { Link, useSearchParams } from 'react-router'
import { LifeBuoy } from 'lucide-react'
import { formatDate, type TicketSummary } from '../../lib/api'
import { useResource } from '../useResource'
import { Card, EmptyState, Notice, PageHeader, Select, Spinner, StatusBadge } from '../ui'

export default function AdminTickets() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const { data, error, loading } = useResource<{ tickets: TicketSummary[] }>(`/tickets${status ? `?status=${status}` : ''}`)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support tickets"
        description="Questions from partners. Replying marks a ticket as answered."
        actions={
          <Select aria-label="Filter by status" value={status} onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {})} className="!w-44">
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </Select>
        }
      />
      <Card>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Notice>{error}</Notice>
        ) : !data?.tickets.length ? (
          <EmptyState icon={<LifeBuoy className="size-5" />} title="No tickets">
            {status ? 'No tickets with this status.' : 'Partner tickets will appear here.'}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-ink/[0.07]">
            {data.tickets.map((t) => (
              <li key={t._id}>
                <Link to={`/admin/tickets/${t._id}`} className="flex items-center justify-between gap-4 py-4 hover:text-emerald-deep">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{t.subject}</span>
                    <span className="block truncate text-xs text-slate-ink">
                      {t.user?.business?.name || t.user?.name} · <span className="capitalize">{t.category}</span> · Updated {formatDate(t.updatedAt)}
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
