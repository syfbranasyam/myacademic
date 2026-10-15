import { test, expect } from '@playwright/test'
import { login, logout, expectToast, ADMIN, TEACHER } from './helpers.js'

test.describe('Authentication & role', () => {
  test('admin login lands on dashboard', async ({ page }) => {
    await login(page, ADMIN)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('sidebar shows all items for admin', async ({ page }) => {
    await login(page, ADMIN)
    await expect(page.getByRole('button', { name: 'Students' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Academic Master' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Teaching Assignment' }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Users' })).not.toBeVisible()
  })

  test('teacher login hides admin-only items', async ({ page }) => {
    await login(page, TEACHER)
    await expect(page.getByRole('button', { name: 'Students' })).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Academic Master' }),
    ).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Teaching Assignment' }),
    ).toBeVisible()
  })

  test('teacher cannot access /students directly', async ({ page }) => {
    await login(page, TEACHER)
    await page.goto('/students')
    await expect(page).toHaveURL(/\/forbidden/)
  })

  test('invalid credentials show error toast', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#login-username').fill('wrong')
    await page.locator('#login-password').fill('wrong')
    await page.getByRole('button', { name: 'Login' }).click()
    await expectToast(page, 'Invalid username or password')
  })

  test('logout returns to login', async ({ page }) => {
    await login(page, ADMIN)
    await logout(page)
  })
})