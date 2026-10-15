import { useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

import PageHeader from '../components/layout/PageHeader.jsx'
import { Avatar, Icon, StatusBadge } from '../components/ui'

import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useCrudConfirm } from '../hooks/useCrudConfirm.js'
import { isValidEmail, isValidPassword } from '../utils/validation.js'
import { PROFILE_GENDERS } from '../data/referenceData.js'

/*
 * Profile page (spec §5.3, UI-polish round 2).
 *
 * Cleaned up:
 *   - Removed breadcrumb.
 *   - Removed the info panel from the identity card — NIP, email, and phone
 *     already appear in the Personal Information form; duplicating them
 *     created visual noise with no added value.
 *   - Removed the two long subtitles on the right cards.
 *   - Card title size reduced from 18 to 16px.
 *   - Password requirements condensed from three chips to a single line.
 *
 * Preserved: photo upload + preview, dirty tracking, save confirmation,
 * password validation, role badge, and both forms.
 */

const EDITABLE_FIELDS = ['name', 'email', 'phone', 'gender']

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth()
  const { showToast } = useToast()
  const { confirmSave } = useCrudConfirm()

  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    gender: currentUser.gender,
  })

  const [photoDataUrl, setPhotoDataUrl] = useState(currentUser.photoDataUrl ?? '')

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({
    current: false,
    next: false,
    confirm: false,
  })

  const fileInputRef = useRef(null)

  const roleLabel = currentUser.role === 'admin' ? 'Administrator' : 'Teacher'
  const displayName = currentUser.name

  const isDirty = useMemo(() => {
    for (const key of EDITABLE_FIELDS) {
      if (form[key] !== currentUser[key]) return true
    }
    return photoDataUrl !== (currentUser.photoDataUrl ?? '')
  }, [form, currentUser, photoDataUrl])

  /* ---------------------------------------------------------------- *
   * Photo handling
   * ---------------------------------------------------------------- */

  const openFilePicker = () => fileInputRef.current?.click()

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPhotoDataUrl(String(reader.result))
    reader.onerror = () => showToast('Could not read the image file')
    reader.readAsDataURL(file)
  }

  /* ---------------------------------------------------------------- *
   * Personal info
   * ---------------------------------------------------------------- */

  const handleSave = async () => {
    if (!form.name.trim() || !isValidEmail(form.email)) {
      showToast('Name and a valid email are required')
      return
    }
    const ok = await confirmSave({
      title: 'Save changes?',
      text: 'Update your profile information?',
      confirmText: 'Save',
    })
    if (!ok) return
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      gender: form.gender,
      photoDataUrl,
    })
    showToast('Profile saved')
  }

  const handleDiscard = () => {
    setForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      gender: currentUser.gender,
    })
    setPhotoDataUrl(currentUser.photoDataUrl ?? '')
    showToast('Changes discarded')
  }

  /* ---------------------------------------------------------------- *
   * Password
   * ---------------------------------------------------------------- */

  const handleUpdatePassword = () => {
    if (!pwd.current) {
      showToast('Enter your current password')
      return
    }
    if (!isValidPassword(pwd.next)) {
      showToast('Password does not meet requirements')
      return
    }
    if (pwd.next !== pwd.confirm) {
      showToast('Passwords do not match')
      return
    }
    setPwd({ current: '', next: '', confirm: '' })
    showToast('Password updated')
  }

  const handleCancelPassword = () => {
    setPwd({ current: '', next: '', confirm: '' })
  }

  /* ---------------------------------------------------------------- *
   * Render
   * ---------------------------------------------------------------- */

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and account security."
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleDiscard}
              disabled={!isDirty}
              sx={{
                color: 'primary.main',
                borderColor: 'transparent',
                backgroundColor: 'surfaceHigh',
                '&:hover': {
                  backgroundColor: 'surface',
                  borderColor: 'transparent',
                },
                '&.Mui-disabled': {
                  color: 'text.disabled',
                  backgroundColor: 'surfaceLow',
                },
              }}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isDirty}
              startIcon={<Icon name="check" size={18} />}
            >
              Save Changes
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        {/* ========================== Left card ========================== */}
        <Grid size={{ xs: 12, lg: 4, xl: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                onClick={openFilePicker}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openFilePicker()
                }}
                aria-label="Change profile photo"
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  '&:hover .avatar-overlay': { opacity: 1 },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: '0 0 0 3px rgba(233, 30, 99, 0.25)',
                  },
                }}
              >
                <Avatar
                  name={displayName}
                  index={0}
                  size={96}
                  src={photoDataUrl}
                />
                <Box
                  className="avatar-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 120ms',
                    pointerEvents: 'none',
                  }}
                >
                  <Icon name="photo_camera" size={26} />
                </Box>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />

              <Typography
                sx={{ mt: 2, fontSize: 18, fontWeight: 600, color: 'text.primary' }}
              >
                {displayName}
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}
              >
                {currentUser.school}
              </Typography>

              <Stack
                direction="row"
                spacing={0.75}
                sx={{ mt: 1.5, justifyContent: 'center' }}
              >
                <StatusBadge variant="pink">{roleLabel}</StatusBadge>
                <StatusBadge variant="blue">{currentUser.status}</StatusBadge>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={0.75} sx={{ textAlign: 'left', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 12,
                    color: 'text.secondary',
                  }}
                >
                  <Icon name="history" size={14} />
                  <Box component="span">Last Login</Box>
                  <Box
                    component="span"
                    className="num"
                    sx={{ ml: 'auto', color: 'text.primary', fontWeight: 500 }}
                  >
                    Today, 08:30 WIB
                  </Box>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                fullWidth
                onClick={openFilePicker}
                startIcon={<Icon name="upload" size={18} />}
                sx={{
                  color: 'primary.main',
                  borderColor: 'transparent',
                  backgroundColor: 'surfaceHigh',
                  '&:hover': {
                    backgroundColor: 'surface',
                    borderColor: 'transparent',
                  },
                }}
              >
                Change Photo
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ========================== Right column ========================== */}
        <Grid size={{ xs: 12, lg: 8, xl: 9 }}>
          <Stack spacing={2.5}>
            {/* Personal Information */}
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
                  Personal Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Full Name & Title"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="NIP / Employee Number"
                      value={currentUser.nip}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': { backgroundColor: 'surface' },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Institutional Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Phone / WhatsApp"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Gender"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      fullWidth
                    >
                      {PROFILE_GENDERS.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Department & Assignment"
                      value={currentUser.department}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': { backgroundColor: 'surface' },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Security & Password */}
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
                  Security & Password
                </Typography>

                <Stack spacing={2}>
                  <PasswordInput
                    label="Current Password"
                    value={pwd.current}
                    onChange={(v) => setPwd({ ...pwd, current: v })}
                    visible={showPwd.current}
                    onToggle={() =>
                      setShowPwd({ ...showPwd, current: !showPwd.current })
                    }
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <PasswordInput
                        label="New Password"
                        value={pwd.next}
                        onChange={(v) => setPwd({ ...pwd, next: v })}
                        visible={showPwd.next}
                        onToggle={() =>
                          setShowPwd({ ...showPwd, next: !showPwd.next })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <PasswordInput
                        label="Confirm New Password"
                        value={pwd.confirm}
                        onChange={(v) => setPwd({ ...pwd, confirm: v })}
                        visible={showPwd.confirm}
                        onToggle={() =>
                          setShowPwd({ ...showPwd, confirm: !showPwd.confirm })
                        }
                      />
                    </Grid>
                  </Grid>

                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    Requires 8+ characters with a letter, a number, and a symbol.
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCancelPassword}
                      disabled={!pwd.current && !pwd.next && !pwd.confirm}
                      sx={{
                        color: 'primary.main',
                        borderColor: 'transparent',
                        backgroundColor: 'surfaceHigh',
                        '&:hover': {
                          backgroundColor: 'surface',
                          borderColor: 'transparent',
                        },
                        '&.Mui-disabled': {
                          color: 'text.disabled',
                          backgroundColor: 'surfaceLow',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdatePassword}>
                      Update Password
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * Small helper: password field with eye toggle
 * ------------------------------------------------------------------ */

function PasswordInput({ label, value, onChange, visible, onToggle }) {
  return (
    <TextField
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onToggle}
              edge="end"
              size="small"
              aria-label={visible ? 'Hide password' : 'Show password'}
              sx={{ color: 'text.secondary' }}
            >
              <Icon name="visibility" size={18} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}