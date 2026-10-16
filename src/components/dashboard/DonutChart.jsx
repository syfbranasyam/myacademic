import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/*
 * Lightweight donut chart (Dashboard, SVG, no external library).
 *
 * Renders a ring built from stroke-dasharray segments with a total label in
 * the middle and a legend to the right. Zero-total or empty data renders a
 * friendly empty state.
 *
 * Props:
 *   data        – array of { label, value, color }
 *   size        – outer diameter in px (default 160)
 *   thickness   – ring thickness in px (default 22)
 *   centerLabel – caption above the total (default 'Total')
 *   emptyText   – fallback message
 */

export default function DonutChart({
  data = [],
  size = 160,
  thickness = 22,
  centerLabel = 'Total',
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

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const cx = size / 2
  const cy = size / 2

  /* Each segment's dash length and its offset along the ring. Offsets are
     derived, not accumulated in a mutable variable — the sum of all previous
     dash lengths is computed from the array itself, so no variable is
     reassigned during render. */
  const segments = visible.map((d) => ({
    ...d,
    dash: (d.value / total) * circumference,
  })).map((d, index) => ({
    ...d,
    offset: -visible
      .slice(0, index)
      .reduce((sum, prev) => sum + (prev.value / total) * circumference, 0),
  }))

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <svg width={size} height={size} role="img" aria-label={centerLabel}>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(17, 28, 45, 0.06)"
            strokeWidth={thickness}
          />
          {segments.map((d) => (
            <circle
              key={d.label}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${d.dash} ${circumference - d.dash}`}
              strokeDashoffset={d.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          ))}
        </svg>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'text.secondary',
            }}
          >
            {centerLabel}
          </Typography>
          <Typography
            className="num"
            sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}
          >
            {total}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minWidth: 140,
          flexGrow: 1,
        }}
      >
        {segments.map((d) => {
          const pct = Math.round((d.value / total) * 100)
          return (
            <Box
              key={d.label}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '3px',
                  backgroundColor: d.color,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{ fontSize: 12.5, color: 'text.secondary', flexGrow: 1 }}
              >
                {d.label}
              </Typography>
              <Typography
                className="num"
                sx={{ fontSize: 12.5, fontWeight: 600 }}
              >
                {d.value}
              </Typography>
              <Typography
                className="num"
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                  minWidth: 34,
                  textAlign: 'right',
                }}
              >
                {pct}%
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}