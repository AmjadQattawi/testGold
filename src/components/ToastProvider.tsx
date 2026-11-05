import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { translateMessage } from "../i18n";
import { ToastContext, type ToastOptions } from "../context/toastContext";

type ToastEntry = ToastOptions & { id: number };
function ToastItem({
  toast,
  dismiss,
}: {
  toast: ToastEntry;
  dismiss: (id: number) => void;
}) {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration ?? 8000);
  useEffect(() => {
    if (paused || remaining.current <= 0) return;
    const start = Date.now();
    const timer = window.setTimeout(() => dismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - start;
    };
  }, [paused, dismiss, toast.id]);
  return (
    <div
      className="app-toast"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <span className="app-toast-icon" aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      </span>
      <div
        className="app-toast-copy"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="app-toast-title">
          {toast.title ?? t("toastSuccessTitle")}
        </p>
        <p className="app-toast-message">
          {toast.messageKey
            ? t(toast.messageKey)
            : translateMessage(toast.message ?? "")}
        </p>
      </div>
      <button
        type="button"
        className="app-toast-close"
        aria-label={t("dismissToast")}
        onClick={() => dismiss(toast.id)}
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const sequence = useRef(0);
  const dismissToast = useCallback(
    (id: number) =>
      setToasts((current) => current.filter((toast) => toast.id !== id)),
    [],
  );
  const showToast = useCallback((options: ToastOptions) => {
    if (!options.message && !options.messageKey) return;
    const toast = { ...options, id: ++sequence.current };
    setToasts((current) => [...current.slice(-2), toast]);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {createPortal(
        <div className="app-toast-region">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} dismiss={dismissToast} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
