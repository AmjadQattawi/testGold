import { useReducer } from "react";
import {
  createSalesInvoiceState,
  salesInvoiceReducer,
  type InvoiceFieldName,
  type InvoiceTable,
} from "../reducers/SalesInvoiceReducer";
import {
  newSalesInvoice,
  type GemstoneCollectionLine,
  type GoldBoxLine,
  type JewelryPieceLine,
  type SalesInvoiceDraft,
  type ServiceMaterialLine,
} from "../utils/salesInvoice";
import {
  readDrafts,
  salesInvoiceStorageKey,
} from "../services/salesInvoiceDraftStorage";
import type { VoucherAction as ToolbarAction } from "../components/voucher/VoucherToolbar";
export function useSalesInvoice(companyId: string) {
  const storageKey = salesInvoiceStorageKey(companyId);

  const [state, dispatch] = useReducer(salesInvoiceReducer, storageKey, (key) =>
    createSalesInvoiceState(newSalesInvoice(), readDrafts(key)),
  );

  function change(key: InvoiceFieldName, value: string) {
    dispatch({ type: "fieldChanged", key, value });
  }

  function selectRows(table: InvoiceTable, ids: string[]) {
    dispatch({ type: "rowsSelected", table, ids });
  }

  function jewelryPieceLineChanged(
    id: string,
    key: keyof JewelryPieceLine,
    value: string,
  ) {
    dispatch({ type: "jewelryPieceLineChanged", id, key, value });
  }

  function goldBoxLineChanged(
    id: string,
    key: keyof GoldBoxLine,
    value: string,
  ) {
    dispatch({ type: "goldBoxLineChanged", id, key, value });
  }

  function serviceMaterialLineChanged(
    id: string,
    key: keyof ServiceMaterialLine,
    value: string,
  ) {
    dispatch({
      type: "serviceMaterialLineChanged",
      id,
      key,
      value,
    });
  }

  function gemstoneCollectionLineChanged(
    id: string,
    key: keyof GemstoneCollectionLine,
    value: string,
  ) {
    dispatch({
      type: "gemstoneCollectionLineChanged",
      id,
      key,
      value,
    });
  }

  const selectedIndex = state.saved.findIndex(
    (item) => item.id === state.draft.id,
  );

  function openDraft(value: SalesInvoiceDraft) {
    dispatch({
      type: "draftOpened",
      draft: structuredClone(value),
    });
  }
  function jump(index: number) {
    const selectedDraft = state.saved[index];

    if (selectedDraft) {
      openDraft(selectedDraft);
    }
  }

  function deleteSelectedRows(table: InvoiceTable) {
    dispatch({ type: "selectedRowsDeleted", table });
  }

  //

  const actions: ToolbarAction[] = [
    {
      id: "save",
      label: "Save",
      icon: "save",
      type: "button",
      variant: "primary",
    },
    {
      id: "new",
      label: "New",
      icon: "new",
    },
    {
      id: "post",
      label: "Post",
      icon: "send",
    },
    {
      id: "delete",
      label: "Delete",
      icon: "trash",
      variant: "danger",
    },
    {
      id: "search",
      label: "Search",
      icon: "search",
    },
    {
      id: "print",
      label: "Print",
      icon: "print",
      onClick: () => window.print(),
    },
    {
      id: "exit",
      label: "Exit",
      icon: "exit",
    },
    {
      id: "archive",
      label: "Archive",
      icon: "archive",
    },
    {
      id: "restore",
      label: "Restore",
      icon: "reset",
    },
  ];

  //

  return {
    state,
    change,
    selectedIndex,
    jump,
    jewelryPieceLineChanged,
    goldBoxLineChanged,
    serviceMaterialLineChanged,
    gemstoneCollectionLineChanged,
    actions,
    selectRows,
    deleteSelectedRows,
  };
}
