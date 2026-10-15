import { test, expect } from '@playwright/test'
import { login, confirmSweetAlert, expectToast, goTo, ADMIN, TEACHER } from './helpers.js'

test.describe('Teaching Assignment', () => {
  test('admin sees full matrix for default year', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Teaching Assignment')
    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(12)
  })

  test('teacher sees only their own assignments', async ({ page }) => {
    await login(page, TEACHER)
    await goTo(page, 'Teaching Assignment')
    const rows = page.locator('table tbody tr')
    // Budi has 3 rows across 2024/2025 and 2025/2026, but filter defaults to 2024/2025 → 2 rows
    await expect(rows).toHaveCount(2)
    await expect(rows.first()).toContainText('Budi')
  })

  test('teacher has no Create Assignment button', async ({ page }) => {
    await login(page, TEACHER)
    await goTo(page, 'Teaching Assignment')
    await expect(
      page.getByRole('button', { name: 'Create Assignment' }),
    ).not.toBeVisible()
  })

  test('admin create assignment', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Teaching Assignment')
    await page.getByRole('button', { name: 'Create Assignment' }).click()
    await page.locator('#assign-teacher').click()
    await page.getByRole('option', { name: 'Budi Santoso, S.Pd' }).click()
    await page.locator('#assign-cls').click()
    await page.getByRole('option', { name: 'XI IPS 1' }).click()
    await page.locator('#assign-subj').click()
    await page.getByRole('option', { name: 'Mathematics' }).click()
    await page.getByRole('button', { name: 'Create Assignment' }).click()
    await confirmSweetAlert(page, 'Create')
    await expectToast(page, 'Assignment created')
  })

  test('admin delete assignment', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Teaching Assignment')
    await page
      .locator('table tbody tr')
      .first()
      .locator('[aria-label="Delete"]')
      .click()
    await confirmSweetAlert(page, 'Delete')
    await expectToast(page, 'Assignment deleted')
  })
})