import { getAccessToken, clearTokens } from '../utils/authToken';
import { clearSelectedCompany } from '../utils/selectedCompany';
import i18n from "../i18n";
import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { authService } from "../services/authService";
import { ApiError } from "../api/client";
import { getAuthSession, clearAuthSession } from "../utils/authSession";
export function homeLoader() {
  const session = getAuthSession();
  return session && getAccessToken() ? session : redirect("/login");
}
export async function logoutAction({ request }: ActionFunctionArgs) {
  const session = getAuthSession();
  if (!session) return redirect("/login");
  try {
    const result = await authService.logout(
      { email: session.email },
      { signal: request.signal },
    );
    if (result && typeof result === "object") {
      const response = result as Record<string, unknown>;
      if (response.success === false || response.isSuccess === false) {
        return {
          isError: true,
          message:
            typeof response.message === "string"
              ? response.message
              : i18n.t("logoutFailed"),
        };
      }
    }
    clearTokens();
    clearSelectedCompany();
    clearAuthSession();
    return redirect("/login");
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (error instanceof ApiError && error.status === 401) {
      clearTokens();
    clearSelectedCompany();
    clearAuthSession();
      return redirect("/login");
    }
    return {
      isError: true,
      message:
        error instanceof ApiError ? error.message : i18n.t("logoutFailed"),
    };
  }
}
