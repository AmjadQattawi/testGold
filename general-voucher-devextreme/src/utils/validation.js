export const accounts = ['Main cash', 'Bank account', 'Receivables', 'Payables'];
export const currencies = ['JOD', 'USD', 'EUR', 'SAR', 'AED'];
export function lineError(row) {
  if (!accounts.includes(row.account)) return 'Select a valid account';
  if (!currencies.includes(row.currency)) return 'Select a currency';
  if (!Number.isFinite(row.rate) || row.rate <= 0) return 'Exchange rate must be greater than zero';
  if (![row.debit, row.credit].every(n => Number.isFinite(n) && n >= 0)) return 'Amounts must be finite non-negative numbers';
  if (!((row.debit > 0 && row.credit === 0) || (row.credit > 0 && row.debit === 0))) return 'Enter a positive amount on one side only';
  return '';
}
export function totals(rows) {
  const sum = field => rows.reduce((n, r) => n + Math.round(Math.round(r[field] * 10000) * Math.round(r.rate * 10000) / 10000), 0);
  const debit = sum('debit'), credit = sum('credit');
  return { debit: debit / 10000, credit: credit / 10000, difference: (debit - credit) / 10000, balanced: debit > 0 && debit === credit };
}
export function voucherError(voucher) {
  if (!voucher.date || Number.isNaN(new Date(voucher.date).getTime())) return 'Voucher date is required';
  if (voucher.rows.length < 2) return 'Add at least two rows';
  for (const [index, row] of voucher.rows.entries()) {
    const error = lineError(row);
    if (error) return `Row ${index + 1}: ${error}`;
  }
  if (!totals(voucher.rows).balanced) return 'The voucher is unbalanced. Debit and credit must match in JOD';
  return '';
}
