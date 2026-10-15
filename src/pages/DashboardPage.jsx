import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'

import {
  CLASSES,
  SUBJECTS,
  TEACHERS,
  CURRENT_SEMESTER,
  CURRENT_YEAR,
  shortSemester,
} from '../data/referenceData.js'
import { useData } from '../context/DataContext.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import { Icon, StatCard, Avatar, StatusBadge } from '../components/ui'
import { resultStatus, resultStatusVariant } from '../utils/grading.js'

/*
 * Dashboard (UI-polish spec §8).
 *
 * Real data, cleaner hierarchy:
 *   Row 1 — four KPI cards: Students, Teachers, Classes, Subjects
 *   Row 2 — Academic Period + Academic Snapshot
 *   Row 3 — Recent Students (last 5 by NIS)
 *
 * No static figures, no placeholder text.
 */

export default function DashboardPage() {
  const { students } = useData()
  const navigate = useNavigate()

  const visibleStudents = useMemo(
    () => students.filter((s) => s.IsDelete === 0),
    [students],
  )

  const snapshot = useMemo(() => {
    const total = visibleStudents.length
    const passing = visibleStudents.filter((s) => s.avg >= 75).length
    const remedial = total - passing
    const passRate = total ? Math.round((passing / total) * 100) : 0
    return { total, passing, remedial, passRate }
  }, [visibleStudents])

  const recentStudents = useMemo(
    () =>
      [...visibleStudents]
        .sort((a, b) => Number(b.nis) - Number(a.nis))
        .slice(0, 5),
    [visibleStudents],
  )

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview akademik sekolah" />

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, lg: 3 }}>
          <StatCard label="Students" value={snapshot.total} icon="group" />
        </Grid>
        <Grid size={{ xs: 6, lg: 3 }}>
          <StatCard label="Teachers" value={TEACHERS.length} icon="person_apron" />
        </Grid>
        <Grid size={{ xs: 6, lg: 3 }}>
          <StatCard label="Classes" value={CLASSES.length} icon="meeting_room" />
        </Grid>
        <Grid size={{ xs: 6, lg: 3 }}>
          <StatCard label="Subjects" value={SUBJECTS.length} icon="menu_book" />
        </Grid>
      </Grid>

      {/* Info cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: 'surface',
                    color: 'primary.main',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="calendar_today" size={20} />
                </Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Active Academic Period
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary' }}>
                {CURRENT_YEAR} — {shortSemester(CURRENT_SEMESTER)}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
                Current semester in progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: 'surface',
                    color: 'primary.main',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="verified" size={20} />
                </Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Academic Snapshot
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  className="num"
                  sx={{ fontSize: 22, fontWeight: 700, color: 'primary.main' }}
                >
                  {snapshot.passRate}%
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  passing rate
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
                {snapshot.passing} passing · {snapshot.remedial} remedial flagged
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent students */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
              Recent Students
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Last 5 students added to the register
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => navigate('/students')}
            endIcon={<Icon name="arrow_forward" size={16} />}
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'surfaceLow' },
            }}
          >
            View all
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableBody>
              {recentStudents.length > 0 ? (
                recentStudents.map((s, index) => (
                  <TableRow key={s.nis} hover>
                    <TableCell sx={{ px: 3, py: 1.25, width: 80 }}>
                      <Box
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'text.secondary',
                        }}
                      >
                        {s.nis}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.25 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar name={s.name} index={index} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {s.name}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                            {s.cls}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      className="num"
                      sx={{ px: 3, py: 1.25, fontWeight: 600, width: 100 }}
                    >
                      {s.avg.toFixed(1)}
                    </TableCell>
                    <TableCell align="right" sx={{ px: 3, py: 1.25, width: 160 }}>
                      <StatusBadge variant={resultStatusVariant(s.avg)}>
                        {resultStatus(s.avg)}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}
                  >
                    No students yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}