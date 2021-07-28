export interface IOnChangePage {
  event: unknown;
  newPage: number;
} 

export interface IPagination {
  quantityOfRows: number[];
  component: string;
  totalOfRows: number;
  rowsPerPage: number;
  page: number;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}