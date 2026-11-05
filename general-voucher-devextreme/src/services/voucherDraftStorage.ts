import type { Voucher, Line } from '../utils/voucher';
const storageKey = 'devextreme-general-vouchers-v1';
export function readDrafts(): Voucher[] { try {
    const v = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(v) ? v.filter(x => x && Array.isArray(x.rows)).map(x => ({ ...x, rows: x.rows.map((r: Line, i: number) => ({ ...r, lineNo: String(i + 1).padStart(2, '0') })) })) : [];
}
catch {
    return [];
} }
export function writeDrafts(items: Voucher[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }
