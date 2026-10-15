import { useState } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import { FormField, FormNote } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { CLASSES, SUBJECTS, TEACHERS } from '../../data/referenceData.js'

/*
 * Generate Grade roster modal (spec §10.6, revision Phase 6).
 *
 * Teacher / Subject / Class selects, all required. A roster is refused if one
 * already exists for the same (class, subject) in the current year — the
 * refusal is a toast, not a SweetAlert. On success, the page filter jumps to
 * the new roster's year + semester so it is visible.
 *
 * `onCreated()` is called after a successful generate so the parent can react
 * (jump filters, refresh tab counts).
 */
export default function GenerateGradeModal({ onClose, onCreated }) {
  const { generateRoster } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()

  const [teacher, setTeacher] = useState('Select teacher')
  const [subject, setSubject] = useState('Select subject')
  const [cls, setCls] = useState('Select class')

  const validate = () => {
    if (teacher.startsWith('Select')) {
      showToast('Please select a teacher')
      return false
    }
    if (subject.startsWith('Select')) {
      showToast('Please select a subject')
      return false
    }
    if (cls.startsWith('Select')) {
      showToast('Please select a class')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const ok = await confirmSave({
      title: 'Generate roster?',
      text: `Create a grade roster for ${cls} — ${subject} with ${teacher}?`,
      confirmText: 'Generate',
    })
    if (!ok) return

    const created = generateRoster({ teacher, cls, subject })
    if (!created) {
      showToast('Roster already exists for that class and subject')
      return
    }
    showToast('Grade roster generated')
    if (onCreated) onCreated({ teacher, cls, subject })
    onClose()
  }

  return (
    <Modal
      title="Generate Grade"
      subtitle="Select parameters to generate a grade roster"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Generate Grade"
    >
      <FormField label="Teacher" htmlFor="gen-teacher">
        <TextField
          select
          id="gen-teacher"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select teacher">Select teacher</MenuItem>
          {TEACHERS.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <FormField label="Subject" htmlFor="gen-subject">
        <TextField
          select
          id="gen-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select subject">Select subject</MenuItem>
          {SUBJECTS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <FormField label="Class" htmlFor="gen-cls">
        <TextField
          select
          id="gen-cls"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select class">Select class</MenuItem>
          {CLASSES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <FormNote>
        Generating grades will create standard assessment entries for all enrolled
        students in the selected class.
      </FormNote>
    </Modal>
  )
}