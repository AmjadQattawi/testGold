export function getBaseUrl(): string {
  if (import.meta.env.DEV)
    return new URL("/backend/", window.location.origin).toString();
  const configured =
    import.meta.env.VITE_API_BASE_URL || "https://api.22-soft.net/";
  const url = new URL(configured);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Invalid API base URL protocol.");
  return url.toString().replace(/\/+$/, "") + "/";
}
function endpoint(path: string) {
  return new URL(path, getBaseUrl()).toString();
}
export const API = {
  LOGIN: () => endpoint("api/Auth/login"),
  SIGNUP: () => endpoint("api/Accounts/Signup"),
  FORGOT_PASSWORD: () => endpoint("api/Password/forgot"),
  RESET_PASSWORD: () => endpoint("api/Password/reset"),
  RESEND_CONFIRMATION: () => endpoint("api/Accounts/resend-confirmation"),
  CONFIRM_EMAIL: () => endpoint("api/Accounts/confirm-email"),
  PROFILE: () => endpoint("user/profile"),
  SIGN_OUT: () => endpoint("api/Auth/logout"),
  GET_COMPANIES: () => endpoint("api/Companies/my"),
  REFRESH_TOKEN: () => endpoint("api/Auth/refresh-token"),
  GET_TREE_NODES_MENU: () => endpoint("api/22-Gold/SystemModules/get-allowed"),
} as const;
