import { useActionToast } from "../hooks/useActionToast";
import { useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";
import { useActionDialog } from "../hooks/useActionDialog";
import { focusNextField } from "../utils/focusNextField";
import type { ResetPasswordResult } from "../actions/resetPasswordAction";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const userId = params.get("userId") || "";
  const token = params.get("token") || "";
  const validLink = Boolean(userId.trim() && token.trim());
  const result = useActionData<ResetPasswordResult>();
  const pending = useNavigation().state !== "idle";
  const navigate = useNavigate();
  useActionDialog(result);
  useActionToast(result);
  useEffect(() => {
    if (!result?.success) return;
    const timer = window.setTimeout(
      () => navigate("/login", { replace: true }),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [result?.success, navigate]);
  return (
    <AuthLayout>
      <AuthCard
        title={t(result?.success ? "resetSuccessTitle" : "resetTitle")}
        description={t(
          result?.success ? "resetSuccessDescription" : "resetDescription",
        )}
        titleId="reset-password-title"
      >
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-accent-background text-accent">
          <svg
            viewBox="0 0 32 32"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {result?.success ? (
              <>
                <circle cx="16" cy="16" r="12" />
                <path d="m10 16 4 4 8-9" />
              </>
            ) : (
              <>
                <rect x="6" y="14" width="20" height="14" rx="3" />
                <path d="M10 14V9a6 6 0 0 1 12 0v5M16 20v3" />
              </>
            )}
          </svg>
        </div>
        {result?.success ? (
          <div className="text-center">
            <p
              role="status"
              className="mb-5 rounded-lg bg-accent-background p-3 text-sm text-accent"
            >
              {t("resetRedirect")}
            </p>
            <Link
              replace
              to="/login"
              className="block rounded-lg bg-accent p-3 font-medium text-accent-button-text hover:bg-accent-hover"
            >
              {t("login")}
            </Link>
          </div>
        ) : !validLink ? (
          <div className="text-center">
            <p
              role="alert"
              className="mb-5 text-sm leading-6 text-secondary-text"
            >
              {t("resetInvalidLink")}
            </p>
            <Link
              to="/forgot-password"
              className="block rounded-lg bg-accent p-3 font-medium text-accent-button-text hover:bg-accent-hover"
            >
              {t("sendReset")}
            </Link>
          </div>
        ) : (
          <Form
            method="post"
            onKeyDown={focusNextField}
            aria-labelledby="reset-password-title"
            aria-describedby="reset-password-title-description"
          >
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="token" value={token} />
            <PasswordField
              id="password"
              name="password"
              label={t("newPassword")}
              autoComplete="new-password"
              placeholder="••••••••"
              required
              disabled={pending}
              error={result?.errors?.password}
            />
            <PasswordField
              id="confirm-password"
              name="confirmPassword"
              label={t("confirmPassword")}
              autoComplete="new-password"
              placeholder="••••••••"
              required
              disabled={pending}
              error={result?.errors?.confirmPassword}
            />
            <SubmitButton disabled={pending}>
              {t(pending ? "resettingPassword" : "resetButton")}
            </SubmitButton>
          </Form>
        )}
        {!result?.success && (
          <p className="mt-4 text-center text-sm">
            <Link
              to="/login"
              className="font-medium text-accent hover:underline"
            >
              {t("backToLogin")}
            </Link>
          </p>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
