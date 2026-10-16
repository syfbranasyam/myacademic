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
import { CrudTabs, BulkActionBar, SortableTableHead } from '../components/crud'
import AssignmentFormModal from '../components/teaching/AssignmentFormModal.jsx'
import AssignmentViewModal from '../components/teaching/AssignmentViewModal.jsx'
import {
  TEACHERS,
  teacherNip,
  subjectIcon,
  shortSemester,
  activeStatusLabel,
  activeStatusVariant,
} from '../data/referenceData.js'

/*
 * Teaching Assignment page.
 *
 * Integration pass: the Academic Year, Semester, and Class filters read from
 * the derived option sets on DataContext — which mirror the records in
 * Academic Period Management and Class Management — instead of the legacy
 * static constants. The "All Semesters" / "All Classes" / "All Teachers"
 * sentinels are preserved.
 */

const COLUMNS = {
  teacher: { label: 'Teacher', sortable: true, align: 'left' },
  cls: { label: 'Class', sortable: true, align: 'left' },
  subject: { label: 'Subject', sortable: true, align: 'left' },
  semester: { label: 'Semester', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['teacher', 'cls', 'subject', 'semester', 'IsActive']
const COLUMN_STORAGE_KEY = 'myacademic.assignments.columnOrder'

const SORTABLE = {
  teacher: (a, b) => a.teacher.localeCompare(b.teacher),
  cls: (a, b) => a.cls.localeCompare(b.cls),
  subject: (a, b) => a.subject.localeCompare(b.subject),
  semester: (a, b) => a.semester.localeCompare(b.semester),
  IsActive: (a, b) => a.IsActive - b.IsActive,
}

export default function TeachingAssignmentPage() {
  const {
    assignments,
    deleteAssignment,
    bulkSetAssignmentStatus,
    bulkDeleteAssignments,
    availableClasses,
    availableYears,
    availableSemesters,
  } = useData()
  const { showToast, showConfirmation } = useToast()
  const { currentUser, isAdmin } = useAuth()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('2024/2025')
  const [semesterFilter, setSemesterFilter] = useState('Ganjil (Odd)')
  const [clsFilter, setClsFilter] = useState('All Classes')
  const [teacherFilter, setTeacherFilter] = useState('All Teachers')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'teacher', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  const scoped = useMemo(() => {
    if (isAdmin) return assignments
    return assignments.filter((a) => a.teacher === currentUser.name)
  }, [assignments, isAdmin, currentUser])

  const tabCounts = useMemo(() => {
    const visible = scoped.filter((a) => a.IsDelete === 0)
    return {
      active: visible.filter((a) => a.IsActive === 1).length,
      inactive: visible.filter((a) => a.IsActive === 0).length,
    }
  }, [scoped])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return scoped.filter((a) => a.IsDelete === 0 && a.IsActive === target)
  }, [scoped, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tabRows.filter((a) => {
      const yearMatch = a.year === yearFilter
      const semMatch =
        semesterFilter === 'All Semesters' || a.semester === semesterFilter
      const clsMatch = clsFilter === 'All Classes' || a.cls === clsFilter
      const teacherMatch =
        teacherFilter === 'All Teachers' || a.teacher === teacherFilter
      const searchMatch =
        !q ||
        a.teacher.toLowerCase().includes(q) ||
        a.cls.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q)
      return yearMatch && semMatch && clsMatch && teacherMatch && searchMatch
    })
  }, [tabRows, search, yearFilter, semesterFilter, clsFilter, teacherFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}|${yearFilter}|${semesterFilter}|${clsFilter}|${teacherFilter}|${isAdmin}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((a) => selected.has(a.id))
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
    else setSelected(new Set(filtered.map((a) => a.id)))
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

  const openAdd = () => setModal({ type: 'add' })
  const openEdit = (a) => setModal({ type: 'edit', assignment: a })
  const openView = (a) => setModal({ type: 'view', assignment: a })
  const closeModal = () => setModal(null)

  const handleAssignmentCreated = (created) => {
    if (created?.year) setYearFilter(created.year)
    if (created?.semester) setSemesterFilter(created.semester)
  }

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  const handleDelete = async (assignment) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Remove ${assignment.teacher}'s assignment for ${assignment.cls} — ${assignment.subject}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteAssignment(assignment.id)
      showToast('Assignment deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(assignment.id)
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
        text: `Deactivate ${count} assignment${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetAssignmentStatus(ids, 0)
        showToast(`${count} assignment${count === 1 ? '' : 's'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} assignment${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetAssignmentStatus(ids, 1)
        showToast(`${count} assignment${count === 1 ? '' : 's'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} assignment${count === 1 ? '' : 's'}? They will be hidden from both tabs.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteAssignments(ids)
        showToast(`${count} assignment${count === 1 ? '' : 's'} deleted`)
        setSelected(new Set())
      }
    }
  }

  const renderCell = (key, a) => {
    switch (key) {
      case 'teacher':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar name={a.teacher} index={a.id} />
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {a.teacher}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                NIP: {teacherNip(a.teacher)}
              </Typography>
            </Box>
          </Box>
        )
      case 'cls':
        return <StatusBadge variant="blue">{a.cls}</StatusBadge>
      case 'subject':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon
              name={subjectIcon(a.subject)}
              size={20}
              sx={{ color: 'primary.main' }}
            />
            <Typography sx={{ fontSize: 14 }}>{a.subject}</Typography>
          </Box>
        )
      case 'semester':
        return <StatusBadge variant="pink">{shortSemester(a.semester)}</StatusBadge>
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(a)}>
            {activeStatusLabel(a)}
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

  const totalColumns = columnOrder.length + (isAdmin ? 1 : 0) + (isAdmin ? 1 : 0)

  return (
    <>
      <PageHeader
        title="Teaching Assignment"
        subtitle={
          isAdmin
            ? 'Assign teachers to classes and subjects'
            : 'Your class and subject allocations'
        }
        actions={
          isAdmin ? (
            <Button
              variant="contained"
              onClick={openAdd}
              startIcon={<Icon name="add" size={18} />}
            >
              Create Assignment
            </Button>
          ) : null
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
        searchPlaceholder="Search teacher, class or subject..."
        onRefresh={handleRefresh}
        filters={[
          {
            key: 'year',
            label: 'Academic Year',
            value: yearFilter,
            onChange: setYearFilter,
            options: availableYears,
          },
          {
            key: 'sem',
            label: 'Semester',
            value: semesterFilter,
            onChange: setSemesterFilter,
            options: [...availableSemesters, 'All Semesters'],
          },
          {
            key: 'cls',
            label: 'Class',
            value: clsFilter,
            onChange: setClsFilter,
            options: ['All Classes', ...availableClasses.map((c) => c.cls)],
          },
          ...(isAdmin
            ? [
                {
                  key: 'teacher',
                  label: 'Teacher',
                  value: teacherFilter,
                  onChange: setTeacherFilter,
                  options: ['All Teachers', ...TEACHERS],
                },
              ]
            : []),
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
                isAdmin ? (
                  <TableCell sx={{ ...headerCellSx, textAlign: 'right' }}>
                    Action
                  </TableCell>
                ) : null
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
                paginated.map((a) => {
                  const isSelected = selected.has(a.id)
                  return (
                    <TableRow
                      key={a.id}
                      hover
                      selected={isSelected}
                      onClick={() => openView(a)}
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
                            onChange={() => toggleRow(a.id)}
                          />
                        </TableCell>
                      ) : null}
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, a)}
                        </TableCell>
                      ))}
                      {isAdmin ? (
                        <TableCell
                          align="right"
                          sx={{ whiteSpace: 'nowrap' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconButton
                            size="small"
                            onClick={() => openEdit(a)}
                            aria-label="Edit"
                            sx={{ color: 'text.secondary' }}
                          >
                            <Icon name="edit" size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(a)}
                            aria-label="Delete"
                            sx={{ color: 'text.secondary' }}
                          >
                            <Icon name="delete" size={18} />
                          </IconButton>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  )
                })
              ) : (
                <EmptyRow colSpan={totalColumns}>
                  {isAdmin
                    ? activeTab === 'Active'
                      ? 'No active assignments for this filter'
                      : 'No inactive assignments for this filter'
                    : 'No assignments found for your account'}
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

      {isAdmin && modal?.type === 'add' && (
        <AssignmentFormModal
          assignment={null}
          onClose={closeModal}
          onCreated={handleAssignmentCreated}
        />
      )}
      {isAdmin && modal?.type === 'edit' && (
        <AssignmentFormModal
          assignment={modal.assignment}
          onClose={closeModal}
        />
      )}
      {modal?.type === 'view' && (
        <AssignmentViewModal
          assignment={modal.assignment}
          onClose={closeModal}
        />
      )}
    </>
  )
}