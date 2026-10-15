import Alert from '@mui/material/Alert'

import Icon from './Icon.jsx'

/*
 * Info note shown below the fields in some modals (spec §7.6).
 *
 * Migrated to MUI's Alert in Phase 2c with the `info` severity. The theme
 * already sets the surface background and 8px radius for Alerts; the icon is
 * swapped for the shared Icon component so the glyph stays consistent with the
 * rest of the app.
 */
export default function FormNote({ children }) {
  return (
    <Alert
      severity="info"
      icon={<Icon name="info" size={18} />}
      sx={{
        mt: 2,
        fontSize: 12,
        backgroundColor: 'surface',
        color: 'secondary.main',
        alignItems: 'flex-start',
        '& .MuiAlert-icon': {
          color: 'secondary.main',
          padding: 0,
          marginRight: 1,
          alignItems: 'center',
        },
      }}
    >
      {children}
    </Alert>
  )
}