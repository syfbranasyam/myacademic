import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usePersistedState } from '../hooks/usePersistedState.js'

import PageHeader from '../components/layout/PageHeader.jsx'
import {
  FilterBar,
  Pagination,
  EmptyRow,
  Avatar,
  StatusBadge,
  Icon,
} from '../components/ui'
import { SortableTableHead } from '../components/crud'
import ResultKpiCards from '../components/result/ResultKpiCards.jsx'
import ResultViewModal from '../components/result/ResultViewModal.jsx'

import { CLASSES, ACADEMIC_YEARS, SEMESTERS } from '../data/referenceData.js'
import {
  letterGrade,
  gradeVariant,
  resultStatus,
  resultStatusVariant,
} from '../utils/grading.js'

/*
 * Academic Result (UI-polish spec §5).
 *
 *   - No breadcrumb.
 *   - No Active/Inactive tabs — this page has no status concept.
 *   - Row-level Print opens the transcript modal and auto-prints it.
 *   - Export Transcripts prints the grid (KPIs + table), not the whole page.
 *   - Page size 10/50/100.
 */

const COLUMNS = {
  nis: { label: 'NIS', sortable: true, align: 'left' },
  name: { label: 'Student Name', sortable: true, align: 'left' },
  cls: { label: 'Class', sortable: true, align: 'left' },
  subjects: { label: 'Total Subjects', sortable: false, align: 'left' },
  avg: { label: 'Average Score', sortable: true, align: 'right' },
  grade: { label: 'Overall Grade', sortable: true, align: 'center' },
  status: { label: 'Result Status', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['nis', 'name', 'cls', 'subjects', 'avg', 'grade', 'status']
const COLUMN_STORAGE_KEY = 'myacademic.results.columnOrder'

const SORTABLE = {
  nis: (a, b) => Number(a.nis) - Number(b.nis),
  name: (a, b) => a.name.localeCompare(b.name),
  cls: (a, b) => a.cls.localeCompare(b.cls),
  avg: (a, b) => a.avg - b.avg,
  grade: (a, b) => letterGrade(a.avg).localeCompare(letterGrade(b.avg)),
  status: (a, b) => resultStatus(a.avg).localeCompare(resultStatus(b.avg)),
}

/* Print helpers — add a body class, trigger the browser print dialog,
   remove the class. The class drives the @media print rules in theme.css. */
function printArea(mode, onDone) {
  document.body.classList.add(mode)
  window.print()
  document.body.classList.remove(mode)
  if (onDone) onDone()
}

export default function AcademicResultListPage() {
  const { students, rosters } = useData()
  const { showToast } = useToast()
  const { currentUser, isAdmin } = useAuth()

  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('2026/2027')
  const [semesterFilter, setSemesterFilter] = useState(SEMESTERS[0])
  const [clsFilter, setClsFilter] = useState('All Classes')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'nis', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [viewStudent, setViewStudent] = useState(null)
  const [autoPrint, setAutoPrint] = useState(false)

  const scoped = useMemo(() => {
    if (isAdmin) return students
    const myClasses = new Set(
      rosters.filter((r) => r.teacher === currentUser.name).map((r) => r.cls),
    )
    return students.filter((s) => myClasses.has(s.cls))
  }, [students, rosters, isAdmin, currentUser])

  const visible = useMemo(() => scoped.filter((s) => s.IsDelete === 0), [scoped])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return visible.filter((s) => {
      const nameMatch = !q || s.name.toLowerCase().includes(q) || s.nis.includes(q)
      const clsMatch = clsFilter === 'All Classes' || s.cls === clsFilter
      const statusMatch =
        statusFilter === 'All Status' || resultStatus(s.avg) === statusFilter
      return nameMatch && clsMatch && statusMatch
    })
  }, [visible, search, clsFilter, statusFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${search}|${clsFilter}|${statusFilter}|${isAdmin}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
  }

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' },
    )
    setPage(1)
  }

  const handlePageSizeChange = (next) => {
    setPageSize(next)
    setPage(1)
  }

  const handleRefresh = () => showToast('List refreshed')

  const handleDownloadSummary = () => showToast('Summary downloaded (mock)')

  /* Export prints the KPI + table section, not the entire page */
  const handleExportTranscripts = () => {
    printArea('printing-table')
  }

  /* Row print opens the modal and triggers its auto-print */
  const handleRowPrint = (student) => {
    setViewStudent(student)
    setAutoPrint(true)
  }

  const handleCloseModal = () => {
    setViewStudent(null)
    setAutoPrint(false)
  }

  const renderCell = (key, s, index) => {
    switch (key) {
      case 'nis':
        return (
          <Box sx={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.nis}</Box>
        )
      case 'name':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar name={s.name} index={index} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{s.name}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {s.name.split(' ')[0].toLowerCase()}@student.sch.id
              </Typography>
            </Box>
          </Box>
        )
      case 'cls':
        return <Box sx={{ fontSize: 14 }}>{s.cls}</Box>
      case 'subjects':
        return <StatusBadge variant="blue">7 Subjects</StatusBadge>
      case 'avg': {
        const color =
          s.avg < 75 ? 'error.main' : s.avg >= 90 ? 'primary.main' : 'text.primary'
        return (
          <Box className="num" sx={{ fontWeight: 600, color, textAlign: 'right' }}>
            {s.avg.toFixed(1)}
          </Box>
        )
      }
      case 'grade':
        return (
          <StatusBadge variant={gradeVariant(s.avg)}>{letterGrade(s.avg)}</StatusBadge>
        )
      case 'status':
        return (
          <StatusBadge variant={resultStatusVariant(s.avg)}>
            {resultStatus(s.avg)}
          </StatusBadge>
        )
      default:
        return null
    }
  }

  const headerCellSx = {
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

  const totalColumns = columnOrder.length + 1

  return (
    <>
      <PageHeader
        title="Academic Result"
        subtitle={
          isAdmin
            ? 'Directory and cumulative grade ledger for all registered students across classes'
            : 'Your students — cumulative grade ledger'
        }
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleDownloadSummary}
              startIcon={<Icon name="download" size={18} />}
              sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': { backgroundColor: 'surfaceLow', borderColor: 'divider' },
              }}
            >
              Download Summary
            </Button>
            <Button
              variant="contained"
              onClick={handleExportTranscripts}
              startIcon={<Icon name="print" size={18} />}
            >
              Export Transcripts
            </Button>
          </Stack>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search student by name or NIS..."
        onRefresh={handleRefresh}
        filters={[
          { key: 'year', label: 'Year', value: yearFilter, onChange: setYearFilter, options: ACADEMIC_YEARS },
          { key: 'sem', label: 'Semester', value: semesterFilter, onChange: setSemesterFilter, options: SEMESTERS },
          { key: 'cls', label: 'Class', value: clsFilter, onChange: setClsFilter, options: ['All Classes', ...CLASSES] },
          { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: ['All Status', 'Lulus / Pass', 'Remedial Needed'] },
        ]}
      />

      <Box className="print-area">
        <ResultKpiCards students={filtered} />

        <Card sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <SortableTableHead
                pinnedFirst={null}
                pinnedLast={
                  <TableCell sx={{ ...headerCellSx, textAlign: 'right' }}>
                    Actions
                  </TableCell>
                }
                columnOrder={columnOrder}
                onReorder={setColumnOrder}
                columns={COLUMNS}
                sortKey={sort.key}
                sortDir={sort.dir}
                onSort={handleSort}
                headerSx={headerCellSx}
              />
              <TableBody>
                {paginated.length > 0 ? (
                  paginated.map((s, index) => (
                    <TableRow
                      key={s.nis}
                      hover
                      onClick={() => setViewStudent(s)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, s, index)}
                        </TableCell>
                      ))}
                      <TableCell
                        align="right"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          onClick={() => setViewStudent(s)}
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            textTransform: 'none',
                            minWidth: 0,
                            p: 0.5,
                            '&:hover': {
                              backgroundColor: 'transparent',
                              color: 'primary.light',
                            },
                          }}
                          startIcon={<Icon name="visibility" size={18} />}
                        >
                          View
                        </Button>
                        <IconButton
                          size="small"
                          aria-label="Print"
                          onClick={() => handleRowPrint(s)}
                          sx={{ color: 'text.secondary', ml: 0.5 }}
                        >
                          <Icon name="print" size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyRow colSpan={totalColumns}>
                    {isAdmin
                      ? 'No results match the current filter'
                      : 'No students in your classes'}
                  </EmptyRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="no-print">
            <Pagination
              items={filtered}
              perPage={pageSize}
              current={page}
              onChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </Card>
      </Box>

      {viewStudent ? (
        <ResultViewModal
          student={viewStudent}
          onClose={handleCloseModal}
          autoPrint={autoPrint}
        />
      ) : null}
    </>
  )
}