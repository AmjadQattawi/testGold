import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <main className="min-h-dvh w-full bg-page-background px-4 py-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-97.5">
        <div className="mb-3 flex justify-end">
          <ThemeToggle />
        </div>
        {children}
        <footer className="mt-3 text-center text-sm text-footer-text">
          {t("footer")}
        </footer>
      </div>
    </main>
  );
}
