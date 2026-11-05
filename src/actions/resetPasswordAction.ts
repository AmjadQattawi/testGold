import type { ActionFunctionArgs } from "react-router-dom";
import i18n from "../i18n";
import { ApiError } from "../api/client";
import { authService } from "../services/authService";
import type { AuthActionResult } from "./authActions";

export type ResetPasswordResult = AuthActionResult & { success?: boolean };
export async function resetPasswordAction({
  request,
}: ActionFunctionArgs): Promise<ResetPasswordResult> {
  const data = await request.formData();
  const read = (name: string) =>
    typeof data.get(name) === "string" ? (data.get(name) as string) : "";
  const userId = read("userId").trim();
  const token = read("token");
  if (!userId || !token.trim())
    return { isError: true, message: i18n.t("resetInvalidLink") };
  const newPassword = read("password");
  const errors: NonNullable<AuthActionResult["errors"]> = {};
  if (!newPassword) errors.password = i18n.t("enterPassword");
  if (newPassword !== read("confirmPassword"))
    errors.confirmPassword = i18n.t("passwordMismatch");
  if (Object.keys(errors).length) return { errors };
  try {
    const result = await authService.resetPassword(
      { userId, token, newPassword },
      { signal: request.signal },
    );
    if (
      result === false ||
      (result &&
        typeof result === "object" &&
        ((result as Record<string, unknown>).success === false ||
          (result as Record<string, unknown>).isSuccess === false))
    ) {
      return { isError: true, message: i18n.t("resetFailed") };
    }
    return { success: true, messageKey: "resetSuccessDescription" };
  } catch (error) {
    if (request.signal.aborted) throw error;
    return {
      isError: true,
      message:
        error instanceof ApiError ? error.message : i18n.t("resetFailed"),
    };
  }
}
