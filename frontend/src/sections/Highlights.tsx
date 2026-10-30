import { highlights } from '../content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

export default function Highlights() {
  return (
    <section className="section-pad relative overflow-hidden bg-ink" aria-labelledby="highlights-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-48 -left-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.14),transparent)]" />
        <div className="absolute -top-32 right-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_199_122/0.07),transparent)]" />
      </div>

      <div className="above-trail shell">
        <SectionHeading id="highlights-title" tone="dark" eyebrow={highlights.eyebrow} title={highlights.title} />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {highlights.items.map((h, i) => (
            <li key={h.title} className="bg-ink">
              <Reveal delay={i * 0.08} className="group relative h-full p-8 md:p-9">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent transition-colors duration-700 group-hover:via-gold/70" />
                <span className="font-display text-sm text-gold/80 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h.icon className="mt-10 size-7 text-emerald-2" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-medium text-snow">{h.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{h.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
