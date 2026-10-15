import { CLASSES, SEMESTERS, SUBJECTS, TEACHERS } from './referenceData.js'

/*
 * Mock teaching assignments (Phase 4a, Phase 5a).
 *
 * 18 records: a full 2024/2025 Ganjil matrix (12) and a partial 2025/2026
 * Ganjil matrix (6). Every (teacher, class, subject) combination is unique
 * inside a given year+semester.
 *
 * Phase 5a: adds the two numeric flags used by the CRUD standard:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 */

/* [teacher index, class index, subject index, year, semester index] */
const SEED = [
  /* 2024/2025 Ganjil — full matrix */
  [0, 0, 0, '2024/2025', 0],
  [0, 1, 0, '2024/2025', 0],
  [1, 0, 1, '2024/2025', 0],
  [1, 1, 1, '2024/2025', 0],
  [2, 0, 2, '2024/2025', 0],
  [2, 1, 2, '2024/2025', 0],
  [2, 2, 2, '2024/2025', 0],
  [3, 0, 3, '2024/2025', 0],
  [3, 1, 3, '2024/2025', 0],
  [4, 0, 4, '2024/2025', 0],
  [4, 1, 4, '2024/2025', 0],
  [5, 2, 5, '2024/2025', 0],

  /* 2025/2026 Ganjil — partial, for year-filter variety */
  [0, 0, 0, '2025/2026', 0],
  [1, 0, 1, '2025/2026', 0],
  [2, 0, 2, '2025/2026', 0],
  [3, 1, 3, '2025/2026', 0],
  [4, 1, 4, '2025/2026', 0],
  [5, 2, 5, '2025/2026', 0],
]

export const teachingAssignments = SEED.map(
  ([teacher, cls, subject, year, semester], index) => ({
    id: index + 1,
    teacher: TEACHERS[teacher],
    cls: CLASSES[cls],
    subject: SUBJECTS[subject],
    year,
    semester: SEMESTERS[semester],
    IsActive: 1,
    IsDelete: 0,
  }),
)