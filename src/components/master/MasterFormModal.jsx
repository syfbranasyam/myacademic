import { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { FormField, FormNote } from '../ui'
import Modal from '../ui/Modal.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { MASTER_CATEGORIES } from '../../data/referenceData.js'

/*
 * Academic Master Add / Edit modal (spec §10.6, UI-polish round 2).
 *
 * The Master Type field has been removed — every entry is a Subject, so the
 * field was redundant. Duplicate code check applies to Add and Edit alike.
 */

export default function MasterFormModal({ master, onClose, onSaved }) {
  const { addMasterItem, updateMasterItem } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()
  const isEdit = Boolean(master)

  const [code, setCode] = useState(isEdit ? master.code : '')
  const [name, setName] = useState(isEdit ? master.name : '')
  const [statusValue, setStatusValue] = useState(isEdit ? master.IsActive : 1)
  const [category, setCategory] = useState(
    isEdit ? master.category : 'Select category',
  )

  const codeRef = useRef(null)
  useEffect(() => {
    const input = codeRef.current?.querySelector?.('input')
    input?.focus()
  }, [])

  const validate = () => {
    if (!code.trim() || !name.trim()) {
      showToast('Code and name are required')
      return false
    }
    if (category === 'Select category') {
      showToast('Select a category')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const ok = await confirmSave({
      title: isEdit ? 'Save changes?' : 'Add subject?',
      text: isEdit
        ? `Update "${master.name}"?`
        : `Add "${name.trim()}" to the subject list?`,
      confirmText: isEdit ? 'Save' : 'Add',
    })
    if (!ok) return

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      IsActive: statusValue,
    }

    let result
    if (isEdit) {
      result = updateMasterItem(master.code, payload)
      if (result) showToast('Master data updated')
      else showToast('Code already exists')
    } else {
      result = addMasterItem(payload)
      if (result) showToast('Master data added')
      else showToast('Code already exists')
    }
    if (result) {
      if (onSaved) onSaved()
      onClose()
    }
  }

  return (
    <Modal
      title={isEdit ? 'Edit Subject Master' : 'Add Academic Master'}
      subtitle={
        isEdit
          ? 'Update subject details and classification'
          : 'Create a new subject entry'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Update Subject' : 'Save Master'}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <FormField label="Subject Code" htmlFor="master-code">
          <TextField
            ref={codeRef}
            id="master-code"
            placeholder="E.G. MAT-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            sx={{ '& .MuiOutlinedInput-input': { fontFamily: 'var(--font-mono)' } }}
          />
        </FormField>

        <FormField label="Status" htmlFor="master-status">
          <TextField
            select
            id="master-status"
            value={statusValue}
            onChange={(e) => setStatusValue(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </FormField>
      </Box>

      <FormField label="Subject Name" htmlFor="master-name">
        <TextField
          id="master-name"
          placeholder="Enter subject name (e.g. Chemistry)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </FormField>

      <FormField label="Category / Department" htmlFor="master-category">
        <TextField
          select
          id="master-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        >
          <MenuItem value="Select category">Select category</MenuItem>
          {MASTER_CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <FormNote>
        {isEdit
          ? 'Modifying subject master properties will recalculate teacher syllabus allocations across current active rosters.'
          : 'This master data entry will immediately synchronize across curriculum planners and teaching assignment allocations.'}
      </FormNote>
    </Modal>
  )
}