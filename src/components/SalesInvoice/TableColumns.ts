// Column definitions for rendering each sales invoice table.

import type {
  GemstoneCollectionLine,
  GoldBoxLine,
  InvoicePaymentLine,
  JewelryPieceLine,
  ServiceMaterialLine,
} from "../../utils/salesInvoice";


// jewelryPiecesColumns -------------
import type { EditableColumn } from "../voucher/EditableTable";
// jewelryPiecesColumns -------------

export const jewelryPiecesColumns: EditableColumn<JewelryPieceLine>[] = [
  { key: "lineNo", label: "#", type: "text", readOnly: true, width: "w-12" }, // 48px
  { key: "itemNumber", label: "رقم المادة", type: "text", width: "w-26" }, // 128px

  { key: "wagesBeforeDiscount", label: "السعر قبل الخصم", type: "number", numeric: true, width: "w-36" }, // 144px
  { key: "discount", label: "قيمة الخصم", type: "number", numeric: true, width: "w-28" }, // 112px
  { key: "saleWages", label: "سعر البيع", type: "number", numeric: true, width: "w-32" }, // 128px
  { key: "minimumSalePrice", label: "أقل سعر بيع", type: "number", numeric: true, readOnly: true, width: "w-36" },

  { key: "grossWeight", label: "الوزن القائم", type: "number", numeric: true, readOnly: true, width: "w-28" },
  { key: "goldWeight", label: "وزن الذهب", type: "number", numeric: true, readOnly: true, width: "w-28" },
  { key: "karat", label: "العيار", type: "number", numeric: true, readOnly: true, width: "w-20" }, // 80px
  { key: "alloy", label: "حلة", type: "number", numeric: true, readOnly: true, width: "w-20" },

  { key: "totalWages", label: "إجمالي الأجور", type: "number", numeric: true, readOnly: true, width: "w-36" },
  { key: "description", label: "وصف القطعة", type: "text", readOnly: true, width: "w-34" }, // 256px - مساحة مريحة للنص
  { key: "diamondWeight", label: "وزن الماس", type: "number", numeric: true, readOnly: true, width: "w-28" },
  { key: "diamondCount", label: "عدد الماس", type: "number", numeric: true, readOnly: true, width: "w-24" },
  { key: "coloredWeight", label: "وزن ملون", type: "number", numeric: true, readOnly: true, width: "w-28" },
  { key: "coloredCount", label: "عدد ملون", type: "number", numeric: true, readOnly: true, width: "w-24" },

  { key: "warehouse", label: "المستودع", type: "text", readOnly: true, width: "w-26" },
  { key: "alloyPrice", label: "سعر الحلة", type: "number", numeric: true, width: "w-28" },
];



// goldBoxesColumns ------------------
export const goldBoxesColumns: EditableColumn<GoldBoxLine>[] = [
  { key: "lineNo", label: "#", readOnly: true, numeric: true, width: "w-12" }, // 48px
  { key: "boxNumber", label: "رقم الصندوق", type: "text", width: "w-32" }, // 128px
  { key: "description", label: "وصف المادة", type: "text", width: "w-34" }, // 256px - مساحة مريحة للوصف
  
  { key: "grossWeight", label: "الوزن القائم", type: "number", numeric: true, width: "w-28" }, // 112px
  { key: "quantity", label: "العدد", type: "number", numeric: true, width: "w-24" }, // 96px
  { key: "karat", label: "العيار", type: "number", numeric: true, width: "w-20" }, // 80px
  { key: "alloy", label: "حلة", type: "number", numeric: true, width: "w-20" }, // 80px
  
  { key: "alloyPrice", label: "سعر الحلة", type: "number", numeric: true, width: "w-28" },
  { key: "unitWages", label: "أجور الوحدة", type: "number", numeric: true, width: "w-32" },
  { key: "wagesBeforeDiscount", label: "الأجور قبل الخصم", type: "number", numeric: true, width: "w-36" }, // 144px
  { key: "discount", label: "قيمة الخصم", type: "number", numeric: true, width: "w-28" },
  { key: "totalWages", label: "إجمالي الأجور", type: "number", numeric: true, width: "w-36" },
  { key: "total", label: "الإجمالي", type: "number", numeric: true, width: "w-36" },
  
  { key: "warehouse", label: "المستودع", type: "text", width: "w-31" },
  { key: "notes", label: "ملاحظات المادة", type: "text", width: "w-42" }, // 208px - مساحة جيدة لكتابة الملاحظات
];


// serviceMaterialsColumns ---------------------
export const serviceMaterialsColumns: EditableColumn<ServiceMaterialLine>[] = [
  { key: "lineNo", label: "#", readOnly: true, numeric: true, width: "w-[4%]" },
  { key: "boxNumber", label: "رقم الصندوق", type: "text", width: "w-[12%]" },
  { key: "description", label: "وصف المادة", type: "text", width: "w-[15%]" },
  { key: "quantity", label: "العدد", type: "number", numeric: true, width: "w-[12%]" },
  { key: "unitPrice", label: "سعر الوحدة", type: "number", numeric: true, width: "w-[13%]" },
  { key: "discount", label: "قيمة الخصم", type: "number", numeric: true, width: "w-[13%]" },
  { key: "total", label: "الإجمالي", type: "number", numeric: true, width: "w-[13%]" },
  { key: "net", label: "الصافي", type: "number", numeric: true, width: "w-[13%]" },
];

// gemstoneCollectionsColumns ----------------
export const gemstoneCollectionsColumns: EditableColumn<GemstoneCollectionLine>[] = [
  { key: "lineNo", label: "#", readOnly: true, numeric: true, width: "w-[4%]" },
  { key: "boxNumber", label: "رقم الصندوق", type: "text", width: "w-[11%]" },
  { key: "description", label: "وصف المادة", type: "text", width: "w-[15%]" },
  { key: "grossWeight", label: "الوزن القائم", type: "number", numeric: true, width: "w-[9%]" },
  { key: "quantity", label: "العدد", type: "number", numeric: true, width: "w-[6%]" },
  { key: "unitWages", label: "أجور الوحدة", type: "number", numeric: true, width: "w-[10%]" },
  { key: "wagesBeforeDiscount", label: "الأجور قبل الخصم", type: "number", numeric: true, width: "w-[14%]" },
  { key: "discount", label: "قيمة الخصم", type: "number", numeric: true, width: "w-[10%]" },
  { key: "totalWages", label: "إجمالي الأجور", type: "number", numeric: true, width: "w-[11%]" },
  { key: "warehouse", label: "المستودع", type: "text", width: "w-[11%]" },
];

// invoicePaymentColumns -------------------------------
export const invoicePaymentColumns: EditableColumn<InvoicePaymentLine>[] = [
  { key: "lineNo", label: "#", readOnly: true, numeric: true, width: "w-12" },
  { key: "debit", label: "المدين", type: "number", numeric: true, width: "w-25" },
  { key: "credit", label: "الدائن", type: "number", numeric: true, width: "w-25" },
  {
    key: "account",
    label: "الحساب",
    type: "select",
    options: [
      { value: "cash", label: "الصندوق النقدي" },
      { value: "bank", label: "البنك" },
    ],
    width: "w-27",
  },
  {
    key: "currency",
    label: "العملة",
    type: "select",
    options: [
      { value: "JOD", label: "JOD" },
      { value: "USD", label: "USD" },
    ],
    width: "w-25",
  },
  { key: "rate", label: "الصرف", type: "number", numeric: true, width: "w-25" },
  { key: "dueDate", label: "تاريخ الحق", type: "date", width: "w-30" },
  { key: "description", label: "البيان", type: "text", width: "w-25" },
];