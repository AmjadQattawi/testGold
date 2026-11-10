import { useId } from "react";
import type { InvoiceFieldName } from "../../reducers/SalesInvoiceReducer";
import type { SalesInvoiceDraft } from "../../utils/salesInvoice";

const control =
  "h-10 w-full min-w-0 rounded-lg border border-control-border bg-input-background ps-3 pe-12 text-sm text-primary-text outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/15";

const buttonStyle =
  "absolute inset-e-1 top-1 flex size-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function SalesInvoiceTablesHeader({
  draft,
  change,
}: {
  draft: SalesInvoiceDraft;
  change: (key: InvoiceFieldName, value: string) => void;
}) {
  const addItemId = useId();
  const distributionId = useId();

  return (
    <div className="  ">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-start">
        {/* Add Item */}
        <div className="min-w-0">
          <label
            htmlFor={addItemId}
            className="mb-1.5 block text-xs font-semibold text-secondary-text justify-between"
          >
            Add Item
          </label>

          <div className="min-w-0 w-full sm:w-60">
            <input
              id={addItemId}
              data-voucher-step="addItem"
              className={control}
              value={draft.addItem}
              onChange={(event) => change("addItem", event.target.value)}
            />

            <button
              type="button"
              aria-label="Add item"
              className={
                buttonStyle +
                " bg-accent text-accent-button-text hover:bg-accent-hover"
              }
            >
              <span aria-hidden="true" className="text-xl leading-none">
                +
              </span>
            </button>
          </div>
        </div>

        {/* Sale Price Distribution */}
        <div className="min-w-0 w-full sm:w-60">
          <label
            htmlFor={distributionId}
            className="mb-1.5 block text-xs font-semibold text-secondary-text"
          >
            Sale Price Distribution
          </label>

          <div className="relative">
            <input
              id={distributionId}
              data-voucher-step="salePriceDistribution"
              className={control}
              value={draft.salePriceDistribution}
              onChange={(event) =>
                change("salePriceDistribution", event.target.value)
              }
            />

            <button
              type="button"
              aria-label="Distribute sale price"
              className={
                buttonStyle +
                " bg-accent-background text-accent hover:bg-hover-background"
              }
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ↻
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
