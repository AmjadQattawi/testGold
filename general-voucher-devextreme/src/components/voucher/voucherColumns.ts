import type { Field } from '../../utils/voucher';
import { accounts, currencies } from '../../utils/validation.js';
export const columns: {
    key: Field;
    label: string;
    numeric?: boolean;
    type?: string;
    width: number;
    required?: boolean;
    options?: string[];
}[] = [
    { key: 'lineNo', label: '#', numeric: true, width: 4 }, { key: 'debit', label: 'Debit', numeric: true, width: 9, required: true }, { key: 'credit', label: 'Credit', numeric: true, width: 9, required: true },
    { key: 'account', label: 'Account', width: 20, required: true, options: accounts }, { key: 'currency', label: 'Currency', width: 8, options: currencies }, { key: 'rate', label: 'Exchange rate', numeric: true, width: 11 },
    { key: 'dueDate', label: 'Due date', type: 'date', width: 9 }, { key: 'costCenter', label: 'Cost center', width: 8, options: ['Management', 'Sales'] }, { key: 'description', label: 'Description', width: 19 },
];
