import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { initializeCompany } from "../features/company/initializeCompany";
import { getAccessToken } from "../utils/authToken";
import type { MenuNode } from "../services/menuService";

export type CompanyMenuState = { tree: MenuNode[]; error: string; loading: boolean };
export function useCompanyMenu(companyId?: string) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const company = useAppSelector(state => state.company);
  const unauthorized = !!companyId && !getAccessToken();
  useEffect(() => {
    if (unauthorized) void navigate("/login", { replace: true });
  }, [unauthorized, navigate]);
  const state: CompanyMenuState = {
    tree: company.status === "ready" && company.selectedCompany?.id === companyId ? company.menu : [],
    error: company.error ?? "",
    loading: !!companyId && (company.status === "loading" || company.status === "idle"),
  };
  return { state, retry: () => {
    if (company.selectedCompany) void dispatch(initializeCompany(company.selectedCompany));
  } };
}
