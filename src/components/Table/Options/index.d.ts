export interface IOption {
  type: "link" | "button";
  handle: (id?: string) => void;
  link?: string;
  title: string;
  icon: JSX.Element;
  action?: "view" | "edit"
}

export interface IOptions {
  option: IOption[];
  id: string;
}