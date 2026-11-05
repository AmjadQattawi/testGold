import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import VoucherIcon from "./VoucherIcon";
import type { ColumnFilter, FilterOperator } from "../../utils/tableRows";
type Props = {
  label: string;
  numeric?: boolean;
  date?: boolean;
  anchor: HTMLButtonElement;
  values: { value: string; label: string }[];
  current?: ColumnFilter;
  onApply: (filter?: ColumnFilter) => void;
  onClose: () => void;
};
const control =
  "h-10 w-full rounded-lg border border-control-border bg-input-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15";
export default function ColumnFilterPopover({
  label,
  numeric,
  date,
  anchor,
  values,
  current,
  onApply,
  onClose,
}: Props) {
  const { t, i18n } = useTranslation();
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"values" | "condition">(
    current?.mode ?? "values",
  );
  const [selected, setSelected] = useState(
    () =>
      new Set(
        current?.mode === "values"
          ? current.values
          : values.map((item) => item.value),
      ),
  );
  const [query, setQuery] = useState("");
  const [operator, setOperator] = useState<FilterOperator>(
    current?.mode === "condition"
      ? current.operator
      : numeric || date
        ? "eq"
        : "contains",
  );
  const [value, setValue] = useState(
    current?.mode === "condition" ? current.value : "",
  );
  const [second, setSecond] = useState(
    current?.mode === "condition" ? (current.secondValue ?? "") : "",
  );
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const position = () => {
      const rect = anchor.getBoundingClientRect();
      const bounds = element.getBoundingClientRect();
      const rtl = document.documentElement.dir === "rtl";
      element.style.left =
        Math.max(
          8,
          Math.min(
            window.innerWidth - bounds.width - 8,
            rtl ? rect.right - bounds.width : rect.left,
          ),
        ) + "px";
      element.style.top =
        Math.max(
          8,
          Math.min(rect.bottom + 8, window.innerHeight - bounds.height - 8),
        ) + "px";
    };
    element.showPopover();
    position();
    const previous = document.activeElement;
    const input = element.querySelector<HTMLInputElement | HTMLSelectElement>(
      "input,select",
    );
    input?.focus();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      element.hidePopover();
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus();
    };
  }, [anchor]);
  const shown = values.filter((item) =>
    item.label
      .toLocaleLowerCase(i18n.language)
      .includes(query.toLocaleLowerCase(i18n.language)),
  );
  const operators: FilterOperator[] =
    numeric || date
      ? ["eq", "ne", "gt", "gte", "lt", "lte", "between", "empty", "notEmpty"]
      : [
          "contains",
          "notContains",
          "eq",
          "ne",
          "starts",
          "ends",
          "empty",
          "notEmpty",
        ];
  const noValue = operator === "empty" || operator === "notEmpty";
  function apply(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    onApply(
      mode === "values"
        ? values.every((item) => selected.has(item.value))
          ? undefined
          : { mode: "values", values: [...selected] }
        : { mode: "condition", operator, value, secondValue: second },
    );
  }
  return createPortal(
    <div
      ref={ref}
      popover="auto"
      role="dialog"
      aria-modal="false"
      aria-labelledby={id}
      onToggle={(event) => {
        if (event.newState === "closed") onClose();
      }}
      dir={i18n.dir()}
      className="fixed m-0 w-80 max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-1rem)] overflow-auto rounded-xl border border-control-border bg-elevated-background p-5 text-primary-text shadow-[0_12px_40px_var(--color-card-shadow)] print:hidden"
    >
      <form onSubmit={apply} className="space-y-4">
        <header>
          <h3 id={id} className="text-sm font-semibold">
            {t("filterTitle", { column: label })}
          </h3>
          <p className="mt-1 text-xs text-muted-text">{t("filterHint")}</p>
        </header>
        <div
          role="tablist"
          aria-label={t("tableFilter")}
          className="flex rounded-lg bg-page-background p-1"
        >
          {(["values", "condition"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mode === tab}
              aria-controls={id + "-" + tab}
              id={id + "-tab-" + tab}
              onClick={() => setMode(tab)}
              className={
                "flex-1 rounded-md px-2 py-2 text-xs font-medium " +
                (mode === tab
                  ? "border border-control-border bg-card-background text-accent shadow-sm"
                  : "text-secondary-text")
              }
            >
              {t(
                tab === "values"
                  ? "filterValues"
                  : numeric
                    ? "filterNumeric"
                    : date
                      ? "filterDate"
                      : "filterText",
              )}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={id + "-" + mode}
          aria-labelledby={id + "-tab-" + mode}
        >
          {mode === "values" ? (
            <div className="space-y-3">
              <div className="relative">
                <VoucherIcon
                  name="search"
                  className="pointer-events-none absolute inset-s-3 top-3 text-muted-text"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("filterSearch")}
                  aria-label={t("filterSearch")}
                  className={control + " ps-9"}
                />
              </div>
              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setSelected(
                      (previous) =>
                        new Set([
                          ...previous,
                          ...shown.map((item) => item.value),
                        ]),
                    )
                  }
                  className="text-accent hover:underline"
                >
                  {t("filterSelectAll")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelected(
                      (previous) =>
                        new Set(
                          [...previous].filter(
                            (item) =>
                              !shown.some((option) => option.value === item),
                          ),
                        ),
                    )
                  }
                  className="text-muted-text hover:underline"
                >
                  {t("filterDeselect")}
                </button>
              </div>
              <div className="max-h-44 overflow-y-auto rounded-lg border border-control-border p-2">
                {shown.map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-hover-background"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(item.value)}
                      onChange={(event) =>
                        setSelected((previous) => {
                          const next = new Set(previous);
                          if (event.target.checked) next.add(item.value);
                          else next.delete(item.value);
                          return next;
                        })
                      }
                      className="size-4 accent-accent"
                    />
                    <span className="min-w-0 wrap-break-word">
                      {item.label || t("filterBlank")}
                    </span>
                  </label>
                ))}
                {!shown.length && (
                  <p className="p-2 text-xs text-muted-text">
                    {t("tableNoResults")}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block space-y-2 text-xs text-secondary-text">
                <span>{t("filterCondition")}</span>
                <select
                  className={control}
                  value={operator}
                  onChange={(event) =>
                    setOperator(event.target.value as FilterOperator)
                  }
                >
                  {operators.map((op) => (
                    <option key={op} value={op}>
                      {t("filterOp_" + op)}
                    </option>
                  ))}
                </select>
              </label>
              {!noValue && (
                <label className="block space-y-2 text-xs text-secondary-text">
                  <span>{t("filterValue")}</span>
                  <input
                    type={numeric ? "number" : date ? "date" : "text"}
                    required
                    value={value}
                    step={numeric ? "any" : undefined}
                    onChange={(event) => setValue(event.target.value)}
                    className={
                      control +
                      " [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    }
                  />
                </label>
              )}
              {operator === "between" && (
                <label className="block space-y-2 text-xs text-secondary-text">
                  <span>{t("filterSecond")}</span>
                  <input
                    type={numeric ? "number" : date ? "date" : "text"}
                    required
                    value={second}
                    step={numeric ? "any" : undefined}
                    onChange={(event) => setSecond(event.target.value)}
                    className={control}
                  />
                </label>
              )}
            </div>
          )}
        </div>
        <footer className="flex gap-2 border-t border-control-border pt-4">
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-2 text-xs font-medium text-accent-button-text hover:bg-accent-hover"
          >
            {t("filterApply")}
          </button>
          <button
            type="button"
            onClick={() => onApply(undefined)}
            className="rounded-lg border border-control-border px-5 py-2 text-xs hover:bg-hover-background"
          >
            {t("filterClear")}
          </button>
        </footer>
      </form>
    </div>,
    document.body,
  );
}
