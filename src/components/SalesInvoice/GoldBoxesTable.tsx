import { useState } from "react";
import type { GoldBoxLine } from "../../utils/salesInvoice";
import VoucherSection from "../voucher/VoucherSection";
import EditableTable from "../voucher/EditableTable";
import { goldBoxesColumns } from "./goldBoxesColumns";

export default function GoldBoxesTable({
  rows,
  changeLine,
}: {
  rows: GoldBoxLine[];
  changeLine: (id: string, key: keyof GoldBoxLine, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <VoucherSection
      title="Gold Boxes"
      icon="jewelry"
      className="
    [&>header]:min-h-0
    [&>header]:bg-accent
    [&>header]:bg-none
    [&>header]:px-4
    [&>header]:py-2
    [&>header_h2]:text-white
    [&>header_h2]:text-sm
    [&>header_h2_svg]:size-5
    [&>header_h2_svg]:text-white
  "
      status={
        <span className="text-xs text-white/75">
          Total: <strong className="text-sm text-white">900.00</strong>
        </span>
      }
      aside={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100"
          >
            <span className="text-base leading-none">+</span>
            Add Box
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-expanded={isOpen}
            aria-label={
              isOpen ? "Collapse Gold Boxes" : "Expand Gold Boxes"
            }
            className="rounded-md p-1 text-white hover:bg-white/15"
          >
            <svg
              className={`size-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      }
    >
      <div hidden={!isOpen}>
        <EditableTable
          rows={rows}
          columns={goldBoxesColumns}
          caption="Gold Boxes"
          rowLabel={(index) => `Row ${index + 1}`}
          onChange={changeLine}
          tableMinWidth="min-w-[3200px]"
          containerClassName="max-h-45"
        />
      </div>
    </VoucherSection>
  );
}
