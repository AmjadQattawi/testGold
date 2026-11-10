import type {
  GemstoneCollectionLine,
  GoldBoxLine,
  JewelryPieceLine,
  SalesInvoiceDraft,
  ServiceMaterialLine,
} from "../utils/salesInvoice";

export type InvoiceTable = "jewelry" | "goldBoxes" | "services" | "gemstones";

export type SalesInvoiceState = {
  draft: SalesInvoiceDraft;
  saved: SalesInvoiceDraft[];
  selectedIds: Record<InvoiceTable, string[]>;
};

// function emptySelection(): Record<InvoiceTable, string[]> {

function emptySelection(): SalesInvoiceState["selectedIds"] {
  return {
    jewelry: [],
    goldBoxes: [],
    services: [],
    gemstones: [],
  };
}
export type InvoiceFieldName =
  | "date"
  | "number"
  | "automaticNo"
  | "account"
  | "employee"
  | "notes"
  | "confidentiality"
  | "goldPrice"
  | "addItem"
  | "salePriceDistribution";

export type SalesInvoiceAction =
  | {
      type: "fieldChanged";
      key: InvoiceFieldName;
      value: string;
    }
  | {
      type: "draftOpened";
      draft: SalesInvoiceDraft;
    }
  | {
      type: "jewelryPieceLineChanged";
      id: string;
      key: keyof JewelryPieceLine;
      value: string;
    }
  | {
      type: "goldBoxLineChanged";
      id: string;
      key: keyof GoldBoxLine;
      value: string;
    }
  | {
      type: "serviceMaterialLineChanged";
      id: string;
      key: keyof ServiceMaterialLine;
      value: string;
    }
  | {
      type: "gemstoneCollectionLineChanged";
      id: string;
      key: keyof GemstoneCollectionLine;
      value: string;
    }
  | {
      type: "rowsSelected";
      table: InvoiceTable;
      ids: string[];
    }
  | { type: "selectedRowsDeleted"; table: InvoiceTable };

const rowKeyByTable = {
  jewelry: "jewelryPiecesRow",
  goldBoxes: "goldBoxesRow",
  services: "serviceMaterialsRow",
  gemstones: "gemstoneCollectionsRow",
} as const satisfies Record<InvoiceTable, keyof SalesInvoiceDraft>;

export function createSalesInvoiceState(
  draft: SalesInvoiceDraft,
  saved: SalesInvoiceDraft[],
): SalesInvoiceState {
  return { draft, saved, selectedIds: emptySelection() };
}

export function salesInvoiceReducer(
  state: SalesInvoiceState,
  action: SalesInvoiceAction,
): SalesInvoiceState {
  switch (action.type) {
    case "fieldChanged":
      return {
        ...state,
        draft: {
          ...state.draft,
          [action.key]: action.value,
        },
      };
    case "rowsSelected":
      return {
        ...state,
        selectedIds: {
          ...state.selectedIds,
          [action.table]: action.ids,
        },
      };

    case "draftOpened":
      return {
        ...state,
        draft: action.draft,
        selectedIds: emptySelection(),
      };

    case "jewelryPieceLineChanged":
      if (action.key === "id" || action.key === "lineNo") return state;

      return {
        ...state,
        draft: {
          ...state.draft,
          jewelryPiecesRow: state.draft.jewelryPiecesRow.map((row) =>
            row.id === action.id ? { ...row, [action.key]: action.value } : row,
          ),
        },
      };

    case "goldBoxLineChanged":
      if (action.key === "id" || action.key === "lineNo") return state;

      return {
        ...state,
        draft: {
          ...state.draft,
          goldBoxesRow: state.draft.goldBoxesRow.map((row) =>
            row.id === action.id ? { ...row, [action.key]: action.value } : row,
          ),
        },
      };

    case "serviceMaterialLineChanged":
      if (action.key === "id" || action.key === "lineNo") return state;

      return {
        ...state,
        draft: {
          ...state.draft,
          serviceMaterialsRow: state.draft.serviceMaterialsRow.map((row) =>
            row.id === action.id ? { ...row, [action.key]: action.value } : row,
          ),
        },
      };

    case "gemstoneCollectionLineChanged":
      if (action.key === "id" || action.key === "lineNo") return state;

      return {
        ...state,
        draft: {
          ...state.draft,
          gemstoneCollectionsRow: state.draft.gemstoneCollectionsRow.map(
            (row) =>
              row.id === action.id
                ? { ...row, [action.key]: action.value }
                : row,
          ),
        },
      };

    case "selectedRowsDeleted": {
      const ids = state.selectedIds[action.table];

      if (ids.length === 0) return state;

      const selected = new Set(ids);
      const rowKey = rowKeyByTable[action.table];

      return {
        ...state,
        draft: {
          ...state.draft,
          [rowKey]: state.draft[rowKey].filter((row) => !selected.has(row.id)),
        },
        selectedIds: {
          ...state.selectedIds,
          [action.table]: [],
        },
      };
    }

    // end switch
  }
}
