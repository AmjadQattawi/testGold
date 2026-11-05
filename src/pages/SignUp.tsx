import { useActionToast } from '../hooks/useActionToast';
import { translateMessage } from "../i18n";
import { useTranslation } from "react-i18next";
import { useActionDialog } from "../hooks/useActionDialog";
import { focusNextField } from "../utils/focusNextField";
import { useEffect, useState } from "react";
import { Form, Link, useActionData, useNavigate, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "../actions/authActions";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { PhoneInput } from "../components/PhoneInput";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";

export default function SignUp() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ mobileNo: "" });

  const result = useActionData<AuthActionResult>();
  useActionDialog(result);
  useActionToast(result);
  const navigate = useNavigate();
  useEffect(() => {
    if (result?.isError || result?.messageKey !== "signupSuccess") return;
    const timer = window.setTimeout(() => navigate("/login", { replace: true }), 5000);
    return () => window.clearTimeout(timer);
  }, [result, navigate]);
  const pending = useNavigation().state !== "idle";
  return (
    <AuthLayout>
      <AuthCard
        title={t("signupTitle")}
        description={t("signupDescription")}
        titleId="signup-title"
      >
        <Form
          method="post"
          action="/signup"
          onKeyDown={focusNextField}
          aria-labelledby="signup-title"
          aria-describedby="signup-title-description"
        >
          <FormField
            error={result?.errors?.email}
            icon="mail"
            id="email"
            name="email"
            label={t("email")}
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            required
          />
          <FormField
            error={result?.errors?.username}
            icon="user"
            id="username"
            name="username"
            label={t("username")}
            autoComplete="username"
            placeholder={t("namePlaceholder")}
            required
          />
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="mobile"
              className="mb-1 text-sm font-semibold text-secondary-text"
            >
              {t("mobile")}
            </label>
            <input type="hidden" name="mobileNo" value={form.mobileNo} />
            <PhoneInput
              id="mobile"
              aria-invalid={Boolean(result?.errors?.mobileNo)}
              aria-describedby={
                result?.errors?.mobileNo ? "mobile-error" : undefined
              }
              value={form.mobileNo}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, mobileNo: val }))
              }
              placeholder={t("mobilePlaceholder")}
              required
            />
            {result?.errors?.mobileNo && (
              <p
                id="mobile-error"
                className="mt-1 text-xs text-accent"
                role="alert"
              >
                {translateMessage(result.errors.mobileNo)}
              </p>
            )}
          </div>
          <PasswordField
            error={result?.errors?.password}
            id="password"
            name="password"
            label={t("password")}
            autoComplete="new-password"
            placeholder="••••••••"
            required
          />
          <PasswordField
            id="confirm-password"
            name="confirmPassword"
            label={t("confirmPassword")}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            error={result?.errors?.confirmPassword}
          />
          <SubmitButton disabled={pending} className="mt-0">
            {pending ? t("creatingAccount") : t("createAccount")}
          </SubmitButton>
        </Form>
        <p className="my-2 text-center text-sm text-subtle-text">
          {t("haveAccount")}{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            {t("login")}
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

