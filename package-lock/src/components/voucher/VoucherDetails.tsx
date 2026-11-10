import { useTranslation } from "react-i18next";
import VoucherSection from "./VoucherSection";
import VoucherIcon from "./VoucherIcon";
import EditableTable from "./EditableTable";
import { getVoucherColumns } from "./voucherColumns";
import { formatAmount } from "../../utils/voucher";
import type { useJournalVoucher } from "../../hooks/useJournalVoucher";
type Controller = ReturnType<typeof useJournalVoucher>;
type Props = Pick<
  Controller,
  | "totals"
  | "blockedRow"
  | "rowError"
  | "errorColumns"
  | "changeLine"
  | "deleteSelected"
  | "selectRows"
  | "validateRow"
  | "editRow"
> & {
  draft: Controller["state"]["draft"];
  selectedIds: string[];
};
export default function VoucherDetails({
  draft,
  selectedIds,
  totals,
  blockedRow,
  rowError,
  errorColumns,
  changeLine,
  deleteSelected,
  selectRows,
  validateRow,
  editRow,
}: Props) {
  const { t } = useTranslation();
  const columns = getVoucherColumns(t);
  return (
    <VoucherSection
      className="flex min-h-48 flex-1 flex-col [&>header]:shrink-0 print:min-h-0"
      title={t("voucherDetails")}
      icon="archive"
      aside={
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-text">
            {draft.rows.length} {t("voucherRows")}
          </span>
          <button
            type="button"
            disabled={!!blockedRow || !selectedIds.length}
            onClick={deleteSelected}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger-border bg-danger-background px-3 py-1.5 text-xs font-medium text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <VoucherIcon name="trash" />
            {t("tableDeleteSelected")}
            {selectedIds.length > 0 && <span>({selectedIds.length})</span>}
          </button>
        </div>
      }
    >
      <EditableTable
        columnFooters={{
          lineNo: <span className="font-semibold text-muted-text">{t("voucherTotal")}</span>,
          debit: <><span className="block text-muted-text">{t("voucherTotalDebit")}</span><strong className="mt-1 block font-mono tabular-nums" dir="ltr">{formatAmount(totals.debit)}</strong></>,
          credit: <><span className="block text-muted-text">{t("voucherTotalCredit")}</span><strong className="mt-1 block font-mono tabular-nums" dir="ltr">{formatAmount(totals.credit)}</strong></>,
          account: <><span className="block text-muted-text">{t("voucherDifference")}</span><strong className={"mt-1 block font-mono tabular-nums " + (totals.difference === 0 ? "text-success" : "text-danger")} dir="ltr">{formatAmount(totals.difference)}</strong></>,
        }}
        errorColumns={errorColumns}
        lockedRowId={rowError ? blockedRow?.id : undefined}
        onRowBlur={validateRow}
        onRowFocus={editRow}
        rowError={rowError}
        rows={draft.rows}
        columns={columns}
        caption={t("voucherDetails")}
        onChange={changeLine}
        rowLabel={(index) => t("voucherLine") + " " + (index + 1)}
        selection={{
          ids: selectedIds,
          onChange: selectRows,
        }}
      />
    </VoucherSection>
  );
}

