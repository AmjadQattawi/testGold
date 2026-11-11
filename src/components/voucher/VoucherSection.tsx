import { useId, type ReactNode } from "react";
import VoucherIcon, { type VoucherIconName } from "./VoucherIcon";
export default function VoucherSection({
  title,
  icon = "document",
  status,
  aside,
  center,
  children,
  className = "",
  onHeaderClick
}: {
  title: string;
  icon?: VoucherIconName; 
  status?: ReactNode;
  aside?: ReactNode;
  center?: ReactNode;
  children: ReactNode;
  className?: string;
  onHeaderClick?:()=>void;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={
        "overflow-hidden rounded-sm border border-control-border bg-card-background shadow-[0_5px_20px_var(--color-card-shadow)] print:shadow-none " +
        className
      }
    >
      <header onClick={onHeaderClick} className={(center ? "grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] " : "flex flex-wrap justify-between ") + "min-h-13.5 items-center gap-3 border-b border-control-border bg-linear-to-l from-accent-background/40 to-card-background px-3 "}>
        <div className="flex flex-wrap items-center gap-3">
          <h2 id={id} className="flex items-center gap-2 text-sm font-semibold">
            <VoucherIcon name={icon} className="text-accent" />
            {title}
          </h2>
          {status}
        </div>
        {center && <div className="row-start-1 text-center xl:col-start-2">{center}</div>}
        <div className={center ? "xl:justify-self-end" : ""}>{aside}</div>
      </header>
      
      {children}
      
    </section>
  );
}
