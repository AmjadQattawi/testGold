import {
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { getCompanies } from "../services/companyService";
import { getAccessToken } from "../utils/authToken";
import {
  getSelectedCompany,
  setSelectedCompany,
} from "../utils/selectedCompany";
import { ApiError } from "../api/client";
import i18n from "../i18n";
export async function companiesLoader({ request }: LoaderFunctionArgs) {
  if (!getAccessToken()) throw redirect("/login");
  try {
    return {
      companies: await getCompanies(request.signal),
      message: undefined as string | undefined,
    };
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (
      !getAccessToken() ||
      (error instanceof ApiError && error.status === 401)
    )
      throw redirect("/login");
    return {
      companies: [],
      message:
        error instanceof Error ? error.message : i18n.t("companiesFailed"),
    };
  }
}
export async function selectCompanyAction({ request }: ActionFunctionArgs) {
  if (!getAccessToken()) return redirect("/login");
  const data = await request.formData();
  try {
    const company = (await getCompanies(request.signal)).find(
      (company) => company.id === data.get("companyId"),
    );
    if (!company)
      return { isError: true, message: i18n.t("selectCompanyRequired") };
    setSelectedCompany(company);
    return redirect("/home");
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (
      !getAccessToken() ||
      (error instanceof ApiError && error.status === 401)
    )
      return redirect("/login");
    return {
      isError: true,
      message:
        error instanceof Error ? error.message : i18n.t("companiesFailed"),
    };
  }
}
export function selectedCompanyLoader() {
  if (!getAccessToken()) return redirect("/login");
  return getSelectedCompany() || redirect("/companies");
}
