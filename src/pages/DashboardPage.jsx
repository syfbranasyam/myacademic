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
  TEACHERS,
  CURRENT_SEMESTER,
  CURRENT_YEAR,
  shortSemester,
} from '../data/referenceData.js'
import { useData } from '../context/DataContext.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import { Icon, StatCard, Avatar, StatusBadge } from '../components/ui'
import BarChart from '../components/dashboard/BarChart.jsx'
import DonutChart from '../components/dashboard/DonutChart.jsx'
import { statusColors } from '../styles/muiTheme'
import {
  letterGrade,
  resultStatus,
  resultStatusVariant,
} from '../utils/grading.js'

/*
 * Dashboard (UI-polish spec §8; integration pass; chart enhancement).
 *
 * Layout:
 *   Row 1 — six KPI cards: Students, Teachers, Classes, Subjects,
 *           Academic Periods, Grading Rosters
 *   Row 2 — two info cards: Active Academic Period, Academic Snapshot
 *   Row 3 — two charts: Students by Class, Grade Distribution
 *   Row 4 — two charts: Class Category Split, Roster Progress
 *   Row 5 — Recent Students (last 5 by NIS)
 *
 * Every metric and chart reads from DataContext. No value is hard-coded; the
 * counts update automatically when any CRUD module changes. Charts fall back
 * to a friendly empty state when the underlying dataset has no records.
 */

export default function DashboardPage() {
  const {
    students,
    classes,
    rosters,
    academicPeriods,
    availableSubjects,
  } = useData()
  const navigate = useNavigate()

  /* ---------------------------------------------------------------- *
   * Derived primitives
   * ---------------------------------------------------------------- */

  const visibleStudents = useMemo(
    () => students.filter((s) => s.IsDelete === 0),
    [students],
  )

  const visibleClasses = useMemo(
    () => classes.filter((c) => c.IsDelete === 0),
    [classes],
  )

  const visibleRosters = useMemo(
    () => rosters.filter((r) => r.IsDelete === 0),
    [rosters],
  )

  const visiblePeriods = useMemo(
    () => academicPeriods.filter((p) => p.IsDelete === 0),
    [academicPeriods],
  )

  /* ---------------------------------------------------------------- *
   * Snapshot — pass rate + counts for the info card
   * ---------------------------------------------------------------- */

  const snapshot = useMemo(() => {
    const total = visibleStudents.length
    const passing = visibleStudents.filter((s) => s.avg >= 75).length
    const remedial = total - passing
    const passRate = total ? Math.round((passing / total) * 100) : 0
    return { total, passing, remedial, passRate }
  }, [visibleStudents])

  /* ---------------------------------------------------------------- *
   * Class ↔ category lookup (shared by charts 1 and 3)
   * ---------------------------------------------------------------- */

  const classCategoryMap = useMemo(() => {
    const map = new Map()
    visibleClasses.forEach((c) => map.set(c.cls, c.category))
    return map
  }, [visibleClasses])

  /* ---------------------------------------------------------------- *
   * Chart 1 — students by class
   *
   * Iterates the students, not the class register, so any orphan record
   * (a student whose class has been deleted) is still counted; orphans
   * render with the neutral gray colour.
   * ---------------------------------------------------------------- */

  const studentsByClass = useMemo(() => {
    const counts = {}
    visibleStudents.forEach((s) => {
      counts[s.cls] = (counts[s.cls] || 0) + 1
    })
    return Object.entries(counts)
      .map(([cls, value]) => {
        const category = classCategoryMap.get(cls)
        return {
          label: cls,
          value,
          color:
            category === 'MIPA'
              ? statusColors.pink.fg
              : category === 'IIS'
                ? statusColors.blue.fg
                : statusColors.gray.fg,
        }
      })
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
  }, [visibleStudents, classCategoryMap])

  /* ---------------------------------------------------------------- *
   * Chart 2 — grade distribution
   * ---------------------------------------------------------------- */

  const gradeDistribution = useMemo(() => {
    const colorByGrade = {
      A: statusColors.green.fg,
      B: statusColors.blue.fg,
      C: statusColors.amber.fg,
      D: statusColors.red.fg,
    }
    const order = ['A', 'B', 'C', 'D']
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    visibleStudents.forEach((s) => {
      const g = letterGrade(s.avg)
      if (g in counts) counts[g] += 1
    })
    return order.map((g) => ({
      label: g,
      value: counts[g],
      color: colorByGrade[g],
    }))
  }, [visibleStudents])

  /* ---------------------------------------------------------------- *
   * Chart 3 — class category split (MIPA / IIS / Other)
   * ---------------------------------------------------------------- */

  const categoryDistribution = useMemo(() => {
    let mipa = 0
    let iis = 0
    let other = 0
    visibleStudents.forEach((s) => {
      const category = classCategoryMap.get(s.cls)
      if (category === 'MIPA') mipa += 1
      else if (category === 'IIS') iis += 1
      else other += 1
    })
    const result = [
      { label: 'MIPA', value: mipa, color: statusColors.pink.fg },
      { label: 'IIS', value: iis, color: statusColors.blue.fg },
    ]
    if (other > 0) {
      result.push({ label: 'Other', value: other, color: statusColors.gray.fg })
    }
    return result
  }, [visibleStudents, classCategoryMap])

  /* ---------------------------------------------------------------- *
   * Chart 4 — roster progress
   * ---------------------------------------------------------------- */

  const rosterStatusDistribution = useMemo(() => {
    const complete = visibleRosters.filter((r) => r.status === 'Complete').length
    const inProgress = visibleRosters.filter(
      (r) => r.status === 'In Progress',
    ).length
    const notStarted = visibleRosters.filter(
      (r) => r.status === 'Not Started',
    ).length
    return [
      { label: 'Complete', value: complete, color: statusColors.green.fg },
      { label: 'In Progress', value: inProgress, color: statusColors.amber.fg },
      { label: 'Not Started', value: notStarted, color: statusColors.gray.fg },
    ]
  }, [visibleRosters])

  /* ---------------------------------------------------------------- *
   * Recent students (last five by descending NIS)
   * ---------------------------------------------------------------- */

  const recentStudents = useMemo(
    () =>
      [...visibleStudents]
        .sort((a, b) => Number(b.nis) - Number(a.nis))
        .slice(0, 5),
    [visibleStudents],
  )

  /* ---------------------------------------------------------------- *
   * Render
   * ---------------------------------------------------------------- */

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview akademik sekolah" />

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard label="Students" value={snapshot.total} icon="group" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard label="Teachers" value={TEACHERS.length} icon="person_apron" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard
            label="Classes"
            value={visibleClasses.length}
            icon="meeting_room"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard
            label="Subjects"
            value={availableSubjects.length}
            icon="menu_book"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard
            label="Academic Periods"
            value={visiblePeriods.length}
            icon="date_range"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard
            label="Grading Rosters"
            value={visibleRosters.length}
            icon="assignment_turned_in"
          />
        </Grid>
      </Grid>

      {/* Info cards — preserved from the earlier dashboard */}
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
              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary' }}
              >
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

      {/* Charts — row 1 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Students by Class"
            subtitle="Active students grouped by class register"
          >
            <BarChart
              data={studentsByClass}
              labelWidth={96}
              emptyText="No students recorded yet"
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Grade Distribution"
            subtitle="Students grouped by letter grade from their average score"
          >
            <BarChart
              data={gradeDistribution}
              labelWidth={32}
              emptyText="No grade records to display"
            />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts — row 2 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Class Category Split"
            subtitle="Students distributed across MIPA and IIS tracks"
          >
            <DonutChart
              data={categoryDistribution}
              centerLabel="Students"
              emptyText="No students to categorize"
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Roster Progress"
            subtitle="Grading completion status across all active rosters"
          >
            <DonutChart
              data={rosterStatusDistribution}
              centerLabel="Rosters"
              emptyText="No grade rosters yet"
            />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Recent students — preserved */}
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
            <Typography
              sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}
            >
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
                          <Typography
                            sx={{ fontSize: 12, color: 'text.secondary' }}
                          >
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

/* ------------------------------------------------------------------ *
 * Small helper: title / subtitle wrapper for the four chart cards
 * ------------------------------------------------------------------ */

function ChartCard({ title, subtitle, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}