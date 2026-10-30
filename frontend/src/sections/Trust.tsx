import { Building2, Info } from 'lucide-react'
import { trust } from '../content'
import CompanyBlock from '../components/CompanyBlock'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

export default function Trust() {
  return (
    <section className="section-pad relative overflow-hidden bg-ink" aria-labelledby="trust-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -right-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.12),transparent)]" />
      </div>

      <div className="above-trail shell grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <SectionHeading id="trust-title" tone="dark" eyebrow={trust.eyebrow} title={trust.title} body={trust.body} />

          <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {trust.items.map((t, i) => (
              <li key={t.title}>
                <Reveal delay={(i % 2) * 0.08}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-emerald-2">
                      <t.icon className="size-[1.1rem]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-medium text-snow">{t.title}</h3>
                  </div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{t.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-12">
            <p className="flex gap-3 rounded-2xl border border-gold/25 bg-gold/[0.04] p-5 text-sm leading-relaxed text-snow/85">
              <Info className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              {trust.websiteNote}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:pt-8">
          <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-10">
            <div className="hairline absolute inset-x-0 top-0" />
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-emerald-2 text-ink">
                <Building2 className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-medium text-snow">{trust.registrationTitle}</h3>
            </div>
            <div className="mt-8 text-snow">
              <CompanyBlock />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
