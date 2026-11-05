import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getActiveMenuId } from "../../services/menuService";
import type { CompanyMenuState } from "../../hooks/useCompanyMenu";
import SidebarHomeSection from "./SidebarHomeSection";
import MenuItem from "./SidebarMenuItem";
import { useSidebarTree } from "./useSidebarTree";
import { focusClasses, statusClasses } from "./sidebarStyles";
export default function SidebarNavigation({
  state,
  onRetry,
  onClose,
}: {
  state: CompanyMenuState;
  onRetry: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const activeId = getActiveMenuId(state.tree, location.pathname);
  const {
    mainExpanded,
    setMainExpanded,
    expandedNodes,
    allExpanded,
    toggleNode,
    toggleAll,
  } = useSidebarTree(state.tree, location.pathname, activeId);
  return (
    <>
      <div className="flex shrink-0 justify-end px-3 pt-3">
        <button
          type="button"
          onClick={toggleAll}
          className={
            "flex cursor-pointer items-center gap-2 rounded-lg border border-control-border px-3 py-1.5 text-xs font-medium text-secondary-text transition-colors hover:bg-hover-background hover:text-accent " +
            focusClasses
          }
        >
          <svg
            className="size-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d={
                allExpanded
                  ? "m6 5 4 4 4-4M6 15l4-4 4 4"
                  : "m6 7 4-4 4 4M6 13l4 4 4-4"
              }
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t(allExpanded ? "collapseAllNodes" : "expandAllNodes")}
        </button>
      </div>
      <nav
        aria-label={t("mainNavigation")}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 scrollbar-thin"
      >
        <SidebarHomeSection
          expanded={mainExpanded}
          onToggle={() => setMainExpanded((value) => !value)}
          onClose={onClose}
        />
        {state.loading ? (
          <p role="status" className={statusClasses}>
            {t("menuLoading")}
          </p>
        ) : state.error ? (
          <div role="alert" className={statusClasses}>
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
          <ul className="mt-4 space-y-1 border-t border-control-border/70 pt-3">
            {state.tree.map((node) => (
              <MenuItem
                key={node.ttid}
                node={node}
                activeId={activeId}
                ancestry={[]}
                expandedNodes={expandedNodes}
                onToggle={toggleNode}
                onNavigate={onClose}
              />
            ))}
          </ul>
        ) : (
          <p role="status" className={statusClasses}>
            {t("menuEmpty")}
          </p>
        )}
      </nav>
    </>
  );
}
