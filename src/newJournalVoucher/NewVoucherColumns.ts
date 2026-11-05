import type { TFunction } from "i18next";
import type { NewVoucherLine } from "./NewJournalVoucherUtils";

export type NewVoucherOption = {
  value: string;
  label: string;
};

export type NewVoucherColumn = {
  dataField: keyof NewVoucherLine;
  caption: string;
  dataType: "string" | "number" | "date";
  alignment?: "left" | "center" | "right";
  allowEditing?: boolean;
  cssClass?: string;
  format?:
    | string
    | {
        type: "fixedPoint";
        precision: number;
      };
  requiredMark?: boolean;
  min?: number;
  options?: NewVoucherOption[];
  placeholder?: string;
  width?: number;
  minWidth?: number;
};

export function getNewVoucherColumns(t: TFunction): NewVoucherColumn[] {
  return [
    {
      dataField: "lineNo",
      caption: "#",
      dataType: "number",
      alignment: "center",
      allowEditing: false,
      format: "00",
      cssClass: "new-voucher-readonly",
      width: 65,

    },
    {
      dataField: "debit",
      caption: t("voucherDebit"),
      dataType: "number",
      alignment: "center",
      format: { type: "fixedPoint", precision: 4 },
      min: 0,
      requiredMark: true,
      width: 150,

    },
    {
      dataField: "credit",
      caption: t("voucherCredit"),
      dataType: "number",
      alignment: "center",
      format: { type: "fixedPoint", precision: 4 },
      min: 0,
      requiredMark: true,
      width: 150,

    },
    {
      dataField: "account",
      caption: t("voucherAccount"),
      dataType: "string",
      alignment: "center",
      requiredMark: true,
      options: [
        { value: "cash", label: t("voucherCash") },
        { value: "bank", label: t("voucherBank") },
        {
          value: "receivables",
          label: t("voucherReceivables"),
        },
        {
          value: "payables",
          label: t("voucherPayables"),
        },
      ],
      width: 280,
    },
    {
      dataField: "currency",
      caption: t("voucherCurrency"),
      dataType: "string",
      alignment: "center",
      options: ["JOD", "USD", "EUR", "SAR", "AED"].map((value) => ({
        value,
        label: value,
      })),
      width: 110,
    },
    {
      dataField: "rate",
      caption: t("voucherRate"),
      dataType: "number",
      alignment: "center",
      format: { type: "fixedPoint", precision: 4 },
      min: 0.0001,
      width: 160,
    },
    {
      dataField: "dueDate",
      caption: t("voucherDue"),
      dataType: "date",
      alignment: "center",
      format: "dd/MM/yyyy",
      width: 160,
    },
    {
      dataField: "costCenter",
      caption: t("voucherCost"),
      dataType: "string",
      options: [
        {
          value: "management",
          label: t("voucherManagement"),
        },
        {
          value: "sales",
          label: t("voucherSales"),
        },
      ],
      width: 150,
    },
    {
      dataField: "description",
      caption: t("voucherStatement"),
      dataType: "string",
      placeholder: t("voucherStatementPlaceholder"),
      width: 250,
    },
  ];
}
