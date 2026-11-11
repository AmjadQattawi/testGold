import type { GemstoneCollectionLine } from "../../utils/salesInvoice";
import EditableTable from "../voucher/EditableTable";
import { gemstoneCollectionsColumns } from "./TableColumns";
import InvoiceTableSummaries from "./InvoiceTableSummaries";
import SalesInvoiceTableSection from "./SalesInvoiceTableSection";

export default function GemstoneCollectionsTable({
  rows,
  changeLine,
  isOpen,
  onToggle,
  selection,
  onDeleteSelected
}: {
  rows: GemstoneCollectionLine[];
  changeLine: (
    id: string,
    key: keyof GemstoneCollectionLine, 
    value: string,
  ) => void;
  isOpen: boolean;
  onToggle: () => void;
  selection: {
    ids: string[];
    onChange: (ids: string[]) => void;
  };
    onDeleteSelected: () => void;

}) {
  return (
    <SalesInvoiceTableSection
      title="كاشينات الأحجار الثمينة"
      // icon="gemstones"
       icon="sparkles"
      rowCount={rows.length}
      total="260.00"
      isOpen={isOpen}
      onToggle={onToggle}
      selectedCount={selection.ids.length}
      onDeleteSelected={onDeleteSelected}
    >
      <EditableTable
        rows={rows}
        columns={gemstoneCollectionsColumns}
        caption="Gemstone Collections"
        rowLabel={(index) => `Row ${index + 1}`}
        onChange={changeLine}
        tableMinWidth="min-w-[1300px]"
        containerClassName="max-h-45"
        selection={selection}
      />

      <InvoiceTableSummaries
        summaries={[
          { key: "grossWeight", label: "الوزن القائم", value: "8.0000" },
          { key: "wages", label: "الأجور", value: "20.00" },
          { key: "quantity", label: "العدد", value: 15 },
          { key: "total", label: "الإجمالي", value: "260.00" },
          { key: "itemCount", label: "عدد المواد", value: 2 },
        ]}
      />
    </SalesInvoiceTableSection>
  );
}
