export type NewVoucherLine = {
  id: string;
  lineNo: number;
  debit: number;
  credit: number;
  account: string;
  currency: string;
  rate: number;
  dueDate: Date;
  costCenter: string;
  description: string;
};

export type NewVoucherDraft = {
  id: string;
  number: string;
  automaticNo: string;
  date: string;
  confidentiality: string;
  notes: string;
  rows: NewVoucherLine[];
  archived: boolean;
};

export function localDate(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export function blankNewLine(lineNo: number): NewVoucherLine {
  const dueDate = new Date();
  dueDate.setHours(0, 0, 0, 0);

  return {
    id: crypto.randomUUID(),
    lineNo,
    debit: 0,
    credit: 0,
    account: "",
    currency: "JOD",
    rate: 1,
    dueDate,
    costCenter: "",
    description: "",
  };
}

export function newVoucher(): NewVoucherDraft {
  return {
    id: crypto.randomUUID(),
    number: "",
    automaticNo: "",
    date: localDate(),
    confidentiality: "normal",
    notes: "",
    rows: [blankNewLine(1)],
    archived: false,
  };
}

export function isCompleteLine(row: NewVoucherLine): boolean {
  return (
    row.account.trim() !== "" &&
    row.currency.trim() !== "" &&
    Number.isFinite(row.rate) &&
    row.rate > 0 &&
    Number.isFinite(row.debit) &&
    Number.isFinite(row.credit) &&
    row.debit >= 0 &&
    row.credit >= 0 &&
    ((row.debit > 0 && row.credit === 0) || (row.credit > 0 && row.debit === 0))
  );
}


 

export function hasAmountConflict(row: NewVoucherLine): boolean {
  return row.debit > 0 && row.credit > 0;
}
export function newVoucherLineError(row: NewVoucherLine) {
  if (hasAmountConflict(row)) return "voucherAmountConflict";
  if (!row.account.trim() && (row.debit > 0 || row.credit > 0))
    return "voucherAccountRequired";
  return null;
}