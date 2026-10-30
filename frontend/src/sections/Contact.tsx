import { useId, useRef, useState, type FormEvent } from 'react'
import { useInView } from 'motion/react'
import { ArrowUpRight, CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { company, contact } from '../content'
import { api, ApiError } from '../lib/api'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CompanyBlock from '../components/CompanyBlock'

const channels = [
  { icon: Mail, label: contact.emailLabel, value: company.email, href: `mailto:${company.email}`, external: false },
  { icon: Phone, label: contact.phoneLabel, value: company.phoneDisplay, href: company.phoneHref, external: false },
  { icon: MessageCircle, label: contact.whatsappLabel, value: contact.whatsappText, href: company.whatsappHref, external: true },
]

function LazyMap() {
  const ref = useRef<HTMLDivElement>(null)
  // Only insert the iframe once the visitor is near the map.
  const near = useInView(ref, { once: true, margin: '400px 0px' })
  const src = `https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&z=16&output=embed`

  return (
    <div ref={ref} className="relative h-full min-h-[22rem] overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-card">
      {near ? (
        <iframe
          title={contact.mapTitle}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.35)_contrast(1.05)]"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          <MapPin className="mr-2 size-4 text-gold" aria-hidden="true" /> Loading map…
        </div>
      )}
    </div>
  )
}

const EMPTY = { name: '', company: '', email: '', phone: '', interest: '', message: '', website: '' }

const inputCls =
  'w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-[0.95rem] text-snow placeholder:text-muted/60 transition-colors focus:border-emerald-2/60 focus:outline-none focus:ring-2 focus:ring-emerald/25 aria-[invalid=true]:border-red-400'

function DarkField({ label, error, children }: { label: string; error?: string; children: (id: string, d?: string) => React.ReactNode }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </label>
      <div className="mt-2">{children(id, error ? `${id}-err` : undefined)}</div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

function EnquiryForm() {
  const f = contact.form
  const [form, setForm] = useState(EMPTY)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setFields({})
    try {
      await api('/enquiries', { body: form })
      setSent(true)
      setForm(EMPTY)
    } catch (err) {
      setError((err as ApiError).message)
      setFields((err as ApiError).fields ?? {})
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="card-dark flex h-full flex-col items-center justify-center p-10 text-center text-snow" role="status">
        <CheckCircle2 className="size-12 text-emerald-2" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="mt-5 text-2xl font-medium">{f.successTitle}</h3>
        <p className="mt-2 text-muted">{f.successBody}</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-8">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="card-dark relative h-full p-8 text-snow md:p-10">
      <h3 className="text-2xl font-medium">{f.title}</h3>
      <div className="hairline mt-6 mb-8" />
      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <DarkField label="Name" error={fields.name}>
          {(id, d) => <input id={id} className={inputCls} autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!fields.name} aria-describedby={d} />}
        </DarkField>
        <DarkField label="Company (optional)" error={fields.company}>
          {(id, d) => <input id={id} className={inputCls} autoComplete="organization" value={form.company} onChange={set('company')} aria-describedby={d} />}
        </DarkField>
        <DarkField label="Email" error={fields.email}>
          {(id, d) => <input id={id} type="email" className={inputCls} autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!fields.email} aria-describedby={d} />}
        </DarkField>
        <DarkField label="Phone (optional)" error={fields.phone}>
          {(id, d) => <input id={id} type="tel" className={inputCls} autoComplete="tel" value={form.phone} onChange={set('phone')} aria-invalid={!!fields.phone} aria-describedby={d} />}
        </DarkField>
        <div className="sm:col-span-2">
          <DarkField label="I'm interested in">
            {(id) => (
              <select id={id} className={inputCls} value={form.interest} onChange={set('interest')}>
                <option value="">Choose a topic (optional)</option>
                {f.interests.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            )}
          </DarkField>
        </div>
        <div className="sm:col-span-2">
          <DarkField label="Message" error={fields.message}>
            {(id, d) => <textarea id={id} rows={5} className={inputCls} value={form.message} onChange={set('message')} aria-invalid={!!fields.message} aria-describedby={d} />}
          </DarkField>
        </div>
      </div>
      {/* Honeypot for bots: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
        </label>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">{f.note}</p>
        <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {f.submit}
        </button>
      </div>
    </form>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-ink" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[36rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.13),transparent)]" />
      </div>

      <div className="above-trail shell">
        <SectionHeading id="contact-title" tone="dark" eyebrow={contact.eyebrow} title={contact.title} body={contact.body} />

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {channels.map((c, i) => (
            <li key={c.label}>
              <Reveal delay={i * 0.08} className="h-full">
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="card-dark group flex h-full items-center gap-4 p-6 transition-colors duration-500 hover:border-emerald-2/40"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-emerald-2 text-ink">
                    <c.icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-[0.16em] text-muted uppercase">{c.label}</span>
                    <span className="mt-1 block truncate text-lg font-semibold text-snow">{c.value}</span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto size-5 shrink-0 text-gold transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="h-full">
            <EnquiryForm />
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <div className="card-dark h-full p-8 text-snow md:p-10">
              <h3 className="text-2xl font-medium">{contact.detailsTitle}</h3>
              <div className="hairline mt-6 mb-8" />
              <CompanyBlock />
              <p className="mt-8 flex items-start gap-3 text-sm text-muted">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="text-snow/90">{contact.hoursLabel}:</span> {company.hours}
                </span>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-4">
          <div className="h-[22rem] md:h-[26rem]">
            <LazyMap />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
