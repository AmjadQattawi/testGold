 
import type { SalesInvoiceDraft } from "../../utils/salesInvoice";
import { useTranslation } from "react-i18next";
import type { InvoiceFieldName } from "../../reducers/SalesInvoiceReducer";
import VoucherField from "../voucher/VoucherField";
import type { ReactNode } from "react";
import VoucherSection from "../voucher/VoucherSection";
import VoucherIcon from "../voucher/VoucherIcon";

const control =
  "h-8 w-full rounded-md border border-control-border bg-input-background px-3 text-[clamp(0.875rem,0.75rem+0.3vw,1rem)] text-primary-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/15";
export default function SalesInvoiceInfo({
  draft,
  change,
  navigation
}: {
  draft: SalesInvoiceDraft;
  change: (key: InvoiceFieldName, value: string) => void;
  navigation?: ReactNode;
}) { 
  const { t } = useTranslation();
  return (
    <VoucherSection 
  title="بيانات الفاتورة"
    className="shrink-0"
  center={
    <h1 className="text-lg font-bold text-primary-text">
      فاتورة مبيعات
    </h1>
  }
  status={
    <span className="inline-flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-background px-2.5 py-1 text-[10px] font-medium text-danger">
      <VoucherIcon name="unposted" className="size-3" />
      {t("voucherUnposted")}
    </span>
  }
  aside={
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[10px] text-muted-text">
        {t("voucherRequired")}
      </span>
      {navigation}
    </div>
  }
>
 
      <div className="space-y-3 p-4">

         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-8">
          <VoucherField icon="calendar" label={t("voucherDate")} required>
            <input
              data-voucher-step="date"
              type="date"
              className={control}
              value={draft.date}
              onChange={(event) => change("date", event.target.value)}
              required
            />
          </VoucherField>
          <VoucherField icon="hash" label={t("voucherNumber")}>
            <input
              data-voucher-step="number"
              className={control}
              value={draft.number}
              onChange={(event) => change("number", event.target.value)}
              aria-label={t("voucherNumber")}
            />
          </VoucherField>
          <VoucherField icon="hash" label={t("voucherAutomatic")}>
            <input
              className={control + " text-muted-text"}
              value={draft.automaticNo}
              readOnly
              placeholder="—"
            />
          </VoucherField>

          {/* Account */}
          <VoucherField label={"الحساب"} required>
            <select
              data-voucher-step="account"
              className={control}
              value={draft.account}
              onChange={(event) => change("account", event.target.value)}
              required
            >
              <option value="">Select an account</option>
              <option value="Main cash account">Main cash account</option>
              <option value="Bank account">Bank account</option>
              <option value="Accounts receivable">Accounts receivable</option>
              <option value="Accounts payable">Accounts payable</option>
            </select>
          </VoucherField>


          {/* Employee */}
          <VoucherField label="الموظف" required>
            <select
              data-voucher-step="employee"
              className={control}
              value={draft.employee}
              onChange={(event) => change("employee", event.target.value)}
              required
            >
              <option value="">employee..</option>
              <option value="emp1">emp1</option>
              <option value="emp2">emp2</option>
              <option value="emp3">emp3</option>
            </select>
          </VoucherField>


          {/* Gold Price */}
          <VoucherField label="سعر الذهب">
            <input
              data-voucher-step="goldPrice"
              readOnly
              type="number"
              className={control}
              value={draft.goldPrice}
              // onChange={(event) => change("goldPrice", event.target.value)}
            />
          </VoucherField>

          <VoucherField icon="shield" label={t("voucherSecurity")}>
            <select
              data-voucher-step="Security"
              className={control}
              value={draft.confidentiality}
              onChange={(event) =>
                change("confidentiality", event.target.value)
              }
            >
              <option value="normal">{t("voucherNormal")}</option>
              <option value="confidential">{t("voucherConfidential")}</option>
            </select>
          </VoucherField>


          <VoucherField icon="notebookPen" label="الملاحظات">
            <input
              data-voucher-step="Description"
              type="text"
              className={control}
              value={draft.notes}
              // onChange={ }
            />
          </VoucherField>

        </div>

     
      </div>
    </VoucherSection>
  );
}

{
  /* Add Item */
}
{
  /* <VoucherField label="Add Item">
            <div className="relative">
              <input
                data-voucher-step="addItem"
                className={control + " pe-10"}
                value={draft.addItem}
                onChange={(event) => change("addItem", event.target.value)}
              />

              <button
                type="button"
                aria-label="Add item"
                className="absolute inset-e-0 top-0 h-full px-3 text-accent"
              >
                +
              </button>
            </div>
          </VoucherField> */
}


// {/* Notes */}
// <VoucherField icon="document" label={t("voucherNotes")}>
//   <textarea
//     data-voucher-step="notes"
//     className={control + " h-14 resize-y py-2"}
//     value={draft.notes}
//     onChange={(event) => change("notes", event.target.value)}
//   />
// </VoucherField>

{
  /* Sale Price Distribution */
}
{
  /* <VoucherField label="Sale Price Distribution">
            <div className="relative">
              <input
                data-voucher-step="salePriceDistribution"
                className={control + " pe-10"}
                value={draft.salePriceDistribution}
                onChange={(event) =>
                  change("salePriceDistribution", event.target.value)
                }
              />

              <button
                type="button"
                aria-label="Distribute sale price"
                className="absolute inset-e-0 top-0 h-full px-3 text-accent"
              >
                ↻
              </button>
            </div>
          </VoucherField> */
}
