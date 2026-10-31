import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  ChartColumn,
  ClipboardCheck,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '../components/Navbar'
import { useAuth } from './auth'
import { StatusBadge } from './ui'
import { company } from '../content'

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean }

const NAV: Record<'partner' | 'admin', NavItem[]> = {
  partner: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/onboarding', label: 'Onboarding', icon: ClipboardCheck },
    { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
    { to: '/dashboard/reports', label: 'Reports', icon: ChartColumn },
    { to: '/dashboard/profile', label: 'Profile & security', icon: UserRound },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
    { to: '/admin/tickets', label: 'Support tickets', icon: LifeBuoy },
  ],
}

export default function PortalLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [location.pathname])

  if (!user) return null
  const items = NAV[user.role]

  const sidebar = (
    <div className="flex h-full flex-col">
      <NavLink to="/" className="rounded-lg px-2 text-snow" aria-label={`${company.brand} website`}>
        <Logo />
      </NavLink>
      <p className="mt-8 px-3 text-[0.68rem] font-semibold tracking-[0.2em] text-gold uppercase">
        {user.role === 'admin' ? 'Admin' : 'User portal'}
      </p>
      <nav aria-label="Portal" className="mt-3">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/[0.08] text-snow shadow-[inset_2px_0_0_var(--color-emerald-2)]' : 'text-snow/65 hover:bg-white/[0.04] hover:text-snow'
                  }`
                }
              >
                <item.icon className="size-[1.1rem]" strokeWidth={1.75} aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
        <p className="truncate text-sm font-semibold text-snow">{user.name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
        {user.role === 'partner' && (
          <div className="mt-2">
            <StatusBadge status={user.status} />
          </div>
        )}
        <button
          type="button"
          onClick={async () => {
            await logout()
            navigate('/login', { replace: true })
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-snow/75 hover:text-snow"
        >
          <LogOut className="size-4" aria-hidden="true" /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-svh bg-ivory text-ink lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh bg-ink p-5 lg:block">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-ink px-4 text-snow lg:hidden">
        <NavLink to="/" aria-label={`${company.brand} website`} className="rounded-lg">
          <Logo />
        </NavLink>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-full border border-white/10"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-ink p-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-white/10 text-snow"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <main id="main" className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
