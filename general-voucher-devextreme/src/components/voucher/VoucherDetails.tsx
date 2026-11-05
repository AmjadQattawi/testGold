import { useState } from 'react';
import DataGrid, { Column, Selection, Paging, Scrolling, Summary, TotalItem, HeaderFilter, FilterRow, FilterPanel } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { blank, amount } from '../../utils/voucher';
import type { VoucherController } from '../../hooks/useJournalVoucher';
import { columns } from './voucherColumns';
import VoucherCell from './VoucherCell';
import VoucherIcon from './VoucherIcon';

export default function VoucherDetails({ controller }: { controller: VoucherController }) {
  const [showFilterRow, setShowFilterRow] = useState(false);
  const { voucher, setVoucher, selected, setSelected, blocked, error, balance } = controller;

  function deleteSelected() {
    const rows = voucher.rows.filter(row => !selected.includes(row.id)).map((row, index) => ({ ...row, lineNo: String(index + 1).padStart(2, '0') }));
    setVoucher(value => ({ ...value, rows: rows.length ? rows : [blank()] }));
    setSelected([]);
  }

  return (
    <section className="details card">
      <header className="section-heading">
        <h2><VoucherIcon name="archive" />Entry details</h2>
        <div className="details-aside">
          <span>{voucher.rows.length} rows</span>
          <Button elementAttr={{ class: 'delete-selected', 'aria-label': 'Delete selected' }} disabled={!!blocked || !selected.length} onClick={deleteSelected}
            render={() => <span className="action-content"><VoucherIcon name="trash" /><span>Delete selected{selected.length ? ` (${selected.length})` : ''}</span></span>} />
        </div>
      </header>
      {error && <div className="row-error" role="alert">{error}</div>}
      <div className="grid-shell">
        <DataGrid key={voucher.id} dataSource={voucher.rows} keyExpr="id" rtlEnabled={false} showBorders={false}
          showColumnLines showRowLines rowAlternationEnabled hoverStateEnabled={false} wordWrapEnabled={false}
          height="auto" columnAutoWidth={false} sorting={{ mode: 'single' }} selectedRowKeys={selected}
          onSelectionChanged={event => setSelected(event.selectedRowKeys)} noDataText="No rows match the filters."
          onContextMenuPreparing={event => {
            if (event.target === 'header') {
              event.items ??= [];
              event.items.push({ text: showFilterRow ? 'Hide filter row' : 'Show filter row', onItemClick: () => setShowFilterRow(value => !value) });
            }
          }}>
          <HeaderFilter visible allowSearch />
          <FilterRow visible={showFilterRow} showOperationChooser />
          <FilterPanel visible={showFilterRow} />
          <Paging enabled={false} />
          <Scrolling mode="standard" useNative showScrollbar="onHover" />
          <Selection mode="multiple" showCheckBoxesMode="always" selectAllMode="allPages" />
          {columns.map(column => (
            <Column key={column.key} dataField={column.key} caption={column.label + (column.required ? ' *' : '')}
              dataType={column.key === 'lineNo' ? 'string' : column.numeric ? 'number' : column.type === 'date' ? 'date' : 'string'}
              width={`${column.width}%`} alignment="center" allowSorting={!error} allowFiltering={!error}
              headerCellRender={cell => (
                <div className="column-heading">
                  <Button stylingMode="text" disabled={!!error} elementAttr={{ class: 'column-sort', 'aria-label': `Sort ${column.label}` }}
                    hint={cell.column.sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
                    onClick={event => {
                      event.event?.stopPropagation();
                      cell.component.columnOption(column.key, 'sortOrder', cell.column.sortOrder === 'asc' ? 'desc' : 'asc');
                    }} render={() => <VoucherIcon name={cell.column.sortOrder === 'desc' ? 'descending' : 'ascending'} />} />
                  <span>{column.label}{column.required ? ' *' : ''}</span>
                </div>
              )}
              cellRender={cell => <VoucherCell row={cell.data} column={column} controller={controller} />} />
          ))}
          <Column type="selection" width="3%" visibleIndex={9} />
          <Summary>
            <TotalItem column="lineNo" summaryType="count" cssClass="summary-label" customizeText={() => 'Total'} />
            <TotalItem column="debit" summaryType="sum" customizeText={() => `Total debit\n${amount(balance.debit)}`} />
            <TotalItem column="credit" summaryType="sum" customizeText={() => `Total credit\n${amount(balance.credit)}`} />
            <TotalItem column="account" summaryType="count" cssClass={balance.difference === 0 ? 'balanced' : 'unbalanced'} customizeText={() => `Difference\n${amount(balance.difference)}`} />
          </Summary>
        </DataGrid>
      </div>
    </section>
  );
}
