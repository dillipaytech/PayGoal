import type { ReactNode } from 'react'
import Reveal from './Reveal'

type Props = {
  eyebrow: string
  title: ReactNode
  body?: ReactNode
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  id?: string
}

export default function SectionHeading({ eyebrow, title, body, tone = 'light', align = 'left', id }: Props) {
  const dark = tone === 'dark'
  const centered = align === 'center'

  return (
    <Reveal className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow ${dark ? 'text-gold' : 'text-gold-deep'} ${centered ? 'justify-center' : ''}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`mt-5 text-[2.25rem] leading-[1.06] font-medium sm:text-5xl md:text-[3.5rem] ${
          dark ? 'text-snow' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {body && (
        <p className={`mt-6 text-base leading-relaxed md:text-lg ${dark ? 'text-muted' : 'text-slate-ink'}`}>{body}</p>
      )}
    </Reveal>
  )
}
