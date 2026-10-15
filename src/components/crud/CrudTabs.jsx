import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

/*
 * Active / Inactive tabs for CRUD list pages (revision Phase 5).
 *
 * Value is the string 'Active' or 'Inactive'. `counts` is optional — when
 * supplied, each tab shows a small count chip next to its label. Pages pass
 * counts that ignore the search / filter for the other tab, so the numbers
 * always reflect what the user could see by switching tabs.
 *
 * Uses MUI's Tabs with a custom indicator and no ripple to match the
 * prototype's underline-tab aesthetic.
 */
export default function CrudTabs({ value, onChange, counts = null }) {
  const handleChange = (_event, nextValue) => {
    onChange(nextValue)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          minHeight: 40,
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 2,
          },
        }}
      >
        <Tab
          value="Active"
          label={
            counts ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box component="span">Active</Box>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20,
                    height: 18,
                    px: 0.75,
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: '999px',
                    backgroundColor: 'surfaceHigh',
                    color: 'text.secondary',
                  }}
                >
                  {counts.active}
                </Box>
              </Box>
            ) : (
              'Active'
            )
          }
          sx={{
            minHeight: 40,
            px: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
          }}
        />
        <Tab
          value="Inactive"
          label={
            counts ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box component="span">Inactive</Box>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20,
                    height: 18,
                    px: 0.75,
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: '999px',
                    backgroundColor: 'surfaceHigh',
                    color: 'text.secondary',
                  }}
                >
                  {counts.inactive}
                </Box>
              </Box>
            ) : (
              'Inactive'
            )
          }
          sx={{
            minHeight: 40,
            px: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
          }}
        />
      </Tabs>
    </Box>
  )
}