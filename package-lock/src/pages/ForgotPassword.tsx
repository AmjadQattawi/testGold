import { useTranslation } from "react-i18next";
import EmailRequestPage from "../components/EmailRequestPage";
export default function ForgotPassword() {
  const { t } = useTranslation();
  return (
    <EmailRequestPage
      title={t("forgotPassword")}
      description={t("forgotDescription")}
      titleId="forgot-password-title"
      action="/forgot-password"
      buttonLabel={t("sendReset")}
    />
  );
}
