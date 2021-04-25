import { Store } from 'pullstate';

interface UIStoreState {
  signed: boolean;
  name: string;
}

export const UIStore = new Store<UIStoreState>({
  signed: Boolean(localStorage.getItem('signed')) || false,
  name: localStorage.getItem('name') || ''
});