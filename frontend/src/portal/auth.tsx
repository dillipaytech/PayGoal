import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { api, ApiError, type Role, type User } from '../lib/api'
import { FullPageSpinner } from './ui'

type AuthState = {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { user } = await api<{ user: User }>('/auth/me')
      setUser(user)
    } catch (e) {
      if (!(e instanceof ApiError) || e.status === 401 || e.status === 403) setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return <AuthContext.Provider value={{ user, loading, setUser, refresh, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export const homeFor = (role: Role) => (role === 'admin' ? '/admin' : '/dashboard')

/** Renders children only for a signed-in user with the given role; otherwise redirects. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return <>{children}</>
}
