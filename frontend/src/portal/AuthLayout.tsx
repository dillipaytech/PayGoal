import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '../components/Navbar'
import { company } from '../content'

/** Split-screen layout for login and signup. */
export default function AuthLayout({ title, subtitle, children, aside }: { title: string; subtitle: ReactNode; children: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid min-h-svh bg-ivory lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-snow lg:flex lg:flex-col">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.22),transparent)]" />
          <div className="absolute -right-40 -bottom-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_199_122/0.12),transparent)]" />
        </div>
        <Link to="/" className="relative w-fit rounded-lg">
          <Logo />
        </Link>
        <div className="relative mt-auto">
          <p className="eyebrow text-gold">Partner portal</p>
          <div className="mt-6 font-display text-4xl leading-tight xl:text-5xl">{aside}</div>
          <div className="hairline mt-10" />
          <p className="mt-6 text-xs leading-relaxed text-muted">
            {company.legalName} · GSTIN {company.gstin}
          </p>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-ink hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to website
          </Link>
          <Link to="/" className="rounded-lg text-ink lg:hidden" aria-label="PayGoal home">
            <Logo />
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-12">
          <h1 className="text-4xl font-medium text-ink">{title}</h1>
          <p className="mt-3 text-slate-ink">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
