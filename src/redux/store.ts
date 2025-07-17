import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/features/auth/authSlice";
import employeeReducer from "../components/features/employeeCardSlice";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
