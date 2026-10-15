# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication & role >> sidebar shows all items for admin
- Location: tests\e2e\auth.spec.js:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Students' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: 'Students' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Students' })

```

```yaml
- paragraph: MyAcademic
- button "Collapse sidebar"
- list:
  - link "Dashboard":
    - /url: /dashboard
  - paragraph: ACADEMIC
  - link "Students":
    - /url: /students
  - link "Academic Master":
    - /url: /academic-master
  - link "Teaching Assignment":
    - /url: /teaching-assignment
  - link "Grade Management":
    - /url: /grade-management
  - link "Academic Result":
    - /url: /academic-results
  - paragraph: ACCOUNT
  - link "Profile":
    - /url: /profile
  - button "Logout"
- banner:
  - searchbox "Cari data..."
  - button "Notifications"
  - button "SJ Sarah Jenkins admin":
    - text: SJ
    - paragraph: Sarah Jenkins
    - paragraph: admin
- main:
  - heading "Dashboard" [level=1]
  - paragraph: Overview akademik sekolah
  - paragraph: Students
  - paragraph: 1,245
  - paragraph: Teachers
  - paragraph: "86"
  - paragraph: Classes
  - paragraph: "42"
  - paragraph: Academic Year
  - paragraph: 2026/2027
  - paragraph: Academic Overview
  - paragraph: "Current Semester: Ganjil"
  - paragraph: Active Academic Period
  - paragraph: 2026/2027 Ganjil
  - paragraph: Recent Activity
  - paragraph: Grade submitted — Mathematics — XI IPA 1
  - paragraph: New student registered — Lina
  - paragraph: Teaching assignment updated
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { login, logout, expectToast, ADMIN, TEACHER } from './helpers.js'
  3  | 
  4  | test.describe('Authentication & role', () => {
  5  |   test('admin login lands on dashboard', async ({ page }) => {
  6  |     await login(page, ADMIN)
  7  |     await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  8  |   })
  9  | 
  10 |   test('sidebar shows all items for admin', async ({ page }) => {
  11 |     await login(page, ADMIN)
> 12 |     await expect(page.getByRole('button', { name: 'Students' })).toBeVisible()
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  13 |     await expect(
  14 |       page.getByRole('button', { name: 'Academic Master' }),
  15 |     ).toBeVisible()
  16 |     await expect(
  17 |       page.getByRole('button', { name: 'Teaching Assignment' }),
  18 |     ).toBeVisible()
  19 |     await expect(page.getByRole('button', { name: 'Users' })).not.toBeVisible()
  20 |   })
  21 | 
  22 |   test('teacher login hides admin-only items', async ({ page }) => {
  23 |     await login(page, TEACHER)
  24 |     await expect(page.getByRole('button', { name: 'Students' })).not.toBeVisible()
  25 |     await expect(
  26 |       page.getByRole('button', { name: 'Academic Master' }),
  27 |     ).not.toBeVisible()
  28 |     await expect(
  29 |       page.getByRole('button', { name: 'Teaching Assignment' }),
  30 |     ).toBeVisible()
  31 |   })
  32 | 
  33 |   test('teacher cannot access /students directly', async ({ page }) => {
  34 |     await login(page, TEACHER)
  35 |     await page.goto('/students')
  36 |     await expect(page).toHaveURL(/\/forbidden/)
  37 |   })
  38 | 
  39 |   test('invalid credentials show error toast', async ({ page }) => {
  40 |     await page.goto('/login')
  41 |     await page.locator('#login-username').fill('wrong')
  42 |     await page.locator('#login-password').fill('wrong')
  43 |     await page.getByRole('button', { name: 'Login' }).click()
  44 |     await expectToast(page, 'Invalid username or password')
  45 |   })
  46 | 
  47 |   test('logout returns to login', async ({ page }) => {
  48 |     await login(page, ADMIN)
  49 |     await logout(page)
  50 |   })
  51 | })
```