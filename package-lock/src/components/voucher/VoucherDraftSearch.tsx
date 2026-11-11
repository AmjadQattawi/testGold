import { useTranslation } from 'react-i18next';
import VoucherSection from './VoucherSection';
import type { VoucherDraft } from '../../utils/voucher';
const control = "h-10.5 w-full rounded-md border border-control-border bg-card-background px-3 text-[clamp(0.875rem,0.75rem+0.3vw,1rem)] text-primary-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/15";
export default function VoucherDraftSearch({ saved, search, onSearch, onOpen }: {
    saved: VoucherDraft[];
    search: string;
    onSearch: (value: string) => void;
    onOpen: (draft: VoucherDraft) => void;
}) {
    const { t } = useTranslation();
    return (<div className="mt-5 print:hidden">
          <VoucherSection title={t("voucherDrafts")} icon="search">
            <div className="space-y-3 p-5">
              <input autoFocus aria-label={t("voucherFind")} placeholder={t("voucherFind")} className={control} value={search} onChange={(event) => onSearch(event.target.value)}/>
              {saved
            .filter((item) => (item.number + " " + item.notes)
            .toLowerCase()
            .includes(search.toLowerCase()))
            .map((item) => (<button type="button" key={item.id} onClick={() => onOpen(item)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-control-border p-3 text-start hover:bg-hover-background">
                    <span>
                      {item.number || t("voucherUntitled")}
                      <span className="ms-3 text-xs text-muted-text">
                        {item.notes}
                      </span>
                    </span>
                    <span className="text-xs text-secondary-text">
                      {item.date}
                      {item.archived ? " · " + t("voucherArchivedLabel") : ""}
                    </span>
                  </button>))}
              {saved.length === 0 && (<p className="text-sm text-muted-text">
                  {t("voucherNoDrafts")}
                </p>)}
            </div>
          </VoucherSection>
        </div>);
}
