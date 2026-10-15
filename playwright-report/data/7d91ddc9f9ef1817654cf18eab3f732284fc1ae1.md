# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: results.spec.js >> Academic Result >> search filters students
- Location: tests\e2e\results.spec.js:26:3

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Academic Result' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - paragraph [ref=e8]: MyAcademic
      - button "Collapse sidebar" [ref=e9] [cursor=pointer]:
        - generic [aria-hidden] [ref=e10]: menu_open
    - list [ref=e11]:
      - link "Dashboard" [ref=e12] [cursor=pointer]:
        - /url: /dashboard
        - generic [aria-hidden] [ref=e14]: dashboard
      - paragraph [ref=e17]: ACADEMIC
      - link "Students" [ref=e18] [cursor=pointer]:
        - /url: /students
        - generic [aria-hidden] [ref=e20]: school
      - link "Academic Master" [ref=e23] [cursor=pointer]:
        - /url: /academic-master
        - generic [aria-hidden] [ref=e25]: database
      - link "Teaching Assignment" [ref=e28] [cursor=pointer]:
        - /url: /teaching-assignment
        - generic [aria-hidden] [ref=e30]: co_present
      - link "Grade Management" [ref=e33] [cursor=pointer]:
        - /url: /grade-management
        - generic [aria-hidden] [ref=e35]: assignment_turned_in
      - link "Academic Result" [ref=e38] [cursor=pointer]:
        - /url: /academic-results
        - generic [aria-hidden] [ref=e40]: analytics
      - paragraph [ref=e43]: ACCOUNT
      - link "Profile" [ref=e44] [cursor=pointer]:
        - /url: /profile
        - generic [aria-hidden] [ref=e46]: account_circle
      - button "Logout" [ref=e49] [cursor=pointer]:
        - generic [aria-hidden] [ref=e51]: logout
  - generic [ref=e54]:
    - banner [ref=e55]:
      - generic [ref=e56]:
        - generic "Search" [ref=e57]:
          - generic [ref=e58]:
            - generic [aria-hidden] [ref=e60]: search
            - searchbox "Cari data..." [ref=e61]
            - group [aria-hidden]
        - generic [ref=e62]:
          - button "Notifications" [ref=e63] [cursor=pointer]:
            - generic [aria-hidden] [ref=e64]: notifications
          - button "SJ Sarah Jenkins admin" [ref=e66] [cursor=pointer]:
            - generic [ref=e67]: SJ
            - generic [ref=e68]:
              - paragraph [ref=e69]: Sarah Jenkins
              - paragraph [ref=e70]: admin
    - main [ref=e71]:
      - generic [ref=e72]:
        - generic [ref=e74]:
          - heading "Dashboard" [level=1] [ref=e75]
          - paragraph [ref=e76]: Overview akademik sekolah
        - generic [ref=e77]:
          - generic [ref=e80]:
            - generic [ref=e81]:
              - paragraph [ref=e82]: Students
              - generic [aria-hidden] [ref=e84]: group
            - paragraph [ref=e85]: 1,245
          - generic [ref=e88]:
            - generic [ref=e89]:
              - paragraph [ref=e90]: Teachers
              - generic [aria-hidden] [ref=e92]: person_apron
            - paragraph [ref=e93]: "86"
          - generic [ref=e96]:
            - generic [ref=e97]:
              - paragraph [ref=e98]: Classes
              - generic [aria-hidden] [ref=e100]: meeting_room
            - paragraph [ref=e101]: "42"
          - generic [ref=e104]:
            - generic [ref=e105]:
              - paragraph [ref=e106]: Academic Year
              - generic [aria-hidden] [ref=e108]: calendar_today
            - paragraph [ref=e109]: 2026/2027
        - generic [ref=e110]:
          - generic [ref=e113]:
            - paragraph [ref=e114]: Academic Overview
            - paragraph [ref=e115]: "Current Semester: Ganjil"
          - generic [ref=e118]:
            - paragraph [ref=e119]: Active Academic Period
            - paragraph [ref=e120]: 2026/2027 Ganjil
        - generic [ref=e121]:
          - paragraph [ref=e122]: Recent Activity
          - generic [ref=e123]:
            - generic [ref=e124]:
              - generic [aria-hidden] [ref=e126]: assignment_turned_in
              - paragraph [ref=e127]: Grade submitted — Mathematics — XI IPA 1
            - generic [ref=e128]:
              - generic [aria-hidden] [ref=e130]: person_add
              - paragraph [ref=e131]: New student registered — Lina
            - generic [ref=e132]:
              - generic [aria-hidden] [ref=e134]: edit_calendar
              - paragraph [ref=e135]: Teaching assignment updated
```

# Test source

```ts
  1  | import { expect } from '@playwright/test'
  2  | 
  3  | /*
  4  |  * Shared helpers for the E2E suite (revision Phase 9).
  5  |  *
  6  |  * Selectors prefer stable ids where they exist (form fields), and fall back to
  7  |  * role- or text-based selectors for buttons and links.
  8  |  */
  9  | 
  10 | /* Credentials from src/data/referenceData.js */
  11 | export const ADMIN = { username: 'admin', password: 'admin123' }
  12 | export const TEACHER = { username: 'budi', password: 'budi123' }
  13 | 
  14 | /**
  15 |  * Signs in via the login form.
  16 |  * Waits for navigation to /dashboard before returning.
  17 |  */
  18 | export async function login(page, { username, password } = ADMIN) {
  19 |   await page.goto('/login')
  20 |   await page.locator('#login-username').fill(username)
  21 |   await page.locator('#login-password').fill(password)
  22 |   await page.getByRole('button', { name: 'Login' }).click()
  23 |   await expect(page).toHaveURL(/\/dashboard/)
  24 | }
  25 | 
  26 | /**
  27 |  * Clicks the sidebar Logout.
  28 |  */
  29 | export async function logout(page) {
  30 |   await page.getByRole('button', { name: 'Logout' }).click()
  31 |   await expect(page).toHaveURL(/\/login/)
  32 | }
  33 | 
  34 | /**
  35 |  * Clicks the confirm button on a SweetAlert confirmation dialog.
  36 |  * Waits for the dialog, clicks the button, waits for it to disappear.
  37 |  */
  38 | export async function confirmSweetAlert(page, buttonName = 'Delete') {
  39 |   const dialog = page.locator('.swal-confirm-popup')
  40 |   await expect(dialog).toBeVisible()
  41 |   await dialog.getByRole('button', { name: buttonName }).click()
  42 |   await expect(dialog).toBeHidden()
  43 | }
  44 | 
  45 | /**
  46 |  * Dismisses a SweetAlert confirmation by clicking Cancel.
  47 |  */
  48 | export async function cancelSweetAlert(page) {
  49 |   const dialog = page.locator('.swal-confirm-popup')
  50 |   await expect(dialog).toBeVisible()
  51 |   await dialog.getByRole('button', { name: 'Cancel' }).click()
  52 |   await expect(dialog).toBeHidden()
  53 | }
  54 | 
  55 | /**
  56 |  * Asserts that a toast with the given text appears.
  57 |  * Toasts auto-dismiss after 2.4s, so the timeout is short.
  58 |  */
  59 | export async function expectToast(page, text) {
  60 |   const toast = page.locator('.swal-toast-popup')
  61 |   await expect(toast).toBeVisible({ timeout: 2000 })
  62 |   await expect(toast).toContainText(text, { timeout: 2000 })
  63 | }
  64 | 
  65 | /**
  66 |  * Navigates to a sidebar item by its label.
  67 |  */
  68 | export async function goTo(page, label) {
> 69 |   await page.getByRole('button', { name: label }).click()
     |                                                   ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
  70 | }
```