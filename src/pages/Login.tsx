import { useTranslation } from "react-i18next";
import { useActionDialog } from "../hooks/useActionDialog";
import { focusNextField } from "../utils/focusNextField";

import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "../actions/authActions";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";

export default function Login() {
  const { t } = useTranslation();
  const result = useActionData<AuthActionResult>();
  useActionDialog(result);
  const pending = useNavigation().state !== "idle";


  return (
    <AuthLayout>



      <AuthCard
        title={t("loginTitle")}
        description={t("loginDescription")}
        titleId="login-title"
      >
        <Form
          method="post"
          action="/login"
          onKeyDown={focusNextField}
          aria-labelledby="login-title"
          aria-describedby="login-title-description"
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
          <PasswordField
            error={result?.errors?.password}
            id="password"
            name="password"
            label={t("password")}
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-accent hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <SubmitButton disabled={pending}>
            {pending ? t("signingIn") : t("login")}
          </SubmitButton>
          <p role="status" className="text-sm text-secondary-text">
            {!result?.isError && result?.message}
          </p>
        </Form>
        <p className="my-2 text-center text-sm text-subtle-text">
          {t("noAccount")}{" "}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            {t("signup")}
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
