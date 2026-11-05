import { Activity, lazy, Suspense, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Company } from "../utils/selectedCompany";
import type { CompanyMenuState } from "../hooks/useCompanyMenu";
import { getMenuTrail } from "../services/menuService";
import HomeSurface from "./HomeSurface";
import RouteLoading from "./RouteLoading";
import { useDialog } from "../context/dialogContext";

function PageIcon({
  id,
  home,
  active,
}: {
  id?: number;
  home: boolean;
  active: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!home && id !== undefined && !failed)
    return (
      <img
        src={"/iconsMenu/" + id + ".svg"}
        alt=""
        onError={() => setFailed(true)}
        className={
          "size-4 shrink-0 object-contain brightness-0 " +
          (active ? "invert" : "opacity-65 [:root[data-theme=dark]_&]:invert")
        }
      />
    );
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {home ? (
        <path d="m3 10 9-7 9 7v10H4V10m5 10v-7h6v7" />
      ) : (
        <>
          <rect x="5" y="3" width="14" height="18" rx="3" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </>
      )}
    </svg>
  );
}

const MenuPage = lazy(() => import("../pages/MenuPage"));
const JournalVoucher = lazy(() => import("../pages/JournalVoucher"));

const NewJournalVoucherPage = lazy(  () => import("../newJournalVoucher/NewJournalVoucherPage"),);

const SalesInvoice = lazy(() => import("../pages/SalesInvoice"));

const normalize = (path: string) => path.replace(/\/+$/, "") || "/home";

export default function WorkspaceTabs({
  company,
  menu,
  retryMenu,
}: {
  company: Company;
  menu: CompanyMenuState;
  retryMenu: () => void;
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const active = normalize(location.pathname);
  const [tabs, setTabs] = useState<string[]>(() =>
    active === "/home" ? ["/home"] : ["/home", active],
  );
  const [lastPath, setLastPath] = useState(active);
  if (lastPath !== active) {
    setLastPath(active);
    if (!tabs.includes(active)) setTabs([...tabs, active]);
  }
  const visibleTabs = tabs;
  const arabic = i18n.resolvedLanguage?.startsWith("ar");
  const title = (path: string) => {
    if (path === "/home") return t("homePage");
    const node = getMenuTrail(menu.tree, path).at(-1);
    if (node) return t(String(node.id), { defaultValue: node.transName });
    if (path.toLowerCase() === "/accountingtrans/generalvoucher")
      return t("voucherTitle");
    return path.split("/").at(-1) ?? path;
  };
  const close = (path: string) => {
    showDialog({
      title: arabic
        ? "إغلاق " + title(path) + "؟"
        : "Close " + title(path) + "?",
      message: arabic
        ? "ستفقد التغييرات غير المحفوظة في هذه الصفحة. احفظ السند قبل الإغلاق إذا أردت الاحتفاظ بها."
        : "Unsaved changes on this page will be lost. Save your voucher before closing to keep them.",
      buttonLabel: arabic ? "إغلاق الصفحة" : "Close page",
      cancelLabel: arabic ? "متابعة العمل" : "Keep working",
      onConfirm: () => {
        const index = tabs.indexOf(path);
        const remaining = tabs.filter((tab) => tab !== path);
        if (path === active)
          void navigate(remaining[Math.max(0, index - 1)] ?? "/home");
        setTabs(remaining);
      },
    });
  };
  return (
    <>
      <nav
        aria-label={arabic ? "الصفحات المفتوحة" : "Open pages"}
        className="mb-3 flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-control-border/70 px-1 py-2 print:hidden"
      >
        {visibleTabs.map((path) => (
          <div
            key={path}
            className={
              "flex shrink-0 items-center rounded-md border transition-colors " +
              (path === active
                ? "border-blue-300 bg-blue-900 text-white shadow-sm ring-2 ring-blue-200/70 ring-offset-1 ring-offset-page-background"
                : "border-control-border bg-card-background/60 text-accent hover:border-accent/50 hover:bg-hover-background")
            }
          >
            <Link
              to={path}
              aria-current={path === active ? "page" : undefined}
              className="flex min-h-9 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              title={title(path)}
            >
              <PageIcon
                key={path}
                home={path === "/home"}
                active={path === active}
                id={
                  getMenuTrail(menu.tree, path).at(-1)?.id ??
                  (path.toLowerCase() === "/accountingtrans/generalvoucher"
                    ? 1
                    : undefined)
                }
              />
              <span className="max-w-40 truncate sm:max-w-56">
                {title(path)}
              </span>
            </Link>
            {path !== "/home" && (
              <button
                type="button"
                onClick={() => close(path)}
                aria-label={(arabic ? "إغلاق " : "Close ") + title(path)}
                className={
                  "me-1 flex size-7 cursor-pointer items-center justify-center rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
                  (path === active
                    ? "text-white/80 hover:bg-white/15 hover:text-white"
                    : "text-secondary-text hover:bg-hover-background hover:text-primary-text")
                }
              >
                <svg
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </nav>
      {visibleTabs.map((path) => (
        <Activity key={path} mode={path === active ? "visible" : "hidden"}>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <Suspense fallback={<RouteLoading />}>
              {path === "/home" ? (
                <HomeSurface company={company} />
              ) : path.toLowerCase() === "/accountingtrans/generalvoucher" ? (
                <JournalVoucher company={company} />
              ) : path.toLowerCase() ===
                "/accountingtrans/newjournalvoucher" ? (
                <NewJournalVoucherPage />
              ) : path.toLowerCase() === "/accountingtrans/salesinvoice" ? (
                <SalesInvoice company={company} />
              ) : (
                <MenuPage
                  workspace={{ company, menu, retryMenu, pathname: path }}
                />
              )}
            </Suspense>
          </div>
        </Activity>
      ))}
    </>
  );
}
