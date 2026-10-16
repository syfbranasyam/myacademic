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
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { usePersistedState } from '../hooks/usePersistedState.js'

import PageHeader from '../components/layout/PageHeader.jsx'
import {
  FilterBar,
  Pagination,
  EmptyRow,
  StatusBadge,
  Icon,
} from '../components/ui'
import { CrudTabs, BulkActionBar, SortableTableHead } from '../components/crud'
import AcademicPeriodFormModal from '../components/periods/AcademicPeriodFormModal.jsx'
import AcademicPeriodViewModal from '../components/periods/AcademicPeriodViewModal.jsx'
import {
  activeStatusLabel,
  activeStatusVariant,
  shortSemester,
} from '../data/referenceData.js'
import { PERIOD_TYPES } from '../data/academicPeriods.js'

/*
 * Academic Period Management (Batch 2).
 *
 * Full CRUD over the academic period register. Mirrors the Academic Master
 * and Class Management pages exactly: same header / tabs / bulk bar / filter
 * bar / sortable table / pagination / modals.
 */

const COLUMNS = {
  year: { label: 'Year', sortable: true, align: 'left' },
  period: { label: 'Date Range', sortable: true, align: 'left' },
  semester: { label: 'Semester', sortable: true, align: 'left' },
  type: { label: 'Type', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['year', 'period', 'semester', 'type', 'IsActive']
const COLUMN_STORAGE_KEY = 'myacademic.periods.columnOrder'

const SORTABLE = {
  year: (a, b) => a.year.localeCompare(b.year),
  period: (a, b) => a.startDate.localeCompare(b.startDate),
  semester: (a, b) => a.semester.localeCompare(b.semester),
  type: (a, b) => a.type.localeCompare(b.type),
  IsActive: (a, b) => a.IsActive - b.IsActive,
}

function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AcademicPeriodPage() {
  const {
    academicPeriods,
    deleteAcademicPeriod,
    bulkSetAcademicPeriodStatus,
    bulkDeleteAcademicPeriods,
  } = useData()
  const { showToast, showConfirmation } = useToast()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'year', dir: 'desc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  const tabCounts = useMemo(() => {
    const visible = academicPeriods.filter((p) => p.IsDelete === 0)
    return {
      active: visible.filter((p) => p.IsActive === 1).length,
      inactive: visible.filter((p) => p.IsActive === 0).length,
    }
  }, [academicPeriods])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return academicPeriods.filter(
      (p) => p.IsDelete === 0 && p.IsActive === target,
    )
  }, [academicPeriods, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tabRows.filter((p) => {
      const typeMatch = typeFilter === 'All Types' || p.type === typeFilter
      const searchMatch =
        !q ||
        p.year.toLowerCase().includes(q) ||
        p.semester.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.startDate.includes(q) ||
        p.endDate.includes(q)
      return typeMatch && searchMatch
    })
  }, [tabRows, search, typeFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}|${typeFilter}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p.id))
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
    else setSelected(new Set(filtered.map((p) => p.id)))
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
  const openEdit = (period) => setModal({ type: 'edit', period })
  const openView = (period) => setModal({ type: 'view', period })
  const closeModal = () => setModal(null)

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  const handleDelete = async (period) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Delete ${period.year} — ${period.type}? It will be hidden from both tabs.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteAcademicPeriod(period.id)
      showToast('Academic period deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(period.id)
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
        text: `Deactivate ${count} period${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetAcademicPeriodStatus(ids, 0)
        showToast(`${count} period${count === 1 ? '' : 's'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} period${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetAcademicPeriodStatus(ids, 1)
        showToast(`${count} period${count === 1 ? '' : 's'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} period${count === 1 ? '' : 's'}? They will be hidden from both tabs.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteAcademicPeriods(ids)
        showToast(`${count} period${count === 1 ? '' : 's'} deleted`)
        setSelected(new Set())
      }
    }
  }

  const renderCell = (key, p) => {
    switch (key) {
      case 'year':
        return (
          <Box
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            {p.year}
          </Box>
        )
      case 'period':
        return (
          <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
            {formatDate(p.startDate)} — {formatDate(p.endDate)}
          </Box>
        )
      case 'semester':
        return (
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            {p.semester}
          </Typography>
        )
      case 'type':
        return (
          <StatusBadge variant={p.type === 'Ganjil' ? 'pink' : 'blue'}>
            {shortSemester(p.type)}
          </StatusBadge>
        )
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(p)}>
            {activeStatusLabel(p)}
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
        title="Academic Period"
        subtitle="Manage academic years, semesters, and period ranges"
        actions={
          <Button
            variant="contained"
            onClick={openAdd}
            startIcon={<Icon name="add" size={18} />}
          >
            Add New
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
        searchPlaceholder="Search by year, semester or type..."
        onRefresh={handleRefresh}
        filters={[
          {
            key: 'type',
            label: 'Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: ['All Types', ...PERIOD_TYPES],
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
                paginated.map((p) => {
                  const isSelected = selected.has(p.id)
                  return (
                    <TableRow
                      key={p.id}
                      hover
                      selected={isSelected}
                      onClick={() => openView(p)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => toggleRow(p.id)}
                        />
                      </TableCell>
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, p)}
                        </TableCell>
                      ))}
                      <TableCell
                        align="right"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          size="small"
                          onClick={() => openEdit(p)}
                          aria-label="Edit"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="edit" size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(p)}
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
                    ? 'No active academic periods found'
                    : 'No inactive academic periods found'}
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
        <AcademicPeriodFormModal period={null} onClose={closeModal} />
      )}
      {modal?.type === 'edit' && (
        <AcademicPeriodFormModal period={modal.period} onClose={closeModal} />
      )}
      {modal?.type === 'view' && (
        <AcademicPeriodViewModal period={modal.period} onClose={closeModal} />
      )}
    </>
  )
}