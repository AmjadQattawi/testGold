import NumberBox from 'devextreme-react/number-box';
import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import type { Line } from '../../utils/voucher';
import type { VoucherController } from '../../hooks/useJournalVoucher';
import { columns } from './voucherColumns';
export default function VoucherCell({ row, column: c, controller: controller }: {
    row: Line;
    column: typeof columns[number];
    controller: VoucherController;
}) {
    const { error, blocked, changeRow } = controller;
    const disabled = !!error && blocked?.id !== row.id;
    const common = { disabled, rtlEnabled: false, inputAttr: { 'aria-label': `${c.label} — Row ${row.lineNo}` } };
    if (c.key === 'lineNo')
        return <span className="line-number">{row.lineNo}</span>;
    if (c.numeric)
        return <NumberBox {...common} value={Number(row[c.key])} min={c.key === 'rate' ? 0.0001 : 0} step={0.0001} format="#,##0.0000" stylingMode="underlined" valueChangeEvent="change" onValueChanged={e => { if (e.event)
            changeRow(row.id, c.key, e.value ?? 0); }}/>;
    if (c.options)
        return <SelectBox {...common} value={row[c.key]} items={c.options} placeholder={c.key === 'account' ? '' : '—'} showClearButton={c.key === 'account' || c.key === 'costCenter'} onSelectionChanged={e => { if (e.selectedItem)
            changeRow(row.id, c.key, e.selectedItem); }} stylingMode="underlined" onValueChanged={e => { if (e.event)
            changeRow(row.id, c.key, e.value ?? ''); }}/>;
    if (c.type === 'date')
        return <DateBox {...common} value={row.dueDate || null} type="date" dateSerializationFormat="yyyy-MM-dd" displayFormat="MM/dd/yyyy" stylingMode="underlined" onValueChanged={e => { if (e.event)
            changeRow(row.id, c.key, e.value ?? ''); }}/>;
    return <TextBox {...common} value={String(row[c.key])} placeholder="Enter description" stylingMode="underlined" onValueChanged={e => { if (e.event)
        changeRow(row.id, c.key, e.value ?? ''); }}/>;
}
