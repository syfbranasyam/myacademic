import { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { FormField, FormNote } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { SEMESTERS } from '../../data/referenceData.js'
import { PERIOD_TYPES } from '../../data/academicPeriods.js'

/*
 * Academic Period Add / Edit modal (Batch 2).
 *
 * Fields: Year, Start Date, End Date, Semester, Type (Ganjil / Genap), Status.
 *
 * Validation:
 *   - All fields required.
 *   - End date must not be earlier than start date.
 *   - No exact duplicate (same Year + Semester + Type) among non-deleted rows.
 *   - No overlapping date range within the same academic year.
 */

const DATE_INPUT_SX = {
  '& input[type="date"]': {
    height: 40,
    boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)',
    color: 'text.primary',
  },
}

export default function AcademicPeriodFormModal({ period, onClose, onSaved }) {
  const { academicPeriods, addAcademicPeriod, updateAcademicPeriod } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()
  const isEdit = Boolean(period)

  const [year, setYear] = useState(isEdit ? period.year : '')
  const [startDate, setStartDate] = useState(isEdit ? period.startDate : '')
  const [endDate, setEndDate] = useState(isEdit ? period.endDate : '')
  const [semester, setSemester] = useState(
    isEdit ? period.semester : 'Select semester',
  )
  const [type, setType] = useState(isEdit ? period.type : 'Select type')
  const [statusValue, setStatusValue] = useState(isEdit ? period.IsActive : 1)

  const yearRef = useRef(null)
  useEffect(() => {
    const input = yearRef.current?.querySelector?.('input')
    input?.focus()
  }, [])

  const validate = () => {
    if (!year.trim()) {
      showToast('Academic year is required')
      return false
    }
    if (!startDate) {
      showToast('Start date is required')
      return false
    }
    if (!endDate) {
      showToast('End date is required')
      return false
    }
    if (endDate < startDate) {
      showToast('End date cannot be earlier than start date')
      return false
    }
    if (semester === 'Select semester') {
      showToast('Select a semester')
      return false
    }
    if (type === 'Select type') {
      showToast('Select a period type')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const trimmedYear = year.trim()

    /* Exact duplicate check (Year + Semester + Type) */
    const exactDuplicate = academicPeriods.some(
      (p) =>
        p.IsDelete === 0 &&
        p.year === trimmedYear &&
        p.semester === semester &&
        p.type === type &&
        (!isEdit || p.id !== period.id),
    )
    if (exactDuplicate) {
      showToast('That period already exists for the selected year and semester')
      return
    }

    /* Overlap check within the same academic year */
    const overlaps = academicPeriods.some((p) => {
      if (p.IsDelete === 1) return false
      if (p.year !== trimmedYear) return false
      if (isEdit && p.id === period.id) return false
      return startDate <= p.endDate && endDate >= p.startDate
    })
    if (overlaps) {
      showToast('Date range overlaps an existing period in that academic year')
      return
    }

    const ok = await confirmSave({
      title: isEdit ? 'Save changes?' : 'Add period?',
      text: isEdit
        ? `Update ${period.year} — ${period.type}?`
        : `Add ${trimmedYear} — ${type} to the academic period list?`,
      confirmText: isEdit ? 'Save' : 'Add',
    })
    if (!ok) return

    const payload = {
      year: trimmedYear,
      startDate,
      endDate,
      semester,
      type,
      IsActive: statusValue,
    }

    if (isEdit) {
      updateAcademicPeriod(period.id, payload)
      showToast('Academic period updated')
    } else {
      addAcademicPeriod(payload)
      showToast('Academic period added')
    }
    if (onSaved) onSaved()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Edit Academic Period' : 'Add Academic Period'}
      subtitle={
        isEdit
          ? 'Update the period details'
          : 'Create a new academic period entry'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Update Period' : 'Save Period'}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <FormField label="Academic Year" htmlFor="period-year">
          <TextField
            ref={yearRef}
            id="period-year"
            placeholder="E.G. 2026/2027"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
            sx={{ '& .MuiOutlinedInput-input': { fontFamily: 'var(--font-mono)' } }}
          />
        </FormField>

        <FormField label="Status" htmlFor="period-status">
          <TextField
            select
            id="period-status"
            value={statusValue}
            onChange={(e) => setStatusValue(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </FormField>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <FormField label="Start Date" htmlFor="period-start">
          <TextField
            id="period-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            sx={DATE_INPUT_SX}
          />
        </FormField>

        <FormField label="End Date" htmlFor="period-end">
          <TextField
            id="period-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            sx={DATE_INPUT_SX}
          />
        </FormField>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <FormField label="Semester" htmlFor="period-semester">
          <TextField
            select
            id="period-semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            fullWidth
          >
            <MenuItem value="Select semester">Select semester</MenuItem>
            {SEMESTERS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <FormField label="Type" htmlFor="period-type">
          <TextField
            select
            id="period-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
          >
            <MenuItem value="Select type">Select type</MenuItem>
            {PERIOD_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
      </Box>

      <FormNote>
        {isEdit
          ? 'Updating the period range will re-validate overlaps against other periods in the same academic year.'
          : 'The end date must not be earlier than the start date, and the range must not overlap an existing period in the same academic year.'}
      </FormNote>
    </Modal>
  )
}