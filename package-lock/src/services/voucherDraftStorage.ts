import type { VoucherDraft, VoucherLine } from "../utils/voucher";
import { getAuthSession } from "../utils/authSession";
export function voucherStorageKey(companyId: string) {
  return (
    "testGold.vouchers." +
    encodeURIComponent(getAuthSession()?.email ?? "") +
    "." +
    encodeURIComponent(companyId)
  );
}
export function readDrafts(key: string): VoucherDraft[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(data)
      ? data.filter(
          (item): item is VoucherDraft =>
            !!item &&
            typeof item.id === "string" &&
            typeof item.number === "string" &&
            Array.isArray(item.rows) &&
            item.rows.every(
              (row: Partial<VoucherLine>) =>
                row &&
                typeof row.id === "string" &&
                typeof row.debit === "string" &&
                typeof row.credit === "string",
            ),
        )
      : [];
  } catch {
    return [];
  }
}
export function writeDrafts(key: string, drafts: VoucherDraft[]) {
  localStorage.setItem(key, JSON.stringify(drafts));
}
