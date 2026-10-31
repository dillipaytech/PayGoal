import { company } from '../content'

/** Legal name, registered address and website, as one definition list. */
export default function CompanyBlock({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const label = tone === 'dark' ? 'text-muted' : 'text-slate-ink'
  return (
    <dl className="space-y-5 text-sm">
      <div>
        <dt className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase ${label}`}>Legal name</dt>
        <dd className="mt-1.5 font-semibold tracking-wide">{company.legalName}</dd>
      </div>
      <div>
        <dt className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase ${label}`}>Registered address</dt>
        <dd className="mt-1.5 leading-relaxed">
          <address className="not-italic">{company.address}</address>
        </dd>
      </div>
      <div>
        <dt className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase ${label}`}>Website</dt>
        <dd className="mt-1.5">
          <a href={company.websiteUrl} className="underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
            {company.website}
          </a>
        </dd>
      </div>
    </dl>
  )
}
