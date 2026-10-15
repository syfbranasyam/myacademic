import { expect } from '@playwright/test'

/*
 * Shared helpers for the E2E suite (revision Phase 9).
 *
 * Selectors prefer stable ids where they exist (form fields), and fall back to
 * role- or text-based selectors for buttons and links.
 */

/* Credentials from src/data/referenceData.js */
export const ADMIN = { username: 'admin', password: 'admin123' }
export const TEACHER = { username: 'budi', password: 'budi123' }

/**
 * Signs in via the login form.
 * Waits for navigation to /dashboard before returning.
 */
export async function login(page, { username, password } = ADMIN) {
  await page.goto('/login')
  await page.locator('#login-username').fill(username)
  await page.locator('#login-password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

/**
 * Clicks the sidebar Logout.
 */
export async function logout(page) {
  await page.getByRole('button', { name: 'Logout' }).click()
  await expect(page).toHaveURL(/\/login/)
}

/**
 * Clicks the confirm button on a SweetAlert confirmation dialog.
 * Waits for the dialog, clicks the button, waits for it to disappear.
 */
export async function confirmSweetAlert(page, buttonName = 'Delete') {
  const dialog = page.locator('.swal-confirm-popup')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: buttonName }).click()
  await expect(dialog).toBeHidden()
}

/**
 * Dismisses a SweetAlert confirmation by clicking Cancel.
 */
export async function cancelSweetAlert(page) {
  const dialog = page.locator('.swal-confirm-popup')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toBeHidden()
}

/**
 * Asserts that a toast with the given text appears.
 * Toasts auto-dismiss after 2.4s, so the timeout is short.
 */
export async function expectToast(page, text) {
  const toast = page.locator('.swal-toast-popup')
  await expect(toast).toBeVisible({ timeout: 2000 })
  await expect(toast).toContainText(text, { timeout: 2000 })
}

/**
 * Navigates to a sidebar item by its label.
 */
export async function goTo(page, label) {
  await page.getByRole('button', { name: label }).click()
}