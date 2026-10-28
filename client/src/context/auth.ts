import { createContext, useContext } from 'react'
import type { User } from '../types'

export type AuthValue = {
  user: User | null
  loading: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
