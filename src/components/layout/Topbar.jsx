import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Avatar from '../ui/Avatar.jsx'
import LiveClock from './LiveClock.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

/*
 * Topbar (spec §6.3, UI-polish Part A + round 2).
 *
 * Layout:
 *   [ ...spacer... ] [ LiveClock ] [ divider ] [ user chip ]
 *
 * The search input and notification bell were removed in Part A. The user
 * chip navigates to the Profile page. The clock is hidden below `sm` to
 * keep the mobile topbar compact.
 */

const TOPBAR_HEIGHT = 64

export default function Topbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const displayName = currentUser.name.split(',')[0].trim()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: 'text.primary',
        boxShadow: '0 1px 4px rgba(17, 28, 45, 0.05)',
        '@media print': { display: 'none' },
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${TOPBAR_HEIGHT}px !important`,
          height: TOPBAR_HEIGHT,
          px: { xs: 2, md: 3 },
          gap: 2,
          justifyContent: 'flex-end',
        }}
      >
        <LiveClock />

        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: '1px',
            height: 24,
            backgroundColor: 'divider',
          }}
        />

        <Box
          component="button"
          type="button"
          onClick={() => navigate('/profile')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1,
            py: 0.5,
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: '8px',
            font: 'inherit',
            color: 'inherit',
            transition: 'background-color 120ms',
            '&:hover': { backgroundColor: 'surfaceLow' },
          }}
        >
          <Avatar name={currentUser.name} index={0} />
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              textAlign: 'left',
              lineHeight: 1.25,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>
              {displayName}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: 'text.secondary',
                lineHeight: 1.25,
              }}
            >
              {currentUser.role}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}