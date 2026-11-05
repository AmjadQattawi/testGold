import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";
import { focusClasses } from "./sidebarStyles";
export default function SidebarHeader({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <header className="relative flex h-18.25 shrink-0 items-center px-4 lg:h-28.25 xl:h-18.25">
      <Link
        to="/home"
        onClick={onClose}
        aria-label="22-Gold"
        className={"flex items-center gap-3 rounded-lg " + focusClasses}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl border border-control-border/60 bg-page-background">
          <img src={logo} alt="" className="size-10 object-contain" />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-lg font-bold tracking-tight" dir="ltr">
            22-Gold
          </span>
          <span className="text-[11px] text-secondary-text">
            {t("mainNavigation")}
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={onClose}
        aria-label={t("closeMenu")}
        className={
          "absolute inset-e-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-lg text-xl text-secondary-text transition-colors hover:bg-hover-background hover:text-primary-text lg:hidden " +
          focusClasses
        }
      >
        ×
      </button>
    </header>
  );
}
