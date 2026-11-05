import type { EditableColumn } from "../voucher/EditableTable";
import type { GemstoneCollectionLine } from "../../utils/salesInvoice";

export const gemstoneCollectionsColumns: EditableColumn<GemstoneCollectionLine>[] =
  [
    {
      key: "lineNo",
      label: "#",
      readOnly: true,
      numeric: true,
      width: "w-[3%]",
    },
    {
      key: "boxNumber",
      label: "Box Number",
      type: "text",
      width: "w-[11%]",
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      width: "w-[15%]",
    },
    {
      key: "grossWeight",
      label: "Gross Weight",
      type: "number",
      numeric: true,
      width: "w-[9%]",
    },
    {
      key: "quantity",
      label: "Quantity",
      type: "number",
      numeric: true,
      width: "w-[6%]",
    },
    {
      key: "unitWages",
      label: "Unit Wages",
      type: "number",
      numeric: true,
      width: "w-[10%]",
    },
    {
      key: "wagesBeforeDiscount",
      label: "Wages Before Discount",
      type: "number",
      numeric: true,
      width: "w-[14%]",
    },
    {
      key: "discount",
      label: "Discount",
      type: "number",
      numeric: true,
      width: "w-[10%]",
    },
    {
      key: "totalWages",
      label: "Total Wages",
      type: "number",
      numeric: true,
      width: "w-[11%]",
    },
    {
      key: "warehouse",
      label: "Warehouse",
      type: "text",
      width: "w-[11%]",
    },
  ];