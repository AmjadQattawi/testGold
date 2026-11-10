export type TableSort<Row> = {
  key: keyof Row;
  direction: "ascending" | "descending";
} | null;
export type TableColumn<Row> = {
  key: keyof Row;
  numeric?: boolean;
  type?: string;
  options?: { value: string; label: string }[];
};
export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "empty"
  | "notEmpty"
  | "contains"
  | "notContains"
  | "starts"
  | "ends";
export type ColumnFilter =
  | { mode: "values"; values: string[] }
  | {
      mode: "condition";
      operator: FilterOperator;
      value: string;
      secondValue?: string;
    };
export function displayCell<Row>(row: Row, column: TableColumn<Row>) {
  const value = String(row[column.key] ?? "");
  return (
    column.options?.find((option) => option.value === value)?.label ?? value
  );
}
export function matchesColumnFilter(
  raw: string,
  label: string,
  filter: ColumnFilter | string,
  numeric: boolean,
  locale: string,
) {
  if (typeof filter === "string")
    return label
      .toLocaleLowerCase(locale)
      .includes(filter.trim().toLocaleLowerCase(locale));
  if (filter.mode === "values") return filter.values.includes(raw);
  const { operator, value, secondValue = "" } = filter;
  if (operator === "empty") return !raw.trim();
  if (operator === "notEmpty") return !!raw.trim();
  if (numeric && !raw.trim()) return false;
  const a = numeric ? Number(raw) : label.toLocaleLowerCase(locale),
    b = numeric ? Number(value) : value.toLocaleLowerCase(locale),
    c = numeric ? Number(secondValue) : secondValue.toLocaleLowerCase(locale);
  if (
    numeric &&
    (![a, b].every((item) => Number.isFinite(item)) ||
      (operator === "between" && !Number.isFinite(c)))
  )
    return false;
  switch (operator) {
    case "eq":
      return a === b;
    case "ne":
      return a !== b;
    case "gt":
      return a > b;
    case "gte":
      return a >= b;
    case "lt":
      return a < b;
    case "lte":
      return a <= b;
    case "between":
      return a >= b && a <= c;
    case "contains":
      return String(a).includes(String(b));
    case "notContains":
      return !String(a).includes(String(b));
    case "starts":
      return String(a).startsWith(String(b));
    case "ends":
      return String(a).endsWith(String(b));
    default:
      return true;
  }
}
export function filterSortRows<Row>(
  rows: Row[],
  columns: TableColumn<Row>[],
  filters: Partial<Record<keyof Row, ColumnFilter | string>>,
  sort: TableSort<Row>,
  locale: string,
): Row[] {
  const result = rows.filter((row) =>
    columns.every((column) => {
      const filter = filters[column.key];
      return (
        filter === undefined ||
        matchesColumnFilter(
          String(row[column.key] ?? ""),
          displayCell(row, column),
          filter,
          !!column.numeric,
          locale,
        )
      );
    }),
  );
  if (sort) {
    const column = columns.find((item) => item.key === sort.key);
    if (column)
      result.sort((a, b) => {
        const comparison = column.numeric
          ? Number(a[sort.key] || 0) - Number(b[sort.key] || 0)
          : displayCell(a, column).localeCompare(
              displayCell(b, column),
              locale,
              { numeric: true },
            );
        return sort.direction === "ascending" ? comparison : -comparison;
      });
  }
  return result;
}
