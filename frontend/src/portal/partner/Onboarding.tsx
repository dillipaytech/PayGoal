import { useEffect } from 'react'
import { Link } from 'react-router'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../auth'
import { onboardingProgress, OnboardingSteps, ProgressBar } from '../shared'
import { Card, Notice, PageHeader } from '../ui'

export default function PartnerOnboarding() {
  const { user, refresh } = useAuth()
  // Fetch the latest step statuses (admins may have updated them).
  useEffect(() => {
    refresh()
  }, [refresh])
  if (!user) return null
  const p = onboardingProgress(user.onboarding)

  return (
    <div className="space-y-8">
      <PageHeader title="Onboarding" description="Track each step of getting your partner account set up. Our team updates these as they go." />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Your steps">
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-slate-ink">
              <span>Progress</span>
              <span className="font-semibold text-ink">
                {p.done} of {p.total}
              </span>
            </div>
            <ProgressBar pct={p.pct} label="Onboarding progress" />
          </div>
          <OnboardingSteps steps={user.onboarding} />
        </Card>

        <div className="space-y-5">
          <Card title="About KYC documents">
            <p className="flex gap-3 text-sm leading-relaxed text-slate-ink">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-deep" aria-hidden="true" />
              For your security, please do not send identity documents through support tickets. A PayGoal team member will contact you and explain how to share them securely.
            </p>
          </Card>
          <Notice tone="info">
            Have a question about a step?{' '}
            <Link to="/dashboard/support" className="font-semibold underline">
              Open a support ticket
            </Link>
            .
          </Notice>
        </div>
      </div>
    </div>
  )
}
