import { ArrowUpRight } from 'lucide-react'
import { services } from '../content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

export default function Services() {
  return (
    <section id="services" className="section-pad relative bg-ivory text-ink" aria-labelledby="services-title">
      <div className="above-trail shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} />
          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-base leading-relaxed text-slate-ink">{services.body}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <article className="card-light group relative flex h-full flex-col p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(11_15_26/0.35)] md:p-8">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-ink text-emerald-2 shadow-[inset_0_0_0_1px_rgb(232_199_122/0.25)]">
                      <s.icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                    </span>
                    <span className="font-display text-sm text-gold-deep/70 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-[1.4rem] leading-snug font-medium">{s.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-ink">{s.body}</p>
                  <div className="mt-auto pt-6">
                    <div className="h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" />
                  </div>
                  <ArrowUpRight
                    className="absolute right-7 bottom-7 size-4 text-emerald-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
