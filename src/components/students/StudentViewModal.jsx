import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import Modal from '../ui/Modal.jsx'
import Avatar from '../ui/Avatar.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { activeStatusLabel, activeStatusVariant } from '../../data/referenceData.js'

/*
 * Read-only Student details modal (revision Phase 5).
 *
 * Opens when a table row is clicked. Uses the shared Modal shell with only a
 * Close button (hideCancel).
 */

const labelSx = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  width: '40%',
  pr: 2,
  border: 0,
  backgroundColor: 'transparent',
}

const valueSx = {
  fontSize: 14,
  color: 'text.primary',
  border: 0,
  backgroundColor: 'transparent',
  py: 1,
}

export default function StudentViewModal({ student, onClose }) {
  if (!student) return null

  const rows = [
    ['NIS', student.nis, true],
    ['Student Name', student.name, false],
    ['Class', student.cls, false],
    ['Gender', student.gender, false],
    ['Average Score', student.avg.toFixed(1), true],
  ]

  return (
    <Modal
      title="Student Details"
      subtitle={`${student.cls} · NIS ${student.nis}`}
      onClose={onClose}
      onSubmit={onClose}
      submitLabel="Close"
      hideCancel
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          mb: 2,
          backgroundColor: 'surface',
          borderRadius: '12px',
        }}
      >
        <Avatar name={student.name} index={0} size={56} />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {student.name}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {student.gender} · {student.cls}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(student)}>
          {activeStatusLabel(student)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          {rows.map(([label, value, mono]) => (
            <TableRow key={label}>
              <TableCell sx={labelSx}>{label}</TableCell>
              <TableCell
                sx={valueSx}
                className={mono ? 'num mono' : ''}
              >
                {value}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(student)}>
                {activeStatusLabel(student)}
              </StatusBadge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}