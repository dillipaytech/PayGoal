import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Link } from 'react-router'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { company, nav } from '../content'
import { setScrollLocked } from '../lib/scroll'

/** Text logo: a small goal/target mark plus the PayGoal wordmark. */
export function Logo({ className = '' }: { className?: string }) {
  const gid = useId()
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34D399" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="13" fill="none" stroke={`url(#${gid})`} strokeWidth="2.4" />
        <circle cx="16" cy="16" r="7.5" fill="none" stroke="#E8C77A" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="3" fill={`url(#${gid})`} />
        <path d="M16 1.5v5M16 25.5v5M1.5 16h5M25.5 16h5" stroke="#34D399" strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
      </svg>
      <span className="font-display text-[1.4rem] leading-none font-semibold tracking-[-0.03em]">
        Pay<span className="text-emerald-2">Goal</span>
      </span>
      <span className="-ml-1 self-end pb-px text-[0.7rem] font-medium tracking-wide whitespace-nowrap opacity-60">
        ({company.terminalCode})
      </span>
    </span>
  )
}

export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Mobile menu: lock scroll, focus first link, close on Escape / desktop resize.
  useEffect(() => {
    if (!open) return
    setScrollLocked(true)
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      setScrollLocked(false)
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid
            ? 'border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="shell flex h-[4.5rem] items-center justify-between" aria-label="Primary">
          <a href="#top" className="rounded-lg text-snow" aria-label={`${company.brand}, back to top`}>
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-[0.92rem] font-medium text-snow/75 transition-colors hover:text-snow"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to={nav.login.href}
              className="hidden rounded-full px-4 py-2 text-[0.92rem] font-medium text-snow/75 transition-colors hover:text-snow lg:inline-flex"
            >
              {nav.login.label}
            </Link>
            <a href={nav.cta.href} className="btn btn-primary hidden !py-2.5 !text-[0.88rem] sm:inline-flex">
              {nav.cta.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-snow md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-ink/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="shell flex flex-col pt-6 pb-10">
              {nav.links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  className="border-b border-white/[0.07]"
                >
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 font-display text-3xl text-snow"
                  >
                    {l.label}
                    <ArrowUpRight className="size-5 text-gold" aria-hidden="true" />
                  </a>
                </motion.li>
              ))}
              <li className="mt-8 flex flex-col gap-3">
                <a href={nav.cta.href} onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  {nav.cta.label}
                </a>
                <Link to={nav.login.href} className="btn btn-ghost w-full">
                  {nav.login.label}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
