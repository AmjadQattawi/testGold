import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Company } from "./companyTypes";

import type { MenuNode } from "../../services/menuService";
type CompanyState = {
  menu: MenuNode[];
  selectedCompany: Company | null;
  status: "idle" | "loading" | "ready" | "error";
  requestId: string | null;
  error: string | null;
};
const initialState: CompanyState = {
  selectedCompany: null,
  menu: [],
  status: "idle",
  requestId: null,
  error: null,
};
const slice = createSlice({
  name: "company",
  initialState,
  reducers: {
    companySelected(state, action: PayloadAction<Company>) {
      state.selectedCompany = action.payload;
      state.status = "idle";
      state.error = null;
      state.menu = [];
      state.requestId = null;
    },
    initializationStarted(
      state,
      action: PayloadAction<{ company: Company; requestId: string }>,
    ) {
      state.selectedCompany = action.payload.company;
      state.requestId = action.payload.requestId;
      state.status = "loading";
      state.error = null;
      state.menu = [];
    },
    initializationFinished(
      state,
      action: PayloadAction<{
        requestId: string;
        error?: string;
        menu?: MenuNode[];
      }>,
    ) {
      if (state.requestId !== action.payload.requestId) return;
      state.status = action.payload.error ? "error" : "ready";
      state.error = action.payload.error ?? null;
      state.menu = action.payload.menu ?? [];
    },
    companyCleared: () => initialState,
  },
});
export const {
  companySelected,
  companyCleared,
  initializationStarted,
  initializationFinished,
} = slice.actions;
export default slice.reducer;
