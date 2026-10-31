import { motion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { hero } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

const LINE =
  'M0,92 C24,88 36,70 60,72 C84,74 96,90 120,80 C144,70 156,44 180,48 C204,52 216,66 240,56 C264,46 284,26 320,20'
const BARS = [38, 54, 44, 66, 58, 76, 86]

function DashboardCard() {
  const d = hero.dashboard
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.35, ease }}
      className="relative mx-auto w-full max-w-[30rem]"
    >
      {/* Soft halo behind the card */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(16_185_129/0.28),transparent)] blur-2xl"
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        role="img"
        aria-label="Illustrative preview of a user dashboard showing an activity chart and onboarding statuses. Not real data."
        className="glass rounded-3xl p-5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] sm:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </div>
            <p className="text-sm font-semibold text-snow">{d.title}</p>
          </div>
          <span className="rounded-full border border-gold/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-gold uppercase">
            {d.badge}
          </span>
        </div>

        {/* Chart */}
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-ink/50 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium text-muted">{d.chartLabel}</p>
            <p className="text-[0.7rem] text-muted/80">{d.period}</p>
          </div>
          <svg viewBox="0 0 320 120" className="mt-3 h-28 w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="1" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#10B981" />
                <stop offset="0.7" stopColor="#34D399" />
                <stop offset="1" stopColor="#E8C77A" />
              </linearGradient>
            </defs>
            {[30, 60, 90].map((y) => (
              <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="white" strokeOpacity="0.06" strokeDasharray="3 5" />
            ))}
            <motion.path
              d={`${LINE} L320,120 L0,120 Z`}
              fill="url(#hero-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.3 }}
            />
            <motion.path
              d={LINE}
              fill="none"
              stroke="url(#hero-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.7, ease }}
            />
            <motion.circle
              cx="320"
              cy="20"
              r="4.5"
              fill="#E8C77A"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
            />
          </svg>
        </div>

        {/* Tiles */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {d.tiles.map((t) => (
            <div key={t.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[0.7rem] text-muted">{t.label}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[0.8rem] font-semibold text-snow">
                <span className="pulse-dot size-1.5 rounded-full bg-emerald-2" aria-hidden="true" />
                {t.value}
              </p>
            </div>
          ))}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[0.7rem] text-muted">Activity</p>
            <div className="mt-2 flex h-6 items-end gap-[3px]" aria-hidden="true">
              {BARS.map((h, i) => (
                <motion.span
                  key={i}
                  className="flex-1 origin-bottom rounded-[2px] bg-gradient-to-t from-emerald to-emerald-2"
                  style={{ height: `${h}%`, opacity: 0.45 + i * 0.08 }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.6, ease }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-[0.72rem]">
            <span className="text-muted">{d.progressLabel}</span>
            <span className="font-medium text-snow/90">{d.progressText}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-emerald via-emerald-2 to-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0.75 }}
              transition={{ delay: 1.2, duration: 1.4, ease }}
            />
          </div>
        </div>

        {/* Status list */}
        <ul className="mt-5 divide-y divide-white/[0.06]">
          {d.statuses.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.12, duration: 0.6, ease }}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2.5 text-[0.8rem] text-snow/85">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                    s.tone === 'ok' ? 'bg-emerald/15 text-emerald-2' : 'bg-gold/15 text-gold'
                  }`}
                >
                  {s.tone === 'ok' ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : (
                    <span className="pulse-dot size-1.5 rounded-full bg-gold" />
                  )}
                </span>
                <span className="truncate">{s.label}</span>
              </span>
              <span className={`shrink-0 text-[0.72rem] font-semibold ${s.tone === 'ok' ? 'text-emerald-2' : 'text-gold'}`}>
                {s.status}
              </span>
            </motion.li>
          ))}
        </ul>

        <p className="mt-3 text-center text-[0.65rem] tracking-wide text-muted/70">{d.footnote}</p>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pt-32 pb-24 md:pt-40 md:pb-32" aria-labelledby="hero-title">
      {/* Background glows and grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.16),transparent)]" />
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_199_122/0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.025)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-[size:64px_64px]" />
      </div>

      <div className="above-trail shell grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="eyebrow text-gold"
          >
            {hero.eyebrow}
          </motion.p>

          {/* Headline and subtitle move but never start invisible, so they count as painted immediately (LCP). */}
          <motion.h1
            id="hero-title"
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            className="mt-6 text-[2.75rem] leading-[1.02] font-medium text-snow sm:text-6xl lg:text-[4.75rem]"
          >
            {hero.titleLead}{' '}
            <em className="text-gradient pr-1 font-normal italic">{hero.titleEmphasis}</em>
          </motion.h1>

          <motion.p
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.28, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.08] pt-6 text-sm text-muted"
          >
            {hero.notes.map((n) => (
              <li key={n} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-gold" aria-hidden="true" />
                {n}
              </li>
            ))}
          </motion.ul>
        </div>

        <DashboardCard />
      </div>
    </section>
  )
}
