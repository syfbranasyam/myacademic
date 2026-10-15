import { createTheme } from '@mui/material/styles'

/*
 * My Academic — MUI theme (Phase 2a).
 *
 * Maps the design tokens from theme.css (spec §7.2) onto MUI's theme object.
 * During 2a–2f both Bootstrap/tokens and MUI are loaded side by side; MUI only
 * affects components that opt in. Bootstrap removal happens in 2g.
 *
 * Density targets (Phase 2 doc §5):
 *   Page title        22px (was 30)
 *   Table cell        8px / 12px (was 12px / 16px)
 *   Card padding      20px (was 24)
 *   Modal padding     20px / 24px (was 24)
 */

const PRIMARY = '#b80049'
const PRIMARY_CONTAINER = '#e2165f'
const PRIMARY_DARK = '#92003a'
const BG = '#f9f9ff'
const SURFACE_LOW = '#f0f3ff'
const SURFACE = '#e7eeff'
const SURFACE_HIGH = '#dee8ff'
const ON_SURFACE = '#111c2d'
const ON_SURFACE_VARIANT = '#5b3f43'
const TERTIARY = '#4353b5'
const INPUT_FOCUS = '#e91e63'
const SCRIM = '#263143'
const DIVIDER = 'rgba(17, 28, 45, 0.08)'

/* Status color pairs — spec §7.2 */
export const statusColors = {
  green: { bg: '#d1fae5', fg: '#047857' },
  amber: { bg: '#fef3c7', fg: '#b45309' },
  blue: { bg: '#dee8ff', fg: '#4353b5' },
  pink: { bg: '#fce7f3', fg: '#b80049' },
  gray: { bg: '#e2e8f0', fg: '#475569' },
  teal: { bg: '#f0fdfa', fg: '#0f766e' },
  red: { bg: '#fef2f2', fg: '#b91c1c' },
}

/* Avatar tone cycle — spec §7.2 */
export const avatarTones = [
  { bg: '#fce7f3', fg: '#b80049' },
  { bg: '#dee8ff', fg: '#4353b5' },
  { bg: '#ffedd5', fg: '#c2410c' },
]

export function getAvatarTone(index) {
  const length = avatarTones.length
  return avatarTones[((index % length) + length) % length]
}

export const muiTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: PRIMARY,
      light: PRIMARY_CONTAINER,
      dark: PRIMARY_DARK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: TERTIARY,
      light: SURFACE_HIGH,
      contrastText: '#ffffff',
    },
    error: { main: '#b91c1c', light: '#fef2f2' },
    warning: { main: '#b45309', light: '#fef3c7' },
    success: { main: '#047857', light: '#d1fae5' },
    info: { main: TERTIARY, light: SURFACE_HIGH },

    background: { default: BG, paper: '#ffffff' },
    text: { primary: ON_SURFACE, secondary: ON_SURFACE_VARIANT, disabled: '#94a3b8' },
    divider: DIVIDER,

    /* Custom surface tokens used by components that need the three-tier surface */
    surfaceLow: SURFACE_LOW,
    surface: SURFACE,
    surfaceHigh: SURFACE_HIGH,
  },

  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontSize: 18, fontWeight: 600 },
    h4: { fontSize: 16, fontWeight: 600 },
    h5: { fontSize: 15, fontWeight: 600 },
    h6: { fontSize: 14, fontWeight: 600 },
    subtitle1: { fontSize: 14 },
    subtitle2: { fontSize: 13 },
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
    button: { fontSize: 14, fontWeight: 600, textTransform: 'none' },
    caption: { fontSize: 11, letterSpacing: '0.04em' },
    overline: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },

  shape: { borderRadius: 8 },
  spacing: 8,

  components: {
    /* Buttons: 40px default, 32px small, no uppercase, no elevation */
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          height: 40,
          padding: '0 16px',
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 8,
        },
        sizeSmall: {
          height: 32,
          padding: '0 12px',
          fontSize: 12,
        },
        containedPrimary: {
          '&:hover': { backgroundColor: PRIMARY_CONTAINER },
        },
      },
    },

    /* Inputs: 40px high, surface-low background, 3px focus ring */
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_LOW,
          fontSize: 14,
          height: 40,
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: 'transparent' },
          '&.Mui-focused fieldset': { borderColor: INPUT_FOCUS, borderWidth: 1 },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(233, 30, 99, 0.12)',
          },
        },
        input: {
          padding: '0 12px',
          height: 40,
          boxSizing: 'border-box',
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },

    /* Dialogs: 16px radius, large shadow, tinted footer */
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(17, 28, 45, 0.24)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: 20, fontWeight: 600, padding: '20px 24px 8px' },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: '8px 24px 8px' },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '16px 24px', backgroundColor: BG },
      },
    },

    /* Cards: soft shadow, 12px radius, 20px content padding */
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(17, 28, 45, 0.05)',
          borderRadius: 12,
          border: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 20, '&:last-child': { paddingBottom: 20 } },
      },
    },

    /* Tables: compact rows, uppercase caps header */
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
          fontSize: 14,
          borderBottom: `1px solid ${DIVIDER}`,
        },
        head: {
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: ON_SURFACE_VARIANT,
          backgroundColor: SURFACE_LOW,
        },
      },
    },

    /* Chips: pill, small */
    MuiChip: {
      styleOverrides: {
        root: { height: 22, fontSize: 11, fontWeight: 600, borderRadius: 999 },
      },
    },

    /* AppBar + Drawer: translucent white with blur, no elevation */
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          color: ON_SURFACE,
          boxShadow: '0 1px 4px rgba(17, 28, 45, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          borderRight: 'none',
          boxShadow: '0 1px 4px rgba(17, 28, 45, 0.05)',
        },
      },
    },

    /* Sidebar nav items */
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '9px 16px',
          fontSize: 14,
          '&.Mui-selected': {
            backgroundColor: PRIMARY_CONTAINER,
            color: '#ffffff',
            fontWeight: 600,
            '&:hover': { backgroundColor: PRIMARY_CONTAINER },
            '& .MuiListItemIcon-root': { color: '#ffffff' },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 28, color: ON_SURFACE_VARIANT },
      },
    },

    /* Tabs */
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          fontSize: 14,
          fontWeight: 600,
          textTransform: 'none',
          padding: '8px 12px',
        },
      },
    },

    /* Tooltip */
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: SCRIM,
          fontSize: 12,
          borderRadius: 6,
        },
      },
    },

    /* Alerts: 8px radius, 13px text */
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: 13 },
      },
    },

    /* Paper: no gradient overlay */
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})