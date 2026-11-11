import { useLoaderData } from "react-router-dom";
import type { Company } from "../utils/selectedCompany";
import { focusVoucherNext } from "../utils/focusVoucherNext";
import { useJournalVoucher } from "../hooks/useJournalVoucher";
import JournalVoucherHeader from "../components/voucher/JournalVoucherHeader";
import VoucherInfo from "../components/voucher/VoucherInfo";
import VoucherDetails from "../components/voucher/VoucherDetails";
import VoucherToolbar from "../components/voucher/VoucherToolbar";
import VoucherDraftSearch from "../components/voucher/VoucherDraftSearch";
export default function JournalVoucher({ company: workspaceCompany }: { company?: Company } = {}) {
  const routeCompany = useLoaderData<Company>();
  const company = workspaceCompany ?? routeCompany;
  return <JournalVoucherForm key={company.id} companyId={company.id} />;
}
function JournalVoucherForm({ companyId }: { companyId: string }) {
  const voucher = useJournalVoucher(companyId);
  const { draft, saved, selectedIds, searchOpen, search } = voucher.state;
  return (
    <div className="flex w-full min-h-0 min-w-0 max-w-none flex-1 flex-col text-primary-text print:pb-0">
      <form
        onSubmit={voucher.save}
        onKeyDown={focusVoucherNext}
        className="flex min-h-0 flex-1 flex-col gap-3 [&>section:first-child]:shrink-0"
      >  
        <VoucherInfo draft={draft} change={voucher.change} navigation={
          <JournalVoucherHeader saved={saved} selectedIndex={voucher.selectedIndex} jump={voucher.jump} />
        } />
        <VoucherDetails
          draft={draft}
          selectedIds={selectedIds}
          totals={voucher.totals}
          blockedRow={voucher.blockedRow}
          rowError={voucher.rowError}
          errorColumns={voucher.errorColumns}
          changeLine={voucher.changeLine}
          deleteSelected={voucher.deleteSelected}
          selectRows={voucher.selectRows}
          validateRow={voucher.validateRow}
          editRow={voucher.editRow}
        />

      {searchOpen && (
        <VoucherDraftSearch
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

