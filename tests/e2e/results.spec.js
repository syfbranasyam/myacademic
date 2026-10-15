import { test, expect } from '@playwright/test'
import { login, goTo, ADMIN } from './helpers.js'

test.describe('Academic Result', () => {
  test('admin sees KPIs and student rows', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Academic Result')
    await expect(
      page.getByRole('heading', { name: 'Academic Result' }),
    ).toBeVisible()
    // KPI cards exist
    await expect(page.getByText('Total Students Assessed')).toBeVisible()
    await expect(page.getByText('Passing Rate')).toBeVisible()
    // Rows visible
    await expect(page.locator('table tbody tr')).toHaveCount(6)
  })

  test('row click opens transcript modal', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Academic Result')
    await page.locator('table tbody tr').first().click()
    await expect(page.getByText('Cumulative Grade Ledger')).toBeVisible()
    await expect(page.getByText('Average Score')).toBeVisible()
  })

  test('search filters students', async ({ page }) => {
    await login(page, ADMIN)
    await goTo(page, 'Academic Result')
    await page.getByPlaceholder('Search student by name or NIS...').fill('Andi')
    await expect(page.locator('table tbody tr').first()).toContainText('Andi')
  })
})