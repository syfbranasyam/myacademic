import { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { FormField, FormNote } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { SCORE_BOUNDS, GRADE_LETTERS } from '../../data/gradeScales.js'

/*
 * Grade Scale Add / Edit modal (Batch 3).
 *
 * Fields: Score From, Score To, Grade Alphabet, Status.
 *
 * Validation:
 *   - All fields required.
 *   - Score From and Score To must be numbers within SCORE_BOUNDS (0–100).
 *   - Score From must not exceed Score To.
 *   - No overlapping range among non-deleted rows (inclusive bounds).
 *   - Grade Alphabet is 1–2 characters, uppercase, letter-led (e.g. A, B, A+).
 */

const SCORE_INPUT_SX = {
  '& .MuiOutlinedInput-input': {
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
  },
}

const ALPHABET_PATTERN = /^[A-Z][+-]?$/

export default function GradeScaleFormModal({ scale, onClose, onSaved }) {
  const { gradeScales, addGradeScale, updateGradeScale } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()
  const isEdit = Boolean(scale)

  const [scoreFrom, setScoreFrom] = useState(
    isEdit ? String(scale.scoreFrom) : '',
  )
  const [scoreTo, setScoreTo] = useState(isEdit ? String(scale.scoreTo) : '')
  const [alphabet, setAlphabet] = useState(isEdit ? scale.alphabet : '')
  const [statusValue, setStatusValue] = useState(isEdit ? scale.IsActive : 1)

  const fromRef = useRef(null)
  useEffect(() => {
    const input = fromRef.current?.querySelector?.('input')
    input?.focus()
  }, [])

  const parseScore = (value) => {
    const n = Number(String(value).trim())
    return Number.isFinite(n) ? n : NaN
  }

  const validate = () => {
    const from = parseScore(scoreFrom)
    const to = parseScore(scoreTo)

    if (scoreFrom === '' || scoreTo === '') {
      showToast('Score From and Score To are required')
      return false
    }
    if (Number.isNaN(from) || Number.isNaN(to)) {
      showToast('Scores must be numeric')
      return false
    }
    if (from < SCORE_BOUNDS.min || from > SCORE_BOUNDS.max || to < SCORE_BOUNDS.min || to > SCORE_BOUNDS.max) {
      showToast(`Scores must be between ${SCORE_BOUNDS.min} and ${SCORE_BOUNDS.max}`)
      return false
    }
    if (from > to) {
      showToast('Score From cannot exceed Score To')
      return false
    }
    const letter = alphabet.trim().toUpperCase()
    if (!letter) {
      showToast('Grade alphabet is required')
      return false
    }
    if (!ALPHABET_PATTERN.test(letter)) {
      showToast('Grade alphabet must be a single letter, optionally followed by + or -')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const from = parseScore(scoreFrom)
    const to = parseScore(scoreTo)
    const letter = alphabet.trim().toUpperCase()

    /* Overlap check — inclusive bounds; only non-deleted rows considered */
    const overlaps = gradeScales.some((g) => {
      if (g.IsDelete === 1) return false
      if (isEdit && g.id === scale.id) return false
      return from <= g.scoreTo && to >= g.scoreFrom
    })
    if (overlaps) {
      showToast('Range overlaps an existing grade scale')
      return
    }

    const ok = await confirmSave({
      title: isEdit ? 'Save changes?' : 'Add grade scale?',
      text: isEdit
        ? `Update the ${scale.alphabet} range?`
        : `Add ${letter} (${from}–${to}) to the grade scale?`,
      confirmText: isEdit ? 'Save' : 'Add',
    })
    if (!ok) return

    const payload = {
      alphabet: letter,
      scoreFrom: from,
      scoreTo: to,
      IsActive: statusValue,
    }

    if (isEdit) {
      updateGradeScale(scale.id, payload)
      showToast('Grade scale updated')
    } else {
      addGradeScale(payload)
      showToast('Grade scale added')
    }
    if (onSaved) onSaved()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Edit Grade Scale' : 'Add Grade Scale'}
      subtitle={
        isEdit
          ? 'Update the score range and letter grade'
          : 'Create a new score-to-letter mapping'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Update Grade Scale' : 'Save Grade Scale'}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
        <FormField label="Score From" htmlFor="scale-from">
          <TextField
            ref={fromRef}
            id="scale-from"
            inputMode="numeric"
            placeholder="0"
            value={scoreFrom}
            onChange={(e) => setScoreFrom(e.target.value.replace(/[^0-9]/g, ''))}
            fullWidth
            sx={SCORE_INPUT_SX}
          />
        </FormField>

        <FormField label="Score To" htmlFor="scale-to">
          <TextField
            id="scale-to"
            inputMode="numeric"
            placeholder="100"
            value={scoreTo}
            onChange={(e) => setScoreTo(e.target.value.replace(/[^0-9]/g, ''))}
            fullWidth
            sx={SCORE_INPUT_SX}
          />
        </FormField>

        <FormField label="Grade Alphabet" htmlFor="scale-alphabet">
          <TextField
            id="scale-alphabet"
            placeholder="A"
            value={alphabet}
            onChange={(e) =>
              setAlphabet(e.target.value.toUpperCase().slice(0, 2))
            }
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': {
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.08em',
              },
            }}
          />
        </FormField>
      </Box>

      <FormField label="Status" htmlFor="scale-status">
        <TextField
          select
          id="scale-status"
          value={statusValue}
          onChange={(e) => setStatusValue(Number(e.target.value))}
          fullWidth
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Inactive</MenuItem>
        </TextField>
      </FormField>

      <FormNote>
        Ranges use inclusive bounds (Score From ≤ score ≤ Score To) and must not
        overlap any existing grade scale. Scores are restricted to{' '}
        {SCORE_BOUNDS.min}–{SCORE_BOUNDS.max}. Common letters: {GRADE_LETTERS.join(', ')}.
      </FormNote>
    </Modal>
  )
}