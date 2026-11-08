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
  type DataGridTypes,
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
  const pendingCell = useRef<{ rowId: string; field?: string } | null>(null);

  // بتحدد وين نروح وبتحفظ الطلب
  async function handleGridKeyDown(e: DataGridTypes.KeyDownEvent) {
    const event = e.event;
    if (!event || event.key !== "Enter" || event.defaultPrevented) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    // هل الضغطة نفسها صارت داخل خلية مفتوحة للتعديل
    // مثلا ال حقل الفلترة مش مفتوح للتعديل
    if (!target.closest("td.dx-editor-cell")) return;

    const editor = activeEditor.current;
    if (!editor) return;
    const { rowId, field } = editor;
    const editableColumns = e.component
      .getVisibleColumns()
      .filter(
        (column) =>
          typeof column.dataField === "string" && column.allowEditing !== false,
      );
    const currentIndex = editableColumns.findIndex(
      (column) => column.dataField === field,
    );
    if (currentIndex === -1) return;
    const nextColumn = editableColumns[currentIndex + 1];
    // اذا ما في عامود بعد الحالي يعني وصلت عند ال notes مثلا بكون undefined ال next
    const nextField = nextColumn?.dataField;
    //  Enter خلي
    //  يختار من القائمة إذا كانت مفتوحة.
    if (target.closest('[aria-expanded="true"]')) return;
    e.handled = true;
    event.preventDefault();
    const grid = e.component;
    // حل المشكلة
    // إذا فيه تعديل، احفظه. إذا ما فيه، كمّل التنقّل مباشرة
    if (grid.hasEditData()) {
      await grid.saveEditData();
      // await grid.saveEditData();
    }
    if (grid.hasEditData()) return;
    pendingCell.current = { rowId, field: nextField };
    openPendingCell(grid);
  }

  // بتنفّذ الطلب لما تلاقي السطر بالجدول
  function openPendingCell(grid: DataGridTypes.ContentReadyEvent["component"]) {
    // Id الصف + field  اللي بدنا ننتقل الها
    const next = pendingCell.current;
    if (!next) return;
    let rowIndex = grid.getRowIndexByKey(next.rowId);
    if (rowIndex < 0) return;
    let field = next.field;
    // اذا اخر فيلد ومافي بعده سطر
    // بفحص اذا في سطر بعده 
    if (field === undefined) {
      const visibleRows = grid
        .getVisibleRows()
        .filter((row) => row.rowType === "data");
      const currentIndex = visibleRows.findIndex(
        (row) => row.key === next.rowId,
      );
      if (currentIndex < 0) return;
      const nextRow = visibleRows[currentIndex + 1];

      // إذا ما فيه صف ظاهر بعد الحالي، روح على Post
      if (!nextRow) {
        pendingCell.current = null;
        const form = gridWrapperRef.current?.closest("form");
        const postButton = form?.querySelector<HTMLButtonElement>(
          '[data-voucher-action="post"]:not(:disabled)',
        );
        postButton?.focus();
        return;
      }

      // في صف 
      rowIndex = grid.getRowIndexByKey(nextRow.key);
      if (rowIndex < 0) return;
      // بتختار اول فيلد عامود بطلع بوجها بطابق الشروط 
      field = grid
        .getVisibleColumns()
        .find(
          (column) =>
            typeof column.dataField === "string" &&
            column.allowEditing !== false,
        )?.dataField;
    }
    pendingCell.current = null;
    if (field !== undefined) {
      grid.editCell(rowIndex, field);
    }
  }

  function handleSelectionChanged(e: DataGridTypes.SelectionChangedEvent) {
    onSelectionChange(e.selectedRowKeys);
  }

  function handleSaving(e: DataGridTypes.SavingEvent) {
    if (e.changes.length === 0) return;
    e.cancel = true;
    for (const change of e.changes) {
      if (change.type === "update") {
        onChangeLine(change.key, change.data);
      }
    }
    // حل المشكلة
    e.component.option("editing.changes", []);
  }

  // عشان لو تغير السطر تنادي
  // onRowLeave     عشان تضيف السطر لل validatedRows  ويظهر ال error اذا كان موجود
  // onRowEnter     عشان بس يرجع يفوت السطر ينشال من ال validatedRows ف بروح ال error اذا كان موجود
  function handleFocusedCellChanged(e: DataGridTypes.FocusedCellChangedEvent) {
    if (e.row?.rowType !== "data") return;
    const currentRowId = e.row.key as string;
    const previousId = previousRowId.current;
    if (previousId === currentRowId) return;
    previousRowId.current = currentRowId;
    if (previousId !== null) {
      onRowLeave(previousId);
    }
    onRowEnter(currentRowId);
  }

  // لوّن خلية البيانات عند تجهيزها إذا كان عليها خطأوالجدث نفسه مرتبط ب تجهيزها
  function handleCellPrepared(e: DataGridTypes.CellPreparedEvent) {
    if (e.rowType !== "data" || !(e.cellElement instanceof HTMLElement)) return;
    const hasError =
      e.key === lockedRowId &&
      errorColumns.some((field) => field === e.column.dataField);
    e.cellElement.classList.toggle("voucher-cell-error", hasError);
  }

  // بتخلي الجدول يعرف قيمة الفيلد اثناء الكتابة عليه مش لما اطلع منه بس
  function handleEditorPreparing(e: DataGridTypes.EditorPreparingEvent) {
    if (e.parentType !== "dataRow") return;
    if (e.editorName === "dxNumberBox" || e.editorName === "dxTextBox") {
      e.editorOptions.valueChangeEvent = "input";
    }
  }

  //rowId + field  بتشتغل اول ما ادخل عالفيلد وبتخزنلي ال
  function handleEditingStart(e: DataGridTypes.EditingStartEvent) {
    if (lockedRowId !== undefined && e.key !== lockedRowId) {
      e.cancel = true;
      return;
    }
    const field = e.column?.dataField;
    activeEditor.current =
      typeof e.key === "string" && typeof field === "string"
        ? { rowId: e.key, field }
        : null;
  }

  // عشان ال error يظهر عالفيلد لو كبست برا الجدول
  // هدفه يسمع الكبسات برا الجدول
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
        onSelectionChanged={handleSelectionChanged}
        onSaving={handleSaving}
        onFocusedCellChanged={handleFocusedCellChanged}
        onCellPrepared={handleCellPrepared}
        onEditorPreparing={handleEditorPreparing}
        onEditingStart={handleEditingStart}
        onKeyDown={handleGridKeyDown}
        onContentReady={(e) => openPendingCell(e.component)}
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
