import { useTranslation } from "react-i18next";
 import EditableTable from "../voucher/EditableTable";
import type {
  ReceiptVoucherDraft,
  ReceiptVoucherLine,
} from "../../utils/receiptVoucher";
import VoucherSection from "../voucher/VoucherSection";
import VoucherIcon from "../voucher/VoucherIcon";
import { formatAmount } from "../../utils/voucher";
import { getReceiptVoucherColumns } from "./ReceiptVoucherColumns";

export default function ReceiptVoucherDetails({
  draft,
  changeLine,
  selectedIds,
  selectRows, 
  deleteSelected,
  blockedRow,
  rowError,
  validateRow,
  editRow,
  totals,
}: {
  draft: ReceiptVoucherDraft;
  changeLine: (
    id: string,
    key: keyof ReceiptVoucherLine,
    value: string,
  ) => void;
  selectedIds: string[];
  selectRows: (ids: string[]) => void;
  deleteSelected: () => void;
  blockedRow: ReceiptVoucherLine | undefined;
  rowError: string;
  validateRow: (id: string) => void;
  editRow: (id: string) => void;
  totals: { debit: number };
}) {
  const { t } = useTranslation();
  const columns = getReceiptVoucherColumns(t);

  return (
    <VoucherSection
      className="flex min-h-48 flex-1 flex-col [&>header]:shrink-0 print:min-h-0"
      title="Voucher details"
      icon="archive"
      aside={
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-text">
            {draft.rows.length} Rows
          </span>

          <button
            type="button"
            disabled={!!blockedRow || !selectedIds.length}
            onClick={deleteSelected}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger-border bg-danger-background px-3 py-1.5 text-xs font-medium text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <VoucherIcon name="trash" />
            Delete selected
            {selectedIds.length > 0 && <span>({selectedIds.length})</span>}
          </button>
        </div>
      }
    >
      <EditableTable<ReceiptVoucherLine>
        rows={draft.rows}
        columns={columns}
        caption="Receipt voucher entries"
        onChange={changeLine}
        rowLabel={(index) => `Row ${index + 1}`}
        selection={{
          ids: selectedIds,
          onChange: selectRows,
        }}
        rowError={rowError}
        onRowBlur={validateRow}
        onRowFocus={editRow}
        lockedRowId={rowError ? blockedRow?.id : undefined}
        errorColumns={["account"]}
        columnFooters={{
          lineNo: <span className="font-semibold text-muted-text">Total</span>,
          debit: (
            <strong className="font-mono tabular-nums" dir="ltr">
              {formatAmount(totals.debit)}
            </strong>
          ),
        }}
      />
    </VoucherSection>
  );
}
