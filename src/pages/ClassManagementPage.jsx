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
import ClassFormModal from '../components/classes/ClassFormModal.jsx'
import ClassViewModal from '../components/classes/ClassViewModal.jsx'
import { activeStatusLabel, activeStatusVariant } from '../data/referenceData.js'
import { CLASS_CATEGORIES } from '../data/classes.js'

/*
 * Class Management (Batch 1).
 *
 * Full CRUD over the class register. Mirrors the Academic Master page exactly:
 * same header / tabs / bulk bar / filter bar / sortable table / pagination /
 * modals. Category is restricted to MIPA or IIS.
 */

const COLUMNS = {
  cls: { label: 'Class', sortable: true, align: 'left' },
  category: { label: 'Category', sortable: true, align: 'left' },
  room: { label: 'Room', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
  updated: { label: 'Updated', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['cls', 'category', 'room', 'IsActive', 'updated']
const COLUMN_STORAGE_KEY = 'myacademic.classes.columnOrder'

const SORTABLE = {
  cls: (a, b) => a.cls.localeCompare(b.cls),
  category: (a, b) => a.category.localeCompare(b.category),
  room: (a, b) => a.room.localeCompare(b.room),
  IsActive: (a, b) => a.IsActive - b.IsActive,
  updated: (a, b) => a.updated.localeCompare(b.updated),
}

export default function ClassManagementPage() {
  const {
    classes,
    deleteClass,
    bulkSetClassStatus,
    bulkDeleteClasses,
  } = useData()
  const { showToast, showConfirmation } = useToast()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'cls', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  const tabCounts = useMemo(() => {
    const visible = classes.filter((c) => c.IsDelete === 0)
    return {
      active: visible.filter((c) => c.IsActive === 1).length,
      inactive: visible.filter((c) => c.IsActive === 0).length,
    }
  }, [classes])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return classes.filter((c) => c.IsDelete === 0 && c.IsActive === target)
  }, [classes, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tabRows.filter((c) => {
      const catMatch =
        categoryFilter === 'All Categories' || c.category === categoryFilter
      const searchMatch =
        !q ||
        c.cls.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      return catMatch && searchMatch
    })
  }, [tabRows, search, categoryFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}|${categoryFilter}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((c) => selected.has(c.id))
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
    else setSelected(new Set(filtered.map((c) => c.id)))
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
  const openEdit = (cls) => setModal({ type: 'edit', cls })
  const openView = (cls) => setModal({ type: 'view', cls })
  const closeModal = () => setModal(null)

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  const handleDelete = async (cls) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Delete "${cls.cls}"? It will be hidden from both tabs.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteClass(cls.id)
      showToast('Class deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(cls.id)
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
        text: `Deactivate ${count} class${count === 1 ? '' : 'es'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetClassStatus(ids, 0)
        showToast(`${count} class${count === 1 ? '' : 'es'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} class${count === 1 ? '' : 'es'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetClassStatus(ids, 1)
        showToast(`${count} class${count === 1 ? '' : 'es'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} class${count === 1 ? '' : 'es'}? They will be hidden from both tabs.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteClasses(ids)
        showToast(`${count} class${count === 1 ? '' : 'es'} deleted`)
        setSelected(new Set())
      }
    }
  }

  const renderCell = (key, c) => {
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
                backgroundColor:
                  c.category === 'MIPA' ? 'rgba(252, 231, 243, 1)' : 'surfaceHigh',
                color: c.category === 'MIPA' ? 'primary.main' : 'secondary.main',
                flexShrink: 0,
              }}
            >
              <Icon name="class" size={18} />
            </Box>
            <Box sx={{ fontWeight: 600 }}>{c.cls}</Box>
          </Box>
        )
      case 'category':
        return (
          <StatusBadge variant={c.category === 'MIPA' ? 'pink' : 'blue'}>
            {c.category}
          </StatusBadge>
        )
      case 'room':
        return <Box sx={{ color: 'text.secondary' }}>{c.room}</Box>
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(c)}>
            {activeStatusLabel(c)}
          </StatusBadge>
        )
      case 'updated':
        return <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{c.updated}</Box>
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
        title="Class Management"
        subtitle="Manage classes, categories and assigned rooms"
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
        searchPlaceholder="Search by class, category or room..."
        onRefresh={handleRefresh}
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: ['All Categories', ...CLASS_CATEGORIES],
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
                paginated.map((c) => {
                  const isSelected = selected.has(c.id)
                  return (
                    <TableRow
                      key={c.id}
                      hover
                      selected={isSelected}
                      onClick={() => openView(c)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => toggleRow(c.id)}
                        />
                      </TableCell>
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, c)}
                        </TableCell>
                      ))}
                      <TableCell
                        align="right"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          size="small"
                          onClick={() => openEdit(c)}
                          aria-label="Edit"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="edit" size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(c)}
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
                    ? 'No active classes found'
                    : 'No inactive classes found'}
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
        <ClassFormModal cls={null} onClose={closeModal} />
      )}
      {modal?.type === 'edit' && (
        <ClassFormModal cls={modal.cls} onClose={closeModal} />
      )}
      {modal?.type === 'view' && (
        <ClassViewModal cls={modal.cls} onClose={closeModal} />
      )}
    </>
  )
}