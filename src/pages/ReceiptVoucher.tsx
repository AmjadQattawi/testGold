import { useLoaderData } from "react-router-dom";
import type { Company } from "../utils/selectedCompany";
import { useReceiptVoucher } from "../hooks/useReceiptVoucher";
import ReceiptVoucherInfo from "../components/receiptVoucher/ReceiptVoucherInfo";
import ReceiptVoucherHeader from "../components/receiptVoucher/ReceiptVoucherHeader";
import ReceiptVoucherDetails from "../components/receiptVoucher/ReceiptVoucherDetails";
import VoucherToolbar from "../components/voucher/VoucherToolbar";
import ReceiptVoucherDraftSearch from "../components/receiptVoucher/ReceiptVoucherDraftSearch";
import { focusVoucherNext } from "../utils/focusVoucherNext";

export default function ReceiptVoucher() {
  const company = useLoaderData<Company>();
  return <ReceiptVoucherForm key={company.id} companyId={company.id} />;
}

export function ReceiptVoucherForm({ companyId }: { companyId: string }) {
  const voucher = useReceiptVoucher(companyId);
  const { state, change } = voucher;

  return (
    <div className="flex w-full min-h-0 min-w-0 max-w-none flex-1 flex-col text-primary-text print:pb-0">
      <form
        onSubmit={voucher.save}
        onKeyDown={focusVoucherNext}
        className="flex min-h-0 flex-1 flex-col gap-3 [&>section:first-child]:shrink-0"
      >
        <ReceiptVoucherInfo
          draft={state.draft}
          change={change}
          navigation={
            <ReceiptVoucherHeader
              saved={state.saved}
              selectedIndex={voucher.selectedIndex}
              jump={voucher.jump}
            />
          }
        />

        <ReceiptVoucherDetails
          draft={state.draft}
          changeLine={voucher.changeLine}
          selectedIds={state.selectedIds}
          selectRows={voucher.selectRows}
          deleteSelected={voucher.deleteSelected}
          blockedRow={voucher.blockedRow}
          rowError={voucher.rowError}
          validateRow={voucher.validateRow}
          editRow={voucher.editRow}
          totals={voucher.totals}
        />

        {state.searchOpen && (
          <ReceiptVoucherDraftSearch
            saved={state.saved}
            search={state.search}
            onSearch={voucher.changeSearch}
            onOpen={voucher.openDraft}
          />
        )}
        <VoucherToolbar actions={voucher.actions} />
      </form>
    </div>
  );
}
