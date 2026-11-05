export type Line = {
    id: string;
    lineNo: string;
    debit: number;
    credit: number;
    account: string;
    currency: string;
    rate: number;
    dueDate: string;
    costCenter: string;
    description: string;
};
export type Voucher = {
    id: string;
    number: string;
    automaticNo: string;
    date: string;
    confidentiality: string;
    notes: string;
    archived: boolean;
    rows: Line[];
};
export type Field = keyof Line;
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const blank = (n = 1): Line => ({ id: crypto.randomUUID(), lineNo: String(n).padStart(2, '0'), debit: 0, credit: 0, account: '', currency: 'JOD', rate: 1, dueDate: today(), costCenter: '', description: '' });
export const fresh = (): Voucher => ({ id: crypto.randomUUID(), number: '', automaticNo: '', date: today(), confidentiality: 'Normal', notes: '', archived: false, rows: [blank()] });
export const amount = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
export const isEmpty = (r: Line) => !r.account && !r.debit && !r.credit && !r.description && !r.costCenter;
export const conflict = (r: Line) => r.debit > 0 && r.credit > 0 ? 'Both debit and credit are entered. Set one amount to zero to continue.' : !r.account && (r.debit > 0 || r.credit > 0) ? 'Select an account before continuing.' : '';
