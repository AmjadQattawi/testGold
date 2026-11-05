import { getAuthSession } from "../utils/authSession";
import type { SalesInvoiceDraft } from "../utils/salesInvoice";

export function salesInvoiceStorageKey(companyId: string) {
  return (
    "testGold.salesInvoices." +
    encodeURIComponent(getAuthSession()?.email ?? "") +
    "." +
    encodeURIComponent(companyId)
  );
}

export function readDrafts(key: string): SalesInvoiceDraft[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");

    return Array.isArray(data)
      ? data.filter(
          (item): item is SalesInvoiceDraft =>
            !!item &&
            typeof item.id === "string" &&
            typeof item.number === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export function writeDrafts(key: string, drafts: SalesInvoiceDraft[]) {
  localStorage.setItem(key, JSON.stringify(drafts));
}