import { styled } from '@mui/material/styles'

/*
 * Table row shown when no rows match (spec §8.2).
 *
 * Styled with a plain styled `td` rather than MUI's TableCell: the parent
 * table during Phase 2 is still a plain `<table className="table">` styled by
 * Bootstrap, and a plain `td` composed with theme tokens keeps the cell
 * layout-neutral. When the tables themselves migrate to MUI's Table in a later
 * phase this component can switch to TableCell with no API change.
 */

const EmptyCell = styled('td')(({ theme }) => ({
  padding: '40px 16px',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: 14,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}))

export default function EmptyRow({ colSpan = 1, children }) {
  return (
    <tr>
      <EmptyCell colSpan={colSpan}>{children}</EmptyCell>
    </tr>
  )
}