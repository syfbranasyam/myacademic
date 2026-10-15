import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import Modal from '../ui/Modal.jsx'
import Avatar from '../ui/Avatar.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCrudConfirm } from '../../hooks/useCrudConfirm.js'
import { predikat } from '../../utils/grading.js'
import { CLASS_FACTS } from '../../data/referenceData.js'

/*
 * Grade entry modal (spec §10.6, revision Phase 6).
 *
 * Shows the FIRST SIX students of the roster's class (prototype preservation,
 * spec §13.1 item 4). Each row has a 0–100 score input. Predikat and class
 * average update live while typing.
 *
 * Save Grades:
 *   - Validates every entered score is 0–100 (toast + stop if not)
 *   - Writes scores back to the student's single average
 *   - Updates roster status: Not Started / In Progress / Complete
 *
 * The initial score for each row is the saved score from the grade book, or
 * the student's own average when the roster is not Not Started. Not Started
 * rosters open blank, matching the prototype.
 */

const VISIBLE_ROWS = 6

const headerSx = {
  py: 1,
  px: 1.5,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  backgroundColor: 'surfaceLow',
  whiteSpace: 'nowrap',
}

export default function GradeEditModal({ roster, onClose }) {
  const { students, gradeScores, saveGradeScores } = useData()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()

  const classFacts = CLASS_FACTS[roster.cls]

  /* First six students of this roster's class */
  const displayRows = useMemo(
    () => students.filter((s) => s.cls === roster.cls && s.IsDelete === 0).slice(0, VISIBLE_ROWS),
    [students, roster.cls],
  )

  /* Initial scores: saved score wins; else fall back to student avg unless
     the roster is Not Started (spec §10.6). */
  const initialScores = useMemo(() => {
    const saved = gradeScores[roster.id] ?? {}
    const result = {}
    displayRows.forEach((s) => {
      if (saved[s.nis] !== undefined && saved[s.nis] !== null) {
        result[s.nis] = String(saved[s.nis])
      } else if (roster.status === 'Not Started') {
        result[s.nis] = ''
      } else {
        result[s.nis] = String(s.avg)
      }
    })
    return result
  }, [displayRows, gradeScores, roster.id, roster.status])

  const [scores, setScores] = useState(initialScores)

  const handleScoreChange = (nis, value) => {
    /* Allow only digits and one optional decimal point */
    const cleaned = value.replace(/[^0-9.]/g, '')
    setScores((prev) => ({ ...prev, [nis]: cleaned }))
  }

  /* Live class average of entered scores */
  const { classAverage, enteredCount } = useMemo(() => {
    let sum = 0
    let count = 0
    Object.values(scores).forEach((raw) => {
      const n = parseFloat(raw)
      if (!Number.isNaN(n)) {
        sum += n
        count += 1
      }
    })
    return { classAverage: count > 0 ? sum / count : null, enteredCount: count }
  }, [scores])

  const handleSubmit = async () => {
    /* Validate first — any out-of-range value stops the save */
    let invalid = false
    Object.values(scores).forEach((raw) => {
      if (raw === '') return
      const n = parseFloat(raw)
      if (Number.isNaN(n) || n < 0 || n > 100) invalid = true
    })
    if (invalid) {
      showToast('Scores must be between 0 and 100')
      return
    }

    const ok = await confirmSave({
      title: 'Save grades?',
      text: `Save the entered scores for ${roster.cls} — ${roster.subject}?`,
      confirmText: 'Save',
    })
    if (!ok) return

    /* Numeric conversion before handing to DataContext */
    const numericScores = {}
    Object.entries(scores).forEach(([nis, raw]) => {
      numericScores[nis] = raw === '' ? '' : Number(raw)
    })

    saveGradeScores(roster.id, numericScores)
    showToast('Grades saved')
    onClose()
  }

  return (
    <Modal
      title="Edit Grade"
      subtitle={`${roster.teacher} • ${roster.subject} • ${roster.cls} — Academic Year ${roster.year} (${roster.semester.split(' ')[0]})`}
      width="wide"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Save Grades"
    >
      <TableContainer
        sx={{ mt: 1, border: 1, borderColor: 'divider', borderRadius: '12px' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerSx}>No</TableCell>
              <TableCell sx={headerSx}>Student Name</TableCell>
              <TableCell sx={{ ...headerSx, textAlign: 'center' }}>Score</TableCell>
              <TableCell sx={{ ...headerSx, textAlign: 'right' }}>
                Predikat / Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((s, i) => {
              const raw = scores[s.nis] ?? ''
              const numeric = parseFloat(raw)
              const p = predikat(Number.isNaN(numeric) ? '' : numeric)

              return (
                <TableRow key={s.nis}>
                  <TableCell sx={{ fontSize: 14, color: 'text.secondary' }}>
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar name={s.name} index={i} />
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                          {s.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: 'text.secondary',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          NIS {s.nis}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      value={raw}
                      onChange={(e) => handleScoreChange(s.nis, e.target.value)}
                      inputMode="decimal"
                      placeholder="—"
                      sx={{
                        width: 88,
                        '& .MuiOutlinedInput-input': {
                          textAlign: 'center',
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 600,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {p ? (
                      <StatusBadge variant={p.variant}>{`● ${p.text}`}</StatusBadge>
                    ) : (
                      <Typography
                        sx={{ fontSize: 13, color: 'text.secondary' }}
                      >
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: 1.5,
          mt: 2,
          backgroundColor: 'surfaceLow',
          borderRadius: '8px',
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          Class Average:{' '}
          <Box
            component="span"
            className="num"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            {classAverage !== null ? classAverage.toFixed(1) : '—'}
          </Box>
          {enteredCount > 0 && (
            <Box
              component="span"
              sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}
            >
              ({enteredCount} entered)
            </Box>
          )}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>
          {classFacts?.enrolled ?? displayRows.length} Students Enrolled
        </Typography>
      </Box>

      <Box sx={{ mt: 1.5, fontSize: 12, color: 'text.secondary' }}>
        Note: this prototype shows the first {VISIBLE_ROWS} students for
        demonstration. Saving writes each entered score back to that student's
        average, which feeds Academic Result.
      </Box>
    </Modal>
  )
}