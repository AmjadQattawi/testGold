import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllowedMenu, type MenuNode } from "../services/menuService";
import { getAccessToken } from "../utils/authToken";
import { ApiError } from "../api/client";
export type CompanyMenuState = {
  tree: MenuNode[];
  error: string;
  loading: boolean;
};
export function useCompanyMenu(companyId?: string) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    companyId: string;
    attempt: number;
    tree: MenuNode[];
    error: string;
  } | null>(null);
  useEffect(() => {
    if (!companyId) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      if (controller.signal.aborted) return;
      setResult({ companyId, attempt, tree: [], error: t("menuTimeout") });
      controller.abort();
    }, 20_000);
    getAllowedMenu(companyId, controller.signal)
      .then((tree) => {
        if (!controller.signal.aborted)
          setResult({ companyId, attempt, tree, error: "" });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (
          !getAccessToken() ||
          (error instanceof ApiError && error.status === 401)
        ) {
          void navigate("/login", { replace: true });
          return;
        }
        setResult({
          companyId,
          attempt,
          tree: [],
          error: error instanceof Error ? error.message : t("menuFailed"),
        });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [companyId, attempt, navigate, t]);
  const ready = result?.companyId === companyId && result?.attempt === attempt;
  const state: CompanyMenuState =
    ready && result
      ? { tree: result.tree, error: result.error, loading: false }
      : { tree: [], error: "", loading: !!companyId };
  return { state, retry: () => setAttempt((value) => value + 1) };
}
