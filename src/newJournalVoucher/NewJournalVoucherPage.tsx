import { useLoaderData } from "react-router-dom";
import type { Company } from "../utils/selectedCompany";
import NewVoucherDetails from "./NewVoucherDetails";
import { useNewJournalVoucher } from "./NewUseJournalVoucher";
import NewVoucherInfo from "./NewVoucherInfo";
import NewJournalVoucherHeader from "./NewJournalVoucherHeader";
import NewVoucherDraftSearch from "./NewVoucherDraftSearch";
import VoucherToolbar from "../components/voucher/VoucherToolbar";
import { useRef, type KeyboardEvent } from "react";
import type { DataGridRef } from "devextreme-react/data-grid";

export default function NewJournalVoucherPage({
  company: workspaceCompany,
}: { company?: Company } = {}) {
  const routeCompany = useLoaderData<Company>();
  const company = workspaceCompany ?? routeCompany;
  return <NewJournalVoucherForm key={company.id} companyId={company.id} />;
}
function NewJournalVoucherForm({ companyId }: { companyId: string }) {
  const voucher = useNewJournalVoucher(companyId);
  const { draft, saved, selectedIds, searchOpen, search } = voucher.state;
  const gridRef = useRef<DataGridRef>(null);

  function focusNextHeaderField(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.defaultPrevented) return;
    const currentField = event.target;
    if (!(currentField instanceof HTMLElement)) return;
    const fields = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-voucher-step]"),
    );
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex === -1) return;
    const nextField = fields[currentIndex + 1];
    if (!nextField) {
      if (currentField.dataset.voucherStep !== "notes" || event.shiftKey)
        return;
      const grid = gridRef.current?.instance();
      if (!grid) return;
      const lockedRowId = voucher.blockedRow?.id;
      const row = grid
        .getVisibleRows()
        .find(
          (item) =>
            item.rowType === "data" &&
            (lockedRowId === undefined || item.key === lockedRowId),
        );
      if (!row) return;
      const rowIndex = grid.getRowIndexByKey(row.key);
      if (rowIndex < 0) return;
      event.preventDefault();
      grid.editCell(rowIndex, "debit");
      return;
    }
    event.preventDefault();
    nextField.focus();
  }
 
  return (
    <div className="flex w-full min-h-0 min-w-0 max-w-none flex-1 flex-col text-primary-text print:pb-0">
      <form
        // onSubmit={voucher.save}
        onKeyDown={focusNextHeaderField}
        className="flex min-h-0 flex-1 flex-col gap-3 [&>section:first-child]:shrink-0"
      >
        <NewVoucherInfo
          draft={draft}
          change={voucher.change}
          navigation={
            <NewJournalVoucherHeader
              saved={saved}
              selectedIndex={voucher.selectedIndex}
              jump={voucher.jump}
            />
          }
        />
        <NewVoucherDetails
          draft={draft}
          selectedIds={selectedIds}
          deleteSelected={voucher.deleteSelected}
          selectRows={voucher.selectRows}
          changeLine={voucher.changeLine}
          validateRow={voucher.validateRow}
          rowError={voucher.rowError}
          editRow={voucher.editRow}
          lockedRowId={voucher.blockedRow?.id}
          errorColumns={voucher.errorColumns}
          gridRef={gridRef}
        />

        {searchOpen && (
          <NewVoucherDraftSearch
            saved={saved}
            search={search}
            onSearch={voucher.changeSearch}
            onOpen={voucher.openDraft}
          />
        )}
        <VoucherToolbar actions={voucher.actions} />
      </form>
    
    </div>
  );
}
