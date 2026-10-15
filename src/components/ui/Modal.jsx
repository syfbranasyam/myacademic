import { useRef } from 'react'
import MuiDialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Icon from './Icon.jsx'

/*
 * Modal shell (spec §7.9, revision Phase 2d, UI-polish Part A).
 *
 * MUI Dialog handles focus trap, focus restore, Escape, and backdrop click.
 * Focus lands on the first form control (not the close button).
 *
 * `hideCancel`: view-only modals render just a Close button.
 *
 * `printable` (new in UI-polish): when true, the modal is visible in
 * @media print and is the only element that appears on the printed page.
 * The page must add the `printing-modal` class to <body> before calling
 * window.print() and remove it afterward — see theme.css.
 */

const WIDTHS = { standard: 448, wide: 672, small: 384 }

const FORM_CONTROL =
  'input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled])'

export default function Modal({
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel,
  width = 'standard',
  cancelLabel = 'Cancel',
  hideCancel = false,
  printable = false,
  children,
}) {
  const panelRef = useRef(null)

  const handleEntered = () => {
    const panel = panelRef.current
    if (!panel) return
    const first = panel.querySelector(FORM_CONTROL)
    if (first) first.focus()
  }

  return (
    <MuiDialog
      open
      fullWidth
      maxWidth={false}
      onClose={onClose}
      aria-label={title}
      onTransitionEntered={handleEntered}
      className={printable ? 'print-modal-root' : ''}
      sx={{
        // Non-printable modals are hidden on print. Printable ones are shown
        // only when the body carries the `printing-modal` class (see theme.css).
        ...(printable
          ? {}
          : { '@media print': { display: 'none !important' } }),
        '& .MuiDialog-paper': {
          maxWidth: `${WIDTHS[width] ?? WIDTHS.standard}px`,
          borderRadius: '16px',
          boxShadow: '0 24px 48px rgba(17, 28, 45, 0.24)',
          backgroundImage: 'none',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(38, 49, 67, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      <Box ref={panelRef}>
        <DialogTitle
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            p: '20px 24px 8px',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', m: 0 }}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5, lineHeight: 1.4 }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close"
            sx={{
              color: 'text.secondary',
              mt: -0.5,
              mr: -0.5,
              '@media print': printable ? { display: 'none' } : {},
            }}
          >
            <Icon name="close" size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: '8px 24px' }}>{children}</DialogContent>

        <DialogActions
          sx={{
            p: '16px 24px',
            backgroundColor: 'background.default',
            gap: 1,
            '@media print': printable ? { display: 'none' } : {},
          }}
        >
          {hideCancel ? null : (
            <Button
              onClick={onClose}
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                '&:hover': { backgroundColor: 'surface' },
              }}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onSubmit}
            startIcon={<Icon name="check" size={18} />}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </MuiDialog>
  )
}