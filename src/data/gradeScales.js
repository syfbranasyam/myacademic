/*
 * Mock grade scales (Batch 3).
 *
 * Fields:
 *   scoreFrom – minimum score (inclusive), 0..100
 *   scoreTo   – maximum score (inclusive), 0..100, must be >= scoreFrom
 *   alphabet  – letter grade, e.g. 'A', 'B', 'C', 'D'
 *
 * Score bounds come from SCORE_MIN / SCORE_MAX in referenceData.js so the
 * prototype's single 0–100 scale stays authoritative.
 *
 * The seed mirrors the existing letterGrade() thresholds in utils/grading.js
 * so the module is consistent with how results and transcripts are graded:
 *   A  → 82–100
 *   B  → 75–81
 *   C  → 65–74
 *   D  → 0–64
 *
 * Two CRUD flags are used exactly as elsewhere:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 */

import { SCORE_MAX, SCORE_MIN } from './referenceData.js'

export const GRADE_LETTERS = ['A', 'B', 'C', 'D']

export const SCORE_BOUNDS = { min: SCORE_MIN, max: SCORE_MAX }

const SEED = [
  ['A', 82, 100],
  ['B', 75, 81],
  ['C', 65, 74],
  ['D', 0, 64],
]

export const gradeScales = SEED.map(([alphabet, scoreFrom, scoreTo], index) => ({
  id: index + 1,
  alphabet,
  scoreFrom,
  scoreTo,
  IsActive: 1,
  IsDelete: 0,
  updated: 'Today',
}))