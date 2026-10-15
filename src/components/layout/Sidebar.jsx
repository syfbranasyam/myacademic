import { NavLink, useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Icon from '../ui/Icon.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { ROLES } from '../../data/referenceData.js'

/*
 * Fixed sidebar (spec §6.1, UI-polish round 2).
 *
 * Toggle icon now reflects the current state:
 *   - expanded → keyboard_double_arrow_left  (click to collapse)
 *   - collapsed → keyboard_double_arrow_right (click to expand)
 *
 * Logout asks for confirmation via SweetAlert.
 */

const EXPANDED_WIDTH = 256
const COLLAPSED_WIDTH = 80

const NAV = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    exact: true,
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  { section: 'ACADEMIC' },
  {
    label: 'Students',
    icon: 'school',
    route: '/students',
    roles: [ROLES.ADMIN],
  },
  {
    label: 'Academic Master',
    icon: 'database',
    route: '/academic-master',
    roles: [ROLES.ADMIN],
  },
  {
    label: 'Teaching Assignment',
    icon: 'co_present',
    route: '/teaching-assignment',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    label: 'Grade Management',
    icon: 'assignment_turned_in',
    route: '/grade-management',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    label: 'Academic Result',
    icon: 'analytics',
    route: '/academic-results',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  { section: 'ACCOUNT' },
  {
    label: 'Profile',
    icon: 'account_circle',
    route: '/profile',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    label: 'Logout',
    icon: 'logout',
    action: 'logout',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
]

function filterNav(nav, role) {
  const result = []
  let pendingSection = null

  for (const item of nav) {
    if (item.section) {
      pendingSection = item
      continue
    }
    if (!item.roles || item.roles.includes(role)) {
      if (pendingSection) {
        result.push(pendingSection)
        pendingSection = null
      }
      result.push(item)
    }
  }

  return result
}

export default function Sidebar({ collapsed, showToggle = true, onToggle }) {
  const { currentUser, logout } = useAuth()
  const { showConfirmation } = useToast()
  const navigate = useNavigate()
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
  const role = currentUser?.role
  const visibleNav = filterNav(NAV, role)

  const handleLogout = async () => {
    const result = await showConfirmation({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    })
    if (!result.isConfirmed) return
    logout()
    navigate('/login')
  }

  const itemSx = {
    justifyContent: collapsed ? 'center' : 'flex-start',
    mb: 0.5,
    px: collapsed ? 0 : 2,
    py: 1.1,
    borderRadius: '8px',
    fontSize: 14,
    color: 'text.secondary',
    '&:hover': { backgroundColor: 'surfaceHigh' },
    '&.active': {
      backgroundColor: 'primary.light',
      color: '#fff',
      fontWeight: 600,
      boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
      '&:hover': { backgroundColor: 'primary.light' },
      '& .MuiListItemIcon-root': { color: '#fff' },
    },
  }

  const iconSx = {
    minWidth: collapsed ? 0 : 28,
    justifyContent: 'center',
    color: 'inherit',
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '@media print': { display: 'none' },
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          transition: 'width 0.15s ease',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 1,
          height: 56,
          px: 2,
          mt: 1,
          mb: 1,
        }}
      >
        {collapsed ? null : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/logo.svg" width={30} height={30} alt="" />
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>MyAcademic</Typography>
          </Box>
        )}
        {showToggle ? (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <IconButton
              onClick={onToggle}
              size="small"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              sx={{
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'surfaceHigh' },
              }}
            >
              <Icon
                name={
                  collapsed
                    ? 'keyboard_double_arrow_right'
                    : 'keyboard_double_arrow_left'
                }
              />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>

      <List sx={{ flexGrow: 1, px: 1, py: 0 }}>
        {visibleNav.map((entry, index) => {
          if (entry.section) {
            if (collapsed) return null
            return (
              <Typography
                key={`${entry.section}-${index}`}
                sx={{
                  px: 2,
                  pt: 2,
                  pb: 0.5,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  opacity: 0.7,
                }}
              >
                {entry.section}
              </Typography>
            )
          }

          if (entry.action === 'logout') {
            return (
              <ListItemButton
                key={entry.label}
                onClick={handleLogout}
                title={entry.label}
                sx={itemSx}
              >
                <ListItemIcon sx={iconSx}>
                  <Icon name={entry.icon} />
                </ListItemIcon>
                {collapsed ? null : <ListItemText primary={entry.label} />}
              </ListItemButton>
            )
          }

          return (
            <ListItemButton
              key={entry.label}
              component={NavLink}
              to={entry.route}
              end={entry.exact ?? false}
              title={entry.label}
              sx={itemSx}
            >
              <ListItemIcon sx={iconSx}>
                <Icon name={entry.icon} />
              </ListItemIcon>
              {collapsed ? null : <ListItemText primary={entry.label} />}
            </ListItemButton>
          )
        })}
      </List>
    </Drawer>
  )
}