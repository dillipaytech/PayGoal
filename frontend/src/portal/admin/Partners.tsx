import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search, Users } from 'lucide-react'
import { BUSINESS_TYPES, formatDate, type AccountStatus, type Business } from '../../lib/api'
import { useResource } from '../useResource'
import { Card, EmptyState, Input, Notice, PageHeader, Select, Spinner, StatusBadge } from '../ui'

type Row = { _id: string; name: string; email: string; phone: string; status: AccountStatus; business: Business; createdAt: string; lastLoginAt?: string }

const typeLabel = (v: string) => BUSINESS_TYPES.find((t) => t.value === v)?.label ?? '—'

export default function AdminPartners() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const q = params.get('q') ?? ''
  const [search, setSearch] = useState(q)

  // Debounce the search box into the URL.
  useEffect(() => {
    const t = setTimeout(() => {
      if (search === q) return
      const next = new URLSearchParams(params)
      if (search) next.set('q', search)
      else next.delete('q')
      setParams(next, { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [search, q, params, setParams])

  const query = new URLSearchParams({ ...(status && { status }), ...(q && { q }) }).toString()
  const { data, error, loading } = useResource<{ partners: Row[] }>(`/admin/partners${query ? `?${query}` : ''}`)

  return (
    <div className="space-y-8">
      <PageHeader title="Users" description="Review sign-ups, track onboarding and manage user accounts." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-ink" aria-hidden="true" />
          <Input aria-label="Search users" placeholder="Search name, email, business or city" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            const next = new URLSearchParams(params)
            if (e.target.value) next.set('status', e.target.value)
            else next.delete('status')
            setParams(next)
          }}
          className="sm:!w-48"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="p-6">
            <Notice>{error}</Notice>
          </div>
        ) : !data?.partners.length ? (
          <div className="p-6">
            <EmptyState icon={<Users className="size-5" />} title="No users found">
              {q || status ? 'Try a different search or filter.' : 'Users appear here when they sign up.'}
            </EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-ink/[0.08] bg-ink/[0.02] text-xs tracking-wider text-slate-ink uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Business</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.06]">
                {data.partners.map((p) => (
                  <tr key={p._id} className="hover:bg-ink/[0.02]">
                    <td className="px-6 py-4">
                      <Link to={`/admin/users/${p._id}`} className="font-semibold text-ink hover:text-emerald-deep hover:underline">
                        {p.business?.name || '—'}
                      </Link>
                      <div className="text-xs text-slate-ink">{[p.business?.city, p.business?.state].filter(Boolean).join(', ')}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{p.name}</div>
                      <div className="text-xs text-slate-ink">{p.email}</div>
                    </td>
                    <td className="px-4 py-4">{typeLabel(p.business?.type)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
