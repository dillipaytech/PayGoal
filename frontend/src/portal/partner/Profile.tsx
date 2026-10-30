import { useState, type FormEvent } from 'react'
import { api, ApiError, BUSINESS_TYPES, type User } from '../../lib/api'
import { useAuth } from '../auth'
import { Button, Card, Field, Input, Notice, PageHeader, Select } from '../ui'

function ProfileForm({ user }: { user: User }) {
  const { setUser } = useAuth()
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    business: { ...user.business },
  })
  const [fields, setFields] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const setBiz = (k: keyof User['business']) => (e: { target: { value: string } }) =>
    setForm({ ...form, business: { ...form.business, [k]: e.target.value } })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFields({})
    setMsg(null)
    try {
      const res = await api<{ user: User }>('/me/profile', { method: 'PUT', body: form })
      setUser(res.user)
      setMsg({ tone: 'success', text: 'Profile saved.' })
    } catch (err) {
      setFields((err as ApiError).fields ?? {})
      setMsg({ tone: 'error', text: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Business profile">
      <form onSubmit={submit} noValidate className="space-y-5">
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" error={fields.name}>
            {(id, d) => <Input id={id} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!fields.name} aria-describedby={d} />}
          </Field>
          <Field label="Phone" error={fields.phone}>
            {(id, d) => <Input id={id} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!!fields.phone} aria-describedby={d} />}
          </Field>
        </div>
        <Field label="Email">{(id) => <Input id={id} value={user.email} disabled readOnly />}</Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" error={fields['business.name']}>
            {(id, d) => <Input id={id} value={form.business.name} onChange={setBiz('name')} aria-invalid={!!fields['business.name']} aria-describedby={d} />}
          </Field>
          <Field label="Business type" error={fields['business.type']}>
            {(id, d) => (
              <Select id={id} value={form.business.type} onChange={setBiz('type')} aria-invalid={!!fields['business.type']} aria-describedby={d}>
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
          <Field label="City">{(id) => <Input id={id} value={form.business.city} onChange={setBiz('city')} />}</Field>
          <Field label="State">{(id) => <Input id={id} value={form.business.state} onChange={setBiz('state')} />}</Field>
        </div>
        <Field label="GSTIN (optional)" error={fields['business.gstin']} hint="15 characters, for example 07ABCDE1234F1Z5.">
          {(id, d) => (
            <Input id={id} value={form.business.gstin} onChange={setBiz('gstin')} maxLength={15} className="uppercase" aria-invalid={!!fields['business.gstin']} aria-describedby={d} />
          )}
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={busy}>
            Save profile
          </Button>
        </div>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [fields, setFields] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFields({})
    setMsg(null)
    try {
      await api('/me/password', { method: 'PUT', body: form })
      setForm({ currentPassword: '', newPassword: '' })
      setMsg({ tone: 'success', text: 'Password changed.' })
    } catch (err) {
      setFields((err as ApiError).fields ?? {})
      setMsg({ tone: 'error', text: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Change password">
      <form onSubmit={submit} noValidate className="space-y-5">
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <Field label="Current password" error={fields.currentPassword}>
          {(id, d) => (
            <Input id={id} type="password" autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} aria-invalid={!!fields.currentPassword} aria-describedby={d} />
          )}
        </Field>
        <Field label="New password" error={fields.newPassword} hint="At least 8 characters.">
          {(id, d) => (
            <Input id={id} type="password" autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} aria-invalid={!!fields.newPassword} aria-describedby={d} />
          )}
        </Field>
        <div className="flex justify-end">
          <Button type="submit" variant="dark" loading={busy}>
            Update password
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function PartnerProfile() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <div className="space-y-8">
      <PageHeader title="Profile & security" description="Keep your business details up to date." />
      <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <ProfileForm user={user} />
        <PasswordForm />
      </div>
    </div>
  )
}
