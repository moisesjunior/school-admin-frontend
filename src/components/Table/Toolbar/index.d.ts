export interface IToolbar {
  name: string;
  url?: string;
  title?: string;
  handleFilter?: () => void;
  filter?: string;
}
