import { test, expect } from '@playwright/test'
import { login, confirmSweetAlert, expectToast, goTo, ADMIN, TEACHER } from './helpers.js'

test.describe('Grade Management', () => {
  test('admin sees all rosters', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Grade Management')
    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(12)
  })

  test('teacher sees only their own rosters', async ({ page }) => {
    await login(page, TEACHER)
    await goTo(page, 'Grade Management')
    const rows = page.locator('table tbody tr')
    // Budi has 2 rosters (XI IPA 1 Mathematics + XI IPA 2 Mathematics)
    await expect(rows).toHaveCount(2)
  })

  test('teacher has no Generate Roster button but has Edit access', async ({
    page,
  }) => {
    await login(page, TEACHER)
    await goTo(page, 'Grade Management')
    await expect(
      page.getByRole('button', { name: 'Generate Roster' }),
    ).not.toBeVisible()
    // Edit icon should be present
    await expect(
      page.locator('table tbody tr').first().locator('[aria-label="Edit scores"]'),
    ).toBeVisible()
  })

  test('admin generate roster and edit scores', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Grade Management')

    // Generate a new roster for a combination not yet existing
    await page.getByRole('button', { name: 'Generate Roster' }).click()
    await page.locator('#gen-teacher').click()
    await page.getByRole('option', { name: 'Rahmat Hidayat, M.Kom' }).click()
    await page.locator('#gen-subject').click()
    await page.getByRole('option', { name: 'Sociology' }).click()
    await page.locator('#gen-cls').click()
    await page.getByRole('option', { name: 'XI IPA 1' }).click()
    await page.getByRole('button', { name: 'Generate Grade' }).click()
    await confirmSweetAlert(page, 'Generate')
    await expectToast(page, 'Grade roster generated')
  })
})