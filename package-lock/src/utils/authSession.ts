const KEY = "testGold.authSession";
export type AuthSession = { email: string };
export function getAuthSession(): AuthSession | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) || "null");
    return value && typeof value.email === "string" && value.email
      ? { email: value.email }
      : null;
  } catch {
    return null;
  }
}
export function setAuthSession(email: string) {
  sessionStorage.setItem(KEY, JSON.stringify({ email }));
}
export function clearAuthSession() {
  sessionStorage.removeItem(KEY);
}
