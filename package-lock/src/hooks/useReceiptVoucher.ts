import {
  createReceiptVoucherState,
  receiptVoucherReducer,
  type ReceiptVoucherFieldName,
} from "../reducers/ReceiptVoucherReducer";
import { useReducer, useState, type FormEvent } from "react";
import {
  newReceiptVoucher,
  receiptLineError,
  receiptVoucherTotals,
  type ReceiptVoucherDraft,
  type ReceiptVoucherLine,
} from "../utils/receiptVoucher";
import {
  receiptVoucherStorageKey,
  readDrafts,
  writeDrafts,
} from "../services/receiptVoucherDraftStorage";
import { useToast } from "../context/toastContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { VoucherAction as ToolbarAction } from "../components/voucher/VoucherToolbar";
import { useDialog } from "../context/dialogContext";

export function useReceiptVoucher(companyId: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storageKey = receiptVoucherStorageKey(companyId);
  const [state, dispatch] = useReducer(
    receiptVoucherReducer,
    storageKey,
    (key) => createReceiptVoucherState(newReceiptVoucher(), readDrafts(key)),
  );
  const { draft, saved } = state;

  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [validatedRows, setValidatedRows] = useState<Set<string>>(
    () => new Set(),
  );
  const totals = receiptVoucherTotals(state.draft.rows);
  const blockedRow = state.draft.rows.find((row) => receiptLineError(row));
  const rowError =
    blockedRow && validatedRows.has(blockedRow.id)
      ? "Account is required for this row."
      : "";
  //   تضيف ID للسماح بعرض الخطأ
  function validateRow(id: string) {
    setValidatedRows((previous) => new Set(previous).add(id));
  }
  // تزيله عند العودة لتعديل السطر.
  function editRow(id: string) {
    setValidatedRows((previous) => {
      if (!previous.has(id)) return previous;

      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  }

  function change(key: ReceiptVoucherFieldName, value: string) {
    dispatch({ type: "fieldChanged", key, value });
  }
  function changeLine(
    id: string,
    key: keyof ReceiptVoucherLine,
    value: string,
  ) {
    dispatch({ type: "lineChanged", id, key, value });
  }
  function selectRows(ids: string[]) {
    dispatch({ type: "rowsSelected", ids });
  }

  function deleteSelected() {
    dispatch({ type: "selectedRowsDeleted" });
  }
  function openDraft(value: ReceiptVoucherDraft) {
    dispatch({
      type: "draftOpened",
      draft: structuredClone(value),
    });
  }
  function jump(index: number) {
    const selectedDraft = state.saved[index];

    if (!blockedRow && selectedDraft) {
      openDraft(selectedDraft);
    }
  }

  const selectedIndex = state.saved.findIndex(
    (item) => item.id === state.draft.id,
  );

  function persist(
    items: ReceiptVoucherDraft[],
    current?: ReceiptVoucherDraft,
  ) {
    try {
      writeDrafts(storageKey, items);
      dispatch({
        type: "draftsPersisted",
        saved: items,
        draft: current,
      });
      return true;
    } catch {
      showDialog({
        variant: "error",
        message: "Could not save receipt vouchers.",
      });
      return false;
    }
  }

  function changeSearch(value: string) {
    dispatch({ type: "searchChanged", value });
  }

  function save(event?: FormEvent, archived = state.draft.archived) {
    event?.preventDefault();
    if (blockedRow) return;
    const value = { ...state.draft, archived };
    const items = [
      ...state.saved.filter((item) => item.id !== state.draft.id),
      value,
    ];
    if (persist(items, value)) {
      showToast({
        message: archived
          ? "Receipt voucher archived."
          : "Receipt voucher saved.",
      });
    }
  }

  function remove() {
    if (blockedRow || !window.confirm(t("voucherDeleteConfirm"))) return;
    if (
      persist(
        saved.filter((item) => item.id !== draft.id),
        newReceiptVoucher(),
      )
    )
      showToast({ message: t("voucherDeleted") });
  }

  function post() {
    if (blockedRow) return;

    const invalid =
      !state.draft.date || !state.draft.account.trim() || totals.debit <= 0;

    showDialog({
      variant: invalid ? "error" : "info",
      message: invalid
        ? "Enter the voucher date, account, and a positive total."
        : "Posting is not available yet. Backend integration is required.",
    });
  }
  function restore() {
    const value = saved.find((item) => item.id === draft.id);

    if (value) {
      openDraft(value);
      showToast({ message: "Receipt voucher restored." });
    } else {
      showDialog({ message: "No saved version of this voucher." });
    }
  }

  const definitions: ToolbarAction[] = [
    {
      id: "save",
      label: t("voucherSave"),
      icon: "save",
      type: "submit",
      variant: "primary",
    },
    {
      id: "new",
      label: t("voucherNew"),
      icon: "new",
      onClick: () => openDraft(newReceiptVoucher()),
    },
    {
      id: "post",
      label: t("voucherPost"),
      icon: "send",
      onClick: post,
    },

    {
      id: "delete",
      label: t("voucherDelete"),
      icon: "trash",
      variant: "danger",
      onClick: remove,
    },
    {
      id: "search",
      label: t("voucherSearch"),
      icon: "search",
      onClick: () => dispatch({ type: "searchToggled" }),
    },
    {
      id: "print",
      label: t("voucherPrint"),
      icon: "print",
      onClick: () => window.print(),
    },
    {
      id: "exit",
      label: t("voucherExit"),
      icon: "exit",
      onClick: () => void navigate("/home"),
    },
    {
      id: "archive",
      label: t("voucherArchive"),
      icon: "archive",
      onClick: () => save(undefined, true),
      disabled: draft.archived,
    },
    {
      id: "restore",
      label: t("voucherRestore"),
      icon: "reset",
      onClick: restore,
    },
  ];
  const actions = definitions.map((action) => ({
    ...action,
    disabled:
      action.disabled ||
      (!!blockedRow && !["exit", "print"].includes(action.id)),
  }));

  return {
    state,
    change,
    jump,
    selectedIndex,
    changeLine,
    selectRows,
    deleteSelected,
    blockedRow,
    validateRow,
    editRow,
    rowError,
    totals,
    changeSearch,
    openDraft,
    save,
    actions,
  };
}
