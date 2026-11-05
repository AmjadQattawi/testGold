import { getAccessToken } from "./authToken";

const STORAGE_KEY = "testGold.loginHistoryIndex";
function restoreLoginIndex(): number | null {
  try {
    const value: unknown = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY) || "null",
    );
    return typeof value === "number" && Number.isInteger(value) && value >= 0
      ? value
      : null;
  } catch {
    return null;
  }
}
let loginIndex: number | null = restoreLoginIndex();

/** Keep Back navigation within the history created after this login. */
export function beginSessionHistory() {
  const index: unknown = window.history.state?.idx;
  loginIndex = typeof index === "number" ? index : null;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loginIndex));
  } catch {
    /* Storage unavailable. */
  }
}

export function installSessionHistoryGuard() {
  // Register before the router so a blocked POP never renders an old page.
  window.addEventListener("popstate", (event: PopStateEvent) => {
    if (!getAccessToken()) {
      loginIndex = null;
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* Storage unavailable. */
      }
      return;
    }
    const index: unknown = event.state?.idx;
    if (loginIndex === null || typeof index !== "number" || index >= loginIndex)
      return;
    event.stopImmediatePropagation();
    window.history.go(loginIndex - index);
  });
}
