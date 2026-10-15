/*
 * Mock Academic Master entries (spec §10.3, UI-polish round 2).
 *
 * 8 records, all Science / MIPA category, updated "Today".
 *
 * The `type` field was removed — every record is a Subject, so the field
 * was redundant. If multi-type master data is ever needed, add it back along
 * with the form branching it would require.
 *
 * Each record carries the two CRUD flags:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 */

const SEED = [
  ['MAT', 'Mathematics'],
  ['PHY', 'Physics'],
  ['ENG', 'English'],
  ['BIO', 'Biology'],
  ['CHE', 'Chemistry'],
  ['HIST', 'History'],
  ['SOC', 'Sociology'],
  ['IND', 'Bahasa Indonesia'],
]

export const masterItems = SEED.map(([code, name]) => ({
  code,
  name,
  category: 'Science / MIPA',
  IsActive: 1,
  IsDelete: 0,
  updated: 'Today',
}))