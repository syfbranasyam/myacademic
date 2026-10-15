import Swal from 'sweetalert2'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

/*
 * Global feedback & confirmation behaviour (spec §10.4, revision doc Phase 3).
 *
 * Toasts and confirmations are delegated to SweetAlert2 so the whole
 * application shares one consistent feedback system.
 *
 * Toasts: one at a time, bottom-centre, auto-dismiss after 2.4s. A new toast
 * replaces the current one. Position matches spec §10.4 ("bottom centre").
 *
 * Confirmations: every destructive action (Delete, Deactivate, Reject, etc.)
 * must call `showConfirmation` and act only on the resolved result. The
 * callbacks that follow return a promise; callers should `await` them.
 *
 * The `customClass` names align with the styling block in src/styles/theme.css.
 */

const TOAST_DURATION_MS = 2400

const ToastContext = createContext(null)

const TOAST_CLASSES = {
  container: 'swal-toast',
  popup: 'swal-toast-popup',
  title: 'swal-toast-title',
}

const CONFIRM_CLASSES = {
  popup: 'swal-confirm-popup',
  title: 'swal-confirm-title',
  htmlContainer: 'swal-confirm-text',
  confirmButton: 'swal-confirm-button',
  cancelButton: 'swal-cancel-button',
}

export function ToastProvider({ children }) {
  const timerRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const fireToast = useCallback(
    (message, icon) => {
      clearTimer()
      Swal.fire({
        title: message,
        icon,
        position: 'bottom',
        timer: TOAST_DURATION_MS,
        timerProgressBar: true,
        toast: true,
        showConfirmButton: false,
        customClass: TOAST_CLASSES,
      })
      timerRef.current = setTimeout(() => {
        timerRef.current = null
      }, TOAST_DURATION_MS)
    },
    [clearTimer],
  )

  const showToast = useCallback((message) => fireToast(message, 'info'), [fireToast])
  const showSuccess = useCallback((message) => fireToast(message, 'success'), [fireToast])
  const showError = useCallback((message) => fireToast(message, 'error'), [fireToast])
  const showWarning = useCallback((message) => fireToast(message, 'warning'), [fireToast])

  /*
   * Destructive / important action confirmation. Returns SweetAlert's result
   * promise: `{ isConfirmed, isDismissed }`. Callers act on `isConfirmed`.
   *
   * Defaults are tuned for delete flows: warning icon, "Delete" / "Cancel"
   * labels. Callers that need a different flavour pass `icon`, `confirmText`,
   * or `cancelText`.
   */
  const showConfirmation = useCallback(
    ({
      title,
      text,
      icon = 'warning',
      confirmText = 'Delete',
      cancelText = 'Cancel',
    }) =>
      Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        focusCancel: true,
        customClass: CONFIRM_CLASSES,
      }),
    [],
  )

  useEffect(() => clearTimer, [clearTimer])

  const value = useMemo(
    () => ({
      showToast,
      showSuccess,
      showError,
      showWarning,
      showConfirmation,
    }),
    [showToast, showSuccess, showError, showWarning, showConfirmation],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }
  return context
}