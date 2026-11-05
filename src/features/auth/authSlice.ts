import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUser } from "./authTypes";

type AuthState = { user: CurrentUser | null };
const initialState: AuthState = { user: null };
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userReceived(state, action: PayloadAction<CurrentUser>) {
      state.user = action.payload;
    },
    authCleared: () => initialState,
  },
});
export const { userReceived, authCleared } = slice.actions;
export default slice.reducer;
