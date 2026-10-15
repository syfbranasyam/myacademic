import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import Icon from '../components/ui/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

/*
 * 403 page (Phase 4b).
 *
 * Shown when a signed-in user tries to access a route their role cannot see.
 * Offers a single action: return to the dashboard.
 */
export default function ForbiddenPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 420,
          p: 4,
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(17, 28, 45, 0.05)',
          backgroundImage: 'none',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(254, 243, 199, 1)',
            color: '#b45309',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Icon name="shield-lock" size={28} />
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: 600, color: 'text.primary' }}>
          Access denied
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5, mb: 3 }}>
          {currentUser
            ? `Signed in as ${currentUser.name} (${currentUser.role}). This page requires a different role.`
            : 'You do not have permission to view this page.'}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          startIcon={<Icon name="arrow_back" size={18} />}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  )
}