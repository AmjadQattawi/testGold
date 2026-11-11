import { useTranslation } from "react-i18next";
import EmailRequestPage from "../components/EmailRequestPage";
export default function ResendConfirmation() {
  const { t } = useTranslation();
  return (
    <EmailRequestPage
      title={t("resendTitle")}
      description={t("resendDescription")}
      titleId="resend-confirmation-title"
      action="/resend-confirmation"
      buttonLabel={t("resendButton")}
    />
  );
}
