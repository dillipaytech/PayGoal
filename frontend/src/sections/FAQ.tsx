import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { faq } from '../content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div className="border-b border-ink/10">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
        >
          <span className="font-display text-xl leading-snug font-medium text-ink md:text-2xl">{q}</span>
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ${
              open ? 'rotate-45 border-ink bg-ink text-emerald-2' : 'border-ink/15 text-ink group-hover:border-gold-deep'
            }`}
            aria-hidden="true"
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pr-14 pb-7 text-[0.98rem] leading-relaxed text-slate-ink">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-pad relative bg-ivory text-ink" aria-labelledby="faq-title">
      <div className="above-trail shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} body={faq.body} />
          <Reveal delay={0.1} className="mt-8">
            <a href="#contact" className="btn border border-ink/15 text-ink hover:border-gold-deep">
              Ask us directly
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="border-t border-ink/10">
            {faq.items.map((item, i) => (
              <Item key={item.q} q={item.q} a={item.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
