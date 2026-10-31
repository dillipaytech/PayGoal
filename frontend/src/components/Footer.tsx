import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Globe, Mail, Phone, X } from 'lucide-react'
import { company, footer, legal, nav } from '../content'
import { setScrollLocked } from '../lib/scroll'
import { Logo } from './Navbar'
import CompanyBlock from './CompanyBlock'

type LegalKey = keyof typeof legal

/* ------------------------------------------------------------------ */
/* Legal modal (native <dialog>: focus trap + Escape built in)        */
/* ------------------------------------------------------------------ */

function LegalDialog({ which, onClose }: { which: LegalKey | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (which && !d.open) {
      d.showModal()
      setScrollLocked(true)
    } else if (!which && d.open) {
      d.close()
    }
  }, [which])

  const doc = which ? legal[which] : null

  return (
    <dialog
      ref={ref}
      className="legal"
      aria-labelledby="legal-title"
      onClose={() => {
        setScrollLocked(false)
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      {doc && (
        <div data-lenis-prevent className="max-h-[inherit] overflow-y-auto p-7 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 id="legal-title" className="text-3xl font-medium">
                {doc.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{doc.updated}</p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 hover:border-gold/60"
              aria-label="Close"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="hairline my-7" />
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-snow/85">
            {doc.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {doc.sections?.map((s, i) => (
              <section key={s.heading ?? i} className="pt-2">
                {s.heading && <h3 className="mb-2 font-sans text-base font-semibold text-gold">{s.heading}</h3>}
                <div className="space-y-2">
                  {s.body?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {s.list && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-emerald-2">
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {doc.contact && (
              <ul className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                <li>
                  <Mail className="mr-2 inline size-4 text-emerald-2" aria-hidden="true" />
                  <a href={`mailto:${company.email}`} className="underline-offset-4 hover:underline">
                    {company.email}
                  </a>
                </li>
                <li>
                  <Globe className="mr-2 inline size-4 text-emerald-2" aria-hidden="true" />
                  <a href={company.websiteUrl} className="underline-offset-4 hover:underline">
                    www.{company.website}
                  </a>
                </li>
                <li>
                  <Phone className="mr-2 inline size-4 text-emerald-2" aria-hidden="true" />
                  <a href={company.phoneHref} className="underline-offset-4 hover:underline">
                    {company.phoneDisplay}
                  </a>
                </li>
              </ul>
            )}
          </div>
          <p className="mt-8 text-xs text-muted">{company.legalName}</p>
        </div>
      )}
    </dialog>
  )
}

/* ------------------------------------------------------------------ */
/* Giant wordmark: the scroll trail's destination                     */
/* ------------------------------------------------------------------ */

// Where the arriving dots settle, in viewBox units of the wordmark (1000 × 190).
const DOT_TARGETS = [
  [62, 70], [118, 128], [196, 52], [252, 140], [318, 84], [372, 150], [438, 60],
  [512, 120], [566, 46], [628, 146], [690, 78], [762, 132], [836, 58], [918, 112],
] as const

// The trail arrives at the top-left of the wordmark (viewBox units).
const ARRIVAL_X = 40

function SettlingDot({ p, x, y, i }: { p: MotionValue<number>; x: number; y: number; i: number }) {
  // Dots start together where the trail arrives, then sweep out across the letters.
  const t0 = 0.22 + (x / 1000) * 0.18
  const dx = useTransform(p, [t0, 0.8], [`${(ARRIVAL_X - x) / 10}vw`, '0vw'])
  const dy = useTransform(p, [t0, 0.8], [`${-y / 10}vw`, '0vw'])
  const opacity = useTransform(p, [t0 - 0.05, t0 + 0.05, 0.78, 0.95], [0, 0.9, 0.9, 0])
  const scale = useTransform(p, [t0, 0.85], [1, 0.4])
  return (
    <motion.span
      aria-hidden="true"
      className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${x / 10}%`,
        top: `${(y / 190) * 100}%`,
        x: dx,
        y: dy,
        opacity,
        scale,
        background: i / DOT_TARGETS.length < 0.55 ? '#34D399' : '#E8C77A',
        boxShadow: '0 0 10px 2px rgb(52 211 153 / 0.45)',
      }}
    />
  )
}

function WordmarkSvg({ id, className = '' }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 1000 190" className={`block h-auto w-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#34D399" />
          <stop offset="0.45" stopColor="#10B981" />
          <stop offset="1" stopColor="#E8C77A" />
        </linearGradient>
      </defs>
      <text
        x="500"
        y="166"
        textAnchor="middle"
        textLength="990"
        lengthAdjust="spacingAndGlyphs"
        fill={`url(#${id})`}
        style={{ fontFamily: 'var(--font-display)', fontSize: 200, fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        PAYGOAL
      </text>
    </svg>
  )
}

function Wordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [complete, setComplete] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })

  const opacity = useTransform(scrollYProgress, [0.4, 0.95], [0, 1])
  const y = useTransform(scrollYProgress, [0.2, 1], [50, 0])
  const scale = useTransform(scrollYProgress, [0.2, 1], [0.94, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.97 && !complete) setComplete(true)
  })

  return (
    <div ref={ref} data-trail-end className="relative px-[1vw] pt-6 pb-[2vw]">
      <h2 className="sr-only">{company.brand}</h2>
      {reduce ? (
        <WordmarkSvg id="wm-static" />
      ) : (
        <>
          <motion.div style={{ opacity, y, scale }} className="relative origin-bottom">
            {/* Pre-blurred glow layer: only its opacity animates */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 blur-[28px]"
              initial={{ opacity: 0 }}
              animate={complete ? { opacity: [0, 0.85, 0.3] } : { opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
            >
              <WordmarkSvg id="wm-glow" />
            </motion.div>
            <WordmarkSvg id="wm-main" className="relative" />
          </motion.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[1vw] top-6 bottom-[2vw]">
            {DOT_TARGETS.map(([x, yy], i) => (
              <SettlingDot key={i} p={scrollYProgress} x={x} y={yy} i={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const [doc, setDoc] = useState<LegalKey | null>(null)
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-ink text-snow">
      <div className="hairline" />
      <div className="above-trail shell grid gap-12 pt-20 pb-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.6fr_0.6fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{footer.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-gold uppercase">{footer.quickLinksTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-snow/75 transition-colors hover:text-snow">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-gold uppercase">{footer.legalTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {(Object.keys(legal) as LegalKey[]).map((k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setDoc(k)}
                  className="text-left text-snow/75 transition-colors hover:text-snow"
                >
                  {legal[k].title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-gold uppercase">{footer.companyTitle}</h2>
          <div className="mt-5 text-snow/90">
            <CompanyBlock />
          </div>
        </div>
      </div>

      <div className="above-trail shell">
        <div className="flex flex-col gap-3 border-t border-white/[0.07] py-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <a href={`mailto:${company.email}`} className="hover:text-snow">
              {company.email}
            </a>
            <a href={company.phoneHref} className="hover:text-snow">
              {company.phoneDisplay}
            </a>
          </p>
        </div>
      </div>

      <div className="above-trail">
        <Wordmark />
        <p className="pb-8 text-center font-display text-sm tracking-[0.3em] text-gold/80 md:text-base">
          ({company.terminalCode})
        </p>
      </div>

      <LegalDialog which={doc} onClose={() => setDoc(null)} />
    </footer>
  )
}
