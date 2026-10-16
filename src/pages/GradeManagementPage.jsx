import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usePersistedState } from '../hooks/usePersistedState.js'

import PageHeader from '../components/layout/PageHeader.jsx'
import { FilterBar, Pagination, EmptyRow, StatusBadge, Icon } from '../components/ui'
import { CrudTabs, BulkActionBar, SortableTableHead } from '../components/crud'
import GenerateGradeModal from '../components/grades/GenerateGradeModal.jsx'
import GradeEditModal from '../components/grades/GradeEditModal.jsx'
import RosterViewModal from '../components/grades/RosterViewModal.jsx'
import {
  GRADE_STATUSES,
  CLASS_FACTS,
  teacherNip,
  subjectIcon,
  activeStatusLabel,
  activeStatusVariant,
} from '../data/referenceData.js'

/*
 * Grade Management page.
 *
 * Integration pass: the Year, Semester, Class, and Subject filters read from
 * the derived option sets on DataContext, so Create / Update / Delete in
 * Academic Period Management, Class Management, and Academic Master is
 * reflected here automatically.
 *
 * The default filter values ('2026/2027', 'Ganjil (Odd)') remain the same
 * literals as before — they identify the current year and semester, not a
 * hardcoded list of options.
 */

const COLUMNS = {
  cls: { label: 'Class', sortable: true, align: 'left' },
  subject: { label: 'Subject', sortable: true, align: 'left' },
  teacher: { label: 'Teacher', sortable: true, align: 'left' },
  students: { label: 'Students', sortable: false, align: 'left' },
  status: { label: 'Grading', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['cls', 'subject', 'teacher', 'students', 'status', 'IsActive']
const COLUMN_STORAGE_KEY = 'myacademic.rosters.columnOrder'

const SORTABLE = {
  cls: (a, b) => a.cls.localeCompare(b.cls),
  subject: (a, b) => a.subject.localeCompare(b.subject),
  teacher: (a, b) => a.teacher.localeCompare(b.teacher),
  status: (a, b) => a.status.localeCompare(b.status),
  IsActive: (a, b) => a.IsActive - b.IsActive,
}

export default function GradeManagementPage() {
  const {
    rosters,
    deleteRoster,
    bulkSetRosterStatus,
    bulkDeleteRosters,
    availableClasses,
    availableSubjects,
    availableYears,
    availableSemesters,
  } = useData()
  const { showToast, showConfirmation } = useToast()
  const { currentUser, isAdmin } = useAuth()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('2026/2027')
  const [semesterFilter, setSemesterFilter] = useState('Ganjil (Odd)')
  const [clsFilter, setClsFilter] = useState('All Classes')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'cls', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  const scoped = useMemo(() => {
    if (isAdmin) return rosters
    return rosters.filter((r) => r.teacher === currentUser.name)
  }, [rosters, isAdmin, currentUser])

  const tabCounts = useMemo(() => {
    const visible = scoped.filter((r) => r.IsDelete === 0)
    return {
      active: visible.filter((r) => r.IsActive === 1).length,
      inactive: visible.filter((r) => r.IsActive === 0).length,
    }
  }, [scoped])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return scoped.filter((r) => r.IsDelete === 0 && r.IsActive === target)
  }, [scoped, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tabRows.filter((r) => {
      const yearMatch = r.year === yearFilter
      const semMatch = r.semester === semesterFilter
      const clsMatch = clsFilter === 'All Classes' || r.cls === clsFilter
      const subjectMatch =
        subjectFilter === 'All Subjects' || r.subject === subjectFilter
      const searchMatch =
        !q ||
        r.cls.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.teacher.toLowerCase().includes(q)
      return yearMatch && semMatch && clsMatch && subjectMatch && searchMatch
    })
  }, [tabRows, search, yearFilter, semesterFilter, clsFilter, subjectFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}|${yearFilter}|${semesterFilter}|${clsFilter}|${subjectFilter}|${isAdmin}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  const statusCounts = useMemo(
    () => ({
      [GRADE_STATUSES[0]]: scoped.filter(
        (r) => r.IsDelete === 0 && r.status === GRADE_STATUSES[0],
      ).length,
      [GRADE_STATUSES[1]]: scoped.filter(
        (r) => r.IsDelete === 0 && r.status === GRADE_STATUSES[1],
      ).length,
      [GRADE_STATUSES[2]]: scoped.filter(
        (r) => r.IsDelete === 0 && r.status === GRADE_STATUSES[2],
      ).length,
    }),
    [scoped],
  )

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id))
  const someVisibleSelected = selected.size > 0 && !allVisibleSelected

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (allVisibleSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map((r) => r.id)))
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

  const openGenerate = () => setModal({ type: 'generate' })
  const openEdit = (r) => setModal({ type: 'edit', roster: r })
  const openView = (r) => setModal({ type: 'view', roster: r })
  const closeModal = () => setModal(null)

  const handleGenerated = () => {
    setYearFilter('2026/2027')
    setSemesterFilter('Ganjil (Odd)')
  }

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  const handleDelete = async (roster) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Delete the ${roster.cls} — ${roster.subject} roster? Its scores will also be removed.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteRoster(roster.id)
      showToast('Roster deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(roster.id)
        return next
      })
    }
  }

  const bulkActions = useMemo(() => {
    if (activeTab === 'Active') {
      return [
        { key: 'inactive', label: 'Deactivate', icon: 'block', variant: 'primary' },
        { key: 'delete', label: 'Delete', icon: 'delete', variant: 'danger' },
      ]
    }
    return [
      { key: 'active', label: 'Activate', icon: 'check_circle', variant: 'success' },
      { key: 'delete', label: 'Delete', icon: 'delete', variant: 'danger' },
    ]
  }, [activeTab])

  const handleBulkAction = async (key) => {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    const count = ids.length

    if (key === 'inactive') {
      const result = await showConfirmation({
        title: 'Deactivate selected?',
        text: `Deactivate ${count} roster${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetRosterStatus(ids, 0)
        showToast(`${count} roster${count === 1 ? '' : 's'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} roster${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetRosterStatus(ids, 1)
        showToast(`${count} roster${count === 1 ? '' : 's'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} roster${count === 1 ? '' : 's'}? Their scores will also be removed.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteRosters(ids)
        showToast(`${count} roster${count === 1 ? '' : 's'} deleted`)
        setSelected(new Set())
      }
    }
  }

  const renderCell = (key, r) => {
    const facts = CLASS_FACTS[r.cls]
    switch (key) {
      case 'cls':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 12,
                backgroundColor:
                  r.cls === 'XI IPA 1' ? 'rgba(252, 231, 243, 1)' : 'surfaceHigh',
                color: r.cls === 'XI IPA 1' ? 'primary.main' : 'secondary.main',
                flexShrink: 0,
              }}
            >
              XI
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.cls}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {facts ? `${facts.track} • Room ${facts.room}` : ''}
              </Typography>
            </Box>
          </Box>
        )
      case 'subject':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon
              name={subjectIcon(r.subject)}
              size={20}
              sx={{ color: 'primary.main' }}
            />
            <Typography sx={{ fontSize: 14 }}>{r.subject}</Typography>
          </Box>
        )
      case 'teacher':
        return (
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.teacher}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              NIP: {teacherNip(r.teacher)}
            </Typography>
          </Box>
        )
      case 'students':
        return (
          <StatusBadge variant="gray">
            {facts ? `${facts.enrolled} Students` : '—'}
          </StatusBadge>
        )
      case 'status': {
        const variant =
          r.status === 'Complete'
            ? 'green'
            : r.status === 'In Progress'
              ? 'amber'
              : 'gray'
        return (
          <StatusBadge variant={variant} dot>
            {r.status}
          </StatusBadge>
        )
      }
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(r)}>
            {activeStatusLabel(r)}
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

  const totalColumns = columnOrder.length + (isAdmin ? 1 : 0) + 1

  return (
    <>
      <PageHeader
        title="Grade Management"
        subtitle={
          isAdmin
            ? 'Enter and manage grade scores per roster'
            : 'Your classes — enter and manage grade scores'
        }
        actions={
          <>
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}
            >
              {GRADE_STATUSES.map((status) => (
                <Card key={status} sx={{ px: 1.5, py: 1 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                    {status}:{' '}
                    <Box component="span" className="num">
                      {statusCounts[status] ?? 0}
                    </Box>
                  </Typography>
                </Card>
              ))}
            </Stack>
            {isAdmin ? (
              <Button
                variant="contained"
                onClick={openGenerate}
                startIcon={<Icon name="add" size={18} />}
              >
                Generate Roster
              </Button>
            ) : null}
          </>
        }
      />

      <CrudTabs value={activeTab} onChange={setActiveTab} counts={tabCounts} />

      {isAdmin ? (
        <BulkActionBar
          selectedCount={selected.size}
          actions={bulkActions}
          onAction={handleBulkAction}
          onClear={() => setSelected(new Set())}
        />
      ) : null}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search class, subject or teacher..."
        onRefresh={handleRefresh}
        filters={[
          {
            key: 'year',
            label: 'Year',
            value: yearFilter,
            onChange: setYearFilter,
            options: availableYears,
          },
          {
            key: 'sem',
            label: 'Semester',
            value: semesterFilter,
            onChange: setSemesterFilter,
            options: availableSemesters,
          },
          {
            key: 'cls',
            label: 'Class',
            value: clsFilter,
            onChange: setClsFilter,
            options: ['All Classes', ...availableClasses.map((c) => c.cls)],
          },
          {
            key: 'sub',
            label: 'Subject',
            value: subjectFilter,
            onChange: setSubjectFilter,
            options: ['All Subjects', ...availableSubjects.map((s) => s.name)],
          },
        ]}
      />

      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <SortableTableHead
              pinnedFirst={
                isAdmin ? (
                  <TableCell padding="checkbox" sx={headerCellSx}>
                    <Checkbox
                      size="small"
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected}
                      onChange={toggleAll}
                      disabled={filtered.length === 0}
                    />
                  </TableCell>
                ) : null
              }
              pinnedLast={
                <TableCell sx={{ ...headerCellSx, textAlign: 'right' }}>
                  Action
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
                paginated.map((r) => {
                  const isSelected = selected.has(r.id)
                  return (
                    <TableRow
                      key={r.id}
                      hover
                      selected={isSelected}
                      onClick={() => openView(r)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {isAdmin ? (
                        <TableCell
                          padding="checkbox"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            size="small"
                            checked={isSelected}
                            onChange={() => toggleRow(r.id)}
                          />
                        </TableCell>
                      ) : null}
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, r)}
                        </TableCell>
                      ))}
                      <TableCell
                        align="right"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          size="small"
                          onClick={() => openEdit(r)}
                          aria-label="Edit scores"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="edit" size={18} />
                        </IconButton>
                        {isAdmin ? (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(r)}
                            aria-label="Delete"
                            sx={{ color: 'text.secondary' }}
                          >
                            <Icon name="delete" size={18} />
                          </IconButton>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <EmptyRow colSpan={totalColumns}>
                  {isAdmin
                    ? activeTab === 'Active'
                      ? 'No active rosters for this filter'
                      : 'No inactive rosters for this filter'
                    : 'You have no active grading rosters'}
                </EmptyRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          items={filtered}
          perPage={pageSize}
          current={page}
          onChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>

      {isAdmin && modal?.type === 'generate' && (
        <GenerateGradeModal onClose={closeModal} onCreated={handleGenerated} />
      )}
      {modal?.type === 'edit' && (
        <GradeEditModal roster={modal.roster} onClose={closeModal} />
      )}
      {modal?.type === 'view' && (
        <RosterViewModal roster={modal.roster} onClose={closeModal} />
      )}
    </>
  )
}