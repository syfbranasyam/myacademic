import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import Modal from '../ui/Modal.jsx'
import Avatar from '../ui/Avatar.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import Icon from '../ui/Icon.jsx'
import {
  activeStatusLabel,
  activeStatusVariant,
  shortSemester,
  subjectIcon,
  teacherNip,
} from '../../data/referenceData.js'

/*
 * Read-only Teaching Assignment details modal (revision Phase 5e).
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

export default function AssignmentViewModal({ assignment, onClose }) {
  if (!assignment) return null

  return (
    <Modal
      title="Assignment Details"
      subtitle={`${assignment.teacher} · ${assignment.cls}`}
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
        <Avatar name={assignment.teacher} index={assignment.id} size={56} />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {assignment.teacher}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {assignment.subject} · {assignment.cls}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(assignment)}>
          {activeStatusLabel(assignment)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={labelSx}>Teacher</TableCell>
            <TableCell sx={valueSx}>{assignment.teacher}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>NIP</TableCell>
            <TableCell sx={{ ...valueSx }} className="mono">
              {teacherNip(assignment.teacher)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Class</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant="blue">{assignment.cls}</StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Subject</TableCell>
            <TableCell sx={valueSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon
                  name={subjectIcon(assignment.subject)}
                  size={18}
                  sx={{ color: 'primary.main' }}
                />
                <Box component="span">{assignment.subject}</Box>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Academic Year</TableCell>
            <TableCell sx={valueSx}>{assignment.year}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Semester</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant="pink">
                {shortSemester(assignment.semester)}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(assignment)}>
                {activeStatusLabel(assignment)}
              </StatusBadge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}