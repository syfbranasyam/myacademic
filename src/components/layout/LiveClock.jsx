import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/*
 * Live date & time for the Topbar (UI-polish round 2).
 *
 * Format (Indonesian, 24-hour):
 *   Senin, 9 Oktober 2026 19:34:00
 *
 * Updates every second. The interval is cleared on unmount so no timer
 * leaks survive a route change or a logout.
 *
 * Rendering is isolated to this component so the rest of the Topbar does
 * not re-render once per second — only this Typography updates.
 *
 * `tabular-nums` prevents layout shift when digits change.
 *
 * Hidden below the `sm` breakpoint to keep the mobile topbar uncluttered;
 * the profile menu remains accessible on every viewport.
 */

/* Module-scoped formatter — built once, reused for every render. */
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function format(date) {
  const datePart = dateFormatter.format(date)

  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${datePart} ${hh}:${mm}:${ss}`
}

export default function LiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const label = useMemo(() => format(now), [now])

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: 12.5,
          fontWeight: 500,
          color: 'text.secondary',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}