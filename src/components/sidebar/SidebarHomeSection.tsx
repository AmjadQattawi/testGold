import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import SidebarChevron from "./SidebarChevron";
import { nodeClasses, idleClasses, activeClasses, iconClasses, titleClasses, childrenClasses } from "./sidebarStyles";
export default function SidebarHomeSection({ expanded, onToggle, onClose }: { expanded: boolean; onToggle: () => void; onClose: () => void }) {
  const { t } = useTranslation();
  const location = useLocation();
  const mainId = useId();
  const mainExpanded = expanded;
  return (<>
        <button
          type="button"
          className={nodeClasses + " " + idleClasses}
          aria-expanded={mainExpanded}
          aria-controls={mainId}
          onClick={onToggle}
        >
          <span className={iconClasses} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
            </svg>
          </span>
          <span className={titleClasses}>{t("mainScreen")}</span>
          <SidebarChevron expanded={mainExpanded} />
        </button>
        <ul id={mainId} hidden={!mainExpanded} className={childrenClasses}>
          <li>
            <Link
              to="/home"
              onClick={onClose}
              className={
                nodeClasses +
                " " +
                (location.pathname === "/home" ? activeClasses : idleClasses)
              }
              aria-current={location.pathname === "/home" ? "page" : undefined}
            >
              <span className={iconClasses} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
                </svg>
              </span>
              <span className={titleClasses}>{t("homePage")}</span>
            </Link>
          </li>
        </ul>

  </>);
}
