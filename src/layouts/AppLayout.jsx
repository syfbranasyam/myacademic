import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'

/*
 * App shell (spec §8.1, §7.1).
 *
 * Migrated to a MUI flex layout in Phase 2e:
 *   - Sidebar is a permanent Drawer that reserves flex space via its root width
 *   - The main column is a flex child with flexGrow: 1
 *   - Topbar is a sticky AppBar inside the main column, so it never overlaps
 *     content and needs no "clear the fixed topbar" top padding
 *   - Content is capped at 1440px and centered, with responsive padding
 *
 * Collapse state lives here (spec §3.4: not persisted). On narrow screens the
 * sidebar is forced into its 80px rail regardless of the toggle (spec §7.11),
 * so the effective value is what we hand down.
 */

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const isNarrow = useMediaQuery('(max-width: 900px)')
  const effectiveCollapsed = isNarrow || collapsed

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        collapsed={effectiveCollapsed}
        showToggle={!isNarrow}
        onToggle={() => setCollapsed((current) => !current)}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Topbar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}