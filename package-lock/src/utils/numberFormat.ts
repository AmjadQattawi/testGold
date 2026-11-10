const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});
export function formatDecimal(value: string | number) {
  const number = Number(value);
  return Number.isFinite(number) ? formatter.format(number) : "";
}
export function normalizeDecimal(value: string) {
  const text = value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[,٬\s]/g, "")
    .replace(/٫/g, ".");
  return /^-?\d*(?:\.\d{0,4})?$/.test(text) ? text : null;
}
