import MuiAvatar from '@mui/material/Avatar'
import { getAvatarTone } from '../../styles/muiTheme'

/*
 * Circular avatar (spec §8.2, revision Phase 8).
 *
 * Two modes:
 *   - When `src` is a non-empty data URL, the avatar shows the photo.
 *   - Otherwise it falls back to initials computed from `name`, using the
 *     three-tone cycle by `index`.
 *
 * MUI's Avatar handles the fallback automatically — if the image fails to
 * load, the initials render instead.
 *
 * The prototype passes the page-offset row index rather than a per-page index,
 * so an avatar's colour changes when you paginate; that quirk is preserved.
 */

function initialsOf(name) {
  return String(name ?? '')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, index = 0, size = 32, src = '' }) {
  const tone = getAvatarTone(index)

  return (
    <MuiAvatar
      src={src || undefined}
      sx={{
        width: size,
        height: size,
        fontSize: `${Math.round(size / 2.67)}px`,
        fontWeight: 700,
        backgroundColor: tone.bg,
        color: tone.fg,
      }}
    >
      {initialsOf(name)}
    </MuiAvatar>
  )
}