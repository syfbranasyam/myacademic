import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/*
 * Lightweight horizontal bar chart (Dashboard, no external library).
 *
 * Props:
 *   data        – array of { label, value, color? }
 *   color       – fallback bar colour for items without their own
 *   labelWidth  – reserved width for the label column in px (default 90)
 *   valueWidth  – reserved width for the value column in px (default 44)
 *   valueSuffix – optional suffix appended after the value (e.g. '%')
 *   emptyText   – message shown when every value is zero or data is empty
 *
 * Zero-value rows are hidden so the chart stays focused on the categories
 * that actually hold records. A null / empty total renders the empty state.
 */
export default function BarChart({
  data = [],
  color = 'primary.main',
  labelWidth = 90,
  valueWidth = 44,
  valueSuffix = '',
  emptyText = 'No data to display',
}) {
  const visible = data.filter((d) => Number.isFinite(d.value) && d.value > 0)
  const total = visible.reduce((sum, d) => sum + d.value, 0)

  if (visible.length === 0 || total === 0) {
    return (
      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          fontSize: 13,
          color: 'text.secondary',
        }}
      >
        {emptyText}
      </Box>
    )
  }

  const maxValue = Math.max(...visible.map((d) => d.value))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {visible.map((d) => {
        const pct = maxValue > 0 ? (d.value / maxValue) * 100 : 0
        return (
          <Box
            key={d.label}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
          >
            <Typography
              title={d.label}
              sx={{
                width: labelWidth,
                flexShrink: 0,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {d.label}
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                height: 18,
                borderRadius: '999px',
                backgroundColor: 'surfaceLow',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: '999px',
                  backgroundColor: d.color || color,
                  transition: 'width 240ms ease',
                }}
              />
            </Box>

            <Typography
              className="num"
              sx={{
                width: valueWidth,
                flexShrink: 0,
                textAlign: 'right',
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              {d.value}
              {valueSuffix}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}