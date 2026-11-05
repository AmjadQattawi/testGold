import { useCallback, useState } from "react";
import Sidebar from "./Sidebar";
import SidebarDrawer from "./SidebarDrawer";
import { useCompanyMenu } from "../hooks/useCompanyMenu";
import { useAppSelector } from "../app/hooks";
import AccountMenu from "./AccountMenu";
import PageBreadcrumbs from "./PageBreadcrumbs";
import WorkspaceTabs from "./WorkspaceTabs";
import { translateMessage } from "../i18n";
import { useTranslation } from "react-i18next";
import { useActionDialog } from "../hooks/useActionDialog";
import {
  Link,
  Outlet,
  useActionData,
  useLocation,
  useNavigation,
} from "react-router-dom";
import logo from "../assets/logo.png";
export default function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const focusClasses =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const user = useAppSelector((state) => state.auth.user);
  const email = user?.userEmail ?? "";
  const result = useActionData<{ message?: string; isError?: boolean }>();
  useActionDialog(result);
  const pending = useNavigation().state !== "idle";
  const company = useAppSelector((state) => state.company.selectedCompany);
  //
  const showSidebar = false;
  const { state, retry } = useCompanyMenu(company?.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <div className="flex min-h-dvh flex-col bg-page-background font-sans text-primary-text lg:h-dvh lg:overflow-hidden print:h-auto print:overflow-visible">
      {showSidebar && company && (
        <>
          <div className="fixed inset-s-0 top-0 z-40 hidden lg:block print:hidden">
            <Sidebar
              key={company.id}
              company={company}
              state={state}
              onRetry={retry}
              onClose={closeMenu}
            />
          </div>
          {menuOpen && (
            <SidebarDrawer onClose={closeMenu}>
              <Sidebar
                key={company.id}
                company={company}
                state={state}
                onRetry={retry}
                onClose={closeMenu}
              />
            </SidebarDrawer>
          )}
        </>
      )}
      <header
        className={
          (showSidebar && company ? "lg:ms-sidebar " : "") +
          "relative z-20 shrink-0 border-b border-control-border/60 bg-card-background px-3 sm:px-5 lg:px-6 print:hidden"
        }
      >
        <div className="flex min-h-18 min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 sm:h-18 sm:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {company ? (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t("openMenu")}
                aria-expanded={menuOpen}
                aria-controls="app-sidebar-drawer"
                className={
                  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-control-border text-secondary-text transition-colors hover:bg-hover-background lg:hidden " +
                  focusClasses
                }
              >
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              </button>
            ) : (
              <Link
                to="/home"
                aria-label="22-Gold"
                className={
                  "flex size-11 shrink-0 items-center justify-center rounded-xl border border-control-border bg-page-background " +
                  focusClasses
                }
              >
                <img
                  src={logo}
                  alt="22-Gold"
                  className="size-9 object-contain"
                />
              </Link>
            )}
            <span
              className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-accent-background text-accent lg:flex"
              aria-hidden="true"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="3" width="16" height="18" rx="3" />
                <path d="M8 8h8M8 12h8M8 16h4" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <div className="min-w-0">
                <PageBreadcrumbs
                  tree={state.tree}
                  pathname={location.pathname}
                />
              </div>
              <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-secondary-text sm:text-[11px]">
                {/* ------------------------------------ */}
                <Link
                  // to="/accountingTrans/GeneralVoucher"
                  to="/accountingTrans/newJournalVoucher"
                  className={
                    "shrink-0 rounded transition-colors hover:text-accent " +
                    focusClasses
                  }
                  dir="ltr"
                >
                  22-Gold
                </Link>
                <span className="text-control-border" aria-hidden="true">
                  /
                </span>
                <span className="truncate">
                  {company?.name ?? t("companiesTitle")}
                </span>
              </div>
            </div>
          </div>
          <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <AccountMenu
              email={email}
              userName={user?.userName}
              pending={pending}
            />
          </div>
        </div>
      </header>
      <main
        className={
          (showSidebar && company
            ? "lg:ps-[calc(var(--spacing-sidebar)+0.75rem)] "
            : "lg:ps-4 ") +
          "flex w-full min-h-0 min-w-0 max-w-none flex-1 flex-col ps-2 pe-3 py-3 sm:ps-3 sm:pe-4 lg:overflow-y-auto lg:pe-4 lg:py-4 print:max-w-none print:overflow-visible print:p-0"
        }
      >
        {!result?.isError && result?.message && (
          <p role="alert" className="mb-6 text-sm text-accent">
            {translateMessage(result.message)}
          </p>
        )}
        {company && location.pathname.replace(/\/+$/, "") !== "/companies" ? (
          <WorkspaceTabs
            key={company.id}
            company={company}
            menu={state}
            retryMenu={retry}
          />
        ) : (
          <Outlet context={{ menu: state, retryMenu: retry }} />
        )}
      </main>
    </div>
  );
}
