import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";

export default function AccountMenu({
  email,
  userName,
  pending,
}: {
  email: string;
  userName?: string;
  pending: boolean;
}) {
  const { t, i18n } = useTranslation();
  const nextLanguage = i18n.resolvedLanguage?.startsWith("ar") ? "en" : "ar";
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      )
        setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      ref={container}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={t("accountMenu")}
        aria-expanded={open}
        aria-controls="account-menu"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-control-border/60 bg-page-background/60 py-1.5 ps-1.5 pe-2.5 transition-colors hover:bg-hover-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-button-text"
          aria-hidden="true"
        >
          {(userName || email).trim().charAt(0).toUpperCase()}
        </span>
        <span
          className="hidden max-w-32 truncate text-xs font-semibold text-primary-text sm:block"
          dir="auto"
        >
          {userName || email.split("@")[0]}
        </span>
        <svg
          className={
            "size-4 text-secondary-text transition-transform " +
            (open ? "rotate-180" : "")
          }
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
        <div
          id="account-menu"
          hidden={!open}
          className="absolute inset-e-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-control-border bg-card-background p-2 shadow-xl shadow-card-shadow"
        >
          <div className="border-b border-control-border/60 px-3 py-3">
            <p className="text-xs font-semibold text-primary-text">
              {t("accountMenu")}
            </p>
            <p className="mt-1 break-all text-xs text-secondary-text" dir="ltr">
              {email}
            </p>
          </div>
          <div className="mt-1">
            <ThemeToggle showLabel />
            <button
              type="button"
              onClick={() => void i18n.changeLanguage(nextLanguage)}
              className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium text-secondary-text transition-colors hover:bg-hover-background focus-visible:outline-2 focus-visible:outline-accent"
            >
              <svg
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z" />
              </svg>
              <span lang={nextLanguage} dir="auto">
                {nextLanguage === "ar" ? "العربية" : "English"}
              </span>
            </button>
          </div>
          <Form method="post" action="/" className="mt-1">
            <button
              type="submit"
              disabled={pending}
              className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium text-danger transition-colors hover:bg-danger-background focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50"
            >
              <svg
                className="size-4 shrink-0 rtl:-scale-x-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M14 8l4 4-4 4M8 12h13" />
              </svg>
              {t(pending ? "signingOut" : "logout")}
            </button>
          </Form>
        </div>
    </div>
  );
}
