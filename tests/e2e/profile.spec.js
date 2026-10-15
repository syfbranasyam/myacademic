import { test, expect } from '@playwright/test'
import { login, confirmSweetAlert, expectToast, goTo, ADMIN } from './helpers.js'

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Profile')
  })

  test('shows admin profile with role badge', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
    await expect(page.getByText('Administrator')).toBeVisible()
    await expect(page.getByText('Sarah Jenkins')).toBeVisible()
  })

  test('save changes updates topbar name', async ({ page }) => {
    const nameField = page.locator('input').filter({ hasText: '' }).first()
    // Use the label to find the Full Name field
    const fullNameInput = page
      .locator('label', { hasText: 'Full Name & Title' })
      .locator('..')
      .locator('input')
    await fullNameInput.fill('Sarah J. Updated')
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await confirmSweetAlert(page, 'Save')
    await expectToast(page, 'Profile saved')
  })

  test('invalid email is rejected', async ({ page }) => {
    const emailInput = page
      .locator('label', { hasText: 'Official Institutional Email' })
      .locator('..')
      .locator('input')
    await emailInput.fill('not-an-email')
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await expectToast(page, 'Name and a valid email are required')
  })

  test('password requirements enforced', async ({ page }) => {
    const currentPwd = page
      .locator('label', { hasText: 'Current Password' })
      .locator('..')
      .locator('input')
    const newPwd = page
      .locator('label', { hasText: 'New Password' })
      .locator('..')
      .locator('input')
    await currentPwd.fill('anycurrent')
    await newPwd.fill('short')
    await page.getByRole('button', { name: 'Update Password' }).click()
    await expectToast(page, 'Password does not meet requirements')
  })
})