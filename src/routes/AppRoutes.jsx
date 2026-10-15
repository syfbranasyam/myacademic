import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import RequireRole from './RequireRole.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ROLES } from '../data/referenceData.js'

import AcademicMasterPage from '../pages/AcademicMasterPage.jsx'
import AcademicResultListPage from '../pages/AcademicResultListPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import ForbiddenPage from '../pages/ForbiddenPage.jsx'
import GradeManagementPage from '../pages/GradeManagementPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import StudentsPage from '../pages/StudentsPage.jsx'
import TeachingAssignmentPage from '../pages/TeachingAssignmentPage.jsx'

/*
 * Route table (spec §5.1, Phase 4b).
 *
 * Access matrix:
 *   Admin   → all routes
 *   Teacher → dashboard, teaching-assignment, grade-management,
 *             academic-results, profile
 *
 * /forbidden is a real route so RequireRole can navigate to it cleanly.
 */
export default function AppRoutes() {
  const { isAuthenticated } = useAuth()
  const fallback = isAuthenticated ? '/dashboard' : '/login'

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<Navigate to={fallback} replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            path="/students"
            element={
              <RequireRole role={ROLES.ADMIN}>
                <StudentsPage />
              </RequireRole>
            }
          />

          <Route
            path="/academic-master"
            element={
              <RequireRole role={ROLES.ADMIN}>
                <AcademicMasterPage />
              </RequireRole>
            }
          />

          <Route path="/teaching-assignment" element={<TeachingAssignmentPage />} />
          <Route path="/grade-management" element={<GradeManagementPage />} />
          <Route path="/academic-results" element={<AcademicResultListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={fallback} replace />} />
    </Routes>
  )
}