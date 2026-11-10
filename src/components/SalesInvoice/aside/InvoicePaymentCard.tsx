import {
  Wallet,
  FilePenLine,
  Banknote,
  CreditCard,
 } from "lucide-react";

import { useState } from "react";
import EditableTable from "../../voucher/EditableTable";
import {
  blankInvoicePaymentLine,
  type InvoicePaymentLine,
} from "../../../utils/salesInvoice";
import { invoicePaymentColumns } from "../TableColumns";

const buttonStyle =
  "flex flex-1 items-center justify-center gap-1 h-7 font-semibold rounded-md bg-[#254777] text-white hover:bg-[#2b69a3] transition-colors";

export default function InvoicePaymentCard() {
  const [rows, setRows] = useState<InvoicePaymentLine[]>(() => [
    blankInvoicePaymentLine(),
  ]);

  function changeLine(
    id: string,
    key: keyof InvoicePaymentLine,
    value: string,
  ) {
    if (key === "id") return;

    setRows((previous) =>
      previous.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-1 rounded-md bg-white px-2 py-3 ">
      <div className="flex flex-row justify-between shrink-0">
        <h2 className="flex items-center gap-2 text font-bold text-[#265985]">
          <Wallet className="size-4" />
          بيانات الدفع
        </h2>
        {/* <button
          type="button"
          className="flex items-center justify-center gap-3 bg-white rounded-md text-red-600 text-sm font-semibold shadow-sm w-36 h-10 hover:bg-slate-100 transition-colors border border-red-500/40"
        >
          <Trash2 className="size-4" />
          حذف المحدد
        </button> */}
      </div>

      <div className="flex gap-2 shrink-0">
        <button type="button" className={buttonStyle}>
          <FilePenLine className="size-5 shrink-0" />
          Credit
        </button>

        <button type="button" className={buttonStyle}>
          <Banknote className="size-5 shrink-0" />
          Cash
        </button>

        <button type="button" className={buttonStyle}>
          <CreditCard className="size-5 shrink-0" />
          Cards
        </button>
      </div>

      {/* table -------------- */}
      <EditableTable<InvoicePaymentLine>
        rows={rows}
        columns={invoicePaymentColumns}
        caption="بيانات الدفع"
        onChange={changeLine}
        rowLabel={(index) => `سطر الدفع ${index + 1}`}
        tableMinWidth="min-w-[700px]"
        containerClassName="max-h-40 [&_thead_th]:py-1 [&_tbody_input:not([type=checkbox])]:h-8 [&_tbody_select]:h-8"
      />
      {/* table -------------- */}



     <div className="flex items-end gap-1.5 rounded-md border border-slate-200 p-1.5 shrink-0">
        <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-center">
          <span className="text-xs font-bold text-[#265985]">المدفوع</span>
          <input
            type="text"
            value="2,300.39"
            readOnly
            className="w-full rounded-sm border border-slate-200 bg-white py-0.5 text-center text-xs font-bold text-[#173B60] outline-none"
          />
        </label>

        <span className="pb-0.5 text-base font-bold text-red-500">−</span>

        <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-center">
          <span className="text-xs font-bold text-[#265985]">الإجمالي</span>
          <input
            type="text"
            value="2,300.39"
            readOnly
            className="w-full rounded-sm border border-slate-200 bg-white py-0.5 text-center text-xs font-bold text-[#173B60] outline-none"
          />
        </label>

        <span className="pb-0.5 text-base font-bold text-emerald-500">=</span>

        <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-center">
          <span className="text-xs font-bold text-[#265985]">الباقي</span>
          <input
            type="text"
            value="0.00"
            readOnly
            className="w-full rounded-sm border border-emerald-100 bg-emerald-50 py-0.5 text-center text-xs font-bold text-emerald-600 outline-none"
          />
        </label>
      </div>

      
    </div>
  );
}
