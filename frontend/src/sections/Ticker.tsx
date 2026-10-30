import { ticker } from '../content'

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ticker.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-display text-xl text-snow/80 italic md:px-10 md:text-2xl">{t}</span>
          <svg viewBox="0 0 10 10" className="size-2 text-gold" aria-hidden="true">
            <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  )
}

export default function Ticker() {
  return (
    <section aria-label="Our services at a glance" className="relative bg-ink">
      <div className="hairline" />
      <div className="marquee above-trail overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
      <div className="hairline" />
    </section>
  )
}
