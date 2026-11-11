import type { TFunction } from "i18next";
import type { EditableColumn } from "../voucher/EditableTable";
import type { ReceiptVoucherLine } from "../../utils/receiptVoucher";

export function getReceiptVoucherColumns(
  t: TFunction,
): EditableColumn<ReceiptVoucherLine>[] {
  return [
    {
      key: "lineNo",
      label: "#",
      readOnly: true,
      width: "w-[4%]",
      numeric: true,
    },
    {
      key: "debit",
      requiredMark: true,
      label: t("voucherDebit"),
      type: "number",
      numeric: true,
      min: "0",
      step: "0.0001",
      width: "w-[9%]",
    },

    {
      key: "account",
      requiredMark: true,
      label: t("voucherAccount"),
      type: "select",
      placeholder: "",
      width: "w-[20%]",
      options: [
        { value: "cash", label: t("voucherCash") },
        { value: "bank", label: t("voucherBank") },
        { value: "receivables", label: t("voucherReceivables") },
        { value: "payables", label: t("voucherPayables") },
      ],
    },
    {
      key: "currency",
      label: t("voucherCurrency"),
      type: "select",
      width: "w-[8%]",
      headerNoWrap: true,
      required: true,
      options: ["JOD", "USD", "EUR", "SAR", "AED"].map((value) => ({
        value,
        label: value,
      })),
    },
    {
      key: "rate",
      label: t("voucherRate"),
      type: "number",
      numeric: true,
      min: "0.0001",
      step: "0.0001",
      width: "w-[11%]",
      headerNoWrap: true,
      required: true,
    },
    { key: "dueDate", label: t("voucherDue"), type: "date", width: "w-[9%]" },

    {
      key: "description",
      label: t("voucherStatement"),
      placeholder: t("voucherStatementPlaceholder"),
      width: "w-[19%]",
    },
  ];
}
