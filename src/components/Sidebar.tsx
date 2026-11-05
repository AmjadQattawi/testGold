import { useTranslation } from "react-i18next";
import type { Company } from "../utils/selectedCompany";
import type { CompanyMenuState } from "../hooks/useCompanyMenu";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarFooter from "./sidebar/SidebarFooter";

interface SidebarProps {
  company: Company;
  state: CompanyMenuState;
  onRetry: () => void;
  onClose: () => void;
}

export default function Sidebar({
  company,
  state,
  onRetry,
  onClose,
}: SidebarProps) {
  const { t } = useTranslation();
  return (
    <aside
      className="flex h-dvh w-sidebar max-w-full flex-col bg-card-background text-primary-text"
      aria-label={t("mainNavigation")}
    >
      <SidebarHeader onClose={onClose} />
      <SidebarNavigation state={state} onRetry={onRetry} onClose={onClose} />
      <SidebarFooter company={company} onClose={onClose} />
    </aside>
  );
}
