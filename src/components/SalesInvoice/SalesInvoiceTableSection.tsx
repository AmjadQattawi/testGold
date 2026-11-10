import { ChevronDown, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import VoucherSection from "../voucher/VoucherSection";
import type { VoucherIconName } from "../voucher/VoucherIcon";

type Props = {
  title: string;
  icon: VoucherIconName;
  rowCount: number;
  total: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  children: ReactNode;
};

export default function SalesInvoiceTableSection({
  title,
  icon,
  rowCount,
  total,
  isOpen,
  onToggle,
  selectedCount,
  onDeleteSelected,
  children,
}: Props) {
  const textColor = isOpen ? "text-white" : "text-accent";

  return (
    <VoucherSection
      title={title}
      icon={icon}
      onHeaderClick={onToggle}
      className={`
        [&>header]:min-h-10
        [&>header]:gap-x-4
        [&>header]:gap-y-1
        [&>header]:py-1
        [&>header>div:first-child]:justify-start
        sm:[&>header]:grid-cols-[minmax(0,1fr)_minmax(0,18rem)_minmax(0,1fr)]
        sm:[&>header>div:first-child]:col-start-2
        sm:[&>header>div:first-child]:row-start-1
        sm:[&>header>div:nth-child(2)]:col-start-3
        sm:[&>header>div:nth-child(2)]:justify-self-end
        sm:[&>header>div:last-child]:col-start-1
        sm:[&>header>div:last-child]:row-start-1
        sm:[&>header>div:last-child]:justify-self-start
        [&>header_h2]:text-xl
        [&>header_h2]:font-bold
        [&>header_h2]:leading-none
        [&>header_h2_svg]:size-6
        ${
          isOpen
            ? "[&>header]:bg-none [&>header]:bg-[#254777] [&>header_h2]:text-white [&>header_h2_svg]:text-white border border-slate-600 my- shadow-lg shadow-[#254777]"
            : ""
        }
      `}
      // status={

      // }
      center={
        <div className="flex items-center justify-center gap-2">
          <span className="inline-grid h-6 min-w-6 place-items-center rounded-md border border-orange-300 bg-white px-1 text-sm font-bold tabular-nums text-orange-800">
            <span className="sr-only">عدد الأسطر: </span>
            {/* عدد الأسطر :  {rowCount}  */}
            {rowCount}
          </span>
          {isOpen && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteSelected();
              }}
              disabled={selectedCount === 0}
              className="inline-flex h-7 shrink-0 items-center  rounded-md bg-white px-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "طيّ" : "فتح"} ${title}`}
            className={`inline-grid size-6 shrink-0 place-items-center rounded ${textColor} ${
              isOpen ? "hover:bg-white/15" : "hover:bg-hover-background"
            }`}
          >
            <ChevronDown
              aria-hidden="true"
              className={`size-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      }
      aside={
        <div
          className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${textColor}`}
        >
          <span className="text-sm">إجمالي {title}</span>
          <strong
            dir="ltr"
            className="text-lg font-bold leading-none tabular-nums"
          >
            {total}
          </strong>
        </div>
      }
    >
      <div hidden={!isOpen}>
        {/* <div className="border-b border-control-border bg-accent-background px-3 py-2 text-start tex text-accent">
          تعمل الآن على: <strong className="font-semibold">{title}</strong>
        </div> */}

        {children}
      </div>
    </VoucherSection>
  );
}
