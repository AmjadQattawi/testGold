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
    if (!tree.show) continue;
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
    let parent = nodes.get(node.perentID);
    const visited = new Set([node.ttid]);
    while (parent) {
      if (visited.has(parent.ttid))
        throw new ApiError(i18n.t("menuFormatError"), 200);
      visited.add(parent.ttid);
      parent = nodes.get(parent.perentID);
    }
    const direct = nodes.get(node.perentID);
    if (direct) direct.children.push(node);
    else roots.push(node);
  }
  const sort = (items: MenuNode[]) => {
    items.sort((a, b) => a.ttid.localeCompare(b.ttid));
    items.forEach((node) => sort(node.children));
  };
  sort(roots);
  return roots;
}
const paths: Record<number, string> = {
  1: "/accountingTrans/GeneralVoucher/",
  19: "/accountingTrans/ReceiptVoucher/",
  20: "/accountingTrans/PaymentVoucher/",
};
export function getMenuPath(node: MenuNode): string | undefined {
  const raw =
    paths[node.id] ??
    (node.winFormName === "FrmReceiptVou" ? paths[1] : node.winFormName.trim());
  if (!raw || raw.includes("://") || raw.startsWith("//") || /[\\?#]/.test(raw))
    return undefined;
  return "/" + raw.replace(/^\/+/, "");
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
