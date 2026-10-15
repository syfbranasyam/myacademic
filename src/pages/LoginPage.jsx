import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import Icon from '../components/ui/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

/*
 * Login (spec §5.3, Phase 4b).
 *
 * Now checks credentials against the mock USERS table. Two demo roles:
 *   admin  / admin123   Administrator
 *   budi   / budi123    Teacher
 * Other teacher usernames (citra, andi, sri, fauzi, rahmat) work too — see
 * referenceData.js. The demo hint below the form lists the primary two.
 *
 * On success: navigate to /dashboard. On failure: "Invalid username or
 * password" toast.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [visible, setVisible] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    const user = login(username, password)
    if (!user) {
      showToast('Invalid username or password')
      return
    }

    navigate('/dashboard')
  }

  const fillDemo = (u, p) => {
    setUsername(u)
    setPassword(p)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -160,
          left: -160,
          width: 384,
          height: 384,
          borderRadius: '50%',
          backgroundColor: 'rgba(252, 231, 243, 0.6)',
          filter: 'blur(64px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: -160,
          right: -160,
          width: 384,
          height: 384,
          borderRadius: '50%',
          backgroundColor: 'rgba(222, 232, 255, 0.7)',
          filter: 'blur(64px)',
          pointerEvents: 'none',
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 420,
          p: 5,
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 24px 48px rgba(17, 28, 45, 0.24)',
          backgroundImage: 'none',
        }}
      >
        <Box component="img" src="/logo.svg" width={56} height={56} alt="" />

        <Typography
          component="h1"
          sx={{ mt: 1.5, mb: 0, fontSize: 20, fontWeight: 600, color: 'text.primary' }}
        >
          MyAcademic
        </Typography>
        <Typography sx={{ mb: 4, fontSize: 12, color: 'text.secondary' }}>
          Sistem Informasi Akademik
        </Typography>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="login-username"
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            fullWidth
          />

          <TextField
            id="login-password"
            label="Password"
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setVisible((current) => !current)}
                      edge="end"
                      size="small"
                      aria-label={visible ? 'Hide password' : 'Show password'}
                      sx={{ color: 'text.secondary' }}
                    >
                      <Icon name="visibility" size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, height: 44 }}
        >
          Login
        </Button>

        <Divider sx={{ width: '100%', mt: 3, mb: 2 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', px: 1 }}>
            Demo accounts
          </Typography>
        </Divider>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            width: '100%',
          }}
        >
          <Button
            type="button"
            size="small"
            onClick={() => fillDemo('admin', 'admin123')}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 500,
              color: 'text.secondary',
              backgroundColor: 'surfaceLow',
              '&:hover': { backgroundColor: 'surface' },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.25 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                Administrator
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'var(--font-mono)' }}>
                admin / admin123
              </Typography>
            </Box>
          </Button>

          <Button
            type="button"
            size="small"
            onClick={() => fillDemo('budi', 'budi123')}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 500,
              color: 'text.secondary',
              backgroundColor: 'surfaceLow',
              '&:hover': { backgroundColor: 'surface' },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.25 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                Teacher
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'var(--font-mono)' }}>
                budi / budi123
              </Typography>
            </Box>
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}