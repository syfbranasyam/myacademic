import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import Modal from '../ui/Modal.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { activeStatusLabel, activeStatusVariant } from '../../data/referenceData.js'

/*
 * Read-only Academic Master details modal (spec §5.3, UI-polish round 2).
 *
 * The Master Type row has been removed — every entry is a Subject.
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

export default function MasterViewModal({ master, onClose }) {
  if (!master) return null

  return (
    <Modal
      title="Subject Details"
      subtitle={master.code}
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
            fontWeight: 700,
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >
          {master.code}
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {master.name}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {master.category}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(master)}>
          {activeStatusLabel(master)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={labelSx}>Code</TableCell>
            <TableCell sx={valueSx} className="mono">
              {master.code}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Name</TableCell>
            <TableCell sx={valueSx}>{master.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Category</TableCell>
            <TableCell sx={valueSx}>{master.category}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(master)}>
                {activeStatusLabel(master)}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Updated</TableCell>
            <TableCell sx={valueSx}>{master.updated}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}