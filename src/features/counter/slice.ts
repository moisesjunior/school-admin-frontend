import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../state/store';

interface CounterState {
  value: string[]
}

const initialState: CounterState = {
  value: [ 'foda-se', 'rola']
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((teste) => {
        console.log(teste); 
        return teste !== "foda-se"
      });
    },
    // decrement: state => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // }
  }
});

export const { increment } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;