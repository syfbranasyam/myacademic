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
import GradeScaleFormModal from '../components/gradeScale/GradeScaleFormModal.jsx'
import GradeScaleViewModal from '../components/gradeScale/GradeScaleViewModal.jsx'
import { activeStatusLabel, activeStatusVariant } from '../data/referenceData.js'
import { GRADE_LETTERS } from '../data/gradeScales.js'

/*
 * Grade Scale (Batch 3).
 *
 * Full CRUD over score-to-letter mappings. Mirrors the Academic Master page
 * exactly: same header / tabs / bulk bar / filter bar / sortable table /
 * pagination / modals. This page is distinct from Grade Management, which
 * handles grading rosters and score entry.
 */

const COLUMNS = {
  alphabet: { label: 'Grade Alphabet', sortable: true, align: 'left' },
  range: { label: 'Score Range', sortable: true, align: 'left' },
  IsActive: { label: 'Status', sortable: true, align: 'left' },
  updated: { label: 'Updated', sortable: true, align: 'left' },
}

const DEFAULT_ORDER = ['alphabet', 'range', 'IsActive', 'updated']
const COLUMN_STORAGE_KEY = 'myacademic.gradeScale.columnOrder'

const SORTABLE = {
  alphabet: (a, b) => a.alphabet.localeCompare(b.alphabet),
  range: (a, b) => a.scoreFrom - b.scoreFrom,
  IsActive: (a, b) => a.IsActive - b.IsActive,
  updated: (a, b) => a.updated.localeCompare(b.updated),
}

export default function GradeScalePage() {
  const {
    gradeScales,
    deleteGradeScale,
    bulkSetGradeScaleStatus,
    bulkDeleteGradeScales,
  } = useData()
  const { showToast, showConfirmation } = useToast()

  const [activeTab, setActiveTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [letterFilter, setLetterFilter] = useState('All Letters')
  const [selected, setSelected] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ key: 'range', dir: 'asc' })
  const [columnOrder, setColumnOrder] = usePersistedState(
    COLUMN_STORAGE_KEY,
    DEFAULT_ORDER,
  )

  const [modal, setModal] = useState(null)

  /* Letters present in the data — used for the filter dropdown so it stays
     useful if a custom letter is ever added. */
  const letterOptions = useMemo(() => {
    const seen = new Set()
    gradeScales.forEach((g) => {
      if (g.IsDelete === 0) seen.add(g.alphabet)
    })
    const extras = Array.from(seen).filter(
      (letter) => !GRADE_LETTERS.includes(letter),
    )
    return [...GRADE_LETTERS.filter((l) => seen.has(l)), ...extras]
  }, [gradeScales])

  const tabCounts = useMemo(() => {
    const visible = gradeScales.filter((g) => g.IsDelete === 0)
    return {
      active: visible.filter((g) => g.IsActive === 1).length,
      inactive: visible.filter((g) => g.IsActive === 0).length,
    }
  }, [gradeScales])

  const tabRows = useMemo(() => {
    const target = activeTab === 'Active' ? 1 : 0
    return gradeScales.filter((g) => g.IsDelete === 0 && g.IsActive === target)
  }, [gradeScales, activeTab])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tabRows.filter((g) => {
      const letterMatch =
        letterFilter === 'All Letters' || g.alphabet === letterFilter
      const searchMatch =
        !q ||
        g.alphabet.toLowerCase().includes(q) ||
        String(g.scoreFrom).includes(q) ||
        String(g.scoreTo).includes(q)
      return letterMatch && searchMatch
    })
  }, [tabRows, search, letterFilter])

  const sorted = useMemo(() => {
    const cmp = SORTABLE[sort.key]
    if (!cmp) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => cmp(a, b) * dir)
  }, [filtered, sort])

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const viewSignature = `${activeTab}|${search}|${letterFilter}`
  const [lastView, setLastView] = useState(viewSignature)
  if (viewSignature !== lastView) {
    setLastView(viewSignature)
    setPage(1)
    setSelected(new Set())
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((g) => selected.has(g.id))
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
    else setSelected(new Set(filtered.map((g) => g.id)))
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
  const openEdit = (scale) => setModal({ type: 'edit', scale })
  const openView = (scale) => setModal({ type: 'view', scale })
  const closeModal = () => setModal(null)

  const handleRefresh = () => {
    setSelected(new Set())
    setPage(1)
    showToast('List refreshed')
  }

  const handleDelete = async (scale) => {
    const result = await showConfirmation({
      title: 'Delete?',
      text: `Delete grade scale ${scale.alphabet} (${scale.scoreFrom}–${scale.scoreTo})? It will be hidden from both tabs.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (result.isConfirmed) {
      deleteGradeScale(scale.id)
      showToast('Grade scale deleted')
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(scale.id)
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
        text: `Deactivate ${count} grade scale${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetGradeScaleStatus(ids, 0)
        showToast(`${count} grade scale${count === 1 ? '' : 's'} deactivated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'active') {
      const result = await showConfirmation({
        title: 'Activate selected?',
        text: `Activate ${count} grade scale${count === 1 ? '' : 's'}?`,
        icon: 'question',
        confirmText: 'Activate',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkSetGradeScaleStatus(ids, 1)
        showToast(`${count} grade scale${count === 1 ? '' : 's'} activated`)
        setSelected(new Set())
      }
      return
    }

    if (key === 'delete') {
      const result = await showConfirmation({
        title: 'Delete selected?',
        text: `Delete ${count} grade scale${count === 1 ? '' : 's'}? They will be hidden from both tabs.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      if (result.isConfirmed) {
        bulkDeleteGradeScales(ids)
        showToast(`${count} grade scale${count === 1 ? '' : 's'} deleted`)
        setSelected(new Set())
      }
    }
  }

  const renderCell = (key, g) => {
    switch (key) {
      case 'alphabet':
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
                backgroundColor: 'rgba(252, 231, 243, 1)',
                color: 'primary.main',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {g.alphabet}
            </Box>
            <Box sx={{ fontWeight: 600 }}>{g.alphabet}</Box>
          </Box>
        )
      case 'range':
        return (
          <Box className="num" sx={{ fontSize: 14, color: 'text.secondary' }}>
            {g.scoreFrom} – {g.scoreTo}
          </Box>
        )
      case 'IsActive':
        return (
          <StatusBadge variant={activeStatusVariant(g)}>
            {activeStatusLabel(g)}
          </StatusBadge>
        )
      case 'updated':
        return <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{g.updated}</Box>
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
        title="Grade Scale"
        subtitle="Map score ranges to letter grades"
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
        searchPlaceholder="Search by letter or score..."
        onRefresh={handleRefresh}
        filters={[
          {
            key: 'letter',
            label: 'Letter',
            value: letterFilter,
            onChange: setLetterFilter,
            options: ['All Letters', ...letterOptions],
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
                paginated.map((g) => {
                  const isSelected = selected.has(g.id)
                  return (
                    <TableRow
                      key={g.id}
                      hover
                      selected={isSelected}
                      onClick={() => openView(g)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => toggleRow(g.id)}
                        />
                      </TableCell>
                      {columnOrder.map((key) => (
                        <TableCell key={key} align={COLUMNS[key].align}>
                          {renderCell(key, g)}
                        </TableCell>
                      ))}
                      <TableCell
                        align="right"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          size="small"
                          onClick={() => openEdit(g)}
                          aria-label="Edit"
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon name="edit" size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(g)}
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
                    ? 'No active grade scales found'
                    : 'No inactive grade scales found'}
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
        <GradeScaleFormModal scale={null} onClose={closeModal} />
      )}
      {modal?.type === 'edit' && (
        <GradeScaleFormModal scale={modal.scale} onClose={closeModal} />
      )}
      {modal?.type === 'view' && (
        <GradeScaleViewModal scale={modal.scale} onClose={closeModal} />
      )}
    </>
  )
}