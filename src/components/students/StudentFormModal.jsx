import { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { FormField, FormNote, StatusBadge } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { GENDERS } from '../../data/referenceData.js'

/*
 * Student Add / Edit modal.
 *
 * Integration pass: the Class Cohort select now reads from `availableClasses`
 * (the Class Management register) instead of the legacy CLASSES constant, so
 * newly added classes appear here automatically and deleted classes disappear.
 *
 * The status field stores `IsActive: 1 | 0`. Both Add and Edit confirm the
 * save with SweetAlert before committing. `onSaved()` fires after a
 * successful save so the parent can refresh.
 */

const READ_ONLY_SX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  height: 40,
  px: 1.5,
  fontSize: 14,
  backgroundColor: 'surface',
  borderRadius: '8px',
  color: 'text.primary',
}

export default function StudentFormModal({ student, onClose, onSaved }) {
  const { addStudent, updateStudent, nextNis, availableClasses } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()
  const isEdit = Boolean(student)

  const [name, setName] = useState(isEdit ? student.name : '')
  const [cls, setCls] = useState(isEdit ? student.cls : 'Select class')
  const [gender, setGender] = useState(isEdit ? student.gender : 'Select gender')
  const [statusValue, setStatusValue] = useState(
    isEdit ? student.IsActive : 1,
  )

  const nameRef = useRef(null)
  useEffect(() => {
    const input = nameRef.current?.querySelector?.('input')
    input?.focus()
  }, [])

  const validate = () => {
    if (!name.trim() || cls === 'Select class' || gender === 'Select gender') {
      showToast('Please complete all fields')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const ok = await confirmSave({
      title: isEdit ? 'Save changes?' : 'Add student?',
      text: isEdit
        ? `Update ${student.name}'s record?`
        : `Add ${name.trim()} to the student list?`,
      confirmText: isEdit ? 'Save' : 'Add',
    })
    if (!ok) return

    const payload = { name: name.trim(), cls, gender, IsActive: statusValue }

    if (isEdit) {
      updateStudent(student.nis, payload)
      showToast('Student updated')
    } else {
      addStudent(payload)
      showToast('Student added')
    }
    if (onSaved) onSaved()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Edit Student' : 'Add Student'}
      subtitle={
        isEdit
          ? 'Update academic records and student credentials'
          : 'Enter official student credentials'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Update Student' : 'Save Student'}
    >
      <FormField label="NIS" htmlFor="modal-nis">
        <Box className="mono" sx={READ_ONLY_SX}>
          <Box component="span">{isEdit ? student.nis : nextNis}</Box>
          {isEdit && <StatusBadge variant="blue">Read-only / Unique</StatusBadge>}
        </Box>
      </FormField>

      <FormField label="Student Name" htmlFor="modal-name">
        <TextField
          ref={nameRef}
          id="modal-name"
          placeholder="Enter full student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </FormField>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
        }}
      >
        <FormField label="Class Cohort" htmlFor="modal-cls">
          <TextField
            select
            id="modal-cls"
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            fullWidth
          >
            <MenuItem value="Select class">Select class</MenuItem>
            {availableClasses.map((c) => (
              <MenuItem key={c.id} value={c.cls}>
                {c.cls}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <FormField label="Gender" htmlFor="modal-gender">
          <TextField
            select
            id="modal-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth
          >
            <MenuItem value="Select gender">Select gender</MenuItem>
            {GENDERS.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
      </Box>

      <FormField label={isEdit ? 'Academic Status' : 'Status'} htmlFor="modal-status">
        <TextField
          select
          id="modal-status"
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
          Changes will immediately reflect across teaching assignments and grade reports.
        </FormNote>
      )}
    </Modal>
  )
}