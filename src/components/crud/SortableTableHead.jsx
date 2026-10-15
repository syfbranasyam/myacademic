import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'

/*
 * Sortable table header (revision Phase 5c-2).
 *
 * Wraps MUI's TableHead in a dnd-kit context so the middle column headers can
 * be dragged to reorder. `pinnedFirst` and `pinnedLast` are rendered outside
 * the sortable context — they stay in position and cannot be dragged. This is
 * how the checkbox column stays first and the actions column stays last.
 *
 * Sorting still works: a pointer move of under 5px does not start a drag, so
 * a normal click on the TableSortLabel toggles sorting as expected.
 *
 * Columns not flagged `sortable: true` render as plain labels with no sort
 * control, but they remain draggable.
 */

function SortableHeaderCell({ id, label, sortable, sortKey, sortDir, onSort, sx }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    userSelect: 'none',
    position: 'relative',
    zIndex: isDragging ? 2 : 'auto',
  }

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      sx={sx}
      {...attributes}
      {...listeners}
    >
      {sortable ? (
        <TableSortLabel
          active={sortKey === id}
          direction={sortKey === id ? sortDir : 'asc'}
          onClick={() => onSort(id)}
        >
          {label}
        </TableSortLabel>
      ) : (
        label
      )}
    </TableCell>
  )
}

export default function SortableTableHead({
  pinnedFirst,
  pinnedLast,
  columnOrder,
  onReorder,
  columns,
  sortKey,
  sortDir,
  onSort,
  headerSx,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = columnOrder.indexOf(active.id)
    const newIndex = columnOrder.indexOf(over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(columnOrder, oldIndex, newIndex))
  }

  return (
    <TableHead>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columnOrder}
          strategy={horizontalListSortingStrategy}
        >
          <TableRow>
            {pinnedFirst}
            {columnOrder.map((key) => (
              <SortableHeaderCell
                key={key}
                id={key}
                label={columns[key].label}
                sortable={columns[key].sortable}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
                sx={{ ...headerSx, textAlign: columns[key].align || 'left' }}
              />
            ))}
            {pinnedLast}
          </TableRow>
        </SortableContext>
      </DndContext>
    </TableHead>
  )
}