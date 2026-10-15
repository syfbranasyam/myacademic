import { useEffect, useState } from 'react'

/*
 * Persisted state backed by localStorage (revision Phase 10).
 *
 * Reads the initial value from localStorage on mount (falling back to the
 * default when the key is absent, when localStorage is unavailable, or when
 * the stored value is invalid JSON). Writes on every state change.
 *
 * Used by all CRUD pages to persist their column order under a per-page key:
 *   myacademic.students.columnOrder
 *   myacademic.master.columnOrder
 *   myacademic.assignments.columnOrder
 *   myacademic.rosters.columnOrder
 *   myacademic.results.columnOrder
 *
 * Every localStorage access is wrapped in try/catch — private mode, quota
 * exceeded, and storage disabled all fall back to in-memory state.
 */
export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* ignore — storage may be unavailable */
    }
  }, [key, state])

  return [state, setState]
}