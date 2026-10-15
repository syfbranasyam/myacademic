import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import Modal from '../ui/Modal.jsx'
import Icon from '../ui/Icon.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

import { buildTranscript } from '../../utils/transcript.js'
import { gradeVariant } from '../../utils/grading.js'
import { classTrackLabel, subjectIcon } from '../../data/referenceData.js'

/*
 * Transcript view modal (spec §5.3, UI-polish spec §5).
 *
 * `autoPrint` (new): when true, the modal prints itself to the browser's
 * print dialog, then closes. The modal is marked `printable`, so during
 * printing only the modal content appears (see theme.css for the
 * `.printing-modal` rules).
 */
export default function ResultViewModal({ student, onClose, autoPrint = false }) {
  /* Auto-print: fires once after mount */
  useEffect(() => {
    if (!autoPrint || !student) return

    const timer = setTimeout(() => {
      document.body.classList.add('printing-modal')
      window.print()
      document.body.classList.remove('printing-modal')
      onClose()
    }, 300)

    return () => {
      clearTimeout(timer)
      document.body.classList.remove('printing-modal')
    }
  }, [autoPrint, student, onClose])

  if (!student) return null

  const transcript = buildTranscript(student)
  const overallAverage = transcript.average

  return (
    <Modal
      title={`Transcript — ${student.name}`}
      subtitle={`NIS ${student.nis} · Academic Period 2026/2027 — Ganjil`}
      width="wide"
      printable
      onClose={onClose}
      onSubmit={onClose}
      submitLabel="Close"
      hideCancel
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <SummaryItem
          icon="person"
          label="Student"
          value={student.name}
          detail={`NISN: ${transcript.nisn}`}
        />
        <SummaryItem
          icon="meeting_room"
          label="Class"
          value={student.cls}
          detail={classTrackLabel(student.cls)}
        />
        <SummaryItem
          icon="calendar_today"
          label="Academic Period"
          value="2026/2027 — Ganjil"
          detail="Active Semester"
        />
      </Box>

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            backgroundColor: 'surfaceLow',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon name="fact_check" size={20} sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Cumulative Grade Ledger
            </Typography>
          </Box>
          <StatusBadge variant="blue">5 Registered Subjects</StatusBadge>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell align="right">Assignment</TableCell>
                <TableCell align="right">Mid</TableCell>
                <TableCell align="right">Final</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="center">Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transcript.subjects.map((row) => (
                <TableRow key={row.subject} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          backgroundColor: 'surface',
                          color: 'primary.main',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon name={subjectIcon(row.subject)} size={18} />
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        {row.subject}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" className="num">
                    {row.assignment}
                  </TableCell>
                  <TableCell align="right" className="num">
                    {row.mid}
                  </TableCell>
                  <TableCell align="right" className="num">
                    {row.final}
                  </TableCell>
                  <TableCell
                    align="right"
                    className="num"
                    sx={{ fontWeight: 700 }}
                  >
                    {row.score}
                  </TableCell>
                  <TableCell align="center">
                    <StatusBadge variant={gradeVariant(row.score)}>
                      {row.grade}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            px: 2,
            py: 1.5,
            backgroundColor: 'surfaceLow',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon name="verified" size={16} sx={{ color: 'text.secondary' }} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              All grade components validated by academic registrar
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
              px: 2,
              py: 0.75,
              backgroundColor: 'background.paper',
              borderRadius: '8px',
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              Average Score
            </Typography>
            <Typography
              className="num"
              sx={{ fontSize: 20, fontWeight: 700, color: 'primary.main' }}
            >
              {overallAverage.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

function SummaryItem({ icon, label, value, detail }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: 'surface',
          color: 'primary.main',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{value}</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {detail}
        </Typography>
      </Box>
    </Box>
  )
}