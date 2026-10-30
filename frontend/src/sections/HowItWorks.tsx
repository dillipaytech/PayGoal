import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { steps } from '../content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="how-it-works" className="section-pad relative bg-ivory text-ink" aria-labelledby="how-title">
      <div className="above-trail shell">
        <SectionHeading id="how-title" eyebrow={steps.eyebrow} title={steps.title} body={steps.body} />

        <ol ref={listRef} className="relative mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
          {/* Desktop connector: draws with scroll progress */}
          <div aria-hidden="true" className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-px bg-ink/10 md:block">
            <motion.div
              className="absolute inset-0 origin-left bg-gradient-to-r from-emerald via-teal to-gold"
              style={{ scaleX: progress }}
            />
          </div>

          {steps.items.map((s, i) => (
            <li key={s.title} className="relative pl-20 md:pl-0 md:text-center">
              {/* Mobile connector: one segment from this step's icon to the next */}
              {i < steps.items.length - 1 && (
                <div aria-hidden="true" className="absolute top-14 left-7 h-full w-px bg-ink/10 md:hidden">
                  <motion.div
                    className="absolute inset-0 origin-top bg-gradient-to-b from-emerald to-teal"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '0px 0px -30% 0px' }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
              <Reveal delay={i * 0.12}>
                <div className="absolute top-0 left-0 md:relative md:mx-auto md:w-fit">
                  <span className="relative flex size-14 items-center justify-center rounded-full bg-ink text-emerald-2 shadow-[0_0_0_6px_var(--color-ivory),0_0_0_7px_rgb(232_199_122/0.45)]">
                    <s.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-0 text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase md:mt-8">Step {i + 1}</p>
                <h3 className="mt-2 text-[1.65rem] font-medium">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-slate-ink md:max-w-[17rem]">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
