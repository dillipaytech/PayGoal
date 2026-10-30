import { Check, Circle, Clock, RotateCcw } from 'lucide-react'
import type { OnboardingStep } from '../lib/api'
import { formatDate } from '../lib/api'
import { StatusBadge } from './ui'

export const onboardingProgress = (steps: OnboardingStep[]) => {
  const done = steps.filter((s) => s.status === 'done').length
  return { done, total: steps.length, pct: steps.length ? Math.round((done / steps.length) * 100) : 0 }
}

export function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="h-2 overflow-hidden rounded-full bg-ink/[0.07]">
      <div className="h-full rounded-full bg-gradient-to-r from-emerald via-emerald-2 to-gold transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  )
}

const STEP_ICON = {
  done: <Check className="size-4" strokeWidth={2.5} />,
  in_review: <Clock className="size-4" />,
  needs_changes: <RotateCcw className="size-4" />,
  todo: <Circle className="size-3" />,
}

const STEP_RING = {
  done: 'bg-emerald text-ink',
  in_review: 'bg-gold text-ink',
  needs_changes: 'bg-red-600 text-white',
  todo: 'bg-ink/[0.07] text-slate-ink',
}

/** Vertical onboarding checklist. `renderActions` lets the admin view add controls per step. */
export function OnboardingSteps({ steps, renderActions }: { steps: OnboardingStep[]; renderActions?: (s: OnboardingStep) => React.ReactNode }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
          {i < steps.length - 1 && <span aria-hidden="true" className="absolute top-9 bottom-1 left-[1.05rem] w-px bg-ink/10" />}
          <span className={`relative flex size-[2.1rem] shrink-0 items-center justify-center rounded-full ${STEP_RING[s.status]}`} aria-hidden="true">
            {STEP_ICON[s.status]}
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-sans text-[0.98rem] font-semibold text-ink">{s.label}</h3>
              <StatusBadge status={s.status} />
              {s.status !== 'todo' && <span className="text-xs text-slate-ink">Updated {formatDate(s.updatedAt)}</span>}
            </div>
            {s.note && <p className="mt-1.5 text-sm text-slate-ink">{s.note}</p>}
            {renderActions?.(s)}
          </div>
        </li>
      ))}
    </ol>
  )
}
