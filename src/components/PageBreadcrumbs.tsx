import { useTranslation } from "react-i18next";
import { getMenuTrail, type MenuNode } from "../services/menuService";

export default function PageBreadcrumbs({
  tree,
  pathname,
}: {
  tree: MenuNode[];
  pathname: string;
}) {
  const { t } = useTranslation();
  const trail = getMenuTrail(tree, pathname);
  const labels = trail.map((node) => ({
    key: node.ttid,
    label: t(String(node.id), { defaultValue: node.transName }),
  }));
  if (pathname.replace(/\/+$/, "") === "/home")
    labels.push({ key: "home", label: t("homePage") });
  if (pathname.replace(/\/+$/, "") === "/companies")
    labels.push({ key: "companies", label: t("companiesTitle") });

  return (
    <nav
      aria-label={t("breadcrumbNavigation")}
      className="min-w-0"
    >
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 py-1 text-[10px] leading-4 sm:gap-x-3 sm:text-xs sm:leading-6">
        {labels.map((item, index) => (
          <li
            key={item.key}
            className="flex min-w-0 max-w-full items-center gap-1 sm:gap-3"
          >
            {index > 0 && (
              <svg
                className="size-3 shrink-0 text-muted-text rtl:rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m6 4 4 4-4 4" />
              </svg>
            )}
            <span
              aria-current={index === labels.length - 1 ? "page" : undefined}
              title={item.label}
              className={
                index === labels.length - 1
                  ? "truncate font-semibold text-accent"
                  : "truncate text-secondary-text"
              }
            >
              {item.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
