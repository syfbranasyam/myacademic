import { test, expect } from '@playwright/test'
import { login, confirmSweetAlert, expectToast, goTo, ADMIN } from './helpers.js'

test.describe('Academic Master CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Academic Master')
  })

  test('shows Active tab with master items', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    // Seeded 8 items, 6 per page
    await expect(rows).toHaveCount(6)
  })

  test('search filters by code', async ({ page }) => {
    await page.getByPlaceholder('Search by code or name...').fill('PHY')
    await expect(page.locator('table tbody tr').first()).toContainText('PHY')
  })

  test('add master item', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New' }).click()
    await page.locator('#master-type').click()
    await page.getByRole('option', { name: 'Subject' }).click()
    await page.locator('#master-code').fill('TEST-01')
    await page.locator('#master-name').fill('Test Subject')
    await page.locator('#master-category').click()
    await page.getByRole('option', { name: 'Science / MIPA' }).click()
    await page.getByRole('button', { name: 'Save Master' }).click()
    await confirmSweetAlert(page, 'Add')
    await expectToast(page, 'Master data added')
  })

  test('duplicate code is rejected', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New' }).click()
    await page.locator('#master-type').click()
    await page.getByRole('option', { name: 'Subject' }).click()
    await page.locator('#master-code').fill('MAT')
    await page.locator('#master-name').fill('Duplicate')
    await page.locator('#master-category').click()
    await page.getByRole('option', { name: 'Science / MIPA' }).click()
    await page.getByRole('button', { name: 'Save Master' }).click()
    await confirmSweetAlert(page, 'Add')
    await expectToast(page, 'Code already exists')
  })
})