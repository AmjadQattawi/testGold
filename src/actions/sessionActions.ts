import { getAccessToken, clearTokens } from "../utils/authToken";
import { getSelectedCompany } from "../utils/selectedCompany";
import i18n from "../i18n";
import { redirect, replace, type ActionFunctionArgs } from "react-router-dom";
import { getAuthSession, clearAuthSession } from "../utils/authSession";
import { authService } from "../services/authService";
import { ApiError } from "../api/client";

export function homeLoader() {
  const session = getAuthSession();
  return session && getAccessToken() ? session : redirect("/login");
}
export function loginLoader() {
  if (getAccessToken() && getAuthSession())
    return replace(getSelectedCompany() ? "/home" : "/companies");
  return null;
}
export async function logoutAction({ request }: ActionFunctionArgs) {
  const session = getAuthSession();
  if (!session) {
    clearTokens();
    clearAuthSession();
    return replace("/login");
  }
  try {
    const response = await authService.logout({ email: session.email }, { signal: request.signal });
    request.signal.throwIfAborted();
    if (response === false || (response && typeof response === "object" && ((response as Record<string, unknown>).success === false || (response as Record<string, unknown>).isSuccess === false))) throw new ApiError(i18n.t("logoutFailed"), 200);
    clearTokens();
    clearAuthSession();
    return replace("/login");
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      Number(error.status) === 401
    ) {
      clearTokens();
      clearAuthSession();
      return replace("/login");
    }
    return {
      isError: true,
      message:
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : i18n.t("logoutFailed"),
    };
  }
}
