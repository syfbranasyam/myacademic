import { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { FormField, FormNote } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { CLASS_CATEGORIES } from '../../data/classes.js'

/*
 * Class Add / Edit modal (Class Management module).
 *
 * Fields: Class name (unique among non-deleted), Category (MIPA / IIS),
 * Room, Status (Active / Inactive). Duplicate-name check runs on Add and Edit
 * alike; a duplicate is reported as a toast, not a SweetAlert.
 */
export default function ClassFormModal({ cls, onClose, onSaved }) {
  const { classes, addClass, updateClass } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()
  const isEdit = Boolean(cls)

  const [name, setName] = useState(isEdit ? cls.cls : '')
  const [category, setCategory] = useState(isEdit ? cls.category : 'Select category')
  const [room, setRoom] = useState(isEdit ? cls.room : '')
  const [statusValue, setStatusValue] = useState(isEdit ? cls.IsActive : 1)

  const nameRef = useRef(null)
  useEffect(() => {
    const input = nameRef.current?.querySelector?.('input')
    input?.focus()
  }, [])

  const validate = () => {
    if (!name.trim()) {
      showToast('Class name is required')
      return false
    }
    if (category === 'Select category') {
      showToast('Select a category')
      return false
    }
    if (!room.trim()) {
      showToast('Room is required')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const trimmedName = name.trim()
    const duplicate = classes.some(
      (c) =>
        c.IsDelete === 0 &&
        c.cls.toLowerCase() === trimmedName.toLowerCase() &&
        (!isEdit || c.id !== cls.id),
    )
    if (duplicate) {
      showToast('A class with that name already exists')
      return
    }

    const ok = await confirmSave({
      title: isEdit ? 'Save changes?' : 'Add class?',
      text: isEdit
        ? `Update "${cls.cls}"?`
        : `Add "${trimmedName}" to the class list?`,
      confirmText: isEdit ? 'Save' : 'Add',
    })
    if (!ok) return

    const payload = {
      cls: trimmedName,
      category,
      room: room.trim(),
      IsActive: statusValue,
    }

    if (isEdit) {
      updateClass(cls.id, payload)
      showToast('Class updated')
    } else {
      addClass(payload)
      showToast('Class added')
    }
    if (onSaved) onSaved()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Edit Class' : 'Add Class'}
      subtitle={
        isEdit ? 'Update class details' : 'Create a new class entry'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Update Class' : 'Save Class'}
    >
      <FormField label="Class Name" htmlFor="class-name">
        <TextField
          ref={nameRef}
          id="class-name"
          placeholder="E.G. XI MIPA 1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </FormField>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <FormField label="Category" htmlFor="class-category">
          <TextField
            select
            id="class-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            <MenuItem value="Select category">Select category</MenuItem>
            {CLASS_CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <FormField label="Status" htmlFor="class-status">
          <TextField
            select
            id="class-status"
            value={statusValue}
            onChange={(e) => setStatusValue(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </FormField>
      </Box>

      <FormField label="Room" htmlFor="class-room">
        <TextField
          id="class-room"
          placeholder="E.G. Room 204"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          fullWidth
        />
      </FormField>

      <FormNote>
        {isEdit
          ? 'Updating a class will reflect across every class-based listing and allocation.'
          : 'This class will immediately become available for teaching assignments and grade rosters.'}
      </FormNote>
    </Modal>
  )
}