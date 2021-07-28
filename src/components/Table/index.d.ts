import { IOption } from './Options/index.d'; 
import { HeadCell } from './Header/index.d';
import { IRow } from './Rows/index.d'

interface ITable {
  name: string;
  url: string;
  headCells: HeadCell[];
  title?: string;
  formUrl?: string;
  emptyMessage: string;
  options: IOption[];
  handleFilter?: () => void;
  filter?: string;
  page?: number;
  selectedCells: (value: IRow) => {}
}
