import { useCallback } from 'react'

import { useToast } from '../context/ToastContext.jsx'

/*
 * Save-confirmation helper for CRUD modals (revision Phase 5).
 *
 * Wraps SweetAlert's `showConfirmation` in the wording and icon used for
 * save actions, so every Add/Edit modal asks the same way. Pages call
 * `confirmSave` and act only when it resolves to true:
 *
 *   const ok = await confirmSave({ text: 'Add this student?' })
 *   if (!ok) return
 *   // ... execute the save
 *
 * Delete flows keep using `showConfirmation` directly — their default
 * warning styling and "Delete" wording already fit.
 */
export function useCrudConfirm() {
  const { showConfirmation } = useToast()

  const confirmSave = useCallback(
    async ({ title = 'Save changes?', text, confirmText = 'Save' } = {}) => {
      const result = await showConfirmation({
        title,
        text,
        icon: 'question',
        confirmText,
        cancelText: 'Cancel',
      })
      return result.isConfirmed
    },
    [showConfirmation],
  )

  return { confirmSave }
}