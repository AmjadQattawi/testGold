import type {
  GemstoneCollectionLine,
  GoldBoxLine,
  JewelryPieceLine,
  SalesInvoiceDraft,
  ServiceMaterialLine,
} from "../utils/salesInvoice";

export type SalesInvoiceState = {
  draft: SalesInvoiceDraft;
  saved: SalesInvoiceDraft[];
};

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
    };

export function createSalesInvoiceState(
  draft: SalesInvoiceDraft,
  saved: SalesInvoiceDraft[],
): SalesInvoiceState {
  return { draft, saved };
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
    case "draftOpened":
      return {
        ...state,
        draft: action.draft,
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


    // end switch
  }
}
