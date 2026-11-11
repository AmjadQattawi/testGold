import { useCallback, useState } from "react";
import Sidebar from "./Sidebar";
import SidebarDrawer from "./SidebarDrawer";
import { useCompanyMenu } from "../hooks/useCompanyMenu";
import { getSelectedCompany } from "../utils/selectedCompany";
import ThemeToggle from "./ThemeToggle";
import { translateMessage } from "../i18n";
import { useTranslation } from "react-i18next";
import { useActionDialog } from "../hooks/useActionDialog";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import type { AuthSession } from "../utils/authSession";
import logo from "../assets/logo.png";
export default function AppLayout() {
  const { t } = useTranslation();
  const { email } = useLoaderData<AuthSession>();
  const result = useActionData<{ message?: string; isError?: boolean }>();
  useActionDialog(result);
  const pending = useNavigation().state !== "idle";
  const company = getSelectedCompany();
  const { state, retry } = useCompanyMenu(company?.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <div className="flex min-h-dvh flex-col bg-page-background font-sans text-primary-text lg:h-dvh lg:overflow-hidden print:h-auto print:overflow-visible">
      {company && (
        <>
          <div className="sidebar-desktop">
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
          (company ? "lg:ms-sidebar " : "") +
          "shrink-0 border-b-2 border-accent bg-page-background px-3 py-3 sm:px-5 lg:px-14 print:hidden"
        }
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {company && (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t("openMenu")}
                aria-expanded={menuOpen}
                aria-controls="app-sidebar-drawer"
                className="sidebar-menu-toggle"
              >
                ☰
              </button>
            )}
            <Link to="/home" className="flex items-center gap-3">
              <img src={logo} alt="" className="size-10 object-contain" />
              <span className="font-bold">22-Gold</span>
            </Link>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 text-xs sm:w-auto sm:justify-end sm:gap-4">
            <Link
              to="/companies"
              className="text-sm text-accent hover:underline"
            >
              {t("companiesTitle")}
            </Link>
            <Link
              to="/accountingTrans/GeneralVoucher"
              className="text-sm text-accent hover:underline"
            >
              {t("voucherTitle")}
            </Link>
            
            //
            <Link
              to="/accountingTrans/ReceiptVoucher"
              className="text-sm text-accent hover:underline"
            >
              Receipt Voucher
            </Link>
            //

            <ThemeToggle />
            <span className="order-last w-full truncate text-xs text-secondary-text sm:order-0 sm:w-auto sm:max-w-52">
              {email}
            </span>
            <Form method="post" action="/">
              <button
                type="submit"
                disabled={pending}
                className="cursor-pointer rounded bg-accent px-4 py-2 text-sm font-medium text-accent-button-text hover:bg-accent-hover disabled:opacity-60"
              >
                {pending ? t("signingOut") : t("logout")}
              </button>
            </Form>
          </div>
        </div>
      </header>
      <main
        className={
          (company
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
        <Outlet />
      </main>
    </div>
  );
}
