
import { getAuthSession } from "../utils/authSession";
import type { PaymentVoucherDraft, PaymentVoucherLine } from "../utils/PaymentVoucher";
export function paymentVoucherStorageKey(companyId: string) {
  return (
    "testGold.paymentVouchers." +
    encodeURIComponent(getAuthSession()?.email ?? "") +
    "." +
    encodeURIComponent(companyId)
  );
}
export function readDrafts(key: string): PaymentVoucherDraft[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(data)
      ? data.filter(
          (item): item is PaymentVoucherDraft =>
            !!item &&
            typeof item.id === "string" &&
            typeof item.number === "string" &&
            Array.isArray(item.rows) &&
            item.rows.every(
              (row: Partial<PaymentVoucherLine>) =>
                row &&
                typeof row.id === "string" &&
                typeof row.credit === "string",
            ),
        )
      : [];
  } catch {
    return [];
  }
}
export function writeDrafts(key: string, drafts: PaymentVoucherDraft[]) {
  localStorage.setItem(key, JSON.stringify(drafts));
}
