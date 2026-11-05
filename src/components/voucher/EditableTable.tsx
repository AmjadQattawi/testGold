import DecimalInput from "./DecimalInput";
import ColumnFilterPopover from "./ColumnFilterPopover";
import { useId, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import VoucherIcon from "./VoucherIcon";
import {
  filterSortRows,
  displayCell,
  type ColumnFilter,
  type TableSort,
} from "../../utils/tableRows";
export type EditableOption = { value: string; label: string };
export type EditableColumn<Row> = {
  key: keyof Row;
  label: string;
  type?: "text" | "number" | "date" | "select";
  options?: EditableOption[];
  numeric?: boolean;
  readOnly?: boolean;
  min?: string;
  step?: string;
  width?: string;
  headerNoWrap?: boolean;
  required?: boolean;
  requiredMark?: boolean;
  placeholder?: string;
};
type Props<Row extends { id: string }> = {
  tableMinWidth?: string;
  containerClassName?: string;
  lockedRowId?: string;
  rowError?: string;
  errorColumns?: (keyof Row)[];
  selection?: { ids: string[]; onChange: (ids: string[]) => void };
  rows: Row[];
  columns: EditableColumn<Row>[];
  caption: string;
  onChange: (id: string, key: keyof Row, value: string) => void;
  renderActions?: (row: Row) => ReactNode;
  rowLabel: (index: number) => string;
  columnFooters?: Partial<Record<keyof Row, ReactNode>>;
  onRowBlur?: (id: string) => void;
  onRowFocus?: (id: string) => void;
};
const cellStyle =
  "h-11 w-full min-w-0 border-0 bg-transparent px-2 text-[clamp(0.75rem,0.68rem+0.25vw,0.9375rem)] text-primary-text outline-none read-write:focus:bg-input-background read-write:focus:ring-2 read-write:focus:ring-inset read-write:focus:ring-accent read-only:text-muted-text disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:bg-danger-background aria-invalid:text-danger";
export default function EditableTable<Row extends { id: string }>({
  rows,
  columns,
  caption,
  onChange,
  tableMinWidth = "",
  containerClassName = "",
  renderActions,
  rowLabel,
  lockedRowId,
  rowError,
  errorColumns = [],
  selection,
  columnFooters,
  onRowBlur,
  onRowFocus,
}: Props<Row>) {
  const errorId = useId();
  const { t, i18n } = useTranslation();
  const [sort, setSort] = useState<TableSort<Row>>(null);
  const [filters, setFilters] = useState<
    Partial<Record<keyof Row, ColumnFilter>>
  >({});
  const [openFilter, setOpenFilter] = useState<{
    key: keyof Row;
    anchor: HTMLButtonElement;
  } | null>(null);
  const visible = lockedRowId
    ? rows
    : filterSortRows(rows, columns, filters, sort, i18n.language);
  const sortButton =
    "rounded p-0.5 hover:bg-card-background focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <>
      {rowError && (
        <p
          id={errorId}
          role="alert"
          className="border-b border-danger-border bg-danger-background px-4 py-3 text-sm font-semibold text-danger"
        >
          {rowError}
        </p>
      )}
      <div
        className={
          "relative isolate min-h-0 flex-1 overflow-auto overscroll-contain border-b border-control-border print:overflow-visible " +
          containerClassName
        }
      >
        <table
          className={
            "w-full table-fixed border-separate border-spacing-0 text-sm print:min-w-0 " +
            tableMinWidth
          }
        >
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-20 bg-table-header">
            <tr className="border-b-2 border-control-border bg-table-header text-accent">
              {columns.map((column, columnIndex) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  aria-sort={sort?.key === column.key ? sort.direction : "none"}
                  className={
                    "border-b border-e border-control-border px-4 py-3.5 text-center text-[clamp(0.8125rem,0.7rem+0.3vw,1rem)] font-bold leading-snug " +
                    (column.width ?? "") +
                    (columnIndex === 0
                      ? " sticky inset-s-0 z-30 bg-table-header"
                      : " relative")
                  }
                >
                  <span
                    className={
                      column.headerNoWrap
                        ? "block whitespace-nowrap"
                        : "block wrap-break-word"
                    }
                  >
                    {column.label}
                    {column.requiredMark && " *"}
                  </span>
                  <>
                    <button
                      type="button"
                      disabled={!!lockedRowId}
                      title={t("tableFilter")}
                      aria-label={t("tableFilter") + ": " + column.label}
                      aria-haspopup="dialog"
                      aria-expanded={openFilter?.key === column.key}
                      onClick={(event) =>
                        setOpenFilter({
                          key: column.key,
                          anchor: event.currentTarget,
                        })
                      }
                      className={
                        sortButton +
                        " absolute right-0.5 top-1/2 -translate-y-1/2 print:hidden " +
                        (filters[column.key]
                          ? "bg-card-background text-accent"
                          : "text-muted-text")
                      }
                    >
                      <VoucherIcon name="filter" className="size-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!!lockedRowId}
                      title={t(
                        sort?.key === column.key &&
                          sort.direction === "ascending"
                          ? "tableDescending"
                          : "tableAscending",
                      )}
                      aria-label={
                        t(
                          sort?.key === column.key &&
                            sort.direction === "ascending"
                            ? "tableDescending"
                            : "tableAscending",
                        ) +
                        ": " +
                        column.label
                      }
                      onClick={() =>
                        setSort((previous) => ({
                          key: column.key,
                          direction:
                            previous?.key === column.key &&
                            previous.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        }))
                      }
                      className={
                        sortButton +
                        " absolute left-0.5 top-1/2 -translate-y-1/2 print:hidden " +
                        (sort?.key === column.key
                          ? "bg-card-background text-accent"
                          : "text-muted-text")
                      }
                    >
                      <VoucherIcon
                        name={
                          sort?.key === column.key &&
                          sort.direction === "descending"
                            ? "descending"
                            : "ascending"
                        }
                        className="size-3"
                      />
                    </button>
                  </>
                </th>
              ))}
              {(selection || renderActions) && (
                <th scope="col" className="w-[3%] print:hidden">
                  {selection ? (
                    <input
                      type="checkbox"
                      aria-label={t("tableSelectAll")}
                      disabled={!!lockedRowId || !visible.length}
                      checked={
                        visible.length > 0 &&
                        visible.every((row) => selection.ids.includes(row.id))
                      }
                      ref={(element) => {
                        if (element)
                          element.indeterminate =
                            visible.some((row) =>
                              selection.ids.includes(row.id),
                            ) &&
                            !visible.every((row) =>
                              selection.ids.includes(row.id),
                            );
                      }}
                      onChange={(event) =>
                        selection.onChange(
                          event.target.checked
                            ? [
                                ...new Set([
                                  ...selection.ids,
                                  ...visible.map((row) => row.id),
                                ]),
                              ]
                            : selection.ids.filter(
                                (id) => !visible.some((row) => row.id === id),
                              ),
                        )
                      }
                      className="size-5 cursor-pointer accent-accent disabled:cursor-not-allowed xl:size-4"
                    />
                  ) : (
                    <span className="sr-only">{caption}</span>
                  )}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="">
            {visible.map((row) => (
              <tr
                key={row.id}
                onFocus={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) 
                    onRowFocus?.(row.id);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    onRowBlur?.(row.id);
                }}
                className="bg-card-background even:bg-table-stripe focus-within:bg-accent-background/40"
              >
                {columns.map((column, columnIndex) => {
                  const value = String(row[column.key] ?? "");
                  const label =
                    column.label +
                    " — " +
                    rowLabel(rows.findIndex((item) => item.id === row.id));
                  return (
                    <td
                      key={String(column.key)}
                      className={
                        "border-b border-e border-control-border p-0 " +
                        (column.readOnly ? "bg-slate-100   " : "") +
                        (columnIndex === 0
                          ? "sticky inset-s-0 z-10 bg-card-background shadow-sm"
                          : "")
                      }
                    >
                      {column.type === "select" ? (
                        <select
                          aria-invalid={
                            lockedRowId === row.id &&
                            errorColumns.includes(column.key)
                              ? true
                              : undefined
                          }
                          aria-describedby={
                            lockedRowId === row.id &&
                            errorColumns.includes(column.key)
                              ? errorId
                              : undefined
                          }
                          data-voucher-cell={String(column.key)}
                          value={value}
                          required={column.required}
                          disabled={
                            column.readOnly ||
                            (!!lockedRowId && lockedRowId !== row.id)
                          }
                          aria-label={label}
                          onChange={(event) =>
                            onChange(row.id, column.key, event.target.value)
                          }
                          className={cellStyle + " cursor-pointer text-start"}
                        >
                          {!column.required && (
                            <option value="">
                              {column.placeholder ?? "—"}
                            </option>
                          )}
                          {value &&
                            !column.options?.some(
                              (option) => option.value === value,
                            ) && <option value={value}>{value}</option>}
                          {column.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : column.type === "number" ? (
                        <DecimalInput
                          value={value}
                          readOnly={column.readOnly}
                          onValueChange={(next) =>
                            onChange(row.id, column.key, next)
                          }
                          min={column.min}
                          required={column.required}
                          disabled={!!lockedRowId && lockedRowId !== row.id}
                          aria-label={label}
                          aria-invalid={
                            lockedRowId === row.id &&
                            errorColumns.includes(column.key)
                              ? true
                              : undefined
                          }
                          aria-describedby={
                            lockedRowId === row.id ? errorId : undefined
                          }
                          data-voucher-cell={
                            column.readOnly ? undefined : String(column.key)
                          }
                          className={cellStyle + " tabular-nums text-start"}
                        />
                      ) : (
                        <input
                          disabled={!!lockedRowId && lockedRowId !== row.id}
                          aria-invalid={
                            lockedRowId === row.id &&
                            errorColumns.includes(column.key)
                              ? true
                              : undefined
                          }
                          aria-describedby={
                            lockedRowId === row.id ? errorId : undefined
                          }
                          data-voucher-cell={
                            column.readOnly ? undefined : String(column.key)
                          }
                          type={column.type ?? "text"}
                          value={value}
                          readOnly={column.readOnly}
                          required={column.required}
                          min={column.min}
                          step={column.step}
                          placeholder={column.placeholder}
                          aria-label={label}
                          inputMode={column.numeric ? "decimal" : undefined}
                          dir={
                            column.numeric || column.type === "date"
                              ? "ltr"
                              : undefined
                          }
                          onChange={(event) =>
                            onChange(row.id, column.key, event.target.value)
                          }
                          className={
                            cellStyle +
                            " " +
                            (column.numeric
                              ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none tabular-nums text-start"
                              : "text-start")
                          }
                        />
                      )}
                    </td>
                  );
                })}
                {(selection || renderActions) && (
                  <td className="border-b border-control-border px-0.5 text-center print:hidden">
                    {selection ? (
                      <input
                        type="checkbox"
                        aria-label={t("tableSelectRow", {
                          row: rowLabel(
                            rows.findIndex((item) => item.id === row.id),
                          ),
                        })}
                        checked={selection.ids.includes(row.id)}
                        disabled={!!lockedRowId}
                        onChange={(event) =>
                          selection.onChange(
                            event.target.checked
                              ? [...selection.ids, row.id]
                              : selection.ids.filter((id) => id !== row.id),
                          )
                        }
                        className="size-4 cursor-pointer accent-accent disabled:cursor-not-allowed"
                      />
                    ) : (
                      renderActions?.(row)
                    )}
                  </td>
                )}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={
                    columns.length + (selection || renderActions ? 1 : 0)
                  }
                  className="p-8 text-center text-sm text-muted-text"
                >
                  {t("tableNoResults")}
                </td>
              </tr>
            )}
          </tbody>
          {columnFooters && (
            <tfoot className="sticky bottom-0 z-20 bg-page-background">
              <tr>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="border-t border-e border-control-border px-2 py-3 align-top text-start text-xs"
                  >
                    {columnFooters[column.key]}
                  </td>
                ))}
                {(selection || renderActions) && (
                  <td className="border-t border-control-border print:hidden" />
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {openFilter &&
        !lockedRowId &&
        (() => {
          const column = columns.find((item) => item.key === openFilter.key);
          if (!column) return null;
          const values = [
            ...new Set(rows.map((row) => String(row[column.key] ?? ""))),
          ]
            .map((value) => {
              const row = rows.find(
                (item) => String(item[column.key] ?? "") === value,
              )!;
              return { value, label: displayCell(row, column) };
            })
            .sort((a, b) =>
              a.label.localeCompare(b.label, i18n.language, { numeric: true }),
            );
          return (
            <ColumnFilterPopover
              key={String(column.key)}
              label={column.label}
              numeric={column.numeric}
              date={column.type === "date"}
              anchor={openFilter.anchor}
              values={values}
              current={filters[column.key]}
              onClose={() => setOpenFilter(null)}
              onApply={(filter) => {
                setFilters((previous) => {
                  const next = { ...previous };
                  if (filter) next[column.key] = filter;
                  else delete next[column.key];
                  return next;
                });
                setOpenFilter(null);
              }}
            />
          );
        })()}
    </>
  );
}
