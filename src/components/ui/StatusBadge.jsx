import MuiChip from '@mui/material/Chip'
import { statusColors } from '../../styles/muiTheme'

/*
 * Pill badge (spec §8.2, §7.10).
 *
 * Migrated to MUI's Chip in Phase 2b. The full status colour set lives in
 * muiTheme.js's `statusColors` export, so adding a new variant is a one-line
 * change there and never needs touching here.
 *
 * `dot` reproduces the leading dot used by grading status and by the score
 * predikat. The dot is rendered inline inside the label rather than through
 * MUI's `icon` prop, which keeps it free of the Chip's default icon spacing.
 */

const dotStyle = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: 'currentColor',
  display: 'inline-block',
}

export default function StatusBadge({ variant = 'gray', dot = false, className = '', children }) {
  const colors = statusColors[variant] ?? statusColors.gray

  return (
    <MuiChip
      size="small"
      className={className}
      label={
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            lineHeight: 1,
          }}
        >
          {dot ? <span style={dotStyle} aria-hidden="true" /> : null}
          {children}
        </span>
      }
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.fg,
        borderRadius: '999px',
        '& .MuiChip-label': {
          padding: '0 10px',
          display: 'inline-flex',
          alignItems: 'center',
        },
      }}
    />
  )
}