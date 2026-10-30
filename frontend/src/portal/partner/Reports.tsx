import { ChartColumn, FileText, TrendingUp } from 'lucide-react'
import { Card, EmptyState, PageHeader } from '../ui'

/** Placeholder: reporting will be built later. */
export default function PartnerReports() {
  return (
    <div className="space-y-8">
      <PageHeader title="Reports" description="Business reports and analytics for your account." />
      <Card>
        <EmptyState icon={<ChartColumn className="size-5" />} title="Reports are coming soon">
          We are building clear, regular reports for partners. They will appear here once your account is active.
        </EmptyState>
      </Card>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { icon: TrendingUp, title: 'Activity overview', body: 'A simple view of how your business is doing over time.' },
          { icon: FileText, title: 'Downloadable statements', body: 'Monthly summaries you can download and keep.' },
        ].map((f) => (
          <Card key={f.title} className="opacity-70">
            <f.icon className="size-5 text-emerald-deep" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-medium">{f.title}</h2>
            <p className="mt-1 text-sm text-slate-ink">{f.body}</p>
            <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">Planned</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
