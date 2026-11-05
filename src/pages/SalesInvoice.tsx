import { useLoaderData } from "react-router-dom";
import type { Company } from "../utils/selectedCompany";
import { focusVoucherNext } from "../utils/focusVoucherNext";
import SalesInvoiceInfo from "../components/SalesInvoice/SalesInvoiceInfo";
import { useSalesInvoice } from "../hooks/useSalesInvoice";
import JewelryPiecesTable from "../components/SalesInvoice/JewelryPiecesTable";
import GoldBoxesTable from "../components/SalesInvoice/GoldBoxesTable";
import ServiceMaterialsTable from "../components/SalesInvoice/ServiceMaterialsTable";
import GemstoneCollectionsTable from "../components/SalesInvoice/GemstoneCollectionsTable";
import VoucherToolbar from "../components/voucher/VoucherToolbar";
import SalesInvoiceTablesHeader from "../components/SalesInvoice/SalesInvoiceTablesHeader";
import SalesInvoiceAside from "../components/SalesInvoice/SalesInvoiceAside";

export default function SalesInvoice({
  company: workspaceCompany,
}: { company?: Company } = {}) {
  const routeCompany = useLoaderData<Company>();
  const company = workspaceCompany ?? routeCompany;
  return <SalesInvoiceForm key={company.id} companyId={company.id} />;
}

export function SalesInvoiceForm({ companyId }: { companyId: string }) {
  const voucher = useSalesInvoice(companyId);
  const { draft } = voucher.state;

  return (
    <div className="flex w-full min-w-0 flex-col text-primary-text flex-1">
      <form onKeyDown={focusVoucherNext} className="flex flex-col gap-3">
        <div className="bg-white space-y-4">
          <SalesInvoiceInfo
            draft={draft}
            change={voucher.change}
            // navigation={
            //   <SalesInvoiceHeader
            //     saved={saved}
            //     selectedIndex={voucher.selectedIndex}
            //     jump={voucher.jump}
            //   />
            // }
          />

          <div className="grid grid-cols-12">
            {/* aside */}
            <div className="border col-span-2   ">
              <SalesInvoiceAside />
            </div>

            {/* Tables */}
            <div className=" space-y-5 bg-slate-300 p-4 rounded-md col-span-10 h:[300px]  overflow-y-auto ">
              <SalesInvoiceTablesHeader draft={draft} change={voucher.change} />

              <JewelryPiecesTable
                rows={draft.jewelryPiecesRow}
                changeLine={voucher.jewelryPieceLineChanged}
              />

              <GoldBoxesTable
                rows={draft.goldBoxesRow}
                changeLine={voucher.goldBoxLineChanged}
              />

              <ServiceMaterialsTable
                rows={draft.serviceMaterialsRow}
                changeLine={voucher.serviceMaterialLineChanged}
              />

              <GemstoneCollectionsTable
                rows={draft.gemstoneCollectionsRow}
                changeLine={voucher.gemstoneCollectionLineChanged}
              />
            </div>
          </div>
        </div>

        <div>
          <VoucherToolbar actions={voucher.actions} />
        </div>
      </form>
    </div>
  );
}
