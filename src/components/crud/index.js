/*
 * Barrel for CRUD-specific shared components (revision Phase 5).
 *
 * These are separate from components/ui because they encode the CRUD
 * interaction pattern (tabs, bulk actions) rather than being generic UI
 * primitives. Pages import from this barrel, not from individual files.
 */

export { default as CrudTabs } from './CrudTabs.jsx'
export { default as BulkActionBar } from './BulkActionBar.jsx'
export { default as SortableTableHead } from './SortableTableHead.jsx'