import Lenis from 'lenis'

let lenis: Lenis | null = null

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Starts Lenis smooth scrolling (skipped for reduced motion). Returns a cleanup function. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
  let raf = 0
  const loop = (time: number) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

/** Smoothly scrolls to an in-page anchor and moves keyboard focus there. */
export function scrollToHash(hash: string) {
  const target = hash === '#' || hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash)
  if (!target) return

  if (lenis) lenis.scrollTo(target, { offset: target === document.body ? 0 : -80 })
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

  if (target !== document.body) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash)
}

/** Pause/resume smooth scrolling (used while a modal or menu is open). */
export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
