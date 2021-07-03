import { TableCell, TableRow } from "@material-ui/core";

export default function EmptyRow() {
  return (
    <TableRow style={{ height: 10 }}>
      <TableCell align="center" colSpan={6}>
        <h2>"AAAAA"</h2>
      </TableCell>
    </TableRow>
  )
}