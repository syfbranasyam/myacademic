import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import Modal from '../ui/Modal.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import Icon from '../ui/Icon.jsx'
import { activeStatusLabel, activeStatusVariant } from '../../data/referenceData.js'

/*
 * Read-only Class details modal. Opens when a table row is clicked.
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

export default function ClassViewModal({ cls, onClose }) {
  if (!cls) return null

  return (
    <Modal
      title="Class Details"
      subtitle={`${cls.cls} · ${cls.category}`}
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
          <Icon name="class" size={22} />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {cls.cls}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {cls.category} · {cls.room}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(cls)}>
          {activeStatusLabel(cls)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={labelSx}>Class</TableCell>
            <TableCell sx={valueSx}>{cls.cls}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Category</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant="blue">{cls.category}</StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Room</TableCell>
            <TableCell sx={valueSx}>{cls.room}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(cls)}>
                {activeStatusLabel(cls)}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Updated</TableCell>
            <TableCell sx={valueSx}>{cls.updated}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}