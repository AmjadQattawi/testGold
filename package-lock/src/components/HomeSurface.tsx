import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Company } from "../utils/selectedCompany";
import logo from "../assets/logo.png";

export default function HomeSurface({ company }: { company?: Company | null }) {
  const { t } = useTranslation();
  return (
    <section
      className="overflow-hidden rounded-3xl border border-control-border bg-card-background shadow-sm"
      aria-labelledby="home-title"
    >
      <div className="bg-accent-background p-8 sm:p-12">
        <img
          src={logo}
          alt=""
          className="mb-6 size-20 rounded-2xl bg-card-background p-2 shadow-sm"
        />
        <p className="mb-2 text-sm font-semibold text-accent">
          22-Gold · ERP Platform
        </p>
        <h1 id="home-title" className="text-3xl font-bold text-primary-text">
          {t("welcome")}
        </h1>
        <p className="mt-3 text-secondary-text">
          {company ? company.name : t("companiesDescription")}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-8">
        <div>
          <h2 className="font-semibold">{t("companiesTitle")}</h2>
          <p className="mt-1 text-sm text-secondary-text">
            {t("companiesDescription")}
          </p>
        </div>
        <Link
          to="/companies"
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-button-text hover:bg-accent-hover"
        >
          {t("companiesTitle")}
        </Link>
      </div>
    </section>
  );
}
