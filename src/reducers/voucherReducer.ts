import {
  deleteVoucherLines,
  updateVoucherLine,
  voucherLineError,
  type VoucherDraft,
  type VoucherLine,
} from "../utils/voucher";
export type VoucherFieldName =
  | "number"
  | "automaticNo"
  | "date"
  | "confidentiality"
  | "notes";
export type VoucherState = {
  draft: VoucherDraft;
  saved: VoucherDraft[];
  selectedIds: string[];
  searchOpen: boolean;
  search: string;
};
export type VoucherAction =
  | {
      type: "fieldChanged";
      key: VoucherFieldName;
      value: string;
    }
  | {
      type: "lineChanged";
      id: string;
      key: keyof VoucherLine;
      value: string;
      nextLine: VoucherLine;
    }
  | {
      type: "rowsSelected";
      ids: string[];
    }
  | {
      type: "selectedRowsDeleted";
      emptyLine: VoucherLine;
    }
  | {
      type: "draftOpened";
      draft: VoucherDraft;
    }
  | {
      type: "draftsPersisted";
      saved: VoucherDraft[];
      draft?: VoucherDraft;
    }
  | {
      type: "searchToggled";
    }
  | {
      type: "searchChanged";
      value: string;
    };
export function createVoucherState(
  draft: VoucherDraft,
  saved: VoucherDraft[],
): VoucherState {
  return { draft, saved, selectedIds: [], searchOpen: false, search: "" };
}
export function voucherReducer(
  state: VoucherState,
  action: VoucherAction,
): VoucherState {
  switch (action.type) {
    case "fieldChanged":
      return {
        ...state,
        draft: { ...state.draft, [action.key]: action.value },
      };
    case "lineChanged": {
      if (action.key === "id" || action.key === "lineNo") return state;
      const rows = updateVoucherLine(
        state.draft.rows,
        action.id,
        action.key,
        action.value,
        action.nextLine,
      );
      return rows === state.draft.rows
        ? state
        : { ...state, draft: { ...state.draft, rows } };
    }
    case "rowsSelected":
      return state.draft.rows.some((row) => voucherLineError(row))
        ? state
        : {
            ...state,
            selectedIds: [...new Set(action.ids)].filter((id) =>
              state.draft.rows.some((row) => row.id === id),
            ),
          };
    case "selectedRowsDeleted": {
      if (!state.selectedIds.length) return state;
      const rows = deleteVoucherLines(
        state.draft.rows,
        state.selectedIds,
        action.emptyLine,
      );
      return rows === state.draft.rows
        ? state
        : { ...state, draft: { ...state.draft, rows }, selectedIds: [] };
    }
    case "draftOpened":
      return {
        ...state,
        draft: action.draft,
        selectedIds: [],
        searchOpen: false,
      };
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
      return { ...state, search: action.value };
  }
}
