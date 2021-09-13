import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from './store';

// used to correctly dispatch actions and thunks without having to import the AppDispatch where it's needed;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Saves the need to type (state: RootState) every time;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;