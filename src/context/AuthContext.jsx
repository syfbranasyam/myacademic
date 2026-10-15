import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { ROLES, findUser } from '../data/referenceData.js'

/*
 * Authentication and the signed-in user's profile (spec §8.5, Phase 4b).
 *
 * Two roles: Admin (full access) and Teacher (limited scope). The mock
 * credential table lives in referenceData.js (USERS + findUser). No session is
 * persisted — a refresh returns the user to the login screen (spec §3.4).
 *
 * `currentUser` is null until a successful login, then carries the full user
 * record. Components that need role checks read `currentUser.role` or the
 * convenience `isAdmin` / `isTeacher` flags.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  /* Accepts raw credentials. Returns the full user on success, null on
     failure — the caller decides how to surface the error (spec §10.4). */
  const login = useCallback((username, password) => {
    const user = findUser(username, password)
    if (!user) return null
    setCurrentUser(user)
    setIsAuthenticated(true)
    return user
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUser(null)
  }, [])

  /* Merges patch fields into the current user. Only editable fields are ever
     passed by the Profile page; identity fields (role, nip) are read-only in
     the UI and never sent. */
  const updateProfile = useCallback((patch) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const isAdmin = currentUser?.role === ROLES.ADMIN
  const isTeacher = currentUser?.role === ROLES.TEACHER

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUser,
      isAdmin,
      isTeacher,
      login,
      logout,
      updateProfile,
    }),
    [isAuthenticated, currentUser, isAdmin, isTeacher, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}