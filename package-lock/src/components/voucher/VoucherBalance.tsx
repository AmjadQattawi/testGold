import { useTranslation } from 'react-i18next';
import VoucherIcon from './VoucherIcon';
import { formatAmount, type voucherTotals } from '../../utils/voucher';
export default function VoucherBalance({ totals }: {
    totals: ReturnType<typeof voucherTotals>;
}) {
    const { t } = useTranslation();
    return (<div role="status" aria-live="polite" className={"flex flex-wrap items-center justify-between gap-3 rounded-lg border px-5 py-4 text-xs " +
            (totals.balanced
                ? "border-success-border bg-success-background text-success"
                : "border-control-border bg-accent-background text-accent")}>
          <span className="flex items-center gap-2">
            <VoucherIcon name="check"/>
            {t(totals.balanced
            ? "voucherBalanced"
            : totals.debit === 0 && totals.credit === 0
                ? "voucherEmpty"
                : "voucherUnbalanced")}
          </span>
          <span>
            {t("voucherDifference")}{" "}
            <strong dir="ltr" className="ms-2 inline-block font-mono">
              {formatAmount(totals.difference)}
            </strong>
          </span>
        </div>);
}
