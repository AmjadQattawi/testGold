import { Scale } from "lucide-react";
import { useState } from "react";

const labelStyle = "text-xs font-semibold text-[#265985]";

const inputStyle =
  "w-full min-w-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-center text-sm font-semibold text-[#173B60] outline-none";

export default function InvoiceSettlementCard() {
  const [isGoldAndCurrency, setIsGoldAndCurrency] = useState(false);

  return (
    <section
      dir="rtl"
      className="shrink-0 space-y-3 rounded-md bg-white p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text- font-bold text-[#265985]">
          <Scale className="size-4" />
          تسوية الفاتورة
        </h2>

        <div className="flex items-center gap-2">
          <span className={labelStyle}>
            {isGoldAndCurrency ? "ذهب وعملة" : "عملة"}
          </span>

          <button
            type="button"
            role="switch"
            aria-label="ذهب وعملة"
            aria-checked={isGoldAndCurrency}
            onClick={() => setIsGoldAndCurrency((previous) => !previous)}
            className={`flex h-6 w-12 shrink-0 items-center rounded-full border p-0.5 transition-colors ${
              isGoldAndCurrency
                ? "border-blue-600 bg-blue-600"
                : "border-slate-300 bg-slate-200"
            }`}
          >
            <span
              className={`size-4 shrink-0 rounded-full bg-white transition-transform ${
                isGoldAndCurrency ? "-translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isGoldAndCurrency && (
          <div className="col-span-2 space-y-1">
            <span className={labelStyle}>مجموع الذهب</span>

            <div className="grid grid-cols-3 gap-2">
              <input
                aria-label="مجموع الذهب"
                type="number"
                defaultValue="0.00"
                className={inputStyle}
              />

              <select
                aria-label="وحدة الذهب"
                defaultValue="Gold"
                className={inputStyle}
              >
                <option value="Gold">Gold</option>
              </select>

              <input
                aria-label="سعر تحويل الذهب"
                type="number"
                step="any"
                defaultValue="107.0620"
                className={inputStyle}
              />
            </div>
          </div>
        )}

        <label className="flex min-w-0 flex-col gap-1">
          <span className={labelStyle}>إجمالي الأجور</span>
          <input
            type="number"
            defaultValue="0.00"
            className={inputStyle}
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1">
          <span className={labelStyle}>الخصم</span>
          <input
            type="number"
            defaultValue="0.00"
            className={inputStyle}
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1">
          <span className={labelStyle}>صافي الفاتورة</span>
          <input
            type="text"
            value="0.00"
            readOnly
            className={inputStyle}
          />
        </label>

        <div className="grid min-w-0 grid-cols-2 gap-2">
          <label className="flex min-w-0 flex-col gap-1">
            <span className={labelStyle}>العملة</span>
            <select defaultValue="JOD" className={inputStyle}>
              <option value="JOD">JOD</option>
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1">
            <span className={labelStyle}>الصرف</span>
            <input
              type="number"
              step="any"
              defaultValue="1.0000"
              className={inputStyle}
            />
          </label>
        </div>
      </div>
    </section>
  );
}