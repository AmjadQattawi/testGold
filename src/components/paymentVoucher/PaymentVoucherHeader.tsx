import { useTranslation } from "react-i18next";
import type { PaymentVoucherDraft } from "../../utils/PaymentVoucher";



export default function PaymentVoucherHeader({
  saved,
  selectedIndex,
  jump,
}: {
  saved: PaymentVoucherDraft[];
  selectedIndex: number;
  jump: (index: number) => void;
}){


 const { t } = useTranslation();

  return (
      <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-text print:hidden">
        <div
          role="group"
          className="flex items-center overflow-hidden rounded-lg border border-control-border bg-card-background"
          dir="ltr"
        >
          {[
            { label: "voucherFirst", text: "«", index: 0 },
            { label: "voucherPrevious", text: "‹", index: selectedIndex - 1 },
          ].map((item) => (
            <button
              type="button"
              key={item.label}
              aria-label={t(item.label)}
              onClick={() => jump(item.index)}
              disabled={item.index < 0 || !saved.length || selectedIndex === 0}
              className="h-8 w-8 border-e border-control-border hover:bg-hover-background disabled:opacity-30"
            >
              {item.text}
            </button>
          ))}
          <span className="px-3 tabular-nums">
            {selectedIndex + 1} / {saved.length}
          </span>
          {[
            { label: "voucherNext", text: "›", index: selectedIndex + 1 },
            { label: "voucherLast", text: "»", index: saved.length - 1 },
          ].map((item) => (
            <button
              type="button"
              key={item.label}
              aria-label={t(item.label)}
              onClick={() => jump(item.index)}
              disabled={
                !saved.length ||
                item.index >= saved.length ||
                selectedIndex === saved.length - 1
              }
              className="h-8 w-8 border-s border-control-border hover:bg-hover-background disabled:opacity-30"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
  );



}