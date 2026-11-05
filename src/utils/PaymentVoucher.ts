import { localDate, units } from "./voucher";

export type PaymentVoucherLine = {
  id: string;
  lineNo: string;
  credit: string;
  account: string;
  currency: string;
  rate: string;
  dueDate: string;
  description: string;
};

export type PaymentVoucherDraft = {
  id: string;
  number: string;
  automaticNo: string;
  date: string;
  confidentiality: string;
  notes: string;
  account: string;
  rows: PaymentVoucherLine[];
  archived: boolean;
};

export function newPaymentVoucher(): PaymentVoucherDraft {
  return {
    id: crypto.randomUUID(),
    number: "",
    automaticNo: "",
    date: localDate(),
    confidentiality: "normal",
    notes: "",
    account: "",
    rows: [blankPaymentLine(1)],
    archived: false,
  };
}


export function paymentLineError(row: PaymentVoucherLine) {
  if (!row.account.trim() && Number(row.credit) > 0)
    return "voucherAccountRequired";

  return null;
}


export function updatePaymentVoucherLine(
  rows: PaymentVoucherLine[],
  id: string,
  key: keyof PaymentVoucherLine,
  value: string,
): PaymentVoucherLine[] {
  const blocked = rows.find((row) => paymentLineError(row));

  if (blocked && blocked.id !== id) {
    return rows;
  }
  const updatedRows = rows.map((row) =>
    row.id === id ? { ...row, [key]: value } : row,
  );
  const last = updatedRows[updatedRows.length - 1];
  // اذا انا بكتب في اخر سطر +  isCompletepaymentLine يعني معبى الشغلاتن المطلوبة
  // وما بتضيف سطر جديد اذا في خطا في اي سطر
  if (
    last?.id === id &&
    isCompletepaymentLine(last) &&
    !updatedRows.some((row) => paymentLineError(row))
  ) {
    updatedRows.push(blankPaymentLine(updatedRows.length + 1));
  }
  return updatedRows;
}

 

export function isCompletepaymentLine(row: PaymentVoucherLine) {
  const credit = Number(row.credit);
  return (
    !!row.account.trim() &&
    !!row.currency.trim() &&
    Number(row.rate) > 0 &&
    Number.isFinite(credit) &&
    credit > 0
  );
}

export function blankPaymentLine(lineNo: number): PaymentVoucherLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    credit: "0.000",
    account: "",
    currency: "JOD",
    rate: "1",
    dueDate: localDate(),
    description: "",
  };
}

export function deletePaymentVoucherLines(
  rows: PaymentVoucherLine[],
  ids: string[],
): PaymentVoucherLine[] {
  // إذا وُجد سطر فيه خطأ، أرجع الأسطر كما هي دون حذف
  if (rows.some((row) => paymentLineError(row))) return rows;
  // يعني بدي ال rows اللي مش مضغوط عليهم
  const updatedRows = rows.filter((row) => !ids.includes(row.id));
  if (updatedRows.length === 0) {
    updatedRows.push(blankPaymentLine(1));
  }
  const renumberedRows = updatedRows.map((row, index) => ({
    ...row,
    lineNo: String(index + 1).padStart(2, "0"),
  }));
  return renumberedRows;
}


export function PaymentVoucherTotals(rows: PaymentVoucherLine[]) {
    const credit = rows.reduce(
    (sum, row) =>
      sum + Math.round((units(row.credit) * units(row.rate)) / 10000),
    0,
  );
  return { credit };
}

