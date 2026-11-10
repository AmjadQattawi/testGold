import { saveTokens, clearTokens } from "../utils/authToken";
import { clearSelectedCompany } from "../utils/selectedCompany";
import i18n from "../i18n";
import { redirect } from "react-router-dom";
import { setAuthSession } from "../utils/authSession";
import { getDeviceId } from "../utils/deviceId";
import { authService } from "../services/authService";
import { ApiError } from "../api/client";
import type { ActionFunctionArgs } from "react-router-dom";
import { isPossiblePhoneNumber } from "react-phone-number-input";

export type AuthActionResult = {
  errors?: Partial<
    Record<
      "email" | "username" | "mobileNo" | "password" | "confirmPassword",
      string
    >
  >;
  message?: string;
  messageKey?: string;
  isError?: boolean;
};
function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}
function credentials(data: FormData) {
  return {
    email: field(data, "email").trim(),
    password: field(data, "password"),
  };
}
function credentialErrors(
  email: string,
  password: string,
): NonNullable<AuthActionResult["errors"]> {
  const errors: NonNullable<AuthActionResult["errors"]> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = i18n.t("validEmail");
  if (!password) errors.password = i18n.t("enterPassword");
  return errors;
}
export async function loginAction({
  request,
}: ActionFunctionArgs): Promise<AuthActionResult | Response> {
  const formData = await request.formData();
  const payload = credentials(formData);
  const errors = credentialErrors(payload.email, payload.password);
  if (Object.keys(errors).length) return { errors };
  try {
    const loginPayload = { ...payload, deviceId: getDeviceId() };
    const result = await authService.login(loginPayload, {
      signal: request.signal,
    });
    if (result && typeof result === "object") {
      const response = result as Record<string, unknown>;
      if (response.success === false || response.isSuccess === false) {
        return {
          isError: true,
          message:
            typeof response.message === "string"
              ? response.message
              : i18n.t("loginRejected"),
        };
      }
    }
    clearTokens();
    saveTokens(result);
    clearSelectedCompany();
    setAuthSession(payload.email);
    return redirect("/companies");
  } catch (error) {
    if (request.signal.aborted) throw error;
    return {
      isError: true,
      message: error instanceof Error ? error.message : i18n.t("loginFailed"),
    };
  }
}
export async function signupAction({
  request,
}: ActionFunctionArgs): Promise<AuthActionResult> {
  const formData = await request.formData();
  const payload = {
    ...credentials(formData),
    username: field(formData, "username").trim(),
    mobileNo: field(formData, "mobileNo").trim(),
  };
  const errors = credentialErrors(payload.email, payload.password);
  if (!payload.username) errors.username = i18n.t("enterUsername");
  if (!payload.mobileNo || !isPossiblePhoneNumber(payload.mobileNo))
    errors.mobileNo = i18n.t("validMobile");
  if (payload.password !== field(formData, "confirmPassword"))
    errors.confirmPassword = i18n.t("passwordMismatch");
  if (Object.keys(errors).length) return { errors };
  try {
    const result = await authService.signup(payload, {
      signal: request.signal,
    });
    if (
      result === false ||
      (result &&
        typeof result === "object" &&
        ((result as Record<string, unknown>).success === false ||
          (result as Record<string, unknown>).isSuccess === false))
    ) {
      return { isError: true, message: i18n.t("signupFailed") };
    }
    return { messageKey: "signupSuccess" };
  } catch (error) {
    if (request.signal.aborted) throw error;
    return {
      isError: true,
      message:
        error instanceof ApiError ? error.message : i18n.t("signupFailed"),
    };
  }
}

async function emailRequestAction(
  request: Request,
  purpose: "password-reset" | "email-confirmation",
): Promise<AuthActionResult> {
  const formData = await request.formData();
  const email = field(formData, "email").trim();
  const errors = credentialErrors(email, "not-applicable");
  if (errors.email) return { errors: { email: errors.email } };
  // Connect the email API here using email, purpose and request.signal.
  // After integration use a generic response regardless of account existence.
  return {
    message:
      purpose === "password-reset"
        ? i18n.t("resetNotConnected")
        : i18n.t("confirmationNotConnected"),
  };
}
export async function forgotPasswordAction({
  request,
}: ActionFunctionArgs): Promise<AuthActionResult> {
  const formData = await request.formData();
  const email = field(formData, "email").trim();
  const errors = credentialErrors(email, "not-applicable");
  if (errors.email) return { errors: { email: errors.email } };
  try {
    const result = await authService.forgotPassword(
      { email },
      { signal: request.signal },
    );
    if (
      result === false ||
      (result &&
        typeof result === "object" &&
        ((result as Record<string, unknown>).success === false ||
          (result as Record<string, unknown>).isSuccess === false))
    ) {
      return { isError: true, message: i18n.t("forgotPasswordFailed") };
    }
    return { messageKey: "forgotPasswordSuccess" };
  } catch (error) {
    if (request.signal.aborted) throw error;
    return {
      isError: true,
      message:
        error instanceof ApiError
          ? error.message
          : i18n.t("forgotPasswordFailed"),
    };
  }
}
export async function resendConfirmationAction({
  request,
}: ActionFunctionArgs): Promise<AuthActionResult> {
  return emailRequestAction(request, "email-confirmation");
}
