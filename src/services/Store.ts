import { Store } from 'pullstate';

interface UIStoreState {
  signed: boolean;
}

export const UIStore = new Store<UIStoreState>({
  signed: Boolean(localStorage.getItem('signed')) || false
});