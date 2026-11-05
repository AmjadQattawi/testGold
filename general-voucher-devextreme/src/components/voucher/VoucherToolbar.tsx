import Button from 'devextreme-react/button';
import { fresh } from '../../utils/voucher';
import type { VoucherController } from '../../hooks/useJournalVoucher';
import VoucherIcon, { type VoucherIconName } from './VoucherIcon';

export default function VoucherToolbar({ controller }: { controller: VoucherController }) {
  const { blocked, save, open, post, remove, setSearchOpen, setExited, voucher, restore } = controller;
  const actions: { label: string; icon: VoucherIconName; run: () => void; disabled?: boolean; style?: 'primary' | 'danger' }[] = [
    { label: 'Save draft', icon: 'save', run: () => save(), style: 'primary' },
    { label: 'New', icon: 'new', run: () => open(fresh()) },
    { label: 'Post', icon: 'send', run: post },
    { label: 'Delete', icon: 'trash', run: () => void remove(), style: 'danger' },
    { label: 'Search', icon: 'search', run: () => setSearchOpen(v => !v) },
    { label: 'Print', icon: 'print', run: () => window.print(), disabled: false },
    { label: 'Exit', icon: 'exit', run: () => setExited(true), disabled: false },
    { label: 'Archive', icon: 'archive', run: () => save(true), disabled: !!blocked || voucher.archived },
    { label: 'Restore draft', icon: 'reset', run: restore },
  ];
  return (
    <section className="actions card" aria-label="Voucher actions">
      {actions.map(action => (
        <Button key={action.label} type={action.style === 'primary' ? 'default' : 'normal'}
          elementAttr={{ class: action.style === 'danger' ? 'action-danger' : '', 'aria-label': action.label }}
          disabled={action.disabled ?? !!blocked} onClick={action.run}
          render={() => <span className="action-content"><span>{action.label}</span><VoucherIcon name={action.icon} /></span>} />
      ))}
    </section>
  );
}
