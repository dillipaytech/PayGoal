import { useEffect, useRef } from 'react'
import { MotionConfig } from 'motion/react'
import { initSmoothScroll, scrollToHash } from './lib/scroll'
import Navbar from './components/Navbar'
import ScrollTrail from './components/ScrollTrail'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Ticker from './sections/Ticker'
import Services from './sections/Services'
import WhoItsFor from './sections/WhoItsFor'
import Highlights from './sections/Highlights'
import HowItWorks from './sections/HowItWorks'
import Trust from './sections/Trust'
import FAQ from './sections/FAQ'
import Contact from './sections/Contact'

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => initSmoothScroll(), [])

  // Route every in-page anchor click through the smooth scroller.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')!
      e.preventDefault()
      scrollToHash(hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <div ref={pageRef} className="relative">
        <ScrollTrail containerRef={pageRef} />
        <main id="main">
          <Hero />
          <Ticker />
          <Services />
          <WhoItsFor />
          <Highlights />
          <HowItWorks />
          <Trust />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
