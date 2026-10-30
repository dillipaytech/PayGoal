import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion, useScroll } from 'motion/react'

/**
 * The signature scroll trail.
 *
 * One SVG path, sized to the whole page, winds down between the sections.
 * Its drawn length follows the scroll position (via stroke-dashoffset), so the
 * tip always sits a little below the middle of the viewport. A glowing orb rides
 * the tip; a short chain of dots trails it with spring-like lag. Near the footer
 * everything fades out as the PAYGOAL wordmark (see Footer) takes over.
 *
 * Performance: geometry is measured only on resize. Each frame reads a
 * precomputed lookup table and writes transforms / opacity / dashoffset directly
 * to the DOM; React never re-renders while scrolling.
 */

const TRAIL_DOTS = 12
const SAMPLE_STEP = 6 // px of path length between lookup samples
const TIP_VIEWPORT = 0.58 // tip sits at 58% of the viewport height
const MOBILE_BREAKPOINT = 768

const EMERALD = [16, 185, 129]
const TEAL = [20, 184, 166]
const GOLD = [232, 199, 122]

type Lookup = { xs: Float32Array; ys: Float32Array; ysMono: Float32Array; total: number; maxScroll: number; top: number }

function mixColour(t: number) {
  const [a, b, k]: [number[], number[], number] = t < 0.55 ? [EMERALD, TEAL, t / 0.55] : [TEAL, GOLD, (t - 0.55) / 0.45]
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(' ')})`
}

/** Catmull-Rom spline through the points, as cubic Bézier SVG path data.
 *  Control points are clamped to [minX, maxX] so curves never bulge off-screen. */
function smoothPath(pts: [number, number][], minX: number, maxX: number) {
  const cx = (x: number) => Math.min(maxX, Math.max(minX, x))
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = [cx(p1[0] + (p2[0] - p0[0]) / 6), p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [cx(p2[0] - (p3[0] - p1[0]) / 6), p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

export default function ScrollTrail({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const gradRef = useRef<SVGLinearGradientElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (reduce) return
    const container = containerRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const grad = gradRef.current
    const orb = orbRef.current
    if (!container || !svg || !path || !grad || !orb) return

    let lookup: Lookup | null = null

    /* ---------- Geometry: rebuilt whenever the page size changes ---------- */
    const build = () => {
      const w = container.clientWidth
      const h = container.scrollHeight
      const vh = window.innerHeight
      const top = container.getBoundingClientRect().top + window.scrollY
      const docY = (el: Element) => el.getBoundingClientRect().top + window.scrollY - top
      const mobile = w < MOBILE_BREAKPOINT

      const endEl = container.querySelector('[data-trail-end]')
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh)
      const startY = vh * TIP_VIEWPORT
      // The end must be reachable by the tip at maximum scroll.
      const endY = Math.min(endEl ? docY(endEl) + 4 : h - vh * 0.4, maxScroll + vh * TIP_VIEWPORT - 2)

      let pts: [number, number][]
      if (mobile) {
        pts = [
          [10, startY],
          [10, endY],
        ]
      } else {
        // Weave: rest in the side gutters mid-section, cross the centre at section boundaries.
        const contentEdge = Math.max(0, (w - 1152) / 2) + 32
        const gutter = contentEdge * 0.5
        const sections = Array.from(container.querySelectorAll<HTMLElement>('main > section'))
        const footerEl = container.querySelector('footer')
        const footerTop = footerEl ? docY(footerEl) : endY
        pts = [[w * 0.5, startY]]
        let side = 1
        for (const s of sections) {
          const sTop = docY(s)
          const sh = s.offsetHeight
          if (sh < 200) continue // skip thin strips like the ticker
          const mid = sTop + sh * 0.5
          if (mid > startY + 120 && mid < footerTop - 120) {
            pts.push([side > 0 ? w - gutter : gutter, mid])
            const boundary = sTop + sh
            if (boundary < footerTop - 160) pts.push([w * 0.5 + side * w * 0.06, boundary])
            side = -side
          }
        }
        // Through the footer, keep to the left margin so the line never crosses text,
        // then arrive at the wordmark's left edge, where its dots take over.
        pts.push([gutter, footerTop + 60])
        pts.push([gutter, endY])
        pts = pts.filter((p, i) => i === 0 || p[1] > pts[i - 1][1] + 40)
      }

      svg.setAttribute('width', String(w))
      svg.setAttribute('height', String(h))
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      grad.setAttribute('y1', String(startY))
      grad.setAttribute('y2', String(endY))
      path.setAttribute('d', smoothPath(pts, 6, w - 6))
      path.setAttribute('stroke-width', mobile ? '1' : '1.25')

      const total = path.getTotalLength()
      const n = Math.ceil(total / SAMPLE_STEP) + 1
      const xs = new Float32Array(n)
      const ys = new Float32Array(n)
      const ysMono = new Float32Array(n)
      for (let k = 0; k < n; k++) {
        const p = path.getPointAtLength(Math.min(k * SAMPLE_STEP, total))
        xs[k] = p.x
        ys[k] = p.y
        ysMono[k] = k === 0 ? p.y : Math.max(p.y, ysMono[k - 1])
      }
      path.style.strokeDasharray = `${total} ${total}`
      lookup = { xs, ys, ysMono, total, maxScroll, top }
      dirty = true
    }

    /** Path length at which the curve reaches document height `y`. */
    const lengthAtY = (y: number) => {
      const { ysMono, total } = lookup!
      if (y <= ysMono[0]) return 0
      let lo = 0
      let hi = ysMono.length - 1
      if (y >= ysMono[hi]) return total
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (ysMono[mid] < y) lo = mid
        else hi = mid
      }
      const f = (y - ysMono[lo]) / Math.max(1e-3, ysMono[hi] - ysMono[lo])
      return Math.min(total, (lo + f) * SAMPLE_STEP)
    }

    const pointAt = (len: number): [number, number] => {
      const { xs, ys } = lookup!
      const k = Math.max(0, Math.min(xs.length - 1.001, len / SAMPLE_STEP))
      const i = Math.floor(k)
      const f = k - i
      return [xs[i] + (xs[i + 1] - xs[i]) * f, ys[i] + (ys[i + 1] - ys[i]) * f]
    }

    /* ---------- Animation loop ---------- */
    let raf = 0
    let last = performance.now()
    let tip = -1
    let vel = 0
    let dirty = true
    const tail = new Float32Array(TRAIL_DOTS)
    const dotColours: string[] = []

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!lookup) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const { total, maxScroll, top } = lookup
      const sy = scrollY.get()
      const target = sy >= maxScroll - 2 ? total : lengthAtY(sy + window.innerHeight * TIP_VIEWPORT - top)

      if (tip < 0) {
        tip = target
        tail.fill(target)
      }

      // Slightly under-damped spring for the tip: it feels physical, not mechanical.
      const stiffness = 90
      const damping = 2 * Math.sqrt(stiffness) * 0.82
      vel += ((target - tip) * stiffness - vel * damping) * dt
      tip = Math.max(0, Math.min(total, tip + vel * dt))

      // Each trailing dot chases the one ahead of it.
      let tailMoving = false
      for (let i = 0; i < TRAIL_DOTS; i++) {
        const lead = i === 0 ? tip : tail[i - 1]
        const next = tail[i] + (lead - tail[i]) * (1 - Math.exp(-dt * (26 - i)))
        if (Math.abs(next - tail[i]) > 0.05) tailMoving = true
        tail[i] = next
      }

      if (!dirty && !tailMoving && Math.abs(target - tip) < 0.05 && Math.abs(vel) < 0.05) return
      dirty = false

      // Fade everything out over the last stretch, as the wordmark appears.
      const endFade = Math.min(1, Math.max(0, (total - tip) / 260))

      path.style.strokeDashoffset = String(total - tip)

      const [ox, oy] = pointAt(tip)
      orb.style.transform = `translate3d(${ox}px, ${oy}px, 0)`
      orb.style.opacity = String(endFade)

      for (let i = 0; i < TRAIL_DOTS; i++) {
        const dot = dotRefs.current[i]
        if (!dot) continue
        const [x, y] = pointAt(tail[i])
        // Hide dots that are stacked under the orb; reveal them as the tail stretches.
        const spread = Math.min(1, Math.max(0, (tip - tail[i]) / 10))
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
        dot.style.opacity = String(endFade * spread * 0.75 * (1 - i / (TRAIL_DOTS + 2)))
        const colour = mixColour(Math.round((tail[i] / total) * 40) / 40)
        if (dotColours[i] !== colour) {
          dot.style.backgroundColor = colour
          dotColours[i] = colour
        }
      }
    }

    /* ---------- Wiring ---------- */
    let buildRaf = 0
    const scheduleBuild = () => {
      cancelAnimationFrame(buildRaf)
      buildRaf = requestAnimationFrame(build)
    }
    const ro = new ResizeObserver(scheduleBuild)
    ro.observe(container)
    window.addEventListener('resize', scheduleBuild)
    document.fonts?.ready.then(scheduleBuild)

    // First measurement waits until after the first paint, so it never delays it.
    const startTimer = window.setTimeout(() => {
      scheduleBuild()
      raf = requestAnimationFrame(frame)
    }, 300)

    return () => {
      window.clearTimeout(startTimer)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(buildRaf)
      ro.disconnect()
      window.removeEventListener('resize', scheduleBuild)
    }
  }, [reduce, containerRef, scrollY])

  if (reduce) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <svg ref={svgRef} className="absolute top-0 left-0" fill="none">
        <defs>
          <linearGradient ref={gradRef} id="trail-gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#10B981" />
            <stop offset="0.55" stopColor="#14B8A6" />
            <stop offset="1" stopColor="#E8C77A" />
          </linearGradient>
        </defs>
        <path ref={pathRef} stroke="url(#trail-gradient)" strokeLinecap="round" strokeOpacity="0.55" />
      </svg>

      {/* Trailing dots (desktop only) */}
      <div className="hidden md:block">
        {Array.from({ length: TRAIL_DOTS }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{
              width: 5 - i * 0.25,
              height: 5 - i * 0.25,
              marginLeft: -(5 - i * 0.25) / 2,
              marginTop: -(5 - i * 0.25) / 2,
              borderRadius: 999,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Leading orb: emerald core, soft gold halo */}
      <div ref={orbRef} className="absolute top-0 left-0 will-change-transform" style={{ opacity: 0 }}>
        <span className="absolute -top-6 -left-6 size-12 rounded-full bg-[radial-gradient(circle,rgb(232_199_122/0.32)_0%,rgb(232_199_122/0.08)_45%,transparent_70%)]" />
        <span className="absolute -top-[5px] -left-[5px] size-[10px] rounded-full bg-emerald-2 shadow-[0_0_14px_3px_rgb(52_211_153/0.65)]" />
        <span className="absolute -top-[2px] -left-[2px] size-1 rounded-full bg-white/90" />
      </div>
    </div>
  )
}
