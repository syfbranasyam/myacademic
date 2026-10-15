/*
 * Grade rules (spec §10.7).
 *
 * The prototype deliberately carries TWO different scales, and spec §13.1 item 2
 * requires preserving both: predikat rewards A from 80, while the letter grade
 * used by Academic Result and the transcript awards A from 82. A score of
 * 80–81.9 therefore shows "A - Tuntas" in the Edit Grade modal and "B" in the
 * results list. They must stay separate functions and must not be merged.
 */

/**
 * Predikat shown in the Edit Grade modal.
 * @returns {{ letter: string, status: string, text: string, variant: string } | null}
 *          null when the score is blank, so callers can render an em dash.
 */
export function predikat(score) {
  const value = Number(score)
  if (score === '' || score === null || score === undefined || !Number.isFinite(value)) {
    return null
  }
  if (value >= 80) {
    return { letter: 'A', status: 'Tuntas', text: 'A - Tuntas', variant: 'green' }
  }
  if (value >= 75) {
    return { letter: 'B', status: 'Tuntas', text: 'B - Tuntas', variant: 'green' }
  }
  return { letter: 'C', status: 'Remedial', text: 'C - Remedial', variant: 'amber' }
}

/**
 * Letter grade used by Academic Result and the transcript (spec §10.7).
 * @returns {string} one of A, B, C, D
 */
export function letterGrade(score) {
  const value = Number(score)
  if (!Number.isFinite(value)) {
    return '—'
  }
  if (value >= 82) {
    return 'A'
  }
  if (value >= 75) {
    return 'B'
  }
  if (value >= 65) {
    return 'C'
  }
  return 'D'
}

/** Result status shown in the Academic Result list (spec §10.7). */
export function resultStatus(avg) {
  return Number(avg) >= 75 ? 'Lulus / Pass' : 'Remedial Needed'
}

/** Badge variant for a result status row. */
export function resultStatusVariant(avg) {
  return Number(avg) >= 75 ? 'blue' : 'pink'
}

/** Badge variant for an overall grade: pink when the average is under 75. */
export function gradeVariant(avg) {
  return Number(avg) < 75 ? 'pink' : 'blue'
}