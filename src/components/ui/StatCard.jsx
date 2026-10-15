import MuiCard from '@mui/material/Card'
import MuiCardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Icon from './Icon.jsx'

/*
 * Stat card (spec §8.2, UI-polish round 2).
 *
 * Typography standardized to theme tokens:
 *   - Label / detail use the overline scale (11px, caps, weight 600).
 *   - Figure uses 28px (vertical) / 24px (horizontal).
 *
 * All colours come from theme.palette slots, no hardcoded hex.
 */

const labelSx = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  lineHeight: 1.4,
}

const detailSx = {
  fontSize: 11,
  fontWeight: 600,
  color: 'text.secondary',
  lineHeight: 1.4,
}

export default function StatCard({
  label,
  value,
  icon,
  layout = 'vertical',
  tone,
  detail,
  valueClassName = '',
}) {
  const isRed = tone === 'red'

  const iconTile = icon ? (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: isRed ? 48 : 40,
        height: isRed ? 48 : 40,
        borderRadius: isRed ? '12px' : '8px',
        backgroundColor: isRed ? 'error.light' : 'surfaceLow',
        color: isRed ? 'error.main' : 'primary.main',
      }}
    >
      <Icon name={icon} />
    </Box>
  ) : null

  if (layout === 'horizontal') {
    return (
      <MuiCard>
        <MuiCardContent
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {iconTile}
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={labelSx}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
              <Typography
                className={`num ${valueClassName}`.trim()}
                sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.15 }}
              >
                {value}
              </Typography>
              {detail ? <Typography sx={detailSx}>{detail}</Typography> : null}
            </Box>
          </Box>
        </MuiCardContent>
      </MuiCard>
    )
  }

  return (
    <MuiCard>
      <MuiCardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Typography sx={labelSx}>{label}</Typography>
          {iconTile}
        </Box>
        <Typography
          className={`num ${valueClassName}`.trim()}
          sx={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
        {detail ? <Typography sx={detailSx}>{detail}</Typography> : null}
      </MuiCardContent>
    </MuiCard>
  )
}