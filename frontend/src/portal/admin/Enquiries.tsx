import { useSearchParams } from 'react-router'
import { Inbox, Mail, Phone } from 'lucide-react'
import { api, formatDateTime, type Enquiry, type EnquiryStatus } from '../../lib/api'
import { useResource } from '../useResource'
import { Card, EmptyState, Notice, PageHeader, Select, Spinner, StatusBadge } from '../ui'

export default function AdminEnquiries() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const { data, setData, error, loading } = useResource<{ enquiries: Enquiry[] }>(`/admin/enquiries${status ? `?status=${status}` : ''}`)

  const setEnquiryStatus = async (id: string, next: EnquiryStatus) => {
    const { enquiry } = await api<{ enquiry: Enquiry }>(`/admin/enquiries/${id}`, { method: 'PATCH', body: { status: next } })
    setData((d) => d && { enquiries: d.enquiries.map((e) => (e._id === id ? enquiry : e)) })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Website enquiries"
        description="Messages sent through the contact form on paygoal.in."
        actions={
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {})}
            className="!w-44"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </Select>
        }
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <Notice>{error}</Notice>
      ) : !data?.enquiries.length ? (
        <Card>
          <EmptyState icon={<Inbox className="size-5" />} title="No enquiries">
            New messages from the website contact form will appear here.
          </EmptyState>
        </Card>
      ) : (
        <ul className="space-y-4">
          {data.enquiries.map((e) => (
            <li key={e._id}>
              <Card>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-sans text-base font-semibold text-ink">{e.name}</h2>
                      {e.company && <span className="text-sm text-slate-ink">{e.company}</span>}
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 text-emerald-deep hover:underline">
                        <Mail className="size-3.5" aria-hidden="true" /> {e.email}
                      </a>
                      {e.phone && (
                        <a href={`tel:${e.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 text-emerald-deep hover:underline">
                          <Phone className="size-3.5" aria-hidden="true" /> {e.phone}
                        </a>
                      )}
                      {e.interest && <span className="text-slate-ink">Interested in: {e.interest}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-slate-ink">{formatDateTime(e.createdAt)}</span>
                    <Select
                      aria-label={`Status for enquiry from ${e.name}`}
                      value={e.status}
                      onChange={(ev) => setEnquiryStatus(e._id, ev.target.value as EnquiryStatus)}
                      className="!w-36 !py-1.5 text-sm"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </div>
                </div>
                <p className="mt-4 rounded-xl bg-ink/[0.03] p-4 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-ink">{e.message}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
