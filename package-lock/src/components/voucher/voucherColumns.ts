import type { TFunction } from 'i18next';
import type { EditableColumn } from './EditableTable';
import type { VoucherLine } from '../../utils/voucher';
export function getVoucherColumns(t: TFunction): EditableColumn<VoucherLine>[] {
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
            key: "credit",
            requiredMark: true,
            label: t("voucherCredit"),
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
            key: "costCenter",
            label: t("voucherCost"),
            type: "select",
            width: "w-[8%]",
            options: [
                { value: "management", label: t("voucherManagement") },
                { value: "sales", label: t("voucherSales") },
            ],
        },
        {
            key: "description",
            label: t("voucherStatement"),
            placeholder: t("voucherStatementPlaceholder"),
            width: "w-[19%]",
        },
    ];
}
