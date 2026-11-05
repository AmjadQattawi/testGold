import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getMenuPath, type MenuNode } from "../../services/menuService";
import { containsActivePage } from "./useSidebarTree";
import SidebarChevron from "./SidebarChevron";
import { nodeClasses, activeClasses, idleClasses, iconClasses, titleClasses, childrenClasses } from "./sidebarStyles";
export default function MenuItem({
  node,
  activeId,
  ancestry,
  expandedNodes,
  onToggle,
  onNavigate,
}: {
  node: MenuNode;
  activeId?: string;
  ancestry: MenuNode[];
  expandedNodes: Record<string, boolean>;
  onToggle: (id: string, expanded: boolean) => void;
  onNavigate: () => void;
}) {
  const { t } = useTranslation();
  const menuId = useId();
  const expanded =
    expandedNodes[node.ttid] ?? containsActivePage(node, activeId);
  const [failedIcon, setFailedIcon] = useState(false);
  const title = t(String(node.id), { defaultValue: node.transName });
  const path = getMenuPath(node, ancestry);
  const children = node.children.length > 0;
  const active = node.ttid === activeId;
  const contents = (
    <>
      <span className={iconClasses} aria-hidden="true">
        {failedIcon ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <rect x="4" y="4" width="6" height="6" rx="1.5" />
            <rect x="14" y="4" width="6" height="6" rx="1.5" />
            <rect x="4" y="14" width="6" height="6" rx="1.5" />
            <rect x="14" y="14" width="6" height="6" rx="1.5" />
          </svg>
        ) : (
          <img
            src={"/iconsMenu/" + node.id + ".svg"}
            alt=""
            onError={() => setFailedIcon(true)}
          />
        )}
      </span>
      <span className={titleClasses}>{title}</span>
      {children ? <SidebarChevron expanded={expanded} /> : null}
    </>
  );
  return (
    <li>
      {children ? (
        <button
          type="button"
          className={
            nodeClasses +
            " " +
            (expanded
              ? "bg-hover-background/60 text-primary-text"
              : idleClasses)
          }
          aria-expanded={expanded}
          aria-controls={menuId}
          onClick={() => onToggle(node.ttid, !expanded)}
        >
          {contents}
        </button>
      ) : path ? (
        <Link
          to={path}
          state={{ pageTitle: title }}
          onClick={onNavigate}
          className={nodeClasses + " " + (active ? activeClasses : idleClasses)}
          aria-current={active ? "page" : undefined}
        >
          {contents}
        </Link>
      ) : (
        <span
          className={nodeClasses + " cursor-default text-muted-text opacity-60"}
        >
          {contents}
        </span>
      )}
      {children && (
        <ul id={menuId} hidden={!expanded} className={childrenClasses}>
          {node.children.map((child) => (
            <MenuItem
              key={child.ttid}
              node={child}
              activeId={activeId}
              ancestry={[...ancestry, node]}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
