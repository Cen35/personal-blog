import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { PageLoader } from './Status'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader label="正在确认登录状态" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

