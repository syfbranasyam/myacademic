import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import Breadcrumb from './Breadcrumb.jsx'

/*
 * Page title, subtitle and a right-aligned action slot (spec §7.1).
 *
 * Migrated to MUI in Phase 2e. Title drops from 30px to the theme's h1 (22px,
 * weight 600) as part of the Phase 2 density pass. Action buttons wrap on
 * narrow screens and hide from print (the surrounding shell handles the rest
 * of the print rules).
 */
export default function PageHeader({ title, subtitle, breadcrumb, breadcrumbSeparator, actions }) {
  return (
    <>
      {breadcrumb ? (
        <Breadcrumb segments={breadcrumb} separator={breadcrumbSeparator} />
      ) : null}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', m: 0 }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        {actions ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              '@media print': { display: 'none' },
            }}
          >
            {actions}
          </Stack>
        ) : null}
      </Box>
    </>
  )
}