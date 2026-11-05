import {
  deleteReceiptVoucherLines,
  receiptLineError,
  updateReceiptVoucherLine,
  type ReceiptVoucherDraft,
  type ReceiptVoucherLine,
} from "../utils/receiptVoucher";

export type ReceiptVoucherState = {
  draft: ReceiptVoucherDraft;
  saved: ReceiptVoucherDraft[];
  selectedIds: string[];
  searchOpen: boolean;
  search: string;
};

//  لل inputs اللي فوق  رح استخدمه لاحقا مع action.key
export type ReceiptVoucherFieldName =
  | "number"
  | "automaticNo"
  | "date"
  | "confidentiality"
  | "notes"
  | "account";

export type ReceiptVoucherAction =
  | {
      type: "fieldChanged";
      key: ReceiptVoucherFieldName;
      value: string;
    }
  | {
      type: "draftOpened";
      draft: ReceiptVoucherDraft;
    }
  | {
      type: "lineChanged";
      id: string;
      key: keyof ReceiptVoucherLine;
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
      saved: ReceiptVoucherDraft[];
      draft?: ReceiptVoucherDraft;
    }
  | { type: "searchToggled" }
  | { type: "searchChanged"; value: string };

export function createReceiptVoucherState(
  draft: ReceiptVoucherDraft,
  saved: ReceiptVoucherDraft[],
) {
  // اختصار لـ: return { draft: draft };
  return { draft, saved, selectedIds: [], searchOpen: false, search: "" };
}

export function receiptVoucherReducer(
  state: ReceiptVoucherState,
  action: ReceiptVoucherAction,
): ReceiptVoucherState {
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
      const rows = updateReceiptVoucherLine(
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
      if (state.draft.rows.some((row) => receiptLineError(row))) {
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
      const renumberedRows = deleteReceiptVoucherLines(
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
