import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Icon from './Icon.jsx'

/*
 * Filter + search for CRUD list pages (revision UI-polish Part A).
 *
 * Structure (spec §1):
 *   Card 1: [ Search input ................. ] [ Refresh ]
 *   Card 2: [ Filter ] [ Filter ] [ Filter ] ...
 *
 * The two cards are separate, matching the standardization brief. Card 2
 * does not render when there are no filters. Card 1 does not render when
 * there is neither a search handler nor a refresh handler.
 *
 * Fully controlled — every change is reported upward. The search input is
 * never keyed on its own value, so the caret never jumps.
 */

const cardSx = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 1.5,
  p: 2,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(17, 28, 45, 0.05)',
}

export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  onRefresh,
}) {
  const hasSearch = Boolean(onSearchChange)
  const hasFilters = filters.length > 0
  const hasTop = hasSearch || Boolean(onRefresh)

  return (
    <>
      {hasTop ? (
        <Box sx={{ ...cardSx, mb: hasFilters ? 1.5 : 2.5 }}>
          {hasSearch ? (
            <TextField
              type="search"
              value={search ?? ''}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              sx={{ flex: '1 1 200px', minWidth: 200 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ color: 'text.secondary' }}
                    >
                      <Icon name="search" size={18} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            <Box sx={{ flex: 1 }} />
          )}

          {onRefresh ? (
            <Tooltip title="Refresh list">
              <IconButton
                onClick={onRefresh}
                aria-label="Refresh list"
                sx={{
                  color: 'text.secondary',
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'surfaceLow' },
                }}
              >
                <Icon name="refresh" size={20} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      ) : null}

      {hasFilters ? (
        <Box sx={{ ...cardSx, mb: 2.5 }}>
          {filters.map((filter) => (
            <TextField
              key={filter.key}
              select
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
              sx={{ minWidth: 130 }}
              slotProps={{
                htmlInput: {
                  'aria-label': filter.label,
                  title: filter.label,
                },
              }}
            >
              {filter.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ))}
        </Box>
      ) : null}
    </>
  )
}