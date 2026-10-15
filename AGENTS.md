# AGENTS.md

## Project Overview

My Academic is a school academic information system (SIAKAD) SPA.

- **Stack:** React.js + Vite + Bootstrap 5 (CSS only) + JavaScript
- **Routing:** React Router (`react-router-dom`)
- **State:** React Context (`AuthContext`, `DataContext`, `ToastContext`)
- **Styling:** One theme file (`styles/theme.css`) overriding Bootstrap variables, plus small custom classes
- **Icons:** Material Symbols Outlined (loaded as a font)
- **Fonts:** Inter (UI), JetBrains Mono (codes and IDs)
- **Data:** Local mock data in `src/data/` copied into `DataContext` state — no backend, no persistence
- **Roles:** One role — Administrator (mock user Sarah Jenkins)

The docs file **`My Academic — Frontend Master Design & Technical Specification.md`** is the source of truth for UI/UX and functional behavior. The **single HTML prototype** is the visual reference. When in doubt, match the prototype.

---

# AI WORKING RULES

## Core Principles

Prioritize in this order:

1. Correctness
2. Prototype behavior preservation
3. Minimal and focused changes
4. Reusability
5. Maintainability
6. Performance
7. Consistent UI/UX

Do not optimize for code volume. The prototype is the source of truth — reproducing its behavior is the primary goal.

---

## Before Making Changes

For every task:

1. Read the relevant section of the specification document.
2. Inspect the current React implementation of the file.
3. Search for existing components, contexts, utils, and patterns before creating new ones.
4. Identify all affected files (imports, consumers).
5. Confirm the change matches the specification, not just the prototype's visual.
6. Only then edit.

Do not rewrite files based on assumptions.

---

## Scope Control

Modify only files relevant to the current batch.

Do NOT:

- Refactor unrelated code
- Rename unrelated files or components
- Reorganize the project structure
- Replace working code with different patterns without justification
- Remove code because it looks unused
- Introduce new abstractions
- Introduce new dependencies
- Redesign the prototype's UI

If you find an unrelated issue, report it separately. Do not silently fix it.

---

## Do Not Invent Functionality

Never invent:

- API endpoints
- Backend contracts
- Authentication behavior beyond what the prototype shows
- Business rules beyond the spec
- New roles or permissions
- Environment variables
- Additional pages, routes, modals, or features

The prototype is intentionally limited. Do not add:

- Column sorting (the spec says explicitly: **no sorting anywhere**)
- Multi-select or bulk actions
- Import/export beyond the two mock buttons
- Tabs
- View modals (except the transcript page, which is a route)
- Real backend calls
- Persistence (refresh resets everything — this is intended)

---

# ARCHITECTURE

## Project Structure

The structure is defined in the specification Section 4. Reproduce it exactly:

```
src/
  main.jsx, App.jsx
  routes/          AppRoutes.jsx, ProtectedRoute.jsx
  layouts/         AppLayout.jsx
  pages/           one page per screen
  components/
    layout/        Sidebar, Topbar, PageHeader, Breadcrumb
    ui/            Icon, Avatar, StatusBadge, Modal, ConfirmDialog,
                   ToastHost, Pagination, FilterBar, FormField,
                   PasswordField, FormNote, StatCard, EmptyRow
    students/      StudentFormModal
    master/        MasterFormModal
    teaching/      AssignmentFormModal
    grades/        GenerateGradeModal, GradeEditModal
    results/       ResultKpiCards, TranscriptHeader
  context/         AuthContext.jsx, DataContext.jsx, ToastContext.jsx
  data/            referenceData.js, students.js, masterItems.js,
                   teachingAssignments.js, gradeRosters.js
  utils/           grading.js, pagination.js, validation.js, transcript.js
  styles/          theme.css
```

Rules:

- One component per file.
- PascalCase filenames for components, camelCase for utilities and data.
- Page-specific modals live next to their feature folder.
- Anything used by two or more pages lives in `components/ui` or `components/layout`.
- Provide a `components/ui/index.js` barrel exporting all shared components (adapt the MeStore barrel pattern).

---

## Shared UI Components

Before creating a new component:

1. Search `components/ui/` for an equivalent.
2. Search `components/layout/`.
3. Search the relevant feature folder.
4. Reuse or extend when possible.
5. Create new only when there is a real reusable abstraction.

The 12 shared components listed in the spec Section 8.2 are the intended surface area. Do not add more without a clear reason.

---

# REACT CONVENTIONS

Use **function components and hooks only**. No class components.

Prefer:

- `useState` for local component state
- `useReducer` when state transitions are complex (e.g., modal open + record + form fields in one piece of state)
- Custom hooks for reusable behavior
- Context for genuinely shared state (auth, data, toast)
- `useMemo` / `useCallback` sparingly — only when there is a measurable need
- Derived values computed inline or with `useMemo`

Avoid:

- `useEffect` for anything that could be a computed value
- State duplication (deriving one state from another)
- Prop drilling beyond two levels
- Over-abstracting

Do NOT introduce:

- Redux, Zustand, Jotai, Recoil, MobX, or any state library
- TanStack Query, SWR, or any data fetching library
- React Hook Form, Formik, or any form library
- TanStack Table, AG Grid, or any table library
- date-fns, dayjs, moment, or any date library
- Any component kit (MUI, Chakra, shadcn, Radix, etc.)
- TypeScript

---

# STATE MANAGEMENT

Three contexts, in this nesting order (outer to inner):

1. `ToastProvider` — toast message + `showToast(message)`
2. `AuthProvider` — `isAuthenticated`, `currentUser`, `login()`, `logout()`, `updateProfile()`
3. `DataProvider` — the five datasets and all CRUD actions

**Page-local state stays local** (search text, filters, current page, modal open + record, form fields).

**Exception:** The Topbar search passes the text to `/students` via a URL search parameter `q`. The Students page reads it on mount.

There is no persistence. Refresh resets everything — this is intended behavior. Do not add `localStorage` or `sessionStorage`.

---

# ROUTING

Use `react-router-dom`. Route table is in the spec Section 5.1.

Rules:

- Modals are **never routes**. They are page state.
- `ProtectedRoute` checks authentication only (no per-role checks).
- Unknown routes redirect: `/dashboard` when authenticated, `/login` when not.
- The transcript route (`/academic-results/:nis`) falls back to the first student if the NIS is unknown — this matches the prototype.
- The Sidebar's Academic Result item stays highlighted on both `/academic-results` and `/academic-results/:nis`.

---

# DATA LAYER

## Mock data

All seed data lives in `src/data/` as plain JavaScript modules. Exact record counts, field shapes, and values are specified in Section 10.3.

Do not:

- Add, remove, or reshape seed records beyond what the spec says
- Add persistence
- Add "delete" semantics beyond removing from the in-memory array (or setting a flag if the spec says so — but the spec uses array removal here)

## Reference data

Fixed lists (`CLS`, `SUB`, `YRS`, `SEM`, teachers with NIPs, subject icons, master categories, master types) live in `referenceData.js`. Do not derive them from student or master data — they are fixed in the prototype.

## Actions

All data actions live in `DataContext`. Pages never touch mock arrays directly. Actions:

- `addStudent`, `updateStudent`, `deleteStudent`
- `addMasterItem`, `updateMasterItem`
- `addAssignment`, `updateAssignment`, `deleteAssignment`
- `generateRoster`, `deleteRoster`, `saveGradeScores`
- `updateProfile` (lives in `AuthContext`)

---

# UTILITIES

Four modules in `src/utils/`:

- `grading.js` — `predikat(score)` and `letterGrade(score)` are **two separate functions** (see Section 13.1 item 2 — the spec deliberately preserves two different scales)
- `pagination.js` — `paginate(items, page, perPage)`, `pageNumbers(current, total)`
- `validation.js` — `isValidEmail(value)`, `isValidPassword(value)`
- `transcript.js` — `buildTranscript(student)` returning the five-subject array per Section 10.7

Keep utilities pure. No React imports inside `utils/`.

---

# STYLING AND UI

## Design system

All design tokens are in the spec Section 7. Put them in `styles/theme.css` as CSS variables and map Bootstrap's variables to them.

**Canonical token names** (use these throughout, never inline colors):

- `--primary`, `--primary-container`, `--bg`, `--surface-low`, `--surface`, `--surface-high`
- `--on-surface`, `--on-surface-variant`, `--tertiary`
- `--scrim`, `--input-focus`

## Bootstrap usage

- **CSS only** — the Bootstrap JavaScript bundle must not be used. React state controls modals, toasts, and the sidebar.
- Use Bootstrap utilities for spacing, flex, grid, and text (`d-flex`, `gap-*`, `p-*`, `row`, `col-*`).
- Use Bootstrap's `md` (768) and `lg` (992) breakpoints for column changes.
- Keep the **900px** rule as a custom media query for the sidebar rail.
- Do not scatter inline colors — every value comes from `theme.css`.

## Modal pattern

Every modal uses the same shell:

```
Backdrop → panel → header (title + subtitle + close X) → body → footer (Cancel + primary action)
```

Backdrop click closes. Escape does not close (per Section 13.1 item 9, this is intentionally preserved unless a correction is approved).

## Toast pattern

One toast at a time. Bottom-center. Solid dark background (`#263143`). White 14px text. 8px radius. Auto-dismiss after **2.4 seconds**. A new toast replaces the current.

## Accessibility

The prototype's known gaps (no focus trap, no Escape, unlabeled controls) are documented in Section 13.1 item 9. Implement a minimal improvement: focus the first input on modal open, trap Tab within the modal, and Escape closes. Do NOT add ARIA beyond what is needed.

---

# DESIGN SPECIFICATION

For every UI decision, consult Section 7 of the spec document. The values are exact — colors, sizes, radii, spacing. Do not improvise.

When the prototype and the spec disagree, the spec wins.

---

# DEPENDENCIES

The spec is explicit: only `react`, `react-dom`, `react-router-dom`, and `bootstrap`.

Before adding any dependency:

1. Check whether React or the browser already provides the equivalent.
2. Check the spec — if it says "do not add X library", do not add it.
3. Explain why a new dependency is necessary in a message.

Do not install dependencies automatically unless the batch brief explicitly lists them.

---

# ENVIRONMENT

There is no `.env` file in the prototype. When integration work begins, use Vite environment variables (`VITE_*`). Do not hardcode server addresses.

---

# COMMANDS

Development: `npm run dev`
Build: `npm run build`
Preview: `npm run preview`
Lint: `npm run lint` (if configured — the base React+Vite template does not include ESLint by default; if you add it, keep the config minimal)

---

# TESTING

No test runner is installed. Do not claim tests were executed.

Verification for this project is:

1. `npm run build` succeeds
2. Manual walkthrough of the affected flow in the browser
3. Console shows no errors or warnings
4. Visual comparison against the HTML prototype (open the prototype in another tab)

---

# CODE QUALITY

- No semicolons required but be consistent
- Single quotes
- 2-space indentation
- Trailing commas where valid
- Unused variables should be removed or prefixed with `_`
- `console.warn` and `console.error` allowed; `console.log` should not ship in batch output

---

# GIT SAFETY

- Do not reset unrelated changes
- Do not revert user changes
- Do not force push
- Do not rewrite history
- Do not delete branches
- Do not commit automatically

---

# COMPLETION REQUIREMENTS

After each batch:

1. Review every modified file
2. Review the git diff
3. Run `npm run build`
4. Manually exercise the affected flow
5. Report exactly which files changed, what changed, and what was tested
6. Explicitly report any remaining issue or uncertainty

Never claim a batch is complete without the build having succeeded and the flow having been walked through.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
