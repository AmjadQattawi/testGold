import { useTranslation } from "react-i18next";
import VoucherSection from "../components/voucher/VoucherSection";
import VoucherIcon from "../components/voucher/VoucherIcon";
import type { NewVoucherDraft, NewVoucherLine } from "./NewJournalVoucherUtils";
import NewGrid, { type NewVoucherSummaryItem } from "./NewGrid";
import { getNewVoucherColumns } from "./NewVoucherColumns";
import type { NewVoucherChanges } from "./NewVoucherReducer";
import type { RefObject } from "react";
import type { DataGridRef } from "devextreme-react/data-grid";

type Props = {
  draft: NewVoucherDraft;
  selectedIds: string[];
  deleteSelected: () => void;
  selectRows: (ids: string[]) => void;
  changeLine: (id: string, changes: NewVoucherChanges) => void;
  validateRow: (id: string) => void;
  rowError: string;
  editRow: (id: string) => void;
  lockedRowId?: string;
  errorColumns: (keyof NewVoucherLine)[];
  gridRef: RefObject<DataGridRef | null>;
};

export default function NewVoucherDetails({
  draft,
  selectedIds,
  deleteSelected,
  selectRows,
  changeLine,
  validateRow,
  rowError,
  editRow,
  lockedRowId,
  errorColumns,
  gridRef
}: Props) {
  const { t } = useTranslation();
  const columns = getNewVoucherColumns(t);
  const summaryItems: NewVoucherSummaryItem[] = [
    {
      column: "debit",
      summaryType: "sum",
      displayFormat: `${t("voucherTotalDebit")}\n{0}`,
      valueFormat: { type: "fixedPoint", precision: 4 },
    },
    {
      column: "credit",
      summaryType: "sum",
      displayFormat: `${t("voucherTotalCredit")}\n{0}`,
      valueFormat: { type: "fixedPoint", precision: 4 },
    },
  ];
  return (
    <VoucherSection
      className="flex min-h-48 flex-1 flex-col [&>header]:shrink-0 print:min-h-0"
      title={t("voucherDetails")}
      icon="archive"
      aside={
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-text">
            {/* عدد الاسطر  */}
            {draft.rows.length} {t("voucherRows")}
          </span>
          <button
            type="button"
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger-border bg-danger-background px-3 py-1.5 text-xs font-medium text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <VoucherIcon name="trash" />
            {t("tableDeleteSelected")}
            {selectedIds.length > 0 && <span>({selectedIds.length})</span>}
          </button>
        </div>
      }
    >
      {rowError && (
        <p
          role="alert"
          className="border-b border-danger-border bg-danger-background px-4 py-3 text-sm font-semibold text-danger"
        >
          {rowError}
        </p>
      )}
      <NewGrid
        rows={draft.rows}
        columns={columns}
        selectedIds={selectedIds}
        onSelectionChange={selectRows}
        onChangeLine={changeLine}
        summaryItems={summaryItems}
        onRowLeave={validateRow}
        onRowEnter={editRow}
        lockedRowId={lockedRowId}
        errorColumns={errorColumns}
         gridRef={gridRef}
      />
    </VoucherSection>
  );
}
