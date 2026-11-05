import { useLocation, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CompanyMenuState } from "../hooks/useCompanyMenu";
import { getMenuTrail } from "../services/menuService";
import { lazy, Suspense } from "react";
import RouteLoading from "../components/RouteLoading";
import ModulePage from "./ModulePage";
import NotFound from "./NotFound";
import type { Company } from "../utils/selectedCompany";

const JournalVoucher = lazy(() => import("./JournalVoucher"));

export default function MenuPage({ workspace }: { workspace?: { menu: CompanyMenuState; retryMenu: () => void; pathname: string; company: Company } } = {}) {
  const context = useOutletContext<{
    menu: CompanyMenuState;
    retryMenu: () => void;
  }>();
  const location = useLocation();
  const { menu, retryMenu } = workspace ?? context;
  const pathname = workspace?.pathname ?? location.pathname;
  const { t } = useTranslation();
  if (menu.loading)
    return (
      <p role="status" className="p-8 text-center text-secondary-text">
        {t("menuLoading")}
      </p>
    );
  if (menu.error)
    return (
      <div
        role="alert"
        className="rounded-2xl border border-control-border bg-card-background p-8"
      >
        <p className="text-secondary-text">{menu.error}</p>
        <button
          type="button"
          onClick={retryMenu}
          className="mt-4 rounded-xl bg-accent px-4 py-2 text-accent-button-text"
        >
          {t("retry")}
        </button>
      </div>
    );
  const node = getMenuTrail(menu.tree, pathname).at(-1);
  if (!node) return <NotFound />;
  if (node.id === 1)
    return (
      <Suspense fallback={<RouteLoading overlay />}>
        <JournalVoucher company={workspace?.company} />
      </Suspense>
    );
  return (
    <ModulePage title={t(String(node.id), { defaultValue: node.transName })} />
  );
}
