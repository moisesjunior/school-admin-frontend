import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;

// Type: { counter: CounterState }
export type AppDispatch = typeof store.dispatch;