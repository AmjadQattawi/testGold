import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { Company } from "../../utils/selectedCompany";
import { focusClasses } from "./sidebarStyles";
export default function SidebarFooter({ company, onClose }: { company: Company; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
      <footer className="shrink-0 p-3">
        <Link
          to="/companies"
          onClick={onClose}
          className={
            "flex items-center gap-3 rounded-2xl border border-control-border/60 bg-page-background p-3 text-sm font-semibold transition-colors hover:border-accent/40 hover:text-accent " +
            focusClasses
          }
          title={t("currentCompany")}
        >
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card-background text-accent shadow-sm"
            aria-hidden="true"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M17 10h3v11M2 21h20M8 7h5M8 11h5M8 15h5M9 21v-3h3v3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-[10px] font-normal text-secondary-text">
              {t("currentCompany")}
            </span>
            <span className="block truncate text-xs">{company.name}</span>
          </span>
          <svg
            className="size-4 shrink-0 text-secondary-text"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m7 4 3-3 3 3M10 1v6m3 9-3 3-3-3m3 3v-6" />
          </svg>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2 px-1 text-[11px] text-secondary-text">
          <span>
            {now.toLocaleDateString(i18n.language, {
              weekday: "long",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
          <time dateTime={now.toISOString()} dir="ltr">
            {now.toLocaleTimeString(i18n.language, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </footer>

  );
}
