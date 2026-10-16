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
 * Read-only Grade Scale details modal (Batch 3).
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

export default function GradeScaleViewModal({ scale, onClose }) {
  if (!scale) return null

  return (
    <Modal
      title="Grade Scale Details"
      subtitle={`${scale.alphabet} · ${scale.scoreFrom}–${scale.scoreTo}`}
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
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {scale.alphabet}
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {scale.alphabet}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            Score range {scale.scoreFrom}–{scale.scoreTo}
          </Typography>
        </Box>
        <StatusBadge variant={activeStatusVariant(scale)}>
          {activeStatusLabel(scale)}
        </StatusBadge>
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={labelSx}>Grade Alphabet</TableCell>
            <TableCell
              sx={valueSx}
              className="mono"
            >
              {scale.alphabet}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Score From</TableCell>
            <TableCell sx={valueSx} className="num">
              {scale.scoreFrom}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Score To</TableCell>
            <TableCell sx={valueSx} className="num">
              {scale.scoreTo}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Range</TableCell>
            <TableCell sx={valueSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon
                  name="straighten"
                  size={18}
                  sx={{ color: 'primary.main' }}
                />
                <Box component="span" className="num">
                  {scale.scoreFrom} – {scale.scoreTo}
                </Box>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Status</TableCell>
            <TableCell sx={valueSx}>
              <StatusBadge variant={activeStatusVariant(scale)}>
                {activeStatusLabel(scale)}
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={labelSx}>Updated</TableCell>
            <TableCell sx={valueSx}>{scale.updated}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  )
}