import type { EditableColumn } from "../voucher/EditableTable";
import type { ServiceMaterialLine } from "../../utils/salesInvoice";

export const serviceMaterialsColumns: EditableColumn<ServiceMaterialLine>[] = [
  {
    key: "lineNo",
    label: "#",
    readOnly: true,
    numeric: true,
    width: "w-[4%]",
  },
  {
    key: "boxNumber",
    label: "Box Number",
    type: "text",
    width: "w-[12%]",
  },
  {
    key: "description",
    label: "Description",
    type: "text",
    width: "w-[15%]",
  },
  {
    key: "quantity",
    label: "Quantity",
    type: "number",
    numeric: true,
    width: "w-[12%]",
  },
  {
    key: "unitPrice",
    label: "Unit Price",
    type: "number",
    numeric: true,
    width: "w-[13%]",
  },
  {
    key: "discount",
    label: "Discount",
    type: "number",
    numeric: true,
    width: "w-[13%]",
  },
  {
    key: "total",
    label: "Total",
    type: "number",
    numeric: true,
    width: "w-[13%]",
  },
  {
    key: "net",
    label: "Net",
    type: "number",
    numeric: true,
    width: "w-[13%]",
  },
];