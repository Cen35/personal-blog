import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'
import { AuthContext } from './auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('personal-blog-token')))

  const refresh = async () => {
    if (!localStorage.getItem('personal-blog-token')) return
    try { setUser((await api.get<User>('/users/me')).data) }
    catch { localStorage.removeItem('personal-blog-token'); setUser(null) }
    finally { setLoading(false) }
  }

  // Authentication is restored once when the app starts.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { void refresh() }, [])

  const login = async (loginValue: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', { login: loginValue, password })
    localStorage.setItem('personal-blog-token', data.token)
    setUser(data.user)
  }

  const logout = () => { localStorage.removeItem('personal-blog-token'); setUser(null) }
  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

