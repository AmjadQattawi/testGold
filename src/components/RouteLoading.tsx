import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function RouteLoading({
  overlay = false,
}: {
  overlay?: boolean;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!overlay) return;
    const dialog = dialogRef.current;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous?.isConnected) previous.focus();
    };
  }, [overlay]);
  const content = (
    <div
      role="status"
      className="flex min-h-40 items-center justify-center gap-3 p-8 text-sm text-secondary-text"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-control-border border-t-accent motion-reduce:animate-none"
      />
      {t("routeLoading")}
    </div>
  );
  if (overlay)
    return createPortal(
      <dialog
        ref={dialogRef}
        aria-label={t("routeLoading")}
        onCancel={(event) => event.preventDefault()}
        className="fixed inset-0 m-auto w-72 max-w-[calc(100%-2rem)] rounded-2xl border border-control-border bg-card-background p-0 shadow-2xl backdrop:bg-modal-overlay backdrop:backdrop-blur-sm"
      >
        {content}
      </dialog>,
      document.body,
    );
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page-background">
      {content}
    </div>
  );
}
