import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { api, ApiError, type User } from '../lib/api'
import AuthLayout from './AuthLayout'
import { homeFor, useAuth } from './auth'
import { Button, Field, FullPageSpinner, Input, Notice } from './ui'
import { company } from '../content'

export default function Login() {
  const { user, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from
  const [form, setForm] = useState({ email: '', password: '' })
  const [fields, setFields] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to={homeFor(user.role)} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setFields({})
    try {
      const { user } = await api<{ user: User }>('/auth/login', { body: form })
      setUser(user)
      const home = homeFor(user.role)
      navigate(from?.startsWith(home) ? from : home, { replace: true })
    } catch (err) {
      const e = err as ApiError
      setError(e.message)
      setFields(e.fields ?? {})
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={`Log in to your ${company.brand} user account.`}
      aside={
        <>
          Your onboarding, support and updates, <em className="text-gradient italic">in one place.</em>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Notice>{error}</Notice>
        <Field label="Email" error={fields.email}>
          {(id, d) => (
            <Input
              id={id}
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!fields.email}
              aria-describedby={d}
            />
          )}
        </Field>
        <Field label="Password" error={fields.password}>
          {(id, d) => (
            <Input
              id={id}
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={!!fields.password}
              aria-describedby={d}
            />
          )}
        </Field>
        <Button type="submit" loading={busy} className="w-full py-3">
          Log in
        </Button>
        <p className="text-center text-sm text-slate-ink">
          New user?{' '}
          <Link to="/signup" className="font-semibold text-emerald-deep underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-slate-ink">Forgot your password? Contact {company.brand} support and we will reset it for you.</p>
      </form>
    </AuthLayout>
  )
}
