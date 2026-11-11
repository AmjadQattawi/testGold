
import FlagIcon from './FlagIcon';
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
export default function HeaderCard() {
  const { i18n } = useTranslation();
  return (
    <header className="flex items-center justify-between gap-3 flex-wrap border-b-[3px] border-accent bg-accent-background p-6">
      <div className="flex items-center min-w-0">
        <img
          src={logo}
          alt="22-Gold"
          className="size-20 shrink-0 rounded-2xl bg-card-background shadow"
        />
        <div className="ms-3 min-w-0">
          <p className="font-bold text-primary-text">22-Gold</p>
          <p className="whitespace-nowrap text-[10px] text-brand-caption-text">
            by 22-soft · ERP Platform
          </p>
        </div>
      </div>
      <div
        className="flex shrink-0"
        dir="ltr"
        role="group"
        aria-label={i18n.language === "ar" ? "اللغة" : "Language"}
      >
        <button
          type="button"
          lang="en"
          aria-label="English"
          aria-pressed={i18n.language === "en"}
          onClick={() => void i18n.changeLanguage("en")}
          className={
            "flex items-center justify-center rounded-l px-2 py-1 font-bold shadow " +
            (i18n.language === "en"
              ? "bg-accent text-accent-button-text"
              : "bg-card-background text-muted-text")
          }
        >
          <FlagIcon country="GB" />
          <span className="ml-2 text-sm">EN</span>
        </button>
        <button
          type="button"
          lang="ar"
          aria-label="العربية"
          aria-pressed={i18n.language === "ar"}
          onClick={() => void i18n.changeLanguage("ar")}
          className={
            "flex items-center justify-center rounded-r px-2 py-1 font-bold shadow " +
            (i18n.language === "ar"
              ? "bg-accent text-accent-button-text"
              : "bg-card-background text-muted-text")
          }
        >
          <FlagIcon country="JO" />
          <span className="ml-2 text-sm">ع</span>
        </button>
      </div>
    </header>
  );
}
