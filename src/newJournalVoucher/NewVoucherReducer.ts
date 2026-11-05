import {
  isCompleteLine,
  type NewVoucherDraft,
  type NewVoucherLine,
} from "./NewJournalVoucherUtils";

export type NewVoucherChanges = Partial<Omit<NewVoucherLine, "id" | "lineNo">>;

export type NewVoucherFieldName =
  | "number"
  | "automaticNo"
  | "date"
  | "confidentiality"
  | "notes";

export type NewVoucherState = {
  draft: NewVoucherDraft;
  saved: NewVoucherDraft[];
  selectedIds: string[];
  searchOpen: boolean;
  search: string;
};

export type NewVoucherAction =
  | {
      type: "fieldChanged";
      key: NewVoucherFieldName;
      value: string;
    }
  | {
      type: "lineChanged";
      id: string;
      changes: NewVoucherChanges;
      nextLine: NewVoucherLine;
    }
  | {
      type: "rowsSelected";
      ids: string[];
    }
  | {
      type: "draftOpened";
      draft: NewVoucherDraft;
    }
  | {
      type: "selectedRowsDeleted";
      emptyLine: NewVoucherLine;
    }
  | {
      type: "draftsPersisted";
      saved: NewVoucherDraft[];
      draft?: NewVoucherDraft;
    }
  | {
      type: "searchToggled";
    }
  | {
      type: "searchChanged";
      value: string;
    };

export function createNewVoucherState(
  draft: NewVoucherDraft,
  saved: NewVoucherDraft[],
): NewVoucherState {
  return {
    draft,
    saved,
    selectedIds: [],
    searchOpen: false,
    search: "",
  };
}

export function newVoucherReducer(
  state: NewVoucherState,
  action: NewVoucherAction,
): NewVoucherState {
  switch (action.type) {
    case "fieldChanged":
      return {
        ...state,
        draft: {
          ...state.draft,
          [action.key]: action.value,
        },
      };

    case "lineChanged": {
      const rows = state.draft.rows.map((row) =>
        row.id === action.id
          ? {
              ...row,
              ...action.changes,
              id: row.id,
              lineNo: row.lineNo,
            }
          : row,
      );
      const shouldAddLine = rows.length > 0 && rows.every(isCompleteLine);
      return {
        ...state,
        draft: {
          ...state.draft,
          rows: shouldAddLine ? [...rows, action.nextLine] : rows,
        },
      };
    }

    case "rowsSelected":
      return {
        ...state,
        selectedIds: [...new Set(action.ids)].filter((id) =>
          state.draft.rows.some((row) => row.id === id),
        ),
      };

    case "selectedRowsDeleted": {
      if (state.selectedIds.length === 0) return state;

      const remaining = state.draft.rows.filter(
        (row) => !state.selectedIds.includes(row.id),
      );

      const rows =
        remaining.length > 0
          ? remaining.map((row, index) => ({
              ...row,
              lineNo: index + 1,
            }))
          : [action.emptyLine];

      return {
        ...state,
        draft: {
          ...state.draft,
          rows,
        },
        selectedIds: [],
      };
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
      return {
        ...state,
        searchOpen: !state.searchOpen,
      };

    case "searchChanged":
      return {
        ...state,
        search: action.value,
      };
  }
}
