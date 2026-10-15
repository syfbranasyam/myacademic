import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

/*
 * Route guard. Checks authentication ONLY — the prototype has a single role and
 * no per-module permission checking (spec §9.3), so none is built here.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}