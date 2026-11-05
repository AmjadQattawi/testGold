import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../../app/store";
import { getAllowedMenu } from "../../services/menuService";
import {
  beginCompanyRequest,
  finishCompanyRequest,
} from "../../services/companyRequests";
import i18n from "../../i18n";
import { initializationStarted, initializationFinished } from "./companySlice";
import type { Company } from "./companyTypes";

export const initializeCompany = createAsyncThunk<
  void,
  Company,
  { state: RootState; dispatch: AppDispatch }
>(
  "company/initialize",
  async (company, { dispatch, getState, requestId, signal }) => {
    const user = getState().auth.user;
    if (!user) throw new Error("No authenticated user");
    if (company.companyIsActive === false)
      throw new Error("Company is inactive");
    const controller = beginCompanyRequest();
    dispatch(initializationStarted({ company, requestId }));
    const deadline = AbortSignal.timeout(20_000);
    const requestSignal = AbortSignal.any([
      signal,
      deadline,
      controller.signal,
    ]);
    try {
      // Add future prerequisites here, once their API contracts are provided.
      const menu = await getAllowedMenu(company.id, requestSignal);
      requestSignal.throwIfAborted();
      dispatch(initializationFinished({ requestId, menu }));
    } catch (error) {
      if (controller.signal.aborted || signal.aborted) return;
      const message = deadline.aborted
        ? i18n.t("menuTimeout")
        : error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Request failed";
      dispatch(initializationFinished({ requestId, error: message }));
      // Menu loading already offers a retry; do not hide the company picker.
    } finally {
      finishCompanyRequest(controller);
    }
  },
);
