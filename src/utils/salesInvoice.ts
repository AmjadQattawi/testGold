import { localDate } from "./voucher";

export type SalesInvoiceDraft = {
  id: string;
  date: string;
  number: string;
  automaticNo: string;
  account: string;
  employee: string;
  notes: string;
  confidentiality: string;
  goldPrice: string;
  addItem: string;
  salePriceDistribution: string;
  archived: boolean;
  jewelryPiecesRow: JewelryPieceLine[];
  goldBoxesRow: GoldBoxLine[];
  serviceMaterialsRow: ServiceMaterialLine[];
  gemstoneCollectionsRow: GemstoneCollectionLine[];
};

export function newSalesInvoice(): SalesInvoiceDraft {
  return {
    id: crypto.randomUUID(),
    date: localDate(),
    number: "",
    automaticNo: "",
    account: "",
    employee: "",
    notes: "",
    confidentiality: "normal",
    goldPrice: "",
    addItem: "",
    salePriceDistribution: "",
    archived: false,
    jewelryPiecesRow: [
      blankJewelryPieceLine(1),
      blankJewelryPieceLine(2),
      blankJewelryPieceLine(3),
      // blankJewelryPieceLine(4),
      // blankJewelryPieceLine(5),
      // blankJewelryPieceLine(6),
      // blankJewelryPieceLine(7),
    ],
    goldBoxesRow: [
      blankGoldBoxLine(1),
      blankGoldBoxLine(1),
      blankGoldBoxLine(1),
      blankGoldBoxLine(1),
      blankGoldBoxLine(1),
      blankGoldBoxLine(1),
      blankGoldBoxLine(1),
    ],
    serviceMaterialsRow: [
      blankServiceMaterialLine(1),
      blankServiceMaterialLine(1),
      blankServiceMaterialLine(1),
    ],
    gemstoneCollectionsRow: [
      blankGemstoneCollectionLine(1),
      blankGemstoneCollectionLine(1),
      blankGemstoneCollectionLine(1),
    ],
  };
}

// ----------------------
// JewelryPiece

export function blankJewelryPieceLine(lineNo: number): JewelryPieceLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    itemNumber: "",
    wagesBeforeDiscount: "",
    discount: "",
    saleWages: "",
    saleKarat: "",
    saleAlloy: "",
    minimumSalePrice: "",
    grossWeight: "",
    goldWeight: "",
    karat: "",
    alloy: "",
    totalWages: "",
    description: "",
    diamondWeight: "",
    diamondCount: "",
    coloredWeight: "",
    coloredCount: "",
    warehouse: "",
    alloyPrice: "",
  };
}

export type JewelryPieceLine = {
  id: string;
  lineNo: string;
  itemNumber: string; // رقم المادة
  wagesBeforeDiscount: string; // الأجور قبل الخصم
  discount: string; // قيمة الخصم
  saleWages: string; // أجور / بيع
  saleKarat: string; // عيار / بيع
  saleAlloy: string; // حلة / بيع
  minimumSalePrice: string; // أقل سعر بيع
  grossWeight: string; // الوزن القائم
  goldWeight: string; // وزن الذهب
  karat: string; // العيار
  alloy: string; // حلة
  totalWages: string; // إجمالي الأجور
  description: string; // وصف القطعة
  diamondWeight: string; // وزن الماس
  diamondCount: string; // عدد الماس
  coloredWeight: string; // وزن ملون
  coloredCount: string; // عدد ملون
  warehouse: string; // المستودع
  alloyPrice: string; // سعر الحلة
};

// ----------------------------------------

// GoldBox
export type GoldBoxLine = {
  id: string; // معرّف السطر
  lineNo: string; // رقم السطر
  boxNumber: string; // رقم الصندوق
  description: string; // وصف المادة
  grossWeight: string; // الوزن القائم
  quantity: string; // العدد
  karat: string; // العيار
  alloy: string; // حلة
  alloyPrice: string; // سعر الحلة
  unitWages: string; // أجور الوحدة
  wagesBeforeDiscount: string; // الأجور قبل الخصم
  discount: string; // قيمة الخصم
  totalWages: string; // إجمالي الأجور
  total: string; // الإجمالي
  warehouse: string; // المستودع
  notes: string; // ملاحظات المادة
};

export function blankGoldBoxLine(lineNo = 1): GoldBoxLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    boxNumber: "",
    description: "",
    grossWeight: "0.0000",
    quantity: "",
    karat: "0.0000",
    alloy: "0.0000",
    alloyPrice: "0.0000",
    unitWages: "0.0000",
    wagesBeforeDiscount: "0.0000",
    discount: "0.0000",
    totalWages: "0.0000",
    total: "0.0000",
    warehouse: "",
    notes: "",
  };
}

// -------------------
// ServiceMaterial

export type ServiceMaterialLine = {
  id: string; // معرّف السطر
  lineNo: string; // رقم السطر
  boxNumber: string; // رقم الصندوق
  description: string; // وصف المادة
  quantity: string; // العدد
  unitPrice: string; // سعر الوحدة
  discount: string; // قيمة الخصم
  total: string; // الإجمالي
  net: string; // الصافي
};

export function blankServiceMaterialLine(lineNo = 1): ServiceMaterialLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    boxNumber: "",
    description: "",
    quantity: "",
    unitPrice: "0.0000",
    discount: "0.0000",
    total: "0.0000",
    net: "0.0000",
  };
}

//  ------------------------
// GemstoneCollection
export type GemstoneCollectionLine = {
  id: string; // معرّف السطر
  lineNo: string; // رقم السطر
  boxNumber: string; // رقم الصندوق
  description: string; // وصف المادة
  grossWeight: string; // الوزن القائم
  quantity: string; // العدد
  unitWages: string; // أجور الوحدة
  wagesBeforeDiscount: string; // الأجور قبل الخصم
  discount: string; // قيمة الخصم
  totalWages: string; // إجمالي الأجور
  warehouse: string; // المستودع
};

export function blankGemstoneCollectionLine(
  lineNo = 1,
): GemstoneCollectionLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    boxNumber: "",
    description: "",
    grossWeight: "0.0000",
    quantity: "",
    unitWages: "0.0000",
    wagesBeforeDiscount: "0.0000",
    discount: "0.0000",
    totalWages: "0.0000",
    warehouse: "",
  };
}

// Payment row type and initial empty row -------------
export type InvoicePaymentLine = {
  id: string;
  lineNo: string;
  debit: string;
  credit: string;
  account: string;
  currency: string;
  rate: string;
  dueDate: string;
  description: string;
};

export function blankInvoicePaymentLine(lineNo = 1): InvoicePaymentLine {
  return {
    id: crypto.randomUUID(),
    lineNo: String(lineNo).padStart(2, "0"),
    debit: "0.0000",
    credit: "0.0000",
    account: "",
    currency: "",
    rate: "0.0000",
    dueDate: "",
    description: "",
  };
}
