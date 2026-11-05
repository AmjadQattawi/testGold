import { useLoaderData } from "react-router-dom";
import type { Company } from "../utils/selectedCompany";
import { usePaymentVoucher } from "../hooks/usePaymentVoucher";
import { focusVoucherNext } from "../utils/focusVoucherNext";
import PaymentVoucherInfo from "../components/paymentVoucher/paymentVoucherInfo";
import PaymentVoucherHeader from "../components/paymentVoucher/PaymentVoucherHeader";
import PaymentVoucherDetails from "../components/paymentVoucher/PaymentVoucherDetails";
import PaymentVoucherDraftSearch from "../components/paymentVoucher/PaymentVoucherDraftSearch";
import VoucherToolbar from "../components/voucher/VoucherToolbar";

export default function PaymentVoucher() {
  const company = useLoaderData<Company>();
  return <PaymentVoucherForm key={company.id} companyId={company.id} />;
}

export function PaymentVoucherForm({ companyId }: { companyId: string }) {
  const voucher = usePaymentVoucher(companyId);
  const { state, change } = voucher;

  return (
    <div className="flex w-full min-h-0 min-w-0 max-w-none flex-1 flex-col text-primary-text print:pb-0">
      <form
        onSubmit={voucher.save}
        onKeyDown={focusVoucherNext}
        className="flex min-h-0 flex-1 flex-col gap-3 [&>section:first-child]:shrink-0"
      >
        <PaymentVoucherInfo
          draft={state.draft}
          change={change}
          navigation={
            <PaymentVoucherHeader
              saved={state.saved}
              selectedIndex={voucher.selectedIndex}
              jump={voucher.jump}
            />
          }
        />

                <PaymentVoucherDetails 
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
                  <PaymentVoucherDraftSearch
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
