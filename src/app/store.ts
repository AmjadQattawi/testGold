import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import companyReducer from "../features/company/companySlice";

export function createAppStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      company: companyReducer,
    },
  });
}
export const store = createAppStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
