import type { ReactNode } from "react";
import HeaderCard from "./HeaderCard";
type Props = {
  title: string;
  description: string;
  titleId: string;
  children: ReactNode;
};
export default function AuthCard({
  title,
  description,
  titleId,
  children,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <HeaderCard />
      <section className="bg-card-background p-6" aria-labelledby={titleId}>
        <h1 id={titleId} className="font-semibold text-primary-text">
          {title}
        </h1>
        <p id={titleId + "-description"} className="mb-6 text-sm text-muted-text">
          {description}
        </p>
        {children}
      </section>

    
    </div>
  );
}
