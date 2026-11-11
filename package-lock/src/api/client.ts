import { API, getBaseUrl } from "./endpoints";
import {
  getAccessToken,
  getRefreshToken,
  getTokenVersion,
  saveTokens,
  clearTokens,
} from "../utils/authToken";
import { getDeviceId } from "../utils/deviceId";
import i18n, { translateMessage } from "../i18n";
export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}
type Options = Omit<RequestInit, "body"> & { body?: unknown; auth?: boolean };
function errorMessage(body: unknown, status: number): string {
  const suffix = " (HTTP " + status + ")";
  if (typeof body === "string" && body.trim() && !body.trim().startsWith("<"))
    return body.trim().slice(0, 500) + suffix;
  if (body && typeof body === "object") {
    const details = body as Record<string, unknown>;
    const errors = details.errors ?? details.Errors;
    if (errors && typeof errors === "object") {
      const messages = Object.values(errors).flatMap((value) =>
        typeof value === "string"
          ? [value]
          : Array.isArray(value)
            ? value.filter(
                (entry): entry is string => typeof entry === "string",
              )
            : [],
      );
      if (messages.length) return messages.join(" ") + suffix;
    }
    for (const key of [
      "errorMessage",
      "message",
      "Message",
      "detail",
      "title",
      "error",
      "Error",
    ]) {
      if (typeof details[key] === "string" && details[key])
        return translateMessage(details[key] as string);
    }
  }
  const messages: Record<number, string> = {
    400: i18n.t("badData"),
    401: i18n.t("authRejected"),
    403: i18n.t("accessDenied"),
    404: i18n.t("endpointMissing"),
    409: i18n.t("conflict"),
    429: i18n.t("tooMany"),
    500: i18n.t("internalError"),
    502: i18n.t("proxyError"),
    503: i18n.t("serviceUnavailable"),
  };
  return (messages[status] || i18n.t("requestRejected")) + suffix;
}
async function sendRequest<T = unknown>(
  url: string,
  { body, headers, ...options }: Options = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined)
    requestHeaders.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (
      options.signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError")
    )
      throw error;
    throw new ApiError(i18n.t("networkError"), 0);
  }
  const text = await response.text();
  let result: unknown;
  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      if (response.ok)
        throw new ApiError(i18n.t("unexpectedResponse"), response.status);
      result = text;
    }
  }
  if (!response.ok)
    throw new ApiError(
      errorMessage(result, response.status),
      response.status,
      result,
    );
  if (
    result &&
    typeof result === "object" &&
    (result as Record<string, unknown>).hasError === true
  ) {
    throw new ApiError(
      errorMessage(result, response.status),
      response.status,
      result,
    );
  }
  return result as T;
}

let refreshing: Promise<void> | null = null;
export function refreshAccessToken(): Promise<void> {
  if (refreshing) return refreshing;
  const refreshToken = getRefreshToken();
  // Without a response token, the server can use its HttpOnly refresh cookie.
  const version = getTokenVersion();
  const task = (async () => {
    try {
      const result = await sendRequest(API.REFRESH_TOKEN(), {
        method: "POST",
        credentials: "include",
        ...(refreshToken
          ? { body: { refreshToken, deviceId: getDeviceId() } }
          : {}),
      });
      if (getTokenVersion() !== version)
        throw new ApiError(i18n.t("sessionExpired"), 401);
      saveTokens(result);
    } catch (error) {
      if (
        getTokenVersion() === version &&
        error instanceof ApiError &&
        [400, 401, 403].includes(error.status)
      )
        clearTokens();
      throw error;
    }
  })();
  refreshing = task;
  void task
    .finally(() => {
      if (refreshing === task) refreshing = null;
    })
    .catch(() => undefined);
  return task;
}
export async function apiRequest<T = unknown>(
  url: string,
  { auth = true, headers, ...options }: Options = {},
): Promise<T> {
  const base = new URL(getBaseUrl());
  const destination = new URL(url);
  if (
    destination.origin !== base.origin ||
    !destination.pathname.startsWith(base.pathname)
  )
    throw new ApiError(i18n.t("requestRejected"), 0);
  const attemptedToken = auth ? getAccessToken() : null;
  const withHeaders = () => {
    const result = new Headers(headers);
    if (auth && getAccessToken())
      result.set("Authorization", "Bearer " + getAccessToken());
    return result;
  };
  try {
    return await sendRequest<T>(url, {
      ...options,
      credentials: options.credentials ?? "include",
      headers: withHeaders(),
    });
  } catch (error) {
    if (!auth || !(error instanceof ApiError) || error.status !== 401)
      throw error;
    options.signal?.throwIfAborted();
    if (getAccessToken() === attemptedToken || !getAccessToken())
      await refreshAccessToken();
    options.signal?.throwIfAborted();
    try {
      return await sendRequest<T>(url, {
        ...options,
        credentials: options.credentials ?? "include",
        headers: withHeaders(),
      });
    } catch (retryError) {
      if (retryError instanceof ApiError && retryError.status === 401)
        clearTokens();
      throw retryError;
    }
  }
}
