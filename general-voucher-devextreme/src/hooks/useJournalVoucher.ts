import { useRef, useState } from 'react';
import type { ValidationGroupRef } from 'devextreme-react/validation-group';
import notify from 'devextreme/ui/notify';
import { confirm, alert } from 'devextreme/ui/dialog';
import { fresh, blank, conflict, isEmpty, type Voucher, type Field } from '../utils/voucher';
import { totals, lineError, voucherError } from '../utils/validation.js';
import { readDrafts, writeDrafts } from '../services/voucherDraftStorage';
export function useJournalVoucher() {
    const [voucher, setVoucher] = useState<Voucher>(fresh), [saved, setSaved] = useState<Voucher[]>(readDrafts), [selected, setSelected] = useState<string[]>([]);
    const [searchOpen, setSearchOpen] = useState(false), [query, setQuery] = useState(''), [exited, setExited] = useState(false);
    const form = useRef<ValidationGroupRef>(null);
    const balance = totals(voucher.rows), index = saved.findIndex(v => v.id === voucher.id);
    const blocked = voucher.rows.find(r => conflict(r));
    const error = blocked ? `Row ${blocked.lineNo}: ${conflict(blocked)}` : '';
    function open(v: Voucher) { setVoucher(structuredClone(v)); setSelected([]); setExited(false); }
    function changeRow(id: string, key: Field, value: unknown) {
        if (blocked && blocked.id !== id)
            return;
        setVoucher(old => { if (old.rows.find(r => r.id === id)?.[key] === value)
            return old; const rows = old.rows.map(r => r.id === id ? { ...r, [key]: value } : r); const last = rows.at(-1); if (last?.id === id && !lineError(last) && !rows.some(conflict))
            rows.push(blank(rows.length + 1)); return { ...old, rows }; });
    }
    function persist(items: Voucher[], current: Voucher) { try {
        writeDrafts(items);
        setSaved(items);
        open(current);
        return true;
    }
    catch {
        notify('Unable to save the draft on this device.', 'error', 4000);
        return false;
    } }
    function save(archived = voucher.archived) {
        if (blocked || !form.current?.instance().validate().isValid)
            return;
        const value = structuredClone({ ...voucher, archived });
        if (persist([...saved.filter(v => v.id !== value.id), value], value))
            notify(archived ? 'Draft archived on this device.' : 'Draft saved on this device.', 'success', 2500);
    }
    async function remove() { if (!blocked && await confirm('Delete this draft?', 'Delete'))
        if (persist(saved.filter(v => v.id !== voucher.id), fresh()))
            notify('Draft deleted.', 'success', 2500); }
    function restore() { if (index >= 0) {
        open(saved[index]);
        notify('Draft restored.', 'success', 2500);
    }
    else
        void alert('No saved version of this draft is available.', 'Restore draft'); }
    function post() { const message = voucherError({ ...voucher, rows: voucher.rows.filter(r => !isEmpty(r)) }); void alert(message || 'Posting requires a voucher API. The voucher has not been posted.', 'Post'); }
    return { voucher, setVoucher, saved, selected, setSelected, searchOpen, setSearchOpen, query, setQuery, exited, setExited, form, balance, index, blocked, error, open, changeRow, save, remove, restore, post };
}
export type VoucherController = ReturnType<typeof useJournalVoucher>;
