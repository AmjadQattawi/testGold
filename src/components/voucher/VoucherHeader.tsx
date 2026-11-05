import type { ReactNode } from "react";
export default function VoucherHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-4 w-full">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-[clamp(1.375rem,1rem+1vw,2rem)] font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-secondary-text">{description}</p>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}
