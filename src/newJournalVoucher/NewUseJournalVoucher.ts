import { useReducer, useState } from "react";
import {
  blankNewLine,
  newVoucher,
  newVoucherLineError,
  type NewVoucherDraft,
  type NewVoucherLine,
} from "./NewJournalVoucherUtils";

import {
  createNewVoucherState,
  newVoucherReducer,
  type NewVoucherChanges,
  type NewVoucherFieldName,
} from "./NewVoucherReducer";
import { useTranslation } from "react-i18next";

import type { VoucherAction as ToolbarAction } from "../components/voucher/VoucherToolbar";

export function useNewJournalVoucher(companyId: string) {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(newVoucherReducer, undefined, () =>
    createNewVoucherState(newVoucher(), []),
  );
  const [validatedRows, setValidatedRows] = useState<Set<string>>(
    () => new Set(),
  );
  const blockedRow = state.draft.rows.find(
    (row) => newVoucherLineError(row) !== null,
  );

  // مسموح نظهر خطأه إذا موجود
  function validateRow(id: string) {
    setValidatedRows((previous) => new Set(previous).add(id));
  }

  const rowError =
    blockedRow && validatedRows.has(blockedRow.id)
      ? t(newVoucherLineError(blockedRow)!, {
          row: blockedRow.lineNo,
        })
      : "";

  function editRow(id: string) {
    setValidatedRows((previous) => {
      if (!previous.has(id)) return previous;

      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  }

  const errorColumns: (keyof NewVoucherLine)[] = rowError
    ? newVoucherLineError(blockedRow!) === "voucherAccountRequired"
      ? ["account"]
      : ["debit", "credit"]
    : [];

  function change(key: NewVoucherFieldName, value: string) {
    dispatch({
      type: "fieldChanged",
      key,
      value,
    });
  }

  function changeLine(id: string, changes: NewVoucherChanges) {
    dispatch({
      type: "lineChanged",
      id,
      changes,
      nextLine: blankNewLine(state.draft.rows.length + 1),
    });
  }

  function selectRows(ids: string[]) {
    dispatch({
      type: "rowsSelected",
      ids,
    });
  }

  function deleteSelected() {
    dispatch({
      type: "selectedRowsDeleted",
      emptyLine: blankNewLine(1),
    });
  }

  function openDraft(draft: NewVoucherDraft) {
    dispatch({
      type: "draftOpened",
      draft: structuredClone(draft),
    });
  }

  function createNew() {
    openDraft(newVoucher());
  }

  function toggleSearch() {
    dispatch({
      type: "searchToggled",
    });
  }

  function changeSearch(value: string) {
    dispatch({
      type: "searchChanged",
      value,
    });
  }

  const selectedIndex = state.saved.findIndex(
    (draft) => draft.id === state.draft.id,
  );
  function jump(index: number) {
    const draft = state.saved[index];
    if (draft) {
      openDraft(draft);
    }
  }

  const actions: ToolbarAction[] = [
    { id: "save", label: t("voucherSave"), icon: "save", variant: "primary" },
    { id: "new", label: t("voucherNew"), icon: "new" },
    { id: "post", label: t("voucherPost"), icon: "send" },
    {
      id: "delete",
      label: t("voucherDelete"),
      icon: "trash",
      variant: "danger",
    },
    { id: "search", label: t("voucherSearch"), icon: "search" },
    { id: "print", label: t("voucherPrint"), icon: "print" },
    { id: "exit", label: t("voucherExit"), icon: "exit" },
    { id: "archive", label: t("voucherArchive"), icon: "archive" },
    { id: "restore", label: t("voucherRestore"), icon: "reset" },
  ];

  return {
    state,
    selectedIndex,
    change,
    changeLine,
    selectRows,
    deleteSelected,
    openDraft,
    createNew,
    toggleSearch,
    changeSearch,
    jump,
    blockedRow,
    validateRow,
    rowError,
    editRow,
    errorColumns,
    actions,
  };
}
