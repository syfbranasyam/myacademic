import MuiIcon from '@mui/material/Icon'
import { styled } from '@mui/material/styles'

/*
 * Material Symbols icon (spec §8.2).
 *
 * Migrated to MUI in Phase 2b: the component now uses MUI's Icon primitive
 * (which gives us theme-aware sizing and color via `sx`) while the icon glyphs
 * themselves are still served by the Material Symbols Outlined font loaded in
 * index.html. This is the canonical MUI way to render a custom icon font and
 * keeps the whole set of ~30 icons in use in one place without mapping each
 * name to an @mui/icons-material component.
 *
 * The `size` prop is still pixels and defaults to 20, matching the previous
 * `.ms` class behaviour. `className` passthrough is preserved so that callers
 * still using Bootstrap colour utilities (e.g. `text-primary`) keep working
 * until the 2g cleanup.
 */

const StyledIcon = styled(MuiIcon)({
  fontFamily: '"Material Symbols Outlined"',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: 20,
  lineHeight: 1,
  letterSpacing: 'normal',
  textTransform: 'none',
  display: 'inline-block',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
  direction: 'ltr',
  verticalAlign: 'middle',
  userSelect: 'none',
  WebkitFontSmoothing: 'antialiased',
})

export default function Icon({ name, size, className = '' }) {
  return (
    <StyledIcon
      className={className}
      sx={size ? { fontSize: `${size}px` } : undefined}
      aria-hidden="true"
    >
      {name}
    </StyledIcon>
  )
}