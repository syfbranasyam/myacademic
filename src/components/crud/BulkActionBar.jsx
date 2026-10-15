import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Icon from '../ui/Icon.jsx'

/*
 * Selection-aware action bar for CRUD list pages (revision Phase 5).
 *
 * Renders nothing when zero rows are selected, so pages can mount it
 * unconditionally above the table. Each action is `{ key, label, icon,
 * variant }` where variant is `'primary'`, `'danger'`, or `'success'`.
 * Clicking an action calls `onAction(key)`.
 *
 * `onClear` fires when the user clicks the Clear button; pages should reset
 * their selected set. The bar itself does not manage selection state.
 */
export default function BulkActionBar({ selectedCount = 0, actions = [], onAction, onClear }) {
  if (!selectedCount) return null

  const variantStyle = (variant) => {
    if (variant === 'danger') {
      return {
        color: 'error.main',
        borderColor: 'error.main',
        '&:hover': { backgroundColor: 'error.light' },
      }
    }
    if (variant === 'success') {
      return {
        color: 'success.main',
        borderColor: 'success.main',
        '&:hover': { backgroundColor: 'success.light' },
      }
    }
    return {
      color: 'primary.main',
      borderColor: 'primary.main',
      '&:hover': { backgroundColor: 'surfaceHigh' },
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        p: 1.5,
        mb: 2,
        backgroundColor: 'rgba(252, 231, 243, 0.5)',
        border: 1,
        borderColor: 'primary.main',
        borderRadius: '12px',
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: 'primary.main',
          mr: 'auto',
        }}
      >
        {selectedCount} selected
      </Typography>

      {actions.map((action) => (
        <Button
          key={action.key}
          size="small"
          variant="outlined"
          onClick={() => onAction(action.key)}
          startIcon={action.icon ? <Icon name={action.icon} size={16} /> : null}
          sx={{
            height: 32,
            px: 1.5,
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            ...variantStyle(action.variant),
          }}
        >
          {action.label}
        </Button>
      ))}

      <Button
        size="small"
        onClick={onClear}
        startIcon={<Icon name="close" size={16} />}
        sx={{
          height: 32,
          px: 1.5,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'none',
          color: 'text.secondary',
          '&:hover': { backgroundColor: 'surface' },
        }}
      >
        Clear
      </Button>
    </Paper>
  )
}