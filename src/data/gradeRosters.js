import {
  CLASSES,
  CURRENT_SEMESTER,
  CURRENT_YEAR,
  GRADE_STATUSES,
  SUBJECTS,
  TEACHERS,
} from './referenceData.js'

/*
 * Mock grade rosters (Phase 4a, revision Phase 6).
 *
 * 12 records for the current year (2026/2027 Ganjil). Each record mirrors an
 * assignment in the matrix so that Grade Management and Academic Result have
 * consistent, meaningful data.
 *
 * Phase 6 adds the two CRUD flags:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 *
 * The grading workflow status (Complete / In Progress / Not Started) is
 * separate from the CRUD flags. Both coexist: a roster can be Active + Complete
 * or Inactive + Not Started, etc.
 *
 * Scores are NOT stored here — DataContext owns that map; gradeScores.js seeds
 * a few of the Complete rosters so the demo shows data.
 */

const COMPLETE = GRADE_STATUSES[0]
const IN_PROGRESS = GRADE_STATUSES[1]
const NOT_STARTED = GRADE_STATUSES[2]

/* [teacher index, class index, subject index, status] */
const SEED = [
  [0, 0, 0, COMPLETE],
  [0, 1, 0, IN_PROGRESS],
  [1, 0, 1, IN_PROGRESS],
  [1, 1, 1, NOT_STARTED],
  [2, 0, 2, COMPLETE],
  [2, 1, 2, COMPLETE],
  [2, 2, 2, IN_PROGRESS],
  [3, 0, 3, COMPLETE],
  [3, 1, 3, NOT_STARTED],
  [4, 0, 4, IN_PROGRESS],
  [4, 1, 4, IN_PROGRESS],
  [5, 2, 5, COMPLETE],
]

export const gradeRosters = SEED.map(([teacher, cls, subject, status], index) => ({
  id: index + 1,
  teacher: TEACHERS[teacher],
  cls: CLASSES[cls],
  subject: SUBJECTS[subject],
  status,
  year: CURRENT_YEAR,
  semester: CURRENT_SEMESTER,
  IsActive: 1,
  IsDelete: 0,
}))