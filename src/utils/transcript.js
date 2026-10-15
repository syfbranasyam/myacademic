import { letterGrade } from './grading.js'

/*
 * Mock transcript figures (spec §10.7).
 *
 * These numbers are deliberately synthetic: they exist only to produce stable,
 * plausible values for the transcript screen. The prototype's own formula is
 * reproduced exactly, including the rounding steps and the 100 cap.
 *
 * Spec §12.4 item 3 records that whether a real grade is a single value or the
 * assignment/mid/final components is still undecided, and §13.1 item 6 records
 * that saving a score overwrites the student's single average regardless of
 * subject. Both are preserved here.
 */

/* The five subjects the transcript always shows, in order (spec §10.7). */
export const TRANSCRIPT_SUBJECTS = [
  'Mathematics',
  'Physics',
  'English',
  'Biology',
  'Chemistry',
]

/** NISN is a fixed prefix followed by 20194 + (NIS - 10001). */
export function buildNisn(nis) {
  return `00849${20194 + (Number(nis) - 10001)}`
}

/**
 * Builds the five-subject ledger for one student.
 * @param {{ nis: string, avg: number }} student
 * @returns {{ nisn: string, subjects: Array, average: number }}
 */
export function buildTranscript(student) {
  const index = Number(student.nis) - 10001
  const averageOfStudent = Number(student.avg)

  const subjects = TRANSCRIPT_SUBJECTS.map((subject, j) => {
    const base = Math.round(averageOfStudent + ((index + 3 * j) % 7) - 3)
    const assignment = Math.min(100, base + ((2 * j) % 5) - 2)
    const mid = Math.min(100, base + (j % 3) - 1)
    const final = Math.min(100, Math.round(3 * base - assignment - mid))
    const score = Math.round((assignment + mid + final) / 3)

    return {
      subject,
      assignment,
      mid,
      final,
      score,
      grade: letterGrade(score),
    }
  })

  const total = subjects.reduce((sum, row) => sum + row.score, 0)

  return {
    nisn: buildNisn(student.nis),
    subjects,
    average: Number((total / subjects.length).toFixed(1)),
  }
}