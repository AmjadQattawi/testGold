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
import SalesInvoiceAside from "../components/SalesInvoice/aside/SalesInvoiceAside";
import { useState } from "react";
import SalesInvoiceHeader from "../components/SalesInvoice/SalesInvoiceHeader";

export default function SalesInvoice({
  company: workspaceCompany,
}: { company?: Company } = {}) {
  const routeCompany = useLoaderData<Company>();
  const company = workspaceCompany ?? routeCompany;
  return <SalesInvoiceForm key={company.id} companyId={company.id} />;
}

export function SalesInvoiceForm({ companyId }: { companyId: string }) {
  const voucher = useSalesInvoice(companyId);
  const { draft, saved } = voucher.state;

  type InvoiceTable = "jewelry" | "goldBoxes" | "services" | "gemstones";

  const [openTable, setOpenTable] = useState<InvoiceTable | null>(null);

  function toggleTable(table: InvoiceTable) {
    setOpenTable((current) => (current === table ? null : table));
  }

  return (
    <div className="flex w-full min-h-0 min-w-0 max-w-none flex-1 flex-col text-primary-text print:pb-0">
      <form
        onKeyDown={focusVoucherNext}
        className="flex min-h-0 flex-1 flex-col gap-3 [&>section:first-child]:shrink-0"
      >
        <SalesInvoiceInfo
          draft={draft}
          change={voucher.change}
          navigation={
            <SalesInvoiceHeader
              saved={saved}
              selectedIndex={voucher.selectedIndex}
              jump={voucher.jump}
            />
          }
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1fr)] gap-3 ">
          {/* Tables */}
          {/* bg-slate-100 p-1 shadow-[0_0_8px_1px_#25477733] */}
          <div className="col-span-9 flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto rounded-sm  shrink-0 ">
            {" "}
            {/* <SalesInvoiceTablesHeader draft={draft} change={voucher.change} /> */}
            <JewelryPiecesTable
              rows={draft.jewelryPiecesRow}
              changeLine={voucher.jewelryPieceLineChanged}
              isOpen={openTable === "jewelry"}
              onToggle={() => toggleTable("jewelry")}
              selection={{
                ids: voucher.state.selectedIds.jewelry,
                onChange: (ids) => voucher.selectRows("jewelry", ids),
              }}
              onDeleteSelected={() => voucher.deleteSelectedRows("jewelry")}
            />
            <GoldBoxesTable
              rows={draft.goldBoxesRow}
              changeLine={voucher.goldBoxLineChanged}
              isOpen={openTable === "goldBoxes"}
              onToggle={() => toggleTable("goldBoxes")}
              selection={{
                ids: voucher.state.selectedIds.goldBoxes,
                onChange: (ids) => voucher.selectRows("goldBoxes", ids),
              }}
              onDeleteSelected={() => voucher.deleteSelectedRows("goldBoxes")}
            />
            <ServiceMaterialsTable
              rows={draft.serviceMaterialsRow}
              changeLine={voucher.serviceMaterialLineChanged}
              isOpen={openTable === "services"}
              onToggle={() => toggleTable("services")}
              selection={{
                ids: voucher.state.selectedIds.services,
                onChange: (ids) => voucher.selectRows("services", ids),
              }}
              onDeleteSelected={() => voucher.deleteSelectedRows("services")}
            />
            <GemstoneCollectionsTable
              rows={draft.gemstoneCollectionsRow}
              changeLine={voucher.gemstoneCollectionLineChanged}
              isOpen={openTable === "gemstones"}
              onToggle={() => toggleTable("gemstones")}
              selection={{
                ids: voucher.state.selectedIds.gemstones,
                onChange: (ids) => voucher.selectRows("gemstones", ids),
              }}
              onDeleteSelected={() => voucher.deleteSelectedRows("gemstones")}
            />
          </div>

          {/* aside */}
          <SalesInvoiceAside />
        </div>

        <VoucherToolbar actions={voucher.actions} />








      </form>
    </div>
  );
}
