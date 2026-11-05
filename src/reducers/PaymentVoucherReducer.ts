import {
  deletePaymentVoucherLines,
  paymentLineError,
  updatePaymentVoucherLine,
  type PaymentVoucherDraft,
  type PaymentVoucherLine,
} from "../utils/PaymentVoucher";

export type PaymentVoucherState = {
  draft: PaymentVoucherDraft;
  saved: PaymentVoucherDraft[];
  selectedIds: string[];
  searchOpen: boolean;
  search: string;
};

export type PaymentVoucherFieldName =
  | "number"
  | "automaticNo"
  | "date"
  | "confidentiality"
  | "notes"
  | "account";

export type PaymentVoucherAction =
  | {
      type: "fieldChanged";
      key: PaymentVoucherFieldName;
      value: string;
    }
  | {
      type: "draftOpened";
      draft: PaymentVoucherDraft;
    }
  | {
      type: "lineChanged";
      id: string;
      key: keyof PaymentVoucherLine;
      value: string;
    }
  | {
      type: "rowsSelected";
      ids: string[];
    }
  | {
      type: "selectedRowsDeleted";
    }
  | {
      type: "draftsPersisted";
      saved: PaymentVoucherDraft[];
      draft?: PaymentVoucherDraft;
    }
  | { type: "searchToggled" }
  | { type: "searchChanged"; value: string };

export function createPaymentVoucherState(
  draft: PaymentVoucherDraft,
  saved: PaymentVoucherDraft[],
): PaymentVoucherState {
  return {
    draft,
    saved,
    selectedIds: [],
    searchOpen: false,
    search: "",
  };
}

export function PaymentVoucherReducer(
  state: PaymentVoucherState,
  action: PaymentVoucherAction,
) {
  switch (action.type) {
    case "fieldChanged":
      return {
        ...state,
        draft: { ...state.draft, [action.key]: action.value },
      };
    case "draftOpened":
      return {
        ...state,
        draft: action.draft,
        selectedIds: [],
        searchOpen: false,
      };
    case "lineChanged": {
      if (action.key === "id" || action.key === "lineNo") {
        return state;
      }
      const rows = updatePaymentVoucherLine(
        state.draft.rows,
        action.id,
        action.key,
        action.value,
      );
      if (rows === state.draft.rows) return state;
      return {
        ...state,
        draft: { ...state.draft, rows },
      };
    }
    //  عشان تغيير ال state تبعتها بس
    case "rowsSelected":
      if (state.draft.rows.some((row) => paymentLineError(row))) {
        return state;
      }
      return {
        ...state,
        selectedIds: [...new Set(action.ids)].filter((id) =>
          state.draft.rows.some((row) => row.id === id),
        ),
      };
    case "selectedRowsDeleted": {
      if (!state.selectedIds.length) return state;
      const renumberedRows = deletePaymentVoucherLines(
        state.draft.rows,
        state.selectedIds,
      );
      if (renumberedRows === state.draft.rows) return state;
      return {
        ...state,
        draft: { ...state.draft, rows: renumberedRows },
        selectedIds: [],
      };
    }
    case "draftsPersisted":
      return {
        ...state,
        saved: action.saved,
        draft: action.draft ?? state.draft,
        selectedIds:
          action.draft && action.draft.id !== state.draft.id
            ? []
            : state.selectedIds,
      };
    case "searchToggled":
      return { ...state, searchOpen: !state.searchOpen };

    case "searchChanged":
      return { ...state, search: action.value }; // end switch
  }
}
