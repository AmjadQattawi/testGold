import TextBox from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";
import TextArea from "devextreme-react/text-area";
import DateBox from "devextreme-react/date-box";
import type { ReactNode } from "react";
import type { NewVoucherDraft } from "./NewJournalVoucherUtils";
import type { NewVoucherFieldName } from "./NewVoucherReducer";
import { useTranslation } from "react-i18next";
import VoucherSection from "../components/voucher/VoucherSection";
import VoucherIcon from "../components/voucher/VoucherIcon";
import VoucherField from "../components/voucher/VoucherField";
const control =
  "w-full rounded-md! border-control-border! bg-input-background! [&_.dx-texteditor-input]:px-3! [&_.dx-texteditor-input]:text-[clamp(0.875rem,0.75rem+0.3vw,1rem)]! [&_.dx-texteditor-input]:text-primary-text! [&.dx-state-focused]:border-accent! [&.dx-state-focused]:ring-2 [&.dx-state-focused]:ring-accent/15";

export default function NewVoucherInfo({
  draft,
  change,
  navigation,
}: {
  draft: NewVoucherDraft;
  change: (key: NewVoucherFieldName, value: string) => void;
  navigation?: ReactNode;
}) {
  const { t } = useTranslation();
  const confidentialityOptions = [
    { value: "normal", label: t("voucherNormal") },
    { value: "confidential", label: t("voucherConfidential") },
  ];

  return (
    <VoucherSection
      title={t("voucherData")}
      center={
        <h1 className="text-lg font-bold text-primary-text">
          {t("voucherTitle")}
        </h1>
      }
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
          {/* date */}
          <VoucherField icon="calendar" label={t("voucherDate")} required>
            <DateBox
              className={control}
              inputAttr={{ "data-voucher-step": "date" }}
              type="date"
              value={draft.date}
              displayFormat="dd/MM/yyyy"
              onValueChanged={(e) => change("date", e.value ?? "")}
            />
          </VoucherField>

          {/* voucherNumber */}
          <VoucherField icon="hash" label={t("voucherNumber")}>
            <TextBox
              className={control}
              inputAttr={{ "data-voucher-step": "number" }}
              value={draft.number}
              onValueChanged={(e) => change("number", e.value ?? "")}
              valueChangeEvent="input"
              stylingMode="outlined"
              height={42}
            />
          </VoucherField>

          {/* voucherAutomatic */}
          <VoucherField icon="hash" label={t("voucherAutomatic")}>
            <TextBox
              className={control}
              value={draft.automaticNo}
              readOnly={true}
              placeholder="—"
            />
          </VoucherField>

          {/* voucherSecurity */}
          <VoucherField icon="shield" label={t("voucherSecurity")}>
            <SelectBox
              className={control}
              inputAttr={{ "data-voucher-step": "confidentiality" }}
              dataSource={confidentialityOptions}
              valueExpr="value"
              displayExpr="label"
              value={draft.confidentiality}
              onValueChanged={(e) => change("confidentiality", e.value)}
            />
          </VoucherField>
        </div>

        {/* voucherNotes */}
        <VoucherField icon="document" label={t("voucherNotes")}>
          <TextArea
            className={control}
            inputAttr={{ "data-voucher-step": "notes" }}
            value={draft.notes}
            onValueChanged={(e) => change("notes", e.value ?? "")}
            valueChangeEvent="input"
            height={70}
          />
        </VoucherField>
      </div>
    </VoucherSection>
  );
}
