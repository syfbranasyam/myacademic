# Project Revision & Refinement
Project Path : E:\Product\MyAcademic     

The current project implementation is generally good, but it still requires significant revision and refinement.

Your task is to improve the existing implementation while preserving the intended functionality and architecture.

## IMPORTANT WORKING RULES

Do NOT implement everything at once.

Work incrementally using the following phases:

1. Audit the current implementation
2. Create a detailed refinement plan
3. Implement Phase 1
4. Verify Phase 1
5. Implement Phase 2
6. Verify Phase 2
7. Continue phase by phase
8. Perform final regression testing

Before modifying code:

* Inspect the existing project structure.
* Understand the current implementation.
* Reuse existing components and patterns where appropriate.
* Do not rewrite the application unnecessarily.
* Do not introduce unrelated features.
* Do not create unnecessary abstractions.
* Do not break existing functionality.
* Do not assume backend functionality that does not exist.
* Use mock data where backend integration is not available.
* Keep mock data realistic, consistent, and sufficient to demonstrate every UI state and workflow.

For every phase:

1. Explain what will be changed.
2. Identify affected files.
3. Implement only that phase.
4. Run/build/test the affected functionality.
5. If browser validation is applicable, use Playwright.
6. Fix confirmed issues.
7. Report the result.
8. Only then continue to the next phase.

Do NOT move to the next phase if the current phase has unresolved critical issues.

---

# PHASE 1 — CURRENT PROJECT AUDIT

First, DO NOT MODIFY ANY FILES.

Audit the entire existing project against this specification.

Inspect:

* Layout
* Navigation
* Menu structure
* Components
* Forms
* CRUD behavior
* Modal behavior
* Grid behavior
* Mock data
* Role handling
* Styling
* Material Design consistency
* Responsive behavior
* Loading states
* Empty states
* Error states
* Confirmation dialogs
* Toast notifications
* Existing library usage
* Code duplication
* Unnecessary custom implementations
* Runtime errors
* Build errors
* Functional inconsistencies

Also inspect whether the current implementation already satisfies parts of this specification.

Return an audit report containing:

* Requirement
* Current implementation
* Status: PASS / PARTIAL / FAIL
* Affected files
* Recommended change
* Priority: Critical / High / Medium / Low

DO NOT implement anything yet.

---

# PHASE 2 — UI FOUNDATION & DESIGN SYSTEM

After the audit is approved, refine the global UI foundation.

## Design requirements

Primary visual identity:

* Pink
* White
* Grey

Design system:

* Material Design
* Clean
* Simple
* Professional
* Consistent
* Avoid excessive decoration
* Avoid unnecessary cards, containers, gradients, or visual elements

The application currently has too much unused space.

Improve the layout so that:

* Content uses the available viewport effectively.
* Tables/grids occupy appropriate space.
* Forms do not contain excessive spacing.
* Page headers are compact.
* Toolbar elements are properly aligned.
* Dialog dimensions are appropriate.
* Content density feels suitable for an administration/academic management system.

Do not redesign the application from scratch.

Improve the existing implementation.

## Component libraries

Use relevant existing libraries for UI components whenever appropriate.

Do NOT manually recreate components that are already provided by an appropriate library.

Prefer library components for:

* Dialog
* Button
* TextField
* Select
* Checkbox
* Tabs
* Menu
* Tooltip
* Snackbar/notification
* Data grid/table
* Date picker
* Form controls
* Loading indicators

Reuse existing installed libraries where possible.

Before installing a new library:

1. Check whether an existing dependency already provides the required functionality.
2. If not, determine whether an established library is appropriate.
3. Do not install libraries unnecessarily.

---

# PHASE 3 — GLOBAL FEEDBACK & CONFIRMATION BEHAVIOR

Integrate SweetAlert consistently throughout the application.

Use SweetAlert for appropriate:

* Success toast
* Error toast
* Warning
* Confirmation dialog
* Delete confirmation
* Bulk action confirmation
* Save confirmation
* Other important user feedback

Do not mix multiple unrelated notification systems unless there is a specific technical reason.

Use consistent wording and behavior.

For destructive actions:

* Delete
* Bulk Delete
* Deactivate
* Other destructive operations

Always require confirmation before execution.

---

# PHASE 4 — MOCK DATA & ROLE MODEL

Make sure all mock data is complete, realistic, relevant, and internally consistent.

Mock data must support all required UI states and workflows.

Required roles:

* Admin
* Teacher (User)

Make sure role-based behavior is consistent throughout the application.

At minimum, mock data should properly represent relationships between:

* Students
* Academic years
* Semesters
* Classes
* Subjects
* Teachers
* Teaching assignments
* Grades
* Academic results

Do not use meaningless placeholder data when realistic academic data can be provided.

---

# PHASE 5 — CRUD MENU STANDARDIZATION

The following menus are CRUD-oriented:

1. Students
2. Academic Master
3. Teaching Assignment

All CRUD menus must follow a consistent interaction pattern.

## Standard menu elements

Every CRUD menu must contain:

1. Active / Inactive tabs

   * Active uses `IsActive = 1`
   * Inactive uses `IsActive = 0`

2. Filter by relevant group/category column

3. Search input

4. Refresh button

5. Add Data button

6. Bulk Active

   * Visible/enabled when rows are selected in the Inactive tab
   * Updates selected records to `IsActive = 1`

7. Bulk Inactive

   * Visible/enabled when rows are selected in the Active tab
   * Updates selected records to `IsActive = 0`

8. Bulk Delete

   * Available in both Active and Inactive tabs
   * Updates:

     * `IsActive = 0`
     * `IsDelete = 1`

9. Data grid

## Grid requirements

The grid must support:

* Sorting
* Column drag/reordering
* Row checkbox selection
* Clickable row
* Row click opens View modal
* Action column
* Edit action
* Delete action

## CRUD behavior

### Add

```text
Add Data
→ Open Modal
→ Fill Form
→ Save
→ Confirmation Dialog
→ Execute Save
→ Success Toast
→ Refresh Grid
```

### Edit

```text
Edit
→ Open Modal
→ Edit Form
→ Save
→ Confirmation Dialog
→ Execute Update
→ Success Toast
→ Refresh Grid
```

### View

```text
Click Row
→ Open View Modal
→ Read-only information
```

The View modal may use the same general form layout as Edit, but all fields must be read-only.

### Delete

```text
Delete
→ Confirmation Dialog
→ Execute Delete
→ Success Toast
→ Refresh Grid
```

### Bulk Active

```text
Select rows in Inactive tab
→ Bulk Active
→ Confirmation Dialog
→ Update IsActive = 1
→ Success Toast
→ Refresh Grid
```

### Bulk Inactive

```text
Select rows in Active tab
→ Bulk Inactive
→ Confirmation Dialog
→ Update IsActive = 0
→ Success Toast
→ Refresh Grid
```

### Bulk Delete

```text
Select rows
→ Bulk Delete
→ Confirmation Dialog
→ Update IsActive = 0
→ Update IsDelete = 1
→ Success Toast
→ Refresh Grid
```

Do not open a separate page for CRUD operations.

CRUD operations must use modal dialogs.

---

# PHASE 6 — GRADE MANAGEMENT

Create/refine the Grade Management menu.

Purpose:

Display student grade records based on:

* Student
* Academic
* Teacher
* Class

Teachers must be able to edit student scores.

## Menu elements

Include:

1. Active / Inactive tabs using `IsActive`
2. Filter by relevant group column
3. Search input
4. Refresh button
5. Generate Roster button
6. Bulk Active
7. Bulk Inactive
8. Bulk Delete
9. Grid

## Grid

The grid must support:

* Sorting
* Column drag/reordering
* Row checkbox selection
* Row click → View modal
* Edit action
* Delete action

## Generate Roster

Flow:

```text
Generate Roster
→ Open Modal
→ Select parameters
→ Confirm
→ Generate roster
→ Success feedback
→ Refresh grid
```

Roster generation must combine:

* Students
* Teacher
* Class
* Academic

## Grade CRUD

### Edit

```text
Edit
→ Open Modal
→ Edit score
→ Save
→ Confirmation Dialog
→ Execute
→ Success Toast
→ Refresh Grid
```

### View

```text
Click Row
→ View Modal
→ Read-only grade information
```

### Delete

Use confirmation before deletion.

### Bulk actions

Use the same Active / Inactive / Delete behavior defined in the CRUD standard.

---

# PHASE 7 — ACADEMIC RESULT

Create/refine the Academic Result menu.

Purpose:

Display academic results for students across their academic records.

## Menu elements

Include:

1. Active / Inactive tabs using `IsActive`
2. Filter by relevant group column
3. Search input
4. Refresh button
5. Download PDF
6. Print
7. Grid

## Grid

The grid must support:

* Sorting
* Column drag/reordering
* Row click
* View modal

Clicking a student row must open a read-only modal displaying that student's academic result.

## Download PDF

```text
Download PDF
→ Confirmation Dialog
→ Generate/download PDF
→ Success/Error feedback
```

## Print

```text
Print
→ Confirmation Dialog
→ Print academic result
```

Do not navigate to another page for viewing the student's academic result.

Use a modal.

---

# PHASE 8 — PROFILE

Profile is different from CRUD menus.

Profile must use a DIRECT PAGE, not a modal.

The Profile page must contain:

## Personal Information

Display/edit information for the currently logged-in user.

Supported roles:

* Admin
* Teacher

## Change Password

Provide a dedicated change-password form.

Include appropriate validation.

## Profile Photo

Allow the user to:

* View current profile photo
* Change/upload profile photo
* Preview the selected photo where appropriate

Use appropriate success/error feedback.

---

# PHASE 9 — PLAYWRIGHT VALIDATION

After all implementation phases are completed, use Playwright to validate the actual application in the browser.

Test the important user flows.

At minimum:

## Authentication / Role

* Admin login
* Teacher login
* Role-based navigation

## Students

* Active tab
* Inactive tab
* Search
* Filter
* Sort
* Column reorder
* Add
* View
* Edit
* Delete
* Bulk Active
* Bulk Inactive
* Bulk Delete

## Academic Master

Validate the same applicable CRUD flows.

## Teaching Assignment

Validate the same applicable CRUD flows.

## Grade Management

* Filter
* Search
* Generate Roster
* View
* Edit score
* Delete
* Bulk actions

## Academic Result

* Search/filter
* View result
* Download PDF
* Print

## Profile

* View profile
* Edit profile
* Change password
* Change profile photo

During Playwright validation:

* Do not modify code immediately when an issue is discovered.
* Record the issue first.
* Classify severity.
* After testing the complete flow, fix confirmed issues.
* Rerun the affected test after fixing.

---

# PHASE 10 — FINAL QA & CLEANUP

After all previous phases are completed:

1. Run the application.
2. Run the build.
3. Check for console errors.
4. Check for runtime errors.
5. Run relevant tests.
6. Run Playwright regression testing.
7. Review responsive behavior.
8. Review UI consistency.
9. Review mock data consistency.
10. Review role behavior.
11. Review CRUD behavior.
12. Review modal behavior.
13. Review SweetAlert integration.
14. Review unnecessary duplicated components/code.

Do not introduce new features during final cleanup.

---

# FINAL RULE

The most important requirement is:

DO NOT execute all phases in one step.

Work sequentially.

After completing each phase:

* summarize what changed
* list affected files
* report validation results
* report remaining issues
* wait for the next phase instruction

Do not automatically continue to the next phase unless explicitly instructed.

The goal is not to rewrite the project.

The goal is to progressively refine the existing implementation into a consistent, functional, maintainable Material Design academic management application.
