import type { KeyboardEvent } from "react";

/** Enter advances through editable inputs. The last input keeps native submission. */
export function focusNextField(event: KeyboardEvent<HTMLFormElement>) {
  if (
    event.key !== "Enter" ||
    event.nativeEvent.isComposing ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
    return;
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const excludedTypes = [
    "button",
    "submit",
    "reset",
    "checkbox",
    "radio",
    "file",
    "hidden",
    "range",
    "color",
  ];
  if (excludedTypes.includes(target.type)) return;
  const fields = Array.from(
    event.currentTarget.querySelectorAll<HTMLInputElement>("input"),
  ).filter(
    (input) =>
      !excludedTypes.includes(input.type) &&
      !input.disabled &&
      !input.readOnly &&
      input.tabIndex >= 0 &&
      !input.closest("[inert]") &&
      input.getClientRects().length > 0,
  );
  const index = fields.indexOf(target);
  if (index < 0) return;
  const next = fields[index + 1];
  if (next) {
    event.preventDefault();
    next.focus();
  }
}
