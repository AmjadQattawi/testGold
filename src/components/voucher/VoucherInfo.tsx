import { useTranslation } from "react-i18next";
import VoucherSection from "./VoucherSection";
import VoucherField from "./VoucherField";
import VoucherIcon from "./VoucherIcon";
import type { VoucherDraft } from "../../utils/voucher";
import type { VoucherFieldName } from "../../reducers/voucherReducer";
import type { ReactNode } from "react";
const control =
  "h-10.5 w-full rounded-md border border-control-border bg-input-background px-3 text-[clamp(0.875rem,0.75rem+0.3vw,1rem)] text-primary-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/15";
export default function VoucherInfo({
  draft,
  change,
  navigation,
}: {
  draft: VoucherDraft;
  change: (key: VoucherFieldName, value: string) => void;
  navigation?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <VoucherSection
      title={t("voucherData")}
      center={<h1 className="text-lg font-bold text-primary-text">{t("voucherTitle")}</h1>}
      status={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-background px-2.5 py-1 text-[10px] font-medium text-danger">
          <VoucherIcon
            name={draft.archived ? "archive" : "unposted"}
            className="size-3"
          />
          {t(draft.archived ? "voucherArchivedLabel" : "voucherUnposted")}
        </span>
      }
      aside={
        <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-muted-text">
          {t("voucherRequired")}
        </span>
        {navigation}
        </div>
      }
    >
      <div className="space-y-3 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <VoucherField icon="calendar" label={t("voucherDate")} required>
            <input 
              data-voucher-step="date"
              type="date"
              className={control}
              value={draft.date}
              onChange={(event) => change("date", event.target.value)}
              required
            />
          </VoucherField>
          <VoucherField icon="hash" label={t("voucherNumber")}>
            <input
              data-voucher-step="number"
              className={control}
              value={draft.number}
              onChange={(event) => change("number", event.target.value)}
              aria-label={t("voucherNumber")}
            />
          </VoucherField>
          <VoucherField icon="hash" label={t("voucherAutomatic")}>
            <input
              className={control + " text-muted-text"}
              value={draft.automaticNo}
              readOnly
              placeholder="—"
            />
          </VoucherField>
          <VoucherField icon="shield" label={t("voucherSecurity")}>
            <select
              className={control}
              value={draft.confidentiality}
              onChange={(event) =>
                change("confidentiality", event.target.value)
              }
            >
              <option value="normal">{t("voucherNormal")}</option>
              <option value="confidential">{t("voucherConfidential")}</option>
            </select>
          </VoucherField>
        </div>
        <VoucherField icon="document" label={t("voucherNotes")}>
          <textarea
            data-voucher-step="notes"
            className={control + " h-14 resize-y py-2"}
            value={draft.notes}
            onChange={(event) => change("notes", event.target.value)}
          />
        </VoucherField>
      </div>
    </VoucherSection>
  );
}
