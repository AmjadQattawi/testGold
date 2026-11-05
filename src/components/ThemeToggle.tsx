import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Theme = "light" | "dark";
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem("testGold.theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* Fall back to the system preference. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("testGold.theme", theme);
    } catch {
      /* Keep the selection for this session. */
    }
  }, [theme]);
  const label = t(theme === "dark" ? "switchToLight" : "switchToDark");
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
      className={showLabel
        ? "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium text-secondary-text transition-colors hover:bg-hover-background focus-visible:outline-2 focus-visible:outline-accent"
        : "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-control-border bg-card-background text-secondary-text transition hover:bg-hover-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        ) : (
          <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
        )}
      </svg>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
