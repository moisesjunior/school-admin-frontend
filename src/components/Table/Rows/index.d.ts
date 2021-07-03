import { HeadCell } from '../Header/index.d';
import { IOption } from '../Options/index.d';

export interface IBody {
  rows: any;
  headCells: HeadCell[];
  emptyRows: number;
  page: number;
  rowsPerPage: number;
  name: string;
  options: IOption[];
  order: 'asc' | 'desc';
  orderBy: string;
  selectedCells: (value: IRow) => {};
}

export interface IRow {
  [key: string]: any;
}