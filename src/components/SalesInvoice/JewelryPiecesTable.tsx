import EditableTable from "../voucher/EditableTable";
import type { JewelryPieceLine } from "../../utils/salesInvoice";
import { jewelryPiecesColumns } from "./TableColumns";
import InvoiceTableSummaries from "./InvoiceTableSummaries";
import SalesInvoiceTableSection from "./SalesInvoiceTableSection";
export default function JewelryPiecesTable({
  rows,
  changeLine,
  isOpen,
  onToggle,
  selection,
  onDeleteSelected,
}: {
  rows: JewelryPieceLine[];
  changeLine: (id: string, key: keyof JewelryPieceLine, value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  selection: {
    ids: string[];
    onChange: (ids: string[]) => void;
  };
  onDeleteSelected: () => void
}) {
  return (
    <SalesInvoiceTableSection
      title="قطع المجوهرات"
      icon="jewelry"
      rowCount={rows.length}
      total="1,440.00"
      isOpen={isOpen}
      onToggle={onToggle}
      selectedCount={selection.ids.length}
      onDeleteSelected={onDeleteSelected}
    >
      <EditableTable
        rows={rows}
        columns={jewelryPiecesColumns}
        caption="Jewelry pieces"
        rowLabel={(index) => `Row ${index + 1}`}
        onChange={changeLine}
        tableMinWidth="min-w-[2400px]"
        containerClassName="max-h-45"
        selection={selection}
      />
      <InvoiceTableSummaries
        summaries={[
          { key: "goldWeight", label: "وزن الذهب", value: "13.9500" },
          { key: "grossWeight", label: "الوزن القائم", value: "14.2000" },
          { key: "saleAlloy", label: "الحلة / بيع", value: "0.7900" },
          { key: "salePrice", label: "سعر البيع", value: "1440.00" },
          { key: "alloy", label: "الحلة", value: "0.7900" },
          { key: "wages", label: "الأجور", value: "60.00" },
          { key: "diamondWeight", label: "وزن الماس", value: "0.2500" },
          { key: "coloredWeight", label: "وزن ملون", value: "0.1000" },
          { key: "diamondCount", label: "عدد الماس", value: 4 },
          { key: "coloredCount", label: "عدد ملون", value: 2 },
        ]}
      />
    </SalesInvoiceTableSection>
  );
}
