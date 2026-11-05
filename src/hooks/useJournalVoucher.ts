import { useReducer, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/toastContext";
import { useDialog } from "../context/dialogContext";
import {
  voucherReducer,
  createVoucherState,
  type VoucherFieldName,
} from "../reducers/voucherReducer";
import {
  voucherStorageKey,
  readDrafts,
  writeDrafts,
} from "../services/voucherDraftStorage";
import {
  blankLine,
  newVoucher,
  voucherLineError,
  voucherTotals,
  units, 
  type VoucherDraft,
  type VoucherLine,
} from "../utils/voucher";
import type { VoucherAction as ToolbarAction } from "../components/voucher/VoucherToolbar";
export function useJournalVoucher(companyId: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const storageKey = voucherStorageKey(companyId);
  const [state, dispatch] = useReducer(voucherReducer, storageKey, (key) =>
    createVoucherState(newVoucher(), readDrafts(key)),
  );
  const { draft, saved } = state;
  const [validatedRows, setValidatedRows] = useState<Set<string>>(
    () => new Set(),
  ); 
  const totals = voucherTotals(draft.rows);
  const blockedRow = draft.rows.find((row) => voucherLineError(row));
  const rowError =
    blockedRow && validatedRows.has(blockedRow.id)
      ? t(voucherLineError(blockedRow)!, { row: blockedRow.lineNo })
      : "";
  const errorColumns: (keyof VoucherLine)[] =
    blockedRow && voucherLineError(blockedRow) === "voucherAccountRequired"
      ? ["account"]
      : ["debit", "credit"];
  const selectedIndex = saved.findIndex((item) => item.id === draft.id);
  const change = (key: VoucherFieldName, value: string) =>
    dispatch({ type: "fieldChanged", key, value });

  const changeLine = (id: string, key: keyof VoucherLine, value: string) =>
    dispatch({
      type: "lineChanged",
      id,
      key,
      value,
      nextLine: blankLine(draft.rows.length + 1),
    });
  const selectRows = (ids: string[]) => dispatch({ type: "rowsSelected", ids });
  const deleteSelected = () =>
    dispatch({ type: "selectedRowsDeleted", emptyLine: blankLine(1) });

  const openDraft = (value: VoucherDraft) =>
    dispatch({ type: "draftOpened", draft: structuredClone(value) });

  function persist(items: VoucherDraft[], current?: VoucherDraft) {
    try {
      writeDrafts(storageKey, items);
      dispatch({ type: "draftsPersisted", saved: items, draft: current });
      return true;
    } catch {
      showDialog({ variant: "error", message: t("voucherStorageError") });
      return false;
    }
  }
  function save(event?: FormEvent, archived = draft.archived) {
    event?.preventDefault();
    if (blockedRow) return;
    const value = { ...draft, archived };
    if (
      persist([...saved.filter((item) => item.id !== draft.id), value], value)
    )
      showToast({ message: t(archived ? "voucherArchived" : "voucherSaved") });
  }
  function remove() {
    if (blockedRow || !window.confirm(t("voucherDeleteConfirm"))) return;
    if (
      persist(
        saved.filter((item) => item.id !== draft.id),
        newVoucher(),
      )
    )
      showToast({ message: t("voucherDeleted") });
  }
  function restore() {
    const value = saved.find((item) => item.id === draft.id);
    if (value) {
      openDraft(value);
      showToast({ message: t("voucherRestored") });
    } else showDialog({ message: t("voucherNoRestore") });
  }
  function post() {
    if (blockedRow) return;
    const invalid =
      !draft.date ||
      draft.rows.some(
        (row) =>
          (units(row.debit) > 0 || units(row.credit) > 0) &&
          (!row.account.trim() ||
            (units(row.debit) > 0 && units(row.credit) > 0)),
      );
    showDialog({
      variant: invalid || !totals.balanced ? "error" : "info",
      message: t(
        invalid
          ? "voucherInvalid"
          : !totals.balanced
            ? "voucherUnbalanced"
            : "voucherPostUnavailable",
      ),
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
      onClick: () => openDraft(newVoucher()),
    },
    { id: "post", label: t("voucherPost"), icon: "send", onClick: post },
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
    totals,
    blockedRow,
    rowError,
    errorColumns,
    validateRow: (id: string) =>
      setValidatedRows((previous) => new Set(previous).add(id)),
    editRow: (id: string) =>
      setValidatedRows((previous) => {
        if (!previous.has(id)) return previous;
        const next = new Set(previous);
        next.delete(id);
        return next;
      }),
    selectedIndex,
    change,
    changeLine,
    selectRows,
    deleteSelected,
    save,
    actions,
    openDraft,
    changeSearch: (value: string) => dispatch({ type: "searchChanged", value }),
    jump: (index: number) => {
      if (!blockedRow && saved[index]) openDraft(saved[index]);
    },
  };
}
