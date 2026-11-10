import { API } from "../api/endpoints";
import { apiRequest } from "../api/client";

// Replace these flexible payloads with DTO interfaces from the backend contract.
// Endpoint names alone do not establish the request or token response schema.
type Payload = Record<string, unknown>;
type Options = Pick<RequestInit, "signal" | "credentials" | "headers">;
export const authService = {
  resetPassword: <T = unknown>(
    payload: { userId: string; token: string; newPassword: string },
    options: Options = {},
  ) =>
    apiRequest<T>(API.RESET_PASSWORD(), {
      auth: false,
      ...options,
      method: "POST",
      body: payload,
    }),
  confirmEmail: (
    payload: { userId: string; token: string },
    options: Options = {},
  ) => {
    const url = new URL(API.CONFIRM_EMAIL());
    url.search = new URLSearchParams(payload).toString();
    return apiRequest<
      { success?: boolean; isSuccess?: boolean } | boolean | null
    >(url.toString(), {
      auth: false,
      ...options,
      method: "GET",
    });
  },
  logout: <T = unknown>(payload: { email: string }, options: Options = {}) =>
    apiRequest<T>(API.SIGN_OUT(), {
      ...options,
      method: "POST",
      body: payload,
    }),
  login: <T = unknown>(payload: Payload, options: Options = {}) =>
    apiRequest<T>(API.LOGIN(), {
      auth: false,
      ...options,
      method: "POST",
      body: payload,
    }),
  signup: <T = unknown>(payload: Payload, options: Options = {}) =>
    apiRequest<T>(API.SIGNUP(), {
      auth: false,
      ...options,
      method: "POST",
      body: payload,
    }),
  forgotPassword: <T = unknown>(
    payload: { email: string },
    options: Options = {},
  ) =>
    apiRequest<T>(API.FORGOT_PASSWORD(), {
      auth: false,
      ...options,
      method: "POST",
      body: payload,
    }),
  resendConfirmation: <T = unknown>(payload: Payload, options: Options = {}) =>
    apiRequest<T>(API.RESEND_CONFIRMATION(), {
      auth: false,
      ...options,
      method: "POST",
      body: payload,
    }),
};
