import { localDate, units } from "./voucher";

export type ReceiptVoucherLine = {
  id: string;
  lineNo: string;
  debit: string;
  account: string;
  currency: string;
  rate: string;
  dueDate: string;
  description: string;
};

export type ReceiptVoucherDraft = {
  id: string;
  number: string;
  automaticNo: string;
  date: string;
  confidentiality: string;
  notes: string;
  account: string;
  rows: ReceiptVoucherLine[];
  archived: boolean;
};

export function blankReceiptLine(lineNo: number): ReceiptVoucherLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    debit: "0.000",
    account: "",
    currency: "JOD",
    rate: "1",
    dueDate: localDate(),
    description: "",
  };
}

export function newReceiptVoucher(): ReceiptVoucherDraft {
  return {
    id: crypto.randomUUID(),
    number: "",
    automaticNo: "",
    date: localDate(),
    confidentiality: "normal",
    notes: "",
    account: "",
    rows: [blankReceiptLine(1)],
    archived: false,
  };
}

// تفحص جاهزية السطر، وتُرجع true عند اكتماله أو false إذا نقص أحد الشروط؛ لكنها لا تضيف سطرًا بنفسها.
// هل السطر مكتمل لنضيف سطرًا جديدًا؟
//  !!     عشان يرجعلي boolean
export function isCompleteReceiptLine(row: ReceiptVoucherLine) {
  const debit = Number(row.debit);
  return (
    !!row.account.trim() &&
    !!row.currency.trim() &&
    Number(row.rate) > 0 &&
    Number.isFinite(debit) &&
    debit > 0
  );
}

export function updateReceiptVoucherLine(
  rows:ReceiptVoucherLine[],
  id: string,
  key: keyof ReceiptVoucherLine,
  value: string,
):ReceiptVoucherLine[]{
  const blocked = rows.find((row) => receiptLineError(row));

if (blocked && blocked.id !== id) {
  return rows;
}
    const updatedRows = rows.map((row) =>
    row.id === id
      ? { ...row, [key]: value }
      : row,
  );
  const last = updatedRows[updatedRows.length-1]
  // اذا انا بكتب في اخر سطر +  isCompleteReceiptLine يعني معبى الشغلاتن المطلوبة
  // وما بتضيف سطر جديد اذا في خطا في اي سطر
  if(last.id ===id && isCompleteReceiptLine(last) && !updatedRows.some((row) => receiptLineError(row))  ){
  updatedRows.push(blankReceiptLine(updatedRows.length + 1))
  }
  return updatedRows;
}

// التحقق من خطأ السطر
// هل توجد مشكلة نريد تنبيه المستخدم إليها؟ تُرجع مفتاح الخطأ أو null
export function receiptLineError(row:ReceiptVoucherLine){
  if (!row.account.trim() && (Number(row.debit) > 0 ))
    return "voucherAccountRequired";
  return null;
}

export function deleteReceiptVoucherLines(
  rows: ReceiptVoucherLine[],
  ids: string[],
): ReceiptVoucherLine[] {
  // إذا وُجد سطر فيه خطأ، أرجع الأسطر كما هي دون حذف
  if (rows.some((row) => receiptLineError(row))) return rows;
        // يعني بدي ال rows اللي مش مضغوط عليهم
      const updatedRows = rows.filter(
        (row) => !ids.includes(row.id),
      );
      if(updatedRows.length === 0){
        updatedRows.push(blankReceiptLine(1))
      }
      const renumberedRows = updatedRows.map((row,index)=>( {...row, lineNo:String(index+1).padStart(2,"0")}))
      return renumberedRows
}

 
export function receiptVoucherTotals(rows: ReceiptVoucherLine[]) {
    const debit = rows.reduce(
    (sum, row) =>
      sum + Math.round((units(row.debit) * units(row.rate)) / 10000),
    0,
  );
  return { debit };
}


 