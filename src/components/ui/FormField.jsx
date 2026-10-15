import Box from '@mui/material/Box'

/*
 * Uppercase label above a control (spec §7.6).
 *
 * Migrated to MUI in Phase 2c using plain Box + label primitives, because the
 * children rendered inside are still a mix of Bootstrap-styled inputs and MUI
 * TextFields during the migration window. Wrapping in MUI's FormControl would
 * impose input-id coupling that the callers don't all follow, so the field is
 * layout-neutral on purpose.
 *
 * `labelClassName` is preserved because the login screen is the one place the
 * prototype overrides the uppercase treatment (§5.3). When a non-default class
 * is passed, the default caps styling is skipped so the caller's class wins.
 */
export default function FormField({
  label,
  htmlFor,
  className = '',
  labelClassName = 'label-caps',
  children,
}) {
  const isDefaultLabel = labelClassName === 'label-caps'

  return (
    <Box className={className} sx={{ display: 'block' }}>
      <Box
        component="label"
        htmlFor={htmlFor}
        className={labelClassName}
        sx={{
          display: 'block',
          color: 'text.secondary',
          ...(isDefaultLabel && {
            mt: 1.5,
            mb: 0.5,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }),
        }}
      >
        {label}
      </Box>
      {children}
    </Box>
  )
}