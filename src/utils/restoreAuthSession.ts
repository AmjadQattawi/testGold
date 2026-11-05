import { apiRequest, ApiError, refreshAccessToken } from "../api/client";
import { API } from "../api/endpoints";
import { readCurrentUser } from "../features/auth/authTypes";
import i18n from "../i18n";
import { getAccessToken, clearTokens } from "./authToken";
import { clearAuthSession, getAuthSession, setAuthSession } from "./authSession";

export async function restoreAuthSession() {
  if (getAccessToken() && getAuthSession()) return;
  try {
    const response = await refreshAccessToken();
    const user = readCurrentUser(response) ?? readCurrentUser(await apiRequest(API.PROFILE()));
    if (!user) throw new ApiError(i18n.t("unexpectedResponse"), 200);
    setAuthSession(user);
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && [400, 401, 403].includes(Number(error.status))) {
      clearTokens();
      clearAuthSession();
      return;
    }
    throw error;
  }
}
