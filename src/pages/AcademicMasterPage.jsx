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
import MasterFormModal from '../components/master/MasterFormModal.jsx'
import MasterViewModal from '../components/master/MasterViewModal.jsx'
import { activeStatusLabel, activeStatusVariant } from '../data/referenceData.js'

const COLUMNS = {
  code: { label: 'Code', sortable: true, align: 'left' },
  name: { label: 'Name', sortable: true, align: 'left' },
  category: { label: 'Category', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
  updated: { label: 'Updated', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['code', 'name', 'category', 'IsActive', 'updated']
const COLUMN_STORAGE_KEY = 'myacademic.master.columnOrder'

const SORTABLE = {
  code: (a, b) => a.code.localeCompare(b.code),
  name: (a, b) => a.name.localeCompare(b.name),
  category: (a, b) => a.category.localeCompare(b.category),
  IsActive: (a, b) => a.IsActive - b.IsActive,
  updated: (a, b) => a.updated.localeCompare(b.updated),
}

export default function AcademicMasterPage() {
  const {
    masterItems,
    deleteMasterItem,
    bulkSetMasterStatus,
    bulkDeleteMaster,
  } = useData()
  const { showToast, showConfirmation } = useToast()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'code', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  const tabCounts = useMemo(() => {
    const visible = masterItems.filter((m) => m.IsDelete === 0)
    return {
      active: visible.filter((m) => m.IsActive === 1).length,
      inactive: visible.filter((m) => m.IsActive === 0).length,
    }
  }, [masterItems])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return masterItems.filter((m) => m.IsDelete === 0 && m.IsActive === target)
  }, [masterItems, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return tabRows
    return tabRows.filter(
      (m) => m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q),
    )
  }, [tabRows, search])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((m) => selected.has(m.code))
  const someVisibleSelected = selected.size > 0 && !allVisibleSelected

  const toggleRow = (code) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const toggleAll = () => {
    if (allVisibleSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map((m) => m.code)))
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
  const openEdit = (master) => setModal({ type: 'edit', master })
  const openView = (master) => setModal({ type: 'view', master })
  const closeModal = () => setModal(null)

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  const handleDelete = async (master) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Delete "${master.name}"? It will be hidden from both tabs.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteMasterItem(master.code)
      showToast('Master data deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(master.code)
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
    const codes = Array.from(selected)
    if (codes.length === 0) return
    const count = codes.length

    if (key === 'inactive') {
      const result = await showConfirmation({
        title: 'Deactivate selected?',
        text: `Deactivate ${count} master item${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetMasterStatus(codes, 0)
        showToast(`${count} item${count === 1 ? '' : 's'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} master item${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetMasterStatus(codes, 1)
        showToast(`${count} item${count === 1 ? '' : 's'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} master item${count === 1 ? '' : 's'}? They will be hidden from both tabs.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteMaster(codes)
        showToast(`${count} item${count === 1 ? '' : 's'} deleted`)
        setSelected(new Set())
      }
    }
  }

  const renderCell = (key, m) => {
    switch (key) {
      case 'code':
        return (
          <Box
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            {m.code}
          </Box>
        )
      case 'name':
        return <Box sx={{ fontWeight: 600 }}>{m.name}</Box>
      case 'category':
        return <Box sx={{ color: 'text.secondary' }}>{m.category}</Box>
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(m)}>
            {activeStatusLabel(m)}
          </StatusBadge>
        )
      case 'updated':
        return <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{m.updated}</Box>
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
        title="Academic Master"
        subtitle="Manage core academic master data"
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
        searchPlaceholder="Search by code or name..."
        onRefresh={handleRefresh}
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
                paginated.map((m) => {
                  const isSelected = selected.has(m.code)
                  return (
                    <TableRow
                      key={m.code}
                      hover
                      selected={isSelected}
                      onClick={() => openView(m)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => toggleRow(m.code)}
                        />
                      </TableCell>
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, m)}
                        </TableCell>
                      ))}
                      <TableCell
                        align="right"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          size="small"
                          onClick={() => openEdit(m)}
                          aria-label="Edit"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="edit" size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(m)}
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
                    ? 'No active master data found'
                    : 'No inactive master data found'}
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
        <MasterFormModal master={null} onClose={closeModal} />
      )}
      {modal?.type === 'edit' && (
        <MasterFormModal master={modal.master} onClose={closeModal} />
      )}
      {modal?.type === 'view' && (
        <MasterViewModal master={modal.master} onClose={closeModal} />
      )}
    </>
  )
}