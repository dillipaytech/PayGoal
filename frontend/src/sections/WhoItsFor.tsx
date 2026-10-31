import { audience } from '../content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

export default function WhoItsFor() {
  return (
    <section className="relative bg-ivory pb-24 text-ink md:pb-32" aria-labelledby="audience-title">
      <div className="above-trail shell">
        <div className="hairline mb-20 md:mb-28" />
        <SectionHeading
          id="audience-title"
          eyebrow={audience.eyebrow}
          title={audience.title}
          body={audience.body}
          align="center"
        />

        <ul className="mt-16 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-5">
          {audience.items.map((a, i) => (
            <li
              key={a.title}
              className={audience.items.length % 2 === 1 && i === audience.items.length - 1 ? 'min-[480px]:col-span-2 lg:col-span-1' : ''}
            >
              <Reveal delay={i * 0.07} className="h-full">
                <div className="group h-full rounded-[1.25rem] border border-ink/[0.08] bg-ivory p-6 text-center transition-colors duration-500 hover:border-gold/60 hover:bg-ivory-card">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-deep/20 bg-emerald/[0.07] text-emerald-deep transition-transform duration-500 group-hover:scale-105">
                    <a.icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg leading-snug font-medium">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ink">{a.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal className="mt-10 text-center">
          <p className="font-display text-2xl text-gold-deep italic">{audience.more}</p>
        </Reveal>
      </div>
    </section>
  )
}
