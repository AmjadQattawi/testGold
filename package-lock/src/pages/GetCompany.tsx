import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { companiesLoader } from "../actions/companyActions";
import { getSelectedCompany } from "../utils/selectedCompany";
import { useActionDialog } from "../hooks/useActionDialog";
import HomeSurface from "../components/HomeSurface";
import SubmitButton from "../components/SubmitButton";
import logo from "../assets/logo.png";

export default function GetCompany() {
  const { t } = useTranslation();
  const { companies, message } =
    useLoaderData<Awaited<ReturnType<typeof companiesLoader>>>();
  const result = useActionData<{ isError?: boolean; message?: string }>();
  useActionDialog(result);
  const current = getSelectedCompany();
  const [selectedId, setSelectedId] = useState(current?.id ?? "");
  const busy = useNavigation().state !== "idle";
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <>
      <HomeSurface company={current} />
      {createPortal(
        <dialog
          ref={dialogRef}
          className="company-dialog"
          aria-labelledby="companies-title"
          aria-describedby="companies-description"
          onCancel={(event) => {
            event.preventDefault();
            if (current && !busy) void navigate("/home");
          }}
        >
          <div className="company-dialog-header">
            <span className="company-dialog-brand">
              <img src={logo} alt="" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-widest text-accent">
                22-GOLD
              </p>
              <h2
                id="companies-title"
                className="mt-1 text-2xl font-bold text-primary-text"
              >
                {t("companiesTitle")}
              </h2>
            </div>
            {current && (
              <button
                type="button"
                disabled={busy}
                aria-label={t("closeDialog")}
                onClick={() => void navigate("/home")}
                className="company-dialog-close"
              >
                ×
              </button>
            )}
          </div>
          <p
            id="companies-description"
            className="px-7 pb-6 text-sm text-secondary-text"
          >
            {t("companiesDescription")}
          </p>
          {message ? (
            <div className="px-7 pb-7">
              <p role="alert" className="text-sm text-secondary-text">
                {message}
              </p>
              <button
                type="button"
                onClick={() => void revalidator.revalidate()}
                disabled={revalidator.state !== "idle"}
                className="mt-4 rounded-xl bg-accent px-4 py-2 text-accent-button-text"
              >
                {t("retry")}
              </button>
            </div>
          ) : companies.length === 0 ? (
            <p role="status" className="px-7 pb-7 text-secondary-text">
              {t("noCompanies")}
            </p>
          ) : (
            <Form method="post" action="/companies">
              <fieldset disabled={busy} className="company-list">
                <legend className="sr-only">{t("companiesTitle")}</legend>
                {companies.map((company) => (
                  <label key={company.id} className="company-option">
                    <input
                      type="radio"
                      name="companyId"
                      value={company.id}
                      checked={selectedId === company.id}
                      onChange={() => setSelectedId(company.id)}
                      required
                      className="peer sr-only"
                    />
                    <span className="company-option-logo">
                      <img src={logo} alt="" loading="lazy" />
                    </span>
                    <span className="min-w-0 flex-1 break-words font-semibold text-primary-text">
                      {company.name}
                    </span>
                    <span className="company-option-check" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="company-dialog-footer">
                <SubmitButton
                  disabled={
                    busy ||
                    !companies.some((company) => company.id === selectedId)
                  }
                  className="!my-0 !rounded-xl !py-3"
                >
                  {t(busy ? "openingCompany" : "continueCompany")}
                </SubmitButton>
              </div>
            </Form>
          )}
        </dialog>,
        document.body,
      )}
    </>
  );
}
