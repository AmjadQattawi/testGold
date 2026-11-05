try {
  sessionStorage.removeItem("testGold.authTokens");
} catch { /* Remove tokens saved by the previous implementation when storage is available. */ }
let accessToken: string | null = null;
let refreshToken: string | null = null;
let version = 0;
export function getAccessToken() {
  return accessToken;
}
export function getRefreshToken() {
  return refreshToken;
}
export function getTokenVersion() {
  return version;
}
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  version++;
}
export function saveTokens(response: unknown, requireRefresh = false) {
  if (!response || typeof response !== "object")
    throw new Error("Invalid authentication response.");
  const outer = response as Record<string, unknown>;
  const data =
    outer.content && typeof outer.content === "object"
      ? (outer.content as Record<string, unknown>)
      : outer;
  if (typeof data.accessToken !== "string" || !data.accessToken)
    throw new Error("The authentication response is missing accessToken.");
  if (
    requireRefresh &&
    (typeof data.refreshToken !== "string" || !data.refreshToken)
  )
    throw new Error("The authentication response is missing refreshToken.");
  accessToken = data.accessToken;
  if (typeof data.refreshToken === "string" && data.refreshToken)
    refreshToken = data.refreshToken;
  version++;
}
