import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import Modal from '../ui/Modal.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import Icon from '../ui/Icon.jsx'
import {
  CLASS_FACTS,
  activeStatusLabel,
  activeStatusVariant,
  shortSemester,
  subjectIcon,
  teacherNip,
} from '../../data/referenceData.js'

/*
 * Read-only Grade Management roster details modal (revision Phase 6).
 * Opens when a table row is clicked.
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

export default function RosterViewModal({ roster, onClose }) {
  if (!roster) return null

  const facts = CLASS_FACTS[roster.cls]
  const enrollment = facts ? facts.enrolled : '—'

  return (
    <Modal
      title="Roster Details"
      subtitle={`${roster.teacher} • ${roster.subject} • ${roster.cls}`}
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
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor:
              roster.cls === 'XI IPA 1' ? 'rgba(252, 231, 243, 1)' : 'surfaceHigh',
            color: roster.cls === 'XI IPA 1' ? 'primary.main' : 'secondary.main',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          XI
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {roster.cls} — {roster.subject}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {facts ? `${facts.track} • Room ${facts.room}` : ''}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(roster)}>
          {activeStatusLabel(roster)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={labelSx}>Class</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant="blue">{roster.cls}</StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Subject</TableCell>
            <TableCell sx={valueSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon
                  name={subjectIcon(roster.subject)}
                  size={18}
                  sx={{ color: 'primary.main' }}
                />
                <Box component="span">{roster.subject}</Box>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Teacher</TableCell>
            <TableCell sx={valueSx}>{roster.teacher}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>NIP</TableCell>
            <TableCell sx={valueSx} className="mono">
              {teacherNip(roster.teacher)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Academic Year</TableCell>
            <TableCell sx={valueSx}>{roster.year}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Semester</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant="pink">
                {shortSemester(roster.semester)}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Students</TableCell>
            <TableCell sx={valueSx}>{enrollment} Students</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Grading Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge
                variant={
                  roster.status === 'Complete'
                    ? 'green'
                    : roster.status === 'In Progress'
                      ? 'amber'
                      : 'gray'
                }
                dot
              >
                {roster.status}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(roster)}>
                {activeStatusLabel(roster)}
              </StatusBadge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}