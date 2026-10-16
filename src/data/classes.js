/*
 * Mock classes (Class Management module).
 *
 * Fields:
 *   cls      – class name / identifier
 *   category – MIPA or IIS
 *   room     – assigned classroom
 *
 * The first three seed rows deliberately match the class names referenced by
 * the rest of the application's mock data (students.js, teachingAssignments.js,
 * gradeRosters.js). Those seed files historically used the CLASSES constant
 * from referenceData.js, whose values are 'XI IPA 1', 'XI IPA 2', 'XI IPS 1'.
 * Keeping the same identifiers here means every class dropdown in the app can
 * be sourced from this register without breaking any existing record.
 *
 * The remaining rows (X and XII cohorts) make the register realistic. They are
 * not referenced by any seed data; they simply demonstrate that Class
 * Management is a genuine CRUD source.
 *
 * Two CRUD flags, matching every other entity:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 */

export const CLASS_CATEGORIES = ['MIPA', 'IIS']

const SEED = [
  /* Match the identifiers used by students.js / teachingAssignments.js /
     gradeRosters.js so the register is directly compatible. */
  ['XI IPA 1', 'MIPA', 'Room 204'],
  ['XI IPA 2', 'MIPA', 'Room 205'],
  ['XI IPS 1', 'IIS', 'Room 301'],

  /* Additional cohorts — realistic register entries, not referenced by seed */
  ['X IPA 1', 'MIPA', 'Room 101'],
  ['X IPA 2', 'MIPA', 'Room 102'],
  ['X IPS 1', 'IIS', 'Room 201'],
  ['XII IPA 1', 'MIPA', 'Room 401'],
  ['XII IPA 2', 'MIPA', 'Room 402'],
  ['XII IPS 1', 'IIS', 'Room 501'],
]

export const classes = SEED.map(([cls, category, room], index) => ({
  id: index + 1,
  cls,
  category,
  room,
  IsActive: 1,
  IsDelete: 0,
  updated: 'Today',
}))