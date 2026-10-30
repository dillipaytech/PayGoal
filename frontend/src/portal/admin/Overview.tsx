import { Link } from 'react-router'
import { ArrowRight, Inbox, LifeBuoy, UserCheck, Users } from 'lucide-react'
import { formatDate, type AccountStatus } from '../../lib/api'
import { useResource } from '../useResource'
import { Card, Notice, PageHeader, Spinner, StatusBadge } from '../ui'

type Stats = {
  partners: Record<AccountStatus, number>
  openTickets: number
  newEnquiries: number
  recentPartners: { _id: string; name: string; email: string; status: AccountStatus; business?: { name: string }; createdAt: string }[]
}

export default function AdminOverview() {
  const { data, error, loading } = useResource<Stats>('/admin/stats')
  if (loading) return <Spinner />
  if (error || !data) return <Notice>{error}</Notice>

  const tiles = [
    { label: 'Partners awaiting review', value: data.partners.pending, icon: UserCheck, to: '/admin/partners?status=pending' },
    { label: 'Approved partners', value: data.partners.approved, icon: Users, to: '/admin/partners?status=approved' },
    { label: 'Open support tickets', value: data.openTickets, icon: LifeBuoy, to: '/admin/tickets?status=open' },
    { label: 'New website enquiries', value: data.newEnquiries, icon: Inbox, to: '/admin/enquiries?status=new' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Admin overview" description="What needs attention today." />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link to={t.to} className="card-light group flex h-full flex-col p-6 transition-transform hover:-translate-y-0.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-emerald-2">
                <t.icon className="size-[1.1rem]" aria-hidden="true" />
              </span>
              <span className="mt-5 font-display text-4xl text-ink">{t.value}</span>
              <span className="mt-1 flex items-center justify-between text-sm text-slate-ink">
                {t.label}
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Card title="Newest partners" action={<Link to="/admin/partners" className="text-sm font-semibold text-emerald-deep hover:underline">All partners</Link>}>
        {data.recentPartners.length === 0 ? (
          <p className="text-sm text-slate-ink">No partners have signed up yet.</p>
        ) : (
          <ul className="divide-y divide-ink/[0.07]">
            {data.recentPartners.map((p) => (
              <li key={p._id}>
                <Link to={`/admin/partners/${p._id}`} className="flex items-center justify-between gap-4 py-3 hover:text-emerald-deep">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.business?.name || p.name}</span>
                    <span className="block truncate text-xs text-slate-ink">
                      {p.name} · {p.email} · joined {formatDate(p.createdAt)}
                    </span>
                  </span>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
