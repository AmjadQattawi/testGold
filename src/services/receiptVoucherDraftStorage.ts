import type {
  ReceiptVoucherDraft,
  ReceiptVoucherLine,
} from "../utils/receiptVoucher";
import { getAuthSession } from "../utils/authSession";

export function receiptVoucherStorageKey(companyId: string) {
  return (
    "testGold.receiptVouchers." +
    encodeURIComponent(getAuthSession()?.email ?? "") +
    "." +
    encodeURIComponent(companyId)
  );
}

export function readDrafts(key: string): ReceiptVoucherDraft[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");

    return Array.isArray(data)
      ? data.filter(
          (item): item is ReceiptVoucherDraft =>
            !!item &&
            typeof item.id === "string" &&
            typeof item.number === "string" &&
            Array.isArray(item.rows) &&
            item.rows.every(
              (row: Partial<ReceiptVoucherLine>) =>
                row &&
                typeof row.id === "string" &&
                typeof row.debit === "string",
            ),
        )
      : [];
  } catch {
    return [];
  }
}

export function writeDrafts(
  key: string,
  drafts: ReceiptVoucherDraft[],
) {
  localStorage.setItem(key, JSON.stringify(drafts));
}