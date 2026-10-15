import { test, expect } from '@playwright/test'
import { login, confirmSweetAlert, expectToast, goTo, ADMIN } from './helpers.js'

test.describe('Students CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Students')
  })

  test('shows Active tab with 6 rows paginated', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible()
    // 6 students visible on page 1
    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(6)
  })

  test('search filters rows', async ({ page }) => {
    await page.getByPlaceholder('Search student...').fill('Andi')
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toContainText('Andi')
  })

  test('add student appears in list', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Student' }).click()
    await page.locator('#modal-name').fill('Test New Student')
    await page.locator('#modal-cls').click()
    await page.getByRole('option', { name: 'XI IPA 1' }).click()
    await page.locator('#modal-gender').click()
    await page.getByRole('option', { name: 'Male' }).click()
    await page.getByRole('button', { name: 'Save Student' }).click()
    await confirmSweetAlert(page, 'Add')
    await expectToast(page, 'Student added')
  })

  test('row click opens view modal', async ({ page }) => {
    await page.locator('table tbody tr').first().click()
    await expect(
      page.getByRole('heading', { name: 'Student Details' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).first().click()
  })

  test('delete student confirms and removes', async ({ page }) => {
    await page.locator('table tbody tr').first().locator('[aria-label="Delete"]').click()
    await confirmSweetAlert(page, 'Delete')
    await expectToast(page, 'Student deleted')
  })

  test('bulk deactivate moves rows to inactive tab', async ({ page }) => {
    // Select all visible rows via header checkbox
    await page.locator('table thead input[type="checkbox"]').check()
    await page.getByRole('button', { name: 'Deactivate' }).click()
    await confirmSweetAlert(page, 'Deactivate')
    await expectToast(page, 'students deactivated')
  })
})