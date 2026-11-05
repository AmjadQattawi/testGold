import { useReducer, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/toastContext";
import { useDialog } from "../context/dialogContext";
import { paymentVoucherStorageKey } from "../services/paymentVoucherDraftStorage";
import {
  createPaymentVoucherState,
  PaymentVoucherReducer,
  type PaymentVoucherFieldName,
} from "../reducers/PaymentVoucherReducer";
import {
  newPaymentVoucher,
  paymentLineError,
  PaymentVoucherTotals,
  type PaymentVoucherDraft,
  type PaymentVoucherLine,
} from "../utils/PaymentVoucher";
import {
  readDrafts,
  writeDrafts,
} from "../services/paymentVoucherDraftStorage";
import type { VoucherAction as ToolbarAction } from "../components/voucher/VoucherToolbar";
import { useTranslation } from "react-i18next";

export function usePaymentVoucher(companyId: string) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const storageKey = paymentVoucherStorageKey(companyId);
  const [state, dispatch] = useReducer(
    PaymentVoucherReducer,
    storageKey,
    (key) => createPaymentVoucherState(newPaymentVoucher(), readDrafts(key)),
  );
  const { draft, saved } = state;
  const [validatedRows, setValidatedRows] = useState<Set<string>>(
    () => new Set(),
  );
  // const blockedRow = draft.rows.find((row) => voucherLineError(row));
  const blockedRow = draft.rows.find((row) => paymentLineError(row));
  const rowError =
    blockedRow && validatedRows.has(blockedRow.id)
      ? t(paymentLineError(blockedRow)!, { row: blockedRow.lineNo })
      : "";

  const totals = PaymentVoucherTotals(draft.rows);
  const selectedIndex = saved.findIndex((item) => item.id === draft.id);

  function change(key: PaymentVoucherFieldName, value: string) {
    dispatch({ type: "fieldChanged", key, value });
  }
  function changeLine(
    id: string,
    key: keyof PaymentVoucherLine,
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

  function openDraft(value: PaymentVoucherDraft) {
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

  function persist(
    items: PaymentVoucherDraft[],
    current?: PaymentVoucherDraft,
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
        message: "Could not save Payment vouchers.",
      });
      return false;
    }
  }

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
          ? "Payment voucher archived."
          : "Payment voucher saved.",
      });
    }
  }

  function remove() {
    if (blockedRow || !window.confirm(t("voucherDeleteConfirm"))) return;
    if (
      persist(
        saved.filter((item) => item.id !== draft.id),
        newPaymentVoucher(),
      )
    )
      showToast({ message: t("voucherDeleted") });
  }

  function restore() {
    const value = saved.find((item) => item.id === draft.id);

    if (value) {
      openDraft(value);
      showToast({ message: "Payment voucher restored." });
    } else {
      showDialog({ message: "No saved version of this voucher." });
    }
  }

  function post() {
    if (blockedRow) return;
    const invalid =
      !state.draft.date || !state.draft.account.trim() || totals.credit <= 0;
    showDialog({
      variant: invalid ? "error" : "info",
      message: invalid
        ? "Enter the voucher date, account, and a positive total."
        : "Posting is not available yet. Backend integration is required.",
    });
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
      onClick: () => openDraft(newPaymentVoucher()),
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
