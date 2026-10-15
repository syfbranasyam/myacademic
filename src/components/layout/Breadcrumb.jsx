import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

/*
 * Breadcrumb trail (spec §6.5): small uppercase text, 11px semibold, 0.04em
 * letter spacing, last segment in the primary colour.
 *
 * Migrated to MUI's Breadcrumbs in Phase 2e. The separator prop is preserved
 * because the spec uses two: "ACADEMIC ROSTER / Allocations" uses a slash and
 * the others use "›". Not clickable — the transcript's "← All results" link
 * is a separate element on the transcript page.
 */
export default function Breadcrumb({ segments, separator = '›' }) {
  return (
    <MuiBreadcrumbs
      separator={<Box component="span">{separator}</Box>}
      sx={{
        mb: 0.5,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        '& .MuiBreadcrumbs-separator': { mx: 0.75, fontSize: 11 },
      }}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        return (
          <Typography
            key={segment}
            component="span"
            sx={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isLast ? 'primary.main' : 'text.secondary',
            }}
          >
            {segment}
          </Typography>
        )
      })}
    </MuiBreadcrumbs>
  )
}