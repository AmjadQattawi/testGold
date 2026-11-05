import { API } from "../api/endpoints";
import { apiRequest, ApiError } from "../api/client";
import i18n from "../i18n";
export interface MenuNode {
  id: number;
  ttid: string;
  perentID: string;
  transName: string;
  winFormName: string;
  isFavourite: boolean;
  children: MenuNode[];
}
export function buildMenuTree(response: unknown): MenuNode[] {
  const list = Array.isArray(response)
    ? response
    : response && typeof response === "object" && "content" in response
      ? response.content
      : null;
  if (!Array.isArray(list)) throw new ApiError(i18n.t("menuFormatError"), 200);
  const nodes = new Map<string, MenuNode>();
  for (const item of list) {
    const tree = item?.transtree;
    if (
      !tree ||
      typeof tree.id !== "number" ||
      typeof tree.ttid !== "string" ||
      typeof tree.transName !== "string"
    )
      throw new ApiError(i18n.t("menuFormatError"), 200);

    nodes.set(tree.ttid, {
      id: tree.id,
      ttid: tree.ttid,
      perentID: String(tree.perentID ?? ""),
      transName: tree.transName,
      winFormName: typeof tree.winFormName === "string" ? tree.winFormName : "",
      isFavourite: tree.isFavourite === true,
      children: [],
    });
  }
  const roots: MenuNode[] = [];
  for (const node of nodes.values()) {
    const direct = nodes.get(node.perentID);
    if (direct) direct.children.push(node);
    else roots.push(node);
  }

  return roots;
}
const routeSegments: Record<number, string> = {
  1: "GeneralVoucher",
  10: "accountingTrans",
  19: "ReceiptVoucher",
  20: "PaymentVoucher",
  54: "PettyCashVoucher",
};
function getMenuSegment(node: MenuNode): string | undefined {
  const raw = node.winFormName.trim();
  if (raw.includes("://") || raw.startsWith("//") || /[\\?#]/.test(raw))
    return undefined;
  const segment =
    routeSegments[node.id] ??
    raw.split("/").filter(Boolean).at(-1) ??
    "menu-" + node.id;
  if (segment === "." || segment === "..") return undefined;
  return encodeURIComponent(segment);
}
/** Build the URL from the actual ancestor chain, never from a shared form alias. */
export function getMenuPath(
  node: MenuNode,
  parents: MenuNode[] = [],
): string | undefined {
  const segments = [...parents, node].map(getMenuSegment);
  return segments.some((segment) => !segment)
    ? undefined
    : "/" + segments.join("/") + "/";
}
/** Same request contract as 22_Gold_Web, using this application's API client. */
export async function getAllowedMenu(companyId: string, signal?: AbortSignal) {
  if (!companyId.trim())
    throw new ApiError(i18n.t("selectCompanyRequired"), 400);
  const response = await apiRequest<unknown>(API.GET_TREE_NODES_MENU(), {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Company-Id": companyId,
    },
  });
  return buildMenuTree(response);
}

export function getMenuTrail(tree: MenuNode[], pathname: string): MenuNode[] {
  const normalize = (path: string) => path.replace(/\/+$/, "").toLowerCase();
  const visit = (
    nodes: MenuNode[],
    parents: MenuNode[],
  ): MenuNode[] | undefined => {
    for (const node of nodes) {
      if (node.children.length) {
        const match = visit(node.children, [...parents, node]);
        if (match) return match;
      } else {
        const path = getMenuPath(node, parents);
        if (path && normalize(path) === normalize(pathname))
          return [...parents, node];
      }
    }
    return undefined;
  };
  return visit(tree, []) ?? [];
}

export function getActiveMenuId(
  tree: MenuNode[],
  pathname: string,
): string | undefined {
  return getMenuTrail(tree, pathname).at(-1)?.ttid;
}
