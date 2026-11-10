import { useEffect, useId, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMenuPath, type MenuNode } from "../services/menuService";
import type { Company } from "../utils/selectedCompany";
import type { CompanyMenuState } from "../hooks/useCompanyMenu";
import logo from "../assets/logo.png";

function containsActivePage(node: MenuNode, pathname: string): boolean {
  const path = getMenuPath(node);
  return (
    (!!path && path.replace(/\/$/, "") === pathname.replace(/\/$/, "")) ||
    node.children.some((child) => containsActivePage(child, pathname))
  );
}
function MenuItem({
  node,
  onNavigate,
}: {
  node: MenuNode;
  onNavigate: () => void;
}) {
  const { t } = useTranslation();
  const menuId = useId();
  const location = useLocation();
  const [expanded, setExpanded] = useState(() =>
    containsActivePage(node, location.pathname),
  );
  const [failedIcon, setFailedIcon] = useState(false);
  const title = t(String(node.id), { defaultValue: node.transName });
  const path = getMenuPath(node);
  const children = node.children.length > 0;
  const active =
    !!path && location.pathname.replace(/\/$/, "") === path.replace(/\/$/, "");
  const contents = (
    <>
      <span className="sidebar-node-icon" aria-hidden="true">
        {failedIcon ? (
          <span>▦</span>
        ) : (
          <img
            src={"/iconsMenu/" + node.id + ".svg"}
            alt=""
            onError={() => setFailedIcon(true)}
          />
        )}
      </span>
      <span className="sidebar-node-title">{title}</span>
      {children ? (
        <span
          className={"sidebar-chevron " + (expanded ? "is-expanded" : "")}
          aria-hidden="true"
        >
          ⌄
        </span>
      ) : !children ? (
        <span className="text-accent" aria-hidden="true">
          ♡
        </span>
      ) : null}
    </>
  );
  return (
    <li>
      {children ? (
        <button
          type="button"
          className="sidebar-node"
          aria-expanded={expanded}
          aria-controls={menuId}
          onClick={() => setExpanded((value) => !value)}
        >
          {contents}
        </button>
      ) : path ? (
        <Link
          to={path}
          state={{ pageTitle: title }}
          onClick={onNavigate}
          className={"sidebar-node " + (active ? "is-active" : "")}
          aria-current={active ? "page" : undefined}
        >
          {contents}
        </Link>
      ) : (
        <span className="sidebar-node sidebar-unavailable">{contents}</span>
      )}
      {children && (
        <ul id={menuId} hidden={!expanded} className="sidebar-children">
          {node.children.map((child) => (
            <MenuItem key={child.ttid} node={child} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}
export default function Sidebar({
  company,
  state,
  onRetry,
  onClose,
}: {
  company: Company;
  state: CompanyMenuState;
  onRetry: () => void;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const mainId = useId();
  const location = useLocation();
  const [mainExpanded, setMainExpanded] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <aside className="sidebar-panel" aria-label={t("mainNavigation")}>
      <header className="sidebar-header">
        <Link to="/home" onClick={onClose} aria-label="22-Gold">
          <img src={logo} alt="22-Gold" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeMenu")}
          className="sidebar-close"
        >
          ×
        </button>
      </header>
      <nav aria-label={t("mainNavigation")} className="sidebar-navigation">
        <button
          type="button"
          className="sidebar-node"
          aria-expanded={mainExpanded}
          aria-controls={mainId}
          onClick={() => setMainExpanded((value) => !value)}
        >
          <span className="sidebar-node-icon" aria-hidden="true">
            ▦
          </span>
          <span className="sidebar-node-title">{t("mainScreen")}</span>
          <span
            className={"sidebar-chevron " + (mainExpanded ? "is-expanded" : "")}
            aria-hidden="true"
          >
            ⌄
          </span>
        </button>
        <ul id={mainId} hidden={!mainExpanded} className="sidebar-children">
          <li>
            <Link
              to="/home"
              onClick={onClose}
              className={
                "sidebar-node " +
                (location.pathname === "/home" ? "is-active" : "")
              }
              aria-current={location.pathname === "/home" ? "page" : undefined}
            >
              <span className="sidebar-node-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
                </svg>
              </span>
              <span className="sidebar-node-title">{t("homePage")}</span>
            </Link>
          </li>
        </ul>
        {state.loading ? (
          <p role="status" className="sidebar-status">
            {t("menuLoading")}
          </p>
        ) : state.error ? (
          <div role="alert" className="sidebar-status">
            <p>{state.error}</p>
            <button
              type="button"
              className="mt-3 cursor-pointer font-semibold text-accent"
              onClick={onRetry}
            >
              {t("retry")}
            </button>
          </div>
        ) : state.tree.length ? (
          <ul className="space-y-1">
            {state.tree.map((node) => (
              <MenuItem key={node.ttid} node={node} onNavigate={onClose} />
            ))}
          </ul>
        ) : (
          <p role="status" className="sidebar-status">
            {t("menuEmpty")}
          </p>
        )}
      </nav>
      <footer className="sidebar-footer">
        <Link
          to="/companies"
          onClick={onClose}
          className="sidebar-company"
          title={t("currentCompany")}
        >
          <span aria-hidden="true">▦</span>
          <span className="truncate">{company.name}</span>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-secondary-text">
          <span>
            {now.toLocaleDateString(i18n.language, {
              weekday: "long",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
          <time dateTime={now.toISOString()} dir="ltr">
            {now.toLocaleTimeString(i18n.language, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </footer>
    </aside>
  );
}
