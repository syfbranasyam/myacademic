import { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { FormField, FormNote } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import {
  TEACHERS,
  CURRENT_YEAR,
  CURRENT_SEMESTER,
} from '../../data/referenceData.js'

/*
 * Teaching Assignment Create / Edit modal.
 *
 * Integration pass: Class, Subject, Academic Year, and Semester selects now
 * read from the derived option sets on DataContext, so any Create / Update /
 * Delete in Class Management, Academic Master, or Academic Period Management
 * is reflected here automatically. Teacher options remain static because no
 * Teacher CRUD module exists.
 *
 * `onCreated(payload)` still fires after Create so the parent page can jump
 * its filters to the new record's period. `onSaved()` fires after a
 * successful save (both add and edit).
 */
export default function AssignmentFormModal({
  assignment,
  onClose,
  onCreated,
  onSaved,
}) {
  const {
    addAssignment,
    updateAssignment,
    availableClasses,
    availableSubjects,
    availableYears,
    availableSemesters,
  } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()
  const isEdit = Boolean(assignment)

  const [teacher, setTeacher] = useState(isEdit ? assignment.teacher : 'Select Teacher')
  const [cls, setCls] = useState(isEdit ? assignment.cls : 'Select Class')
  const [subject, setSubject] = useState(isEdit ? assignment.subject : 'Select Subject')
  const [year, setYear] = useState(isEdit ? assignment.year : CURRENT_YEAR)
  const [semester, setSemester] = useState(isEdit ? assignment.semester : CURRENT_SEMESTER)
  const [statusValue, setStatusValue] = useState(isEdit ? assignment.IsActive : 1)

  const teacherRef = useRef(null)
  useEffect(() => {
    const input = teacherRef.current?.querySelector?.('input')
    input?.focus()
  }, [])

  const validate = () => {
    if (
      teacher.startsWith('Select') ||
      cls.startsWith('Select') ||
      subject.startsWith('Select')
    ) {
      showToast('Please select teacher, class and subject')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const ok = await confirmSave({
      title: isEdit ? 'Save changes?' : 'Create assignment?',
      text: isEdit
        ? `Update ${assignment.teacher}'s assignment?`
        : `Assign ${teacher} to ${cls} — ${subject}?`,
      confirmText: isEdit ? 'Save' : 'Create',
    })
    if (!ok) return

    const payload = { teacher, cls, subject, year, semester, IsActive: statusValue }

    if (isEdit) {
      updateAssignment(assignment.id, payload)
      showToast('Assignment updated')
    } else {
      addAssignment(payload)
      showToast('Assignment created')
      if (onCreated) onCreated(payload)
    }
    if (onSaved) onSaved()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Edit Teaching Assignment' : 'Create Teaching Assignment'}
      subtitle={
        isEdit
          ? 'Update allocation details for teacher and class'
          : 'Assign teacher to class and subject'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Update Assignment' : 'Create Assignment'}
    >
      <FormField label="Teacher" htmlFor="assign-teacher">
        <TextField
          select
          ref={teacherRef}
          id="assign-teacher"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select Teacher">Select Teacher</MenuItem>
          {TEACHERS.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <FormField label="Class" htmlFor="assign-cls">
        <TextField
          select
          id="assign-cls"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select Class">Select Class</MenuItem>
          {availableClasses.map((c) => (
            <MenuItem key={c.id} value={c.cls}>
              {c.cls}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <FormField label="Subject" htmlFor="assign-subj">
        <TextField
          select
          id="assign-subj"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select Subject">Select Subject</MenuItem>
          {availableSubjects.map((s) => (
            <MenuItem key={s.code} value={s.name}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <FormField label="Academic Year" htmlFor="assign-year">
          <TextField
            select
            id="assign-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
          >
            {availableYears.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <FormField label="Semester" htmlFor="assign-sem">
          <TextField
            select
            id="assign-sem"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            fullWidth
          >
            {availableSemesters.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
      </Box>

      <FormField label="Status" htmlFor="assign-status">
        <TextField
          select
          id="assign-status"
          value={statusValue}
          onChange={(e) => setStatusValue(Number(e.target.value))}
          fullWidth
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Inactive</MenuItem>
        </TextField>
      </FormField>

      {isEdit && (
        <FormNote>
          Updating this assignment will immediately sync syllabus quotas and gradebook
          permissions for {assignment.cls}.
        </FormNote>
      )}
    </Modal>
  )
}