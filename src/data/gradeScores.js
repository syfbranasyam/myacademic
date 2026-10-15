import { students } from './students.js'

/*
 * Seed grade scores (Phase 4a).
 *
 * The prototype leaves scores empty and creates them on first Edit Grade
 * (spec §10.3). This file pre-populates the Complete rosters so the demo
 * shows what a filled gradebook looks like without manual entry.
 *
 * Map shape: { [rosterId]: { [nis]: score } }
 *
 * Only Complete rosters are seeded (ids 1, 5, 6, 8, 12). In Progress and
 * Not Started rosters stay empty so the user can see those states.
 *
 * Each score is derived from the student's own average with small deterministic
 * noise, keeping the numbers internally consistent with Academic Result.
 */

function scoresForClass(cls, jitterFn) {
  const result = {}
  students
    .filter((s) => s.cls === cls)
    .forEach((s, i) => {
      const jitter = jitterFn(i)
      const raw = Number(s.avg) + jitter
      result[s.nis] = Math.max(0, Math.min(100, Math.round(raw * 2) / 2))
    })
  return result
}

export const gradeScores = {
  /* Budi · XI IPA 1 · Mathematics (Complete) */
  1: scoresForClass('XI IPA 1', (i) => ((i % 5) - 2) * 0.5),

  /* Andi · XI IPA 1 · English (Complete) */
  5: scoresForClass('XI IPA 1', (i) => ((i % 3) - 1) * 0.5),

  /* Andi · XI IPA 2 · English (Complete) */
  6: scoresForClass('XI IPA 2', (i) => ((i % 4) - 2) * 0.5),

  /* Sri · XI IPA 1 · Biology (Complete) */
  8: scoresForClass('XI IPA 1', (i) => ((i % 3) - 1) * 0.5),

  /* Rahmat · XI IPS 1 · Sociology (Complete) */
  12: scoresForClass('XI IPS 1', (i) => ((i % 3) - 1) * 0.5),
}