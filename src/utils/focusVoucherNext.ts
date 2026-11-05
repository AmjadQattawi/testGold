import type { KeyboardEvent } from "react";
export function focusVoucherNext(event: KeyboardEvent<HTMLFormElement>) {
  if (
    event.key !== "Enter" ||
    event.nativeEvent.isComposing ||
    event.repeat ||
    event.shiftKey ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey
  )
    return;
  const target = event.target;
  if (
    !(
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    )
  )
    return;
  if (!target.matches("[data-voucher-step], [data-voucher-cell]")) return;
  event.preventDefault();
  if (!target.reportValidity()) return;
  const fields = Array.from(
    event.currentTarget.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("[data-voucher-step], tbody [data-voucher-cell]"),
  ).filter(
    (field) =>
      !field.disabled &&
      !("readOnly" in field && field.readOnly) &&
      field.tabIndex >= 0 &&
      field.getClientRects().length > 0,
  );
  const index = fields.indexOf(target);
  if (index < 0) return;
  const row = target.closest("tbody tr");
  const rowFields = row
    ? fields.filter((field) => field.closest("tr") === row)
    : [];
  if (row && rowFields[rowFields.length - 1] === target) {
    event.currentTarget
      .querySelector<HTMLButtonElement>(
        '[data-voucher-action="post"]:not(:disabled)',
      )
      ?.focus();
    return;
  }
  const next = fields[index + 1];
  if (next) {
    next.focus();
    if (
      next instanceof HTMLInputElement &&
      ["text", "number"].includes(next.type)
    ) {
      try {
        next.select();
      } catch {
        /*  */
      }
    }
  }
}
