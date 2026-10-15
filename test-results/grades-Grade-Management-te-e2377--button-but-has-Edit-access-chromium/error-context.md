# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: grades.spec.js >> Grade Management >> teacher has no Generate Roster button but has Edit access
- Location: tests\e2e\grades.spec.js:20:3

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Grade Management' })

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
      - link "Teaching Assignment" [ref=e18] [cursor=pointer]:
        - /url: /teaching-assignment
        - generic [aria-hidden] [ref=e20]: co_present
      - link "Grade Management" [ref=e23] [cursor=pointer]:
        - /url: /grade-management
        - generic [aria-hidden] [ref=e25]: assignment_turned_in
      - link "Academic Result" [ref=e28] [cursor=pointer]:
        - /url: /academic-results
        - generic [aria-hidden] [ref=e30]: analytics
      - paragraph [ref=e33]: ACCOUNT
      - link "Profile" [ref=e34] [cursor=pointer]:
        - /url: /profile
        - generic [aria-hidden] [ref=e36]: account_circle
      - button "Logout" [ref=e39] [cursor=pointer]:
        - generic [aria-hidden] [ref=e41]: logout
  - generic [ref=e44]:
    - banner [ref=e45]:
      - generic [ref=e46]:
        - generic "Search" [ref=e47]:
          - generic [ref=e48]:
            - generic [aria-hidden] [ref=e50]: search
            - searchbox "Cari data..." [ref=e51]
            - group [aria-hidden]
        - generic [ref=e52]:
          - button "Notifications" [ref=e53] [cursor=pointer]:
            - generic [aria-hidden] [ref=e54]: notifications
          - button "BS Budi Santoso teacher" [ref=e56] [cursor=pointer]:
            - generic [ref=e57]: BS
            - generic [ref=e58]:
              - paragraph [ref=e59]: Budi Santoso
              - paragraph [ref=e60]: teacher
    - main [ref=e61]:
      - generic [ref=e62]:
        - generic [ref=e64]:
          - heading "Dashboard" [level=1] [ref=e65]
          - paragraph [ref=e66]: Overview akademik sekolah
        - generic [ref=e67]:
          - generic [ref=e70]:
            - generic [ref=e71]:
              - paragraph [ref=e72]: Students
              - generic [aria-hidden] [ref=e74]: group
            - paragraph [ref=e75]: 1,245
          - generic [ref=e78]:
            - generic [ref=e79]:
              - paragraph [ref=e80]: Teachers
              - generic [aria-hidden] [ref=e82]: person_apron
            - paragraph [ref=e83]: "86"
          - generic [ref=e86]:
            - generic [ref=e87]:
              - paragraph [ref=e88]: Classes
              - generic [aria-hidden] [ref=e90]: meeting_room
            - paragraph [ref=e91]: "42"
          - generic [ref=e94]:
            - generic [ref=e95]:
              - paragraph [ref=e96]: Academic Year
              - generic [aria-hidden] [ref=e98]: calendar_today
            - paragraph [ref=e99]: 2026/2027
        - generic [ref=e100]:
          - generic [ref=e103]:
            - paragraph [ref=e104]: Academic Overview
            - paragraph [ref=e105]: "Current Semester: Ganjil"
          - generic [ref=e108]:
            - paragraph [ref=e109]: Active Academic Period
            - paragraph [ref=e110]: 2026/2027 Ganjil
        - generic [ref=e111]:
          - paragraph [ref=e112]: Recent Activity
          - generic [ref=e113]:
            - generic [ref=e114]:
              - generic [aria-hidden] [ref=e116]: assignment_turned_in
              - paragraph [ref=e117]: Grade submitted — Mathematics — XI IPA 1
            - generic [ref=e118]:
              - generic [aria-hidden] [ref=e120]: person_add
              - paragraph [ref=e121]: New student registered — Lina
            - generic [ref=e122]:
              - generic [aria-hidden] [ref=e124]: edit_calendar
              - paragraph [ref=e125]: Teaching assignment updated
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