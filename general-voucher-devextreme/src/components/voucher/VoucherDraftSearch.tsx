import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import type { VoucherController } from '../../hooks/useJournalVoucher';
export default function VoucherDraftSearch({ controller }: {
    controller: VoucherController;
}) {
    const { searchOpen, query, setQuery, saved, open } = controller;
    return <>{searchOpen && <section className="search card"><header className="section-heading"><div className="heading-title"><i className="dx-icon dx-icon-search"/><h2>Saved drafts</h2></div></header><div className="search-body"><TextBox placeholder="Search by voucher number or notes" value={query} valueChangeEvent="input" onValueChanged={e => setQuery(e.value ?? '')}/>{saved.filter(v => `${v.number} ${v.notes}`.toLowerCase().includes(query.toLowerCase())).map(v => <Button key={v.id} width="100%" onClick={() => open(v)} render={() => <div className="draft-result"><span>{v.number || 'Untitled draft'}<small>{v.notes}</small></span><span>{v.date}{v.archived ? ' · Archived' : ''}</span></div>}/>)}{!saved.length && <p>No saved drafts.</p>}</div></section>}</>;
}
