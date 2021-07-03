export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  type?: "date" | "money" | "text" | "cpf" | "dateReference" | "dueDate";
}

export interface IHeader {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  headCells: HeadCell[];
}