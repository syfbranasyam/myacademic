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
import StudentFormModal from '../components/students/StudentFormModal.jsx'
import StudentViewModal from '../components/students/StudentViewModal.jsx'
import { activeStatusLabel, activeStatusVariant } from '../data/referenceData.js'

/*
 * Students page.
 *
 * Integration pass: the Class filter reads from `availableClasses` (the
 * Class Management register) instead of the legacy CLASSES constant, so
 * creating, renaming, or deleting a class is reflected here automatically.
 * The "Class" placeholder that acts as the "all classes" sentinel is
 * preserved.
 */

const COLUMNS = {
  nis: { label: 'NIS', sortable: true, align: 'left' },
  name: { label: 'Student Name', sortable: true, align: 'left' },
  cls: { label: 'Class', sortable: true, align: 'left' },
  gender: { label: 'Gender', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['nis', 'name', 'cls', 'gender', 'IsActive']
const COLUMN_STORAGE_KEY = 'myacademic.students.columnOrder'

const SORTABLE = {
  nis: (a, b) => Number(a.nis) - Number(b.nis),
  name: (a, b) => a.name.localeCompare(b.name),
  cls: (a, b) => a.cls.localeCompare(b.cls),
  gender: (a, b) => a.gender.localeCompare(b.gender),
  IsActive: (a, b) => a.IsActive - b.IsActive,
}

export default function StudentsPage() {
  const {
    students,
    deleteStudent,
    bulkSetStudentStatus,
    bulkDeleteStudents,
    availableClasses,
  } = useData()
  const { showToast, showConfirmation } = useToast()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [clsFilter, setClsFilter] = useState('Class')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'nis', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  /* ---------------------------------------------------------------- *
   * Derived rows
   * ---------------------------------------------------------------- */

  const tabCounts = useMemo(() => {
    const visible = students.filter((s) => s.IsDelete === 0)
    return {
      active: visible.filter((s) => s.IsActive === 1).length,
      inactive: visible.filter((s) => s.IsActive === 0).length,
    }
  }, [students])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return students.filter((s) => s.IsDelete === 0 && s.IsActive === target)
  }, [students, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tabRows.filter((s) => {
      const nameMatch = !q || s.name.toLowerCase().includes(q) || s.nis.includes(q)
      const clsMatch = clsFilter === 'Class' || s.cls === clsFilter
      return nameMatch && clsMatch
    })
  }, [tabRows, search, clsFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}|${clsFilter}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  /* ---------------------------------------------------------------- *
   * Selection
   * ---------------------------------------------------------------- */

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((s) => selected.has(s.nis))
  const someVisibleSelected = selected.size > 0 && !allVisibleSelected

  const toggleRow = (nis) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(nis)) next.delete(nis)
      else next.add(nis)
      return next
    })
  }

  const toggleAll = () => {
    if (allVisibleSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map((s) => s.nis)))
  }

  /* ---------------------------------------------------------------- *
   * Sorting
   * ---------------------------------------------------------------- */

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' },
    )
    setPage(1)
  }

  /* ---------------------------------------------------------------- *
   * Page size + refresh
   * ---------------------------------------------------------------- */

  const handlePageSizeChange = (next) => {
    setPageSize(next)
    setPage(1)
  }

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  /* ---------------------------------------------------------------- *
   * Modals
   * ---------------------------------------------------------------- */

  const openAdd = () => setModal({ type: 'add' })
  const openEdit = (student) => setModal({ type: 'edit', student })
  const openView = (student) => setModal({ type: 'view', student })
  const closeModal = () => setModal(null)

  /* ---------------------------------------------------------------- *
   * Row actions
   * ---------------------------------------------------------------- */

  const handleDelete = async (student) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Remove ${student.name} permanently? The record will be hidden from both tabs.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteStudent(student.nis)
      showToast('Student deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(student.nis)
        return next
      })
    }
  }

  /* ---------------------------------------------------------------- *
   * Bulk actions
   * ---------------------------------------------------------------- */

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
        text: `Deactivate ${count} student${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetStudentStatus(ids, 0)
        showToast(`${count} student${count === 1 ? '' : 's'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} student${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetStudentStatus(ids, 1)
        showToast(`${count} student${count === 1 ? '' : 's'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} student${count === 1 ? '' : 's'}? They will be hidden from both tabs.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteStudents(ids)
        showToast(`${count} student${count === 1 ? '' : 's'} deleted`)
        setSelected(new Set())
      }
    }
  }

  /* ---------------------------------------------------------------- *
   * Cell renderer
   * ---------------------------------------------------------------- */

  const renderCell = (key, s, index) => {
    switch (key) {
      case 'nis':
        return (
          <Box sx={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.nis}</Box>
        )
      case 'name':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar name={s.name} index={index} />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{s.name}</Typography>
          </Box>
        )
      case 'cls':
        return <Box sx={{ color: 'text.secondary' }}>{s.cls}</Box>
      case 'gender':
        return <Box sx={{ color: 'text.secondary' }}>{s.gender}</Box>
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(s)}>
            {activeStatusLabel(s)}
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

  const totalColumns = columnOrder.length + 2

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage student information"
        actions={
          <Button
            variant="contained"
            onClick={openAdd}
            startIcon={<Icon name="add" size={18} />}
          >
            Add Student
          </Button>
        }
      />

      <CrudTabs value={activeTab} onChange={setActiveTab} counts={tabCounts} />

      <BulkActionBar
        selectedCount={selected.size}
        actions={bulkActions}
        onAction={handleBulkAction}
        onClear={() => setSelected(new Set())}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search student..."
        onRefresh={handleRefresh}
        filters={[
          {
            key: 'cls',
            label: 'Class',
            value: clsFilter,
            onChange: setClsFilter,
            options: ['Class', ...availableClasses.map((c) => c.cls)],
          },
        ]}
      />

      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <SortableTableHead
              pinnedFirst={
                <TableCell padding="checkbox" sx={headerCellSx}>
                  <Checkbox
                    size="small"
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    onChange={toggleAll}
                    disabled={filtered.length === 0}
                  />
                </TableCell>
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
                paginated.map((s, index) => {
                  const isSelected = selected.has(s.nis)
                  return (
                    <TableRow
                      key={s.nis}
                      hover
                      selected={isSelected}
                      onClick={() => openView(s)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => toggleRow(s.nis)}
                        />
                      </TableCell>
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
                        <IconButton
                          size="small"
                          onClick={() => openEdit(s)}
                          aria-label="Edit"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="edit" size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(s)}
                          aria-label="Delete"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="delete" size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <EmptyRow colSpan={totalColumns}>
                  {activeTab === 'Active'
                    ? 'No active students found'
                    : 'No inactive students found'}
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

      {modal?.type === 'add' && (
        <StudentFormModal student={null} onClose={closeModal} />
      )}
      {modal?.type === 'edit' && (
        <StudentFormModal student={modal.student} onClose={closeModal} />
      )}
      {modal?.type === 'view' && (
        <StudentViewModal student={modal.student} onClose={closeModal} />
      )}
    </>
  )
}