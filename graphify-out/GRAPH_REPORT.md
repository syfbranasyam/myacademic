# Graph Report - MyAcademic  (2026-10-08)

## Corpus Check
- 50 files · ~26,525 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .log 9, (none) 1, .css 1)

## Summary
- 361 nodes · 788 edges · 16 communities (15 shown, 1 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 96 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Future Development Next Steps
- Icon
- render(keep) Root Render Loop
- State Management Three-Context Nesting
- Fixed Reference Data Lists
- Route Table
- package.json
- referenceData.js
- AppRoutes.jsx
- grading.js
- validation.js
- Core Principles Priority Order
- Utilities (grading, pagination, validation, transcript)
- Design Tokens in theme.css
- Grading Rules (two separate scales)
- Frontend Work Needed at Integration

## God Nodes (most connected - your core abstractions)
1. `render(keep) Root Render Loop` - 21 edges
2. `Icon()` - 19 edges
3. `PageHeader()` - 18 edges
4. `grades() Page Function` - 18 edges
5. `toast(message) Toast Notifier` - 17 edges
6. `students() Page Function` - 16 edges
7. `AppRoutes()` - 15 edges
8. `results() Page Function` - 15 edges
9. `Students Dataset S` - 15 edges
10. `Global UI State Object `st`` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Future Development Next Steps` --conceptually_related_to--> `Manual Verification Policy (no test runner)`  [INFERRED]
  docs/My Academic — Frontend Master Design & Technical Specification.md → AGENTS.md
- `Prototype Behaviours to Preserve or Correct` --rationale_for--> `Core Principles Priority Order`  [INFERRED]
  docs/My Academic — Frontend Master Design & Technical Specification.md → AGENTS.md
- `Before Making Changes Checklist` --cites--> `Project Structure Blueprint`  [EXTRACTED]
  AGENTS.md → docs/My Academic — Frontend Master Design & Technical Specification.md
- `Toast Message Catalogue` --shares_data_with--> `Toast Pattern (2.4s, bottom-center)`  [INFERRED]
  docs/My Academic — Frontend Master Design & Technical Specification.md → AGENTS.md
- `Fixed Reference Data Lists` --shares_data_with--> `Fixed Reference Data Lists`  [INFERRED]
  AGENTS.md → docs/My Academic — Frontend Master Design & Technical Specification.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **React Context Provider Stack (Toast > Auth > Data)** — docs_my_academic_frontend_master_design_technical_specification_auth_context, docs_my_academic_frontend_master_design_technical_specification_data_context, docs_my_academic_frontend_master_design_technical_specification_toast_context [EXTRACTED 1.00]
- **State Mutation to Toast to Full Repaint Loop** — prototype_st, prototype_go, prototype_render, prototype_shell, prototype_toast, prototype_pages [EXTRACTED 1.00]
- **Unified Modal Flow (open, fill, validate, save, close)** — prototype_modal, prototype_studentform, prototype_taform, prototype_masterform, prototype_genform, prototype_gradeform, prototype_confirmdel, prototype_closem [EXTRACTED 1.00]
- **Filter + Paginate + Table Page Pattern** — prototype_filterbar, prototype_fv, prototype_pager, prototype_students, prototype_master, prototype_grades, prototype_results, prototype_teaching [INFERRED 0.85]
- **Grade Entry to Academic Result Chain** — docs_my_academic_frontend_master_design_technical_specification_grade_roster_entity, docs_my_academic_frontend_master_design_technical_specification_grade_score_entity, docs_my_academic_frontend_master_design_technical_specification_student_entity, docs_my_academic_frontend_master_design_technical_specification_kpi_calculations, docs_my_academic_frontend_master_design_technical_specification_transcript_calculation [INFERRED 0.90]
- **Prototype-Preservation Doctrine (preserve by default, correct with approval)** — agents_core_principles, agents_do_not_invent_functionality, docs_my_academic_frontend_master_design_technical_specification_prototype_corrections, docs_my_academic_frontend_master_design_technical_specification_no_column_sorting [INFERRED 0.95]

## Communities (16 total, 1 thin omitted)

### Community 0 - "Future Development Next Steps"
Cohesion: 0.22
Nodes (9): Backend Integration Readiness, Future Development Next Steps, Modal Specification, Decisions Needing Backend/Product Input, Page-Local State Ownership, Prototype Behaviours to Preserve or Correct, Current Prototype Limitations, Search / Filter / Pagination Rules (+1 more)

### Community 1 - "Icon"
Cohesion: 0.13
Nodes (15): NAV, ConfirmDialog(), FilterBar(), FormField(), FormNote(), Icon(), firstFieldIn(), FOCUSABLE (+7 more)

### Community 2 - "render(keep) Root Render Loop"
Cohesion: 0.07
Nodes (78): av(name,i) Avatar Helper, Backdrop Click Closes Modal, chip(text,kind) Status Pill Helper, Client-Side Pagination, closeM() Modal Closer, CLS Classes Reference List, confirmDel(msg,fn) Delete Confirm Dialog, dashboard() Page Function (+70 more)

### Community 3 - "State Management Three-Context Nesting"
Cohesion: 0.21
Nodes (12): DataContext CRUD Action Set, Data Layer Rules, State Management Three-Context Nesting, AuthContext, DataContext, Mock Data Seed (42 students, 8 masters, 5 assignments, 6 rosters), Current User / Profile Entity, ToastContext (showToast) (+4 more)

### Community 4 - "Fixed Reference Data Lists"
Cohesion: 0.33
Nodes (10): Fixed Reference Data Lists, Data Model (ER diagram), Grade Roster Entity, Grade Score Entity (keyed rosterId + nis), Academic Result KPI Calculations, Master Item Entity, Fixed Reference Data Lists, Student Entity (+2 more)

### Community 5 - "Route Table"
Cohesion: 0.17
Nodes (13): My Academic Project Overview, Routing Rules, Stack (React + Vite + Bootstrap 5 CSS only), Bootstrap CSS-Only Usage, Feature Components (student/master/assignment/grade/result modals), Layout Components (AppLayout, Sidebar, Topbar, PageHeader, Breadcrumb), Eight Main Modules, Project Structure Blueprint (+5 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (29): dependencies, bootstrap, react, react-dom, react-router-dom, devDependencies, eslint, @eslint/js (+21 more)

### Community 7 - "referenceData.js"
Cohesion: 0.06
Nodes (37): StatCard(), DataContext, DataProvider(), highestNis(), isFilledScore(), useData(), gradeRosters, SEED (+29 more)

### Community 8 - "AppRoutes.jsx"
Cohesion: 0.10
Nodes (32): bootstrap, react, react-dom, react-router-dom, App(), Breadcrumb(), PageHeader(), Sidebar() (+24 more)

### Community 9 - "grading.js"
Cohesion: 0.27
Nodes (4): letterGrade(), buildNisn(), buildTranscript(), TRANSCRIPT_SUBJECTS

### Community 11 - "Core Principles Priority Order"
Cohesion: 0.22
Nodes (4): AI Working Rules, Code Quality Conventions, Batch Completion Requirements, Graphify Knowledge Graph Workflow

### Community 12 - "Utilities (grading, pagination, validation, transcript)"
Cohesion: 0.29
Nodes (7): Mandated Project Structure, components/ui/index.js Barrel Pattern, Utilities (grading, pagination, validation, transcript), Surface Low #f0f3ff, Pagination Control Behaviour, Twelve Shared UI Components, Table Rules (header, hover, footer bar)

### Community 13 - "Design Tokens in theme.css"
Cohesion: 0.25
Nodes (8): Toast Pattern (2.4s, bottom-center), Button Variants, Primary #b80049, Primary Container #e2165f, Scrim #263143 at 45%, Tertiary #4353b5, Design Tokens in theme.css, Status Color Pairs (green/amber/blue/pink/gray/red/teal)

### Community 14 - "Grading Rules (two separate scales)"
Cohesion: 0.40
Nodes (6): UI Glossary (NIS, NIP, NISN, Ganjil, Genap), Grading Rules (two separate scales), Language Note (English UI with Indonesian terms), Letter Grade Scale (A from 82), Score Predikat Scale (A from 80), Typography Scale (Inter + JetBrains Mono)

### Community 15 - "Frontend Work Needed at Integration"
Cohesion: 0.40
Nodes (5): Vite VITE_* Environment Variables, Input Focus #e91e63, Form Rules (inputs, labels, read-only, password, validation as toast), Frontend Work Needed at Integration, Validation Rules (email, password, required fields)

## Ambiguous Edges - Review These
- `Grade Roster Entity` → `Teaching Assignment Entity`  [AMBIGUOUS]
  docs/My Academic — Frontend Master Design & Technical Specification.md · relation: shares_data_with
- `Master Item Entity` → `Fixed Reference Data Lists`  [AMBIGUOUS]
  docs/My Academic — Frontend Master Design & Technical Specification.md · relation: shares_data_with

## Knowledge Gaps
- **66 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 89 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Grade Roster Entity` and `Teaching Assignment Entity`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._
- **Why does `react` connect `AppRoutes.jsx` to `Icon`, `package.json`, `referenceData.js`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `render(keep) Root Render Loop` (e.g. with `Focus and Caret Preservation Across Re-render` and `Template-String Render Functions`) actually correct?**
  _`render(keep) Root Render Loop` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icon` be split into smaller, more focused modules?**
  _Cohesion score 0.13118279569892474 - nodes in this community are weakly interconnected._
- **What is the exact relationship between `Master Item Entity` and `Fixed Reference Data Lists`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._
- **Why does `Icon()` connect `Icon` to `AppRoutes.jsx`, `referenceData.js`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._