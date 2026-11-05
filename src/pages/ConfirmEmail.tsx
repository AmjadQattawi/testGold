import { Suspense, useEffect, useState } from "react";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../components/AuthLayout";
import HeaderCard from "../components/HeaderCard";
import { confirmEmailLoader, type Result } from "../actions/confirmEmailLoader";

function ConfirmationStatus({ result }: { result?: Result }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(4);
  const success = result?.ok === true;
  useEffect(() => {
    if (!success) return;
    const countdown = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    const redirect = window.setTimeout(
      () => navigate("/login", { replace: true }),
      4000,
    );
    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [success, navigate]);
  const pending = !result;
  return (
    <section
      className="bg-card-background px-6 py-9 text-center"
      aria-labelledby="confirmation-title"
      aria-busy={pending}
    >
      <div className="relative mx-auto mb-7 flex size-24 items-center justify-center rounded-full bg-accent-background text-accent">
        <div className="absolute inset-2 rounded-full border border-accent/15" />
        {pending ? (
          <span className="size-10 animate-spin rounded-full border-3 border-accent/20 border-t-accent motion-reduce:animate-none" />
        ) : (
          <svg
            className="size-11"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {success ? (
              <>
                <path d="M24 4 40 10v13c0 10-16 21-16 21S8 33 8 23V10Z" />
                <path d="m16 23 6 6 11-12" />
              </>
            ) : (
              <>
                <rect x="5" y="10" width="38" height="28" rx="5" />
                <path d="m6 13 18 13 18-13M24 30v1" />
              </>
            )}
          </svg>
        )}
      </div>
      <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
        {t("confirmEyebrow")}
      </p>
      <h1
        id="confirmation-title"
        className="text-2xl font-semibold text-primary-text"
      >
        {t(
          pending
            ? "confirmPending"
            : success
              ? "confirmSuccess"
              : "confirmFailed",
        )}
      </h1>
      <p
        className="mt-3 text-sm leading-6 text-secondary-text"
        role={result && !result.ok ? "alert" : "status"}
      >
        {pending
          ? t("confirmPendingDescription")
          : success
            ? t("confirmSuccessDescription")
            : result?.invalid
              ? t("confirmInvalid")
              : result?.message || t("confirmFailedDescription")}
      </p>
      {success && (
        <p
          className="mt-6 rounded-lg bg-accent-background p-3 text-sm text-accent"
          aria-live="off"
        >
          {t("confirmRedirect", { count: seconds })}
        </p>
      )}
      {!pending && (
        <div className="mt-6 space-y-4">
          <Link
            to={success ? "/login" : "/resend-confirmation"}
            replace={success}
            className="block rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-button-text transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t(success ? "login" : "resendTitle")}
          </Link>
          {!success && (
            <Link
              to="/login"
              className="inline-block text-sm font-medium text-secondary-text hover:text-accent"
            >
              {t("backToLogin")}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

export default function ConfirmEmail() {
  const { confirmation } = useLoaderData<typeof confirmEmailLoader>();
  return (
    <AuthLayout>
      <div className="overflow-hidden rounded-2xl border border-control-border/50 shadow-lg shadow-primary-text/5">
        <HeaderCard />
        <Suspense fallback={<ConfirmationStatus />}>
          <Await resolve={confirmation}>
            {(result: Result) => <ConfirmationStatus result={result} />}
          </Await>
        </Suspense>
      </div>
    </AuthLayout>
  );
}
