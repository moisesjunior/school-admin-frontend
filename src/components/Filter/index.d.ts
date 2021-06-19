interface IFilter {
  children: JSX.Element | JSX.Element[];
  name: string;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export { IFilter };