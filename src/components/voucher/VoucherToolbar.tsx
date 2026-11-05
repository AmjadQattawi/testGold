import VoucherIcon, { type VoucherIconName } from './VoucherIcon';
export type VoucherAction = {
    id: string;
    label: string;
    icon: VoucherIconName;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'danger';
    disabled?: boolean;
};
export default function VoucherToolbar({ actions }: {
    actions: VoucherAction[];
}) {
    return <div role="group" className="mt-auto grid shrink-0 w-full min-w-0 max-w-none grid-cols-3 gap-2 lg:flex lg:flex-nowrap lg:overflow-x-auto rounded-xl border border-control-border bg-page-background p-3 shadow-[0_6px_28px_var(--color-card-shadow)] print:hidden">{actions.map(action => 
    <button data-voucher-action={action.id} key={action.id} type={action.type ?? 'button'} onClick={action.onClick} disabled={action.disabled} className={'flex min-h-11 min-w-0 flex-1 lg:min-w-28 lg:shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-[clamp(0.6875rem,0.6rem+0.25vw,0.875rem)] lg:px-3 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ' + (action.variant === 'primary' ? 'border-accent bg-accent text-accent-button-text hover:bg-accent-hover' : 'border-control-border bg-card-background hover:bg-hover-background ' + (action.variant === 'danger' ? 'text-danger' : 'text-secondary-text'))}><span>{action.label}</span><VoucherIcon name={action.icon}/></button>)}</div>;
}


