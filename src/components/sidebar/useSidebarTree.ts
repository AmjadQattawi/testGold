import { useState } from "react";
import type { MenuNode } from "../../services/menuService";
export function containsActivePage(node: MenuNode, activeId?: string): boolean {
  return (
    node.ttid === activeId ||
    node.children.some((child) => containsActivePage(child, activeId))
  );
}

export function useSidebarTree(tree: MenuNode[], pathname: string, activeId?: string) {
  const [mainExpanded, setMainExpanded] = useState(
    pathname === "/home",
  );
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );
  const branchNodes: MenuNode[] = [];
  const collectBranches = (nodes: MenuNode[]) => {
    for (const node of nodes) {
      if (node.children.length) {
        branchNodes.push(node);
        collectBranches(node.children);
      }
    }
  };
  collectBranches(tree);
  const allExpanded =
    mainExpanded &&
    branchNodes.every(
      (node) => expandedNodes[node.ttid] ?? containsActivePage(node, activeId),
    );
  const toggleNode = (id: string, expanded: boolean) => {
    setExpandedNodes((previous) => ({ ...previous, [id]: expanded }));
  };
  const toggleAll = () => {
    const expanded = !allExpanded;
    setMainExpanded(expanded);
    setExpandedNodes(
      Object.fromEntries(branchNodes.map((node) => [node.ttid, expanded])),
    );
  };

  return { mainExpanded, setMainExpanded, expandedNodes, allExpanded, toggleNode, toggleAll };
}
