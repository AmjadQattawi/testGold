import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import { getAccessToken } from "../utils/authToken";
import logo from "../assets/logo.png";

export default function NotFound() {
  const { t } = useTranslation();
  const signedIn = !!getAccessToken();
  return (
    <main className="flex min-h-dvh items-center justify-center bg-page-background px-4 py-10 text-primary-text">
      <div className="w-full max-w-xl">
        <div className="mb-5 flex justify-end">
          <ThemeToggle />
        </div>
        <section
          aria-labelledby="not-found-title"
          className="relative overflow-hidden rounded-3xl border border-control-border bg-card-background px-6 py-12 text-center shadow-xl shadow-card-shadow sm:px-12 sm:py-16"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-e-16 -top-16 h-48 w-48 rounded-full bg-accent-background"
          />
          <img
            src={logo}
            alt="22-Gold"
            className="relative mx-auto mb-6 h-16 w-16 object-contain"
          />
          <p
            className="text-8xl font-bold tracking-tight text-accent sm:text-9xl"
            dir="ltr"
          >
            404
          </p>
          <span
            className="mx-auto my-6 block h-1 w-12 rounded-full bg-accent"
            aria-hidden="true"
          />
          <h1 id="not-found-title" className="text-2xl font-bold sm:text-3xl">
            {t("notFoundTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-8 text-secondary-text">
            {t("notFoundDescription")}
          </p>
          <Link
            to={signedIn ? "/home" : "/login"}
            replace
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-8 py-3 font-semibold text-accent-button-text transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t(signedIn ? "notFoundHome" : "notFoundLogin")}
          </Link>
        </section>
        <p className="mt-6 text-center text-sm text-footer-text">
          {t("footer")}
        </p>
      </div>
    </main>
  );
}
