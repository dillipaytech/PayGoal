import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { api, ApiError, BUSINESS_TYPES, type User } from '../lib/api'
import AuthLayout from './AuthLayout'
import { homeFor, useAuth } from './auth'
import { Button, Field, FullPageSpinner, Input, Notice, Select } from './ui'

const EMPTY = { name: '', email: '', phone: '', password: '', businessName: '', businessType: '', city: '', state: '' }

export default function Signup() {
  const { user, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to={homeFor(user.role)} replace />

  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setFields({})
    try {
      const { user } = await api<{ user: User }>('/auth/signup', { body: form })
      setUser(user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const e = err as ApiError
      setError(e.message)
      setFields(e.fields ?? {})
    } finally {
      setBusy(false)
    }
  }

  const text = (k: keyof typeof EMPTY, label: string, props: Record<string, unknown> = {}) => (
    <Field label={label} error={fields[k]}>
      {(id, d) => <Input id={id} value={form[k]} onChange={set(k)} aria-invalid={!!fields[k]} aria-describedby={d} {...props} />}
    </Field>
  )

  return (
    <AuthLayout
      title="Become a partner"
      subtitle="Create your account. Our team will review it and guide you through onboarding."
      aside={
        <>
          Join a network built to <em className="text-gradient italic">score.</em>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Notice>{error}</Notice>
        {text('name', 'Your name', { autoComplete: 'name', required: true })}
        <div className="grid gap-5 sm:grid-cols-2">
          {text('email', 'Email', { type: 'email', autoComplete: 'email', required: true })}
          {text('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel' })}
        </div>
        {text('businessName', 'Business name', { autoComplete: 'organization', required: true })}
        <Field label="Business type" error={fields.businessType}>
          {(id, d) => (
            <Select id={id} value={form.businessType} onChange={set('businessType')} aria-invalid={!!fields.businessType} aria-describedby={d} required>
              <option value="" disabled>
                Choose one
              </option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          {text('city', 'City', { autoComplete: 'address-level2' })}
          {text('state', 'State', { autoComplete: 'address-level1' })}
        </div>
        <Field label="Password" error={fields.password} hint="At least 8 characters.">
          {(id, d) => (
            <Input id={id} type="password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!fields.password} aria-describedby={d} required />
          )}
        </Field>
        <Button type="submit" loading={busy} className="w-full py-3">
          Create account
        </Button>
        <p className="text-center text-sm text-slate-ink">
          Already a partner?{' '}
          <Link to="/login" className="font-semibold text-emerald-deep underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
