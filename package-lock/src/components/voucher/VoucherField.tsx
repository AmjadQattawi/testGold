import type { ReactNode } from "react";
import VoucherIcon, { type VoucherIconName } from "./VoucherIcon";
export default function VoucherField({
  label,
  icon,
  children,
  required,
}: {
  label: string;
  icon?: VoucherIconName;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-[clamp(0.75rem,0.65rem+0.25vw,0.875rem)] text-secondary-text">
      <span className="flex items-center gap-1.5">
        {icon && <VoucherIcon name={icon} className="size-3.5 text-accent" />}
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}
