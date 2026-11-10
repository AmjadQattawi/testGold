import { translateMessage } from "../i18n";
import FieldIcon, { type FieldIconName } from "./FieldIcon";
import type { InputHTMLAttributes, ReactNode } from "react";
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  id: string;
  label: string;
  icon?: FieldIconName;
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
};
export default function FormField({
  id,
  label,
  icon,
  prefix,
  suffix,
  error,
  className = "",
  "aria-describedby": describedBy,
  ...inputProps
}: Props) {
  const errorId = id + "-error";
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={id} className="mb-1 text-sm font-semibold text-secondary-text">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-0 flex h-10 items-center text-muted-text">
            <FieldIcon name={icon} />
          </span>
        )}
        {prefix}
        <input
          dir={
            inputProps.type === "email" ||
            inputProps.type === "password" ||
            inputProps.type === "tel"
              ? "ltr"
              : undefined
          }
          {...inputProps}
          id={id}
          aria-invalid={error ? true : inputProps["aria-invalid"]}
          aria-describedby={
            [describedBy, error ? errorId : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={
            "h-10 w-full rounded border border-control-border px-3 outline-none transition placeholder:font-normal placeholder:text-placeholder-text focus:border-accent focus:ring-1 focus:ring-accent " +
            (prefix ? "pl-20 " : icon ? "pl-10 " : "") +
            (suffix ? "pr-12 " : "") +
            className
          }
        />
        {suffix}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-accent" role="alert">
          {translateMessage(error)}
        </p>
      )}
    </div>
  );
}
