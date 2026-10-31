import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth'
import { ArrowRight, ChartColumn, ClipboardCheck, LifeBuoy } from 'lucide-react'
import { formatDate, type TicketSummary, type User } from '../../lib/api'
import { useResource } from '../useResource'
import { onboardingProgress, ProgressBar } from '../shared'
import { Card, EmptyState, Notice, PageHeader, Spinner, StatusBadge } from '../ui'

const STATUS_MESSAGE = {
  pending: 'Thanks for signing up. Our team is reviewing your account and will contact you about the next onboarding steps.',
  approved: 'Your user account is active.',
  rejected: 'We could not approve your account at this time. Please open a support ticket if you have questions.',
  suspended: 'This account is suspended.',
}

export default function PartnerOverview() {
  const { setUser } = useAuth()
  const { data, error, loading } = useResource<{ user: User; openTickets: number; recentTickets: TicketSummary[] }>('/me/overview')
  // Keep the sidebar's account status in sync with the latest data.
  useEffect(() => {
    if (data) setUser(data.user)
  }, [data, setUser])

  if (loading) return <Spinner />
  if (error || !data) return <Notice>{error}</Notice>

  const { user, openTickets, recentTickets } = data
  const p = onboardingProgress(user.onboarding)
  const nextStep = user.onboarding.find((s) => s.status !== 'done')

  return (
    <div className="space-y-8">
      <PageHeader title={`Hello, ${user.name.split(' ')[0]}`} description={user.business.name} />

      <Notice tone={user.status === 'approved' ? 'success' : user.status === 'pending' ? 'info' : 'error'}>
        <strong className="font-semibold">Account status: </strong>
        {STATUS_MESSAGE[user.status]}
      </Notice>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Onboarding progress" action={<Link to="/dashboard/onboarding" className="text-sm font-semibold text-emerald-deep hover:underline">View steps</Link>}>
          <div className="flex items-end justify-between">
            <p className="font-display text-5xl text-ink">{p.pct}%</p>
            <p className="text-sm text-slate-ink">
              {p.done} of {p.total} steps complete
            </p>
          </div>
          <div className="mt-4">
            <ProgressBar pct={p.pct} label="Onboarding progress" />
          </div>
          {nextStep && (
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-ink">
              <ClipboardCheck className="size-4 text-emerald-deep" aria-hidden="true" />
              Next: <span className="font-semibold text-ink">{nextStep.label}</span> <StatusBadge status={nextStep.status} />
            </p>
          )}
        </Card>

        <Card title="Support">
          <p className="font-display text-5xl text-ink">{openTickets}</p>
          <p className="mt-1 text-sm text-slate-ink">active {openTickets === 1 ? 'ticket' : 'tickets'}</p>
          <Link to="/dashboard/support" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:underline">
            Get help <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Recent tickets">
          {recentTickets.length === 0 ? (
            <EmptyState icon={<LifeBuoy className="size-5" />} title="No tickets yet">
              Questions about onboarding or your account? Open a ticket and our team will reply.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-ink/[0.07]">
              {recentTickets.map((t) => (
                <li key={t._id}>
                  <Link to={`/dashboard/support/${t._id}`} className="flex items-center justify-between gap-4 py-3 hover:text-emerald-deep">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{t.subject}</span>
                      <span className="text-xs text-slate-ink">Updated {formatDate(t.updatedAt)}</span>
                    </span>
                    <StatusBadge status={t.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Reports">
          <EmptyState icon={<ChartColumn className="size-5" />} title="Coming soon">
            Performance reports and analytics for your business will appear here.
          </EmptyState>
        </Card>
      </div>
    </div>
  )
}
