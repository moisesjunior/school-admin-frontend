import { combineReducers } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/slice';

const rootReducer = combineReducers({
  counter: counterSlice
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>