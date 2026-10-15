import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import Icon from './Icon.jsx'
import { paginate, pageNumbers } from '../../utils/pagination.js'

/*
 * Table footer: "Showing X to Y of N" + page-size selector + pager
 * (revision UI-polish Part A).
 *
 * Page size (spec §6):
 *   - Options: 10 (default), 50, 100.
 *   - When `onPageSizeChange` is provided, the selector renders.
 *   - The parent owns the page-size state; this component is controlled.
 *
 * Columns are never sorted here; sorting lives on the table header.
 */

const PAGE_SIZE_OPTIONS = [10, 50, 100]

export default function Pagination({
  items,
  perPage = 10,
  current,
  onChange,
  onPageSizeChange,
  label = 'Showing',
}) {
  const { totalPages, currentPage, from, to } = paginate(items, current, perPage)
  const visible = pageNumbers(currentPage, totalPages)
  const total = Array.isArray(items) ? items.length : 0

  const pageButtonSx = {
    minWidth: 32,
    height: 32,
    px: 1,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: '8px',
    color: 'text.primary',
    '&:hover': { backgroundColor: 'surfaceHigh' },
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        px: 2,
        py: 1.5,
        bgcolor: 'surfaceLow',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: 'text.secondary',
          whiteSpace: 'nowrap',
          mr: 'auto',
        }}
      >
        {label} {from} to {to} of {total}
      </Typography>

      {onPageSizeChange ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
            Rows per page:
          </Typography>
          <TextField
            select
            size="small"
            value={perPage}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            slotProps={{
              htmlInput: { 'aria-label': 'Rows per page' },
            }}
            sx={{
              width: 84,
              '& .MuiOutlinedInput-root': { height: 32 },
              '& .MuiOutlinedInput-input': { py: 0, fontSize: 13, fontWeight: 600 },
            }}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: 13 }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      ) : null}

      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton
          size="small"
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          sx={{ color: 'text.primary' }}
        >
          <Icon name="chevron_left" size={18} />
        </IconButton>

        {visible.map((page, index) => {
          const previous = visible[index - 1]
          const showEllipsis = previous !== undefined && page - previous > 1
          const isActive = page === currentPage

          return (
            <Stack key={page} direction="row" spacing={0.5} alignItems="center">
              {showEllipsis ? (
                <Typography
                  aria-hidden="true"
                  sx={{ px: 0.5, color: 'text.disabled', fontSize: 13 }}
                >
                  …
                </Typography>
              ) : null}
              <Button
                onClick={() => onChange(page)}
                aria-current={isActive ? 'page' : undefined}
                sx={{
                  ...pageButtonSx,
                  ...(isActive && {
                    backgroundColor: 'primary.main',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }),
                }}
              >
                {page}
              </Button>
            </Stack>
          )
        })}

        <IconButton
          size="small"
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          sx={{ color: 'text.primary' }}
        >
          <Icon name="chevron_right" size={18} />
        </IconButton>
      </Stack>
    </Box>
  )
}