import DataGrid, {
  FilterRow,
  Editing,
  Selection,
  Column,
  Lookup,
  RangeRule,
  HeaderFilter,
  Scrolling,
  Summary,
  TotalItem,
  Paging,
  KeyboardNavigation,
} from "devextreme-react/data-grid";
import type { NewVoucherLine } from "./NewJournalVoucherUtils";
import type { NewVoucherColumn } from "./NewVoucherColumns";
import type { NewVoucherChanges } from "./NewVoucherReducer";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { DataGridRef } from "devextreme-react/data-grid";

export type NewVoucherSummaryItem = {
  column: keyof NewVoucherLine;
  summaryType: "sum" | "count";
  displayFormat: string;
  valueFormat?: {
    type: "fixedPoint";
    precision: number;
  };
};

type Props = {
  rows: NewVoucherLine[];
  columns: NewVoucherColumn[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onChangeLine: (id: string, changes: NewVoucherChanges) => void;
  summaryItems?: NewVoucherSummaryItem[];
  onRowLeave: (id: string) => void;
  onRowEnter: (id: string) => void;
  lockedRowId?: string;
  errorColumns: (keyof NewVoucherLine)[];
  gridRef: RefObject<DataGridRef | null>;
};

export default function NewGrid({
  rows,
  columns,
  selectedIds,
  onSelectionChange,
  onChangeLine,
  summaryItems = [],
  onRowLeave,
  onRowEnter,
  lockedRowId,
  errorColumns,
  gridRef,
}: Props) {
  const previousRowId = useRef<string | null>(null);
  const activeEditor = useRef<{
    rowId: string;
    field: string;
  } | null>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      // هو الـ <div> اللي مغلّف الجدول.
      const wrapper = gridWrapperRef.current;
      // هو العنصر اللي انطلقت منه الكبسة
      const target = event.target;
      if (!wrapper || !(target instanceof Node)) return;

      // اذا العنصر اللي انطلقت منه الكبسة داخل الجدول  ما تعمل شي
      if (wrapper.contains(target)) return;
      const rowId = previousRowId.current;
      if (rowId === null) return;
      previousRowId.current = null;
      // اذا لا شغل onRowLeave وابعتله الصف
      onRowLeave(rowId);
    }
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [onRowLeave]);
  
  return (
    <div
      className="min-h-0 min-w-0 flex-1 overflow-hidden"
      ref={gridWrapperRef}
    >
      <DataGrid
        className="[&_.dx-header-row>td]:bg-table-header [&_.dx-header-row>td]:text-accent [&_.dx-header-row>td]:font-bold  [&_.dx-header-row>td]:py-4!   [&_.dx-data-row>td]:p-3!  [&_.dx-data-row.dx-row-alt>td:not(.voucher-cell-error)]:bg-slate-50!  [&_.dx-datagrid-total-footer_.dx-row>td]:border-e! [&_.dx-datagrid-total-footer_.dx-row>td]:border-control-border! [&_.dx-datagrid-total-footer_.dx-row>td]:text-xs [&_.dx-datagrid-summary-item]:whitespace-pre-line! [&_.dx-datagrid-total-footer]:bg-slate-100!  [&_.dx-data-row>td.dx-editor-cell]:p-0! [&_.voucher-cell-error]:bg-danger-background! [&_.voucher-cell-error]:text-danger!"
        dataSource={rows}
        ref={gridRef}
        width="100%"
        height="auto"
        keyExpr="id"
        showBorders={true}
        showColumnLines={true}
        showRowLines={true}
        rowAlternationEnabled={true}
        // allowColumnResizing={true}
        // columnResizingMode="widget"
        selectedRowKeys={selectedIds}
        onSelectionChanged={(e) => {
          onSelectionChange(e.selectedRowKeys);
        }}
        onSaving={(e) => {
          e.cancel = true;
          for (const change of e.changes) {
            if (change.type === "update") {
              onChangeLine(change.key, change.data);
            }
          }
          e.component.cancelEditData();
        }}
        onFocusedCellChanged={(e) => {
          if (e.row?.rowType !== "data") return;
          const currentRowId = e.row.key as string;
          const previousId = previousRowId.current;
          if (previousId === currentRowId) return;
          previousRowId.current = currentRowId;
          if (previousId !== null) {
            onRowLeave(previousId);
          }
          onRowEnter(currentRowId);
        }}
        onEditingStart={(e) => {
          if (lockedRowId !== undefined && e.key !== lockedRowId) {
            e.cancel = true;
            return;
          }

          const field = e.column?.dataField;
          activeEditor.current =
            typeof e.key === "string" && typeof field === "string"
              ? { rowId: e.key, field }
              : null;
        }}
        onCellPrepared={(e) => {
          if (e.rowType !== "data" || !(e.cellElement instanceof HTMLElement))
            return;
          const hasError =
            e.key === lockedRowId &&
            errorColumns.some((field) => field === e.column.dataField);

          e.cellElement.classList.toggle("voucher-cell-error", hasError);
        }}
        onKeyDown={async (e) => {
          const event = e.event;
          if (!event || event.key !== "Enter" || event.defaultPrevented) return;

          const editor = activeEditor.current;
          const target = event.target;

          if (!editor || !(target instanceof HTMLElement)) return;
          if (!target.closest("td.dx-editor-cell")) return;

          const { rowId, field } = editor;
          if (field !== "debit" && field !== "credit" && field !== "account")
            return;

          // إذا قائمة الحساب مفتوحة، خلي Enter يختار الخيار.
          if (field === "account" && target.closest('[aria-expanded="true"]'))
            return;

          e.handled = true;
          event.preventDefault();

          const form = target.closest("form");
          const grid = e.component;

          await grid.saveEditData();
          if (grid.hasEditData()) return;

          if (field === "account") {
            form
              ?.querySelector<HTMLButtonElement>(
                '[data-voucher-action="post"]:not(:disabled)',
              )
              ?.focus();
            return;
          }

          const rowIndex = grid.getRowIndexByKey(rowId);
          if (rowIndex < 0) return;

          grid.editCell(rowIndex, field === "debit" ? "credit" : "account");
        }}
      >
        <Editing mode="cell" allowUpdating={true} />
        <KeyboardNavigation
          enterKeyAction="moveFocus"
          enterKeyDirection="none"
          editOnKeyPress={true}
        />
        <FilterRow visible={true} showOperationChooser={true} />
        {/* <Selection
          mode={lockedRowId === undefined ? "multiple" : "none"}
          showCheckBoxesMode="always"
        /> */}
        <Selection mode="multiple" showCheckBoxesMode="always" />
        <HeaderFilter visible={true} />
        <Scrolling
          mode="standard"
          useNative={false}
          showScrollbar="onHover"
        />{" "}
        <Paging enabled={false} />
        {columns.map(
          ({ options, min, requiredMark, placeholder, ...column }) => (
            <Column
              key={column.dataField}
              {...column}
              caption={requiredMark ? `${column.caption} *` : column.caption}
              editorOptions={
                placeholder !== undefined ? { placeholder } : undefined
              }
            >
              {options && (
                <Lookup
                  dataSource={options}
                  valueExpr="value"
                  displayExpr="label"
                />
              )}

              {min !== undefined && (
                <RangeRule
                  min={min}
                  message={`${column.caption} cannot be less than ${min}`}
                />
              )}
            </Column>
          ),
        )}
        <Summary>
          {summaryItems.map((item) => (
            <TotalItem key={`${item.column}-${item.summaryType}`} {...item} />
          ))}
        </Summary>
      </DataGrid>
    </div>
  );
}
