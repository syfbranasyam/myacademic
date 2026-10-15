import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

/*
 * Route guard for role-restricted pages (Phase 4b).
 *
 * `role` accepts a single role string or an array. If the current user's role
 * is not in the allowed set, the user is redirected to /forbidden. Assumes the
 * user is authenticated (ProtectedRoute runs higher in the tree).
 */
export default function RequireRole({ role, children }) {
  const { currentUser } = useAuth()
  const allowed = Array.isArray(role) ? role : [role]

  if (!currentUser || !allowed.includes(currentUser.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return children
}