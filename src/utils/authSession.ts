import { cancelCompanyRequests } from "../services/companyRequests";
import { store } from "../app/store";
import { authCleared, userReceived } from "../features/auth/authSlice";
import type { CurrentUser } from "../features/auth/authTypes";
import { companyCleared } from "../features/company/companySlice";

try {
  sessionStorage.removeItem("testGold.authSession");
} catch {
  /* Remove legacy metadata. */
}
export type AuthSession = { email: string; user: CurrentUser };
export function getAuthSession(): AuthSession | null {
  const user = store.getState().auth.user;
  return user ? { email: user.userEmail, user } : null;
}
export function setAuthSession(user: CurrentUser) {
  store.dispatch(userReceived(user));
}
export function clearAuthSession() {
  cancelCompanyRequests();
  store.dispatch(authCleared());
  store.dispatch(companyCleared());
}
