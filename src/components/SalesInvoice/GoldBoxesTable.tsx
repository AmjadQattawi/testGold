import type { GoldBoxLine } from "../../utils/salesInvoice";
import EditableTable from "../voucher/EditableTable";
import { goldBoxesColumns } from "./TableColumns";
import InvoiceTableSummaries from "./InvoiceTableSummaries";
import SalesInvoiceTableSection from "./SalesInvoiceTableSection";

export default function GoldBoxesTable({
  rows,
  changeLine,
  isOpen,
  onToggle,
  selection,
  onDeleteSelected,
}: {
  rows: GoldBoxLine[];
  changeLine: (id: string, key: keyof GoldBoxLine, value: string) => void;
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
      title="صناديق الذهب"
      icon="vault"
      rowCount={rows.length}
      total="900.00"
      isOpen={isOpen}
      onToggle={onToggle}
      selectedCount={selection.ids.length}
      onDeleteSelected={onDeleteSelected}
    >
      <EditableTable
        rows={rows}
        columns={goldBoxesColumns}
        caption="Gold Boxes"
        rowLabel={(index) => `Row ${index + 1}`}
        onChange={changeLine}
        tableMinWidth="min-w-[1900px]"
        containerClassName="max-h-45"
        selection={selection}
      />

      <InvoiceTableSummaries
        summaries={[
          { key: "grossWeight", label: "الوزن القائم", value: "45.0000" },
          { key: "alloy", label: "الحلة", value: "0.7900" },
          { key: "quantity", label: "العدد", value: 42 },
          { key: "totalWages", label: "الأجور", value: "50.00" },
          { key: "total", label: "الإجمالي", value: "900.00" },
          { key: "itemCount", label: "عدد المواد", value: 2 },
        ]}
      />
    </SalesInvoiceTableSection>
  );
}
