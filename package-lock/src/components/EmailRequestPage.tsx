import { useActionToast } from '../hooks/useActionToast';
import { useTranslation } from "react-i18next";
import { useActionDialog } from "../hooks/useActionDialog";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "../actions/authActions";
import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";
import { focusNextField } from "../utils/focusNextField";

type Props = {
  title: string;
  description: string;
  titleId: string;
  action: string;
  buttonLabel: string;
};
export default function EmailRequestPage({
  title,
  description,
  titleId,
  action,
  buttonLabel,
}: Props) {
  const { t } = useTranslation();
  const result = useActionData<AuthActionResult>();
  useActionDialog(result);
  useActionToast(result);
  const pending = useNavigation().state !== "idle";
  return (
    <AuthLayout>
      <AuthCard title={title} description={description} titleId={titleId}>
        <Form
          method="post"
          action={action}
          onKeyDown={focusNextField}
          aria-labelledby={titleId}
          aria-describedby={titleId + "-description"}
        >
          <FormField
            id="email"
            name="email"
            label={t("email")}
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            required
            error={result?.errors?.email}
          />
          <SubmitButton disabled={pending}>
            {pending ? t("sending") : buttonLabel}
          </SubmitButton>
        </Form>
        <p className="my-2 text-center text-sm">
          <Link to="/login" className="font-medium text-accent hover:underline">
            {t("backToLogin")}
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
