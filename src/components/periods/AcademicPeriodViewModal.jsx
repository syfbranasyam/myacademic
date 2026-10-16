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
  activeStatusLabel,
  activeStatusVariant,
  shortSemester,
} from '../../data/referenceData.js'

/*
 * Read-only Academic Period details modal (Batch 2).
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

function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AcademicPeriodViewModal({ period, onClose }) {
  if (!period) return null

  return (
    <Modal
      title="Academic Period Details"
      subtitle={`${period.year} · ${period.type}`}
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
            backgroundColor: 'rgba(252, 231, 243, 1)',
            color: 'primary.main',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="date_range" size={22} />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {period.year}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {formatDate(period.startDate)} — {formatDate(period.endDate)}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(period)}>
          {activeStatusLabel(period)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={labelSx}>Academic Year</TableCell>
            <TableCell sx={valueSx} className="mono">
              {period.year}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Start Date</TableCell>
            <TableCell sx={valueSx}>{formatDate(period.startDate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>End Date</TableCell>
            <TableCell sx={valueSx}>{formatDate(period.endDate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Semester</TableCell>
            <TableCell sx={valueSx}>{period.semester}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Type</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant="pink">{shortSemester(period.type)}</StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(period)}>
                {activeStatusLabel(period)}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Updated</TableCell>
            <TableCell sx={valueSx}>{period.updated}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}