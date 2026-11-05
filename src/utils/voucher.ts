import { formatDecimal } from "./numberFormat";
export type VoucherLine = {
  id: string;
  lineNo: string;
  debit: string;
  credit: string;
  account: string;
  currency: string;
  rate: string;
  dueDate: string;
  costCenter: string;
  description: string;
};
export type VoucherDraft = {
  id: string;
  number: string;
  automaticNo: string;
  date: string;
  confidentiality: string;
  notes: string;
  rows: VoucherLine[];
  archived: boolean;
};
export function localDate() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}
export function blankLine(lineNo: number): VoucherLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    debit: "0.0000",
    credit: "0.0000",
    account: "",
    currency: "JOD",
    rate: "1",
    dueDate: localDate(),
    costCenter: "",
    description: "",
  };
}
export function newVoucher(): VoucherDraft {
  return {
    id: crypto.randomUUID(),
    number: "",
    automaticNo: "",
    date: localDate(),
    confidentiality: "normal",
    notes: "",
    rows: [blankLine(1)],
    archived: false,
  };
}
export function units(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10000) : 0;
}
export function voucherTotals(rows: VoucherLine[]) {
  const debit = rows.reduce(
    (sum, row) =>
      sum + Math.round((units(row.debit) * units(row.rate)) / 10000),
    0,
  );
  const credit = rows.reduce(
    (sum, row) =>
      sum + Math.round((units(row.credit) * units(row.rate)) / 10000),
    0,
  );
  return {
    debit,
    credit,
    difference: debit - credit,
    balanced: debit > 0 && debit === credit,
  };
}
export function formatAmount(units: number) {
  return formatDecimal(units / 10000);
}

export function isCompleteLine(row: VoucherLine) {
  const debit = Number(row.debit),
    credit = Number(row.credit);
  return (
    !!row.account.trim() &&
    !!row.currency.trim() && 
    Number(row.rate) > 0 &&
    Number.isFinite(debit) &&
    Number.isFinite(credit) &&
    debit >= 0 &&
    credit >= 0 &&
    ((debit > 0 && credit === 0) || (credit > 0 && debit === 0))
  );
}
export function hasAmountConflict(row: VoucherLine) {
  return Number(row.debit) > 0 && Number(row.credit) > 0;
}
export function voucherLineError(row: VoucherLine) {
  if (hasAmountConflict(row)) return "voucherAmountConflict";
  if (!row.account.trim() && (Number(row.debit) > 0 || Number(row.credit) > 0))
    return "voucherAccountRequired";
  return null;
}
export function updateVoucherLine(
  rows: VoucherLine[],
  id: string,
  key: keyof VoucherLine,
  value: string,
  nextLine?: VoucherLine,
) {
  const blocked = rows.find((row) => voucherLineError(row));
  if (blocked && blocked.id !== id) return rows;
  const updated = rows.map((row) =>
    row.id === id ? { ...row, [key]: value } : row,
  );
  const last = updated[updated.length - 1];
  return !updated.some((row) => voucherLineError(row)) &&
    last?.id === id &&
    isCompleteLine(last)
    ? [...updated, nextLine ?? blankLine(updated.length + 1)]
    : updated;
}

export function deleteVoucherLines(
  rows: VoucherLine[],
  ids: string[],
  emptyLine?: VoucherLine,
) {
  if (rows.some((row) => voucherLineError(row))) return rows;
  const remaining = rows.filter((row) => !ids.includes(row.id));
  return remaining.length
    ? remaining.map((row, index) => ({
        ...row,
        lineNo: String(index + 1).padStart(2, "0"),
      }))
    : [emptyLine ?? blankLine(1)];
}
