import type { ServiceMaterialLine } from "../../utils/salesInvoice";
import EditableTable from "../voucher/EditableTable";
import { serviceMaterialsColumns } from "./TableColumns";
import InvoiceTableSummaries from "./InvoiceTableSummaries";
import SalesInvoiceTableSection from "./SalesInvoiceTableSection";

export default function ServiceMaterialsTable({
  rows,
  changeLine,
  isOpen,
  onToggle,
  selection,
  onDeleteSelected
}: {
  rows: ServiceMaterialLine[];
  changeLine: (id: string, key: keyof ServiceMaterialLine, value: string) => void;
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
      title="مواد الخدمات"
      icon="wrench"
      rowCount={rows.length}
      total="100.00"
      isOpen={isOpen}
      onToggle={onToggle}
      selectedCount={selection.ids.length}
onDeleteSelected={onDeleteSelected}
    >
      <EditableTable
        rows={rows}
        columns={serviceMaterialsColumns}
        caption="Service Materials"
        rowLabel={(index) => `Row ${index + 1}`}
        onChange={changeLine}
        tableMinWidth="min-w-[1300px]"
        containerClassName="max-h-45"
        selection={selection}
      />

      <InvoiceTableSummaries
        summaries={[
          { key: "quantity", label: "العدد", value: 3 },
          { key: "total", label: "الإجمالي", value: "100.00" },
        ]}
      />
    </SalesInvoiceTableSection>
  );
}