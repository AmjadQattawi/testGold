import { translateMessage } from "../i18n";
import { useTranslation } from "react-i18next";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { DialogContext, type DialogOptions } from "../context/dialogContext";

export default function DialogProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<DialogOptions | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();
  const showDialog = useCallback(
    (options: DialogOptions) => setDialog(options),
    [],
  );
  const closeDialog = useCallback(() => setDialog(null), []);
  useEffect(() => {
    const element = ref.current;
    if (!dialog || !element) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [dialog]);
  const variant = dialog?.variant ?? "info";
  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}
      {dialog &&
        createPortal(
          <dialog
            ref={ref}
            className="app-dialog"
            aria-labelledby={titleId}
            aria-describedby={messageId}
            onCancel={(event) => {
              event.preventDefault();
              closeDialog();
            }}
          >
            <div className="app-dialog-accent" />
            <div className="app-dialog-body">
              <div className="app-dialog-top">
                <span className="app-dialog-icon" aria-hidden="true">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    {variant === "success" ? (
                      <path d="m8 12 3 3 5-6" />
                    ) : (
                      <>
                        <path d="M12 7v6" />
                        <circle cx="12" cy="17" r=".5" />
                      </>
                    )}
                  </svg>
                </span>
                <button
                  type="button"
                  className="app-dialog-close"
                  aria-label={t("closeDialog")}
                  onClick={closeDialog}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <h2 id={titleId}>
                {dialog.title ??
                  (variant === "error"
                    ? t("dialogError")
                    : variant === "success"
                      ? t("dialogDone")
                      : t("dialogNotice"))}
              </h2>
              <p id={messageId}>{translateMessage(dialog.message)}</p>
              <div className="app-dialog-actions">
              {dialog.onConfirm && (
                <button type="button" className="app-dialog-cancel" autoFocus onClick={closeDialog}>
                  {dialog.cancelLabel ?? t("closeDialog")}
                </button>
              )}
              <button
                type="button"
                className="app-dialog-confirm"
                autoFocus={!dialog.onConfirm}
                onClick={() => {
                  closeDialog();
                  dialog.onConfirm?.();
                }}
              >
                {dialog.buttonLabel ?? t("dialogOK")}
              </button>
              </div>
            </div>
          </dialog>,
          document.body,
        )}
    </DialogContext.Provider>
  );
}
