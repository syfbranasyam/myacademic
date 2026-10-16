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
 * Login (spec §5.3, Phase 4b; Batch 5 background).
 *
 * Authentication is unchanged: credentials are checked against the mock USERS
 * table in referenceData.js. Two demo roles are listed below the form; other
 * teacher usernames (citra, andi, sri, fauzi, rahmat) also work.
 *
 * Background (Batch 5):
 *   - public/bg.png is loaded as a full-bleed, cover-scaled backdrop.
 *   - A dark gradient overlay sits between the image and the form so the
 *     white glass card stays readable on any photo.
 *   - The overlay is decorative and marked aria-hidden.
 *   - pointerEvents: 'none' on both layers, so clicks pass through to the
 *     form even when the image is loading slowly or missing.
 *
 * Fallback: when /bg.png is unavailable, the two non-image layers leave the
 * theme's background.default visible, so the page still renders cleanly with
 * no errors.
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
      {/* Background image — full-bleed, cover-scaled, non-interactive */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Contrast overlay — darker at the edges, softer in the centre so the
          photo still reads behind the glass card */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(160deg, rgba(17, 28, 45, 0.55) 0%, rgba(17, 28, 45, 0.35) 45%, rgba(17, 28, 45, 0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 24px 48px rgba(17, 28, 45, 0.32)',
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