import {
  redirect,
  replace,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { getAccessToken } from "../utils/authToken";
import { getSelectedCompany } from "../utils/selectedCompany";
import { store } from "../app/store";
import { getCompanies } from "../services/companyService";
import { initializeCompany } from "../features/company/initializeCompany";
import type { Company } from "../features/company/companyTypes";
import i18n from "../i18n";

function isUnauthorized(error: unknown) {
  return (
    !getAccessToken() ||
    !!(
      error &&
      typeof error === "object" &&
      "status" in error &&
      Number(error.status) === 401
    )
  );
}
function errorMessage(error: unknown) {
  return error && typeof error === "object" && "message" in error
    ? String(error.message)
    : i18n.t("companiesFailed");
}
export async function loadUserCompanies(signal: AbortSignal) {
  const user = store.getState().auth.user;
  if (!getAccessToken() || !user) throw redirect("/login");
  signal.throwIfAborted();
  return getCompanies(signal);
}
export function automaticCompany(companies: Company[]) {
  return companies.find((company) => company.isDefaultForUser) ?? companies[0];
}
async function openCompany(company: Company, signal: AbortSignal) {
  signal.throwIfAborted();
  const task = store.dispatch(initializeCompany(company));
  const abort = () => task.abort();
  signal.addEventListener("abort", abort, { once: true });
  try {
    await task.unwrap();
    signal.throwIfAborted();
  } finally {
    signal.removeEventListener("abort", abort);
  }
}
export async function companiesLoader({ request }: LoaderFunctionArgs) {
  if (!getAccessToken()) throw redirect("/login");
  let companies: Company[];
  try {
    companies = await loadUserCompanies(request.signal);
  } catch (error) {
    if (request.signal.aborted || error instanceof Response) throw error;
    if (isUnauthorized(error)) throw redirect("/login");
    return { companies: [] as Company[], message: errorMessage(error) };
  }
  if (!getSelectedCompany()) {
    const company = automaticCompany(companies);
    if (company) {
      await openCompany(company, request.signal);
      throw replace("/home");
    }
  }
  return { companies: companies, message: undefined as string | undefined };
}
export async function selectCompanyAction({ request }: ActionFunctionArgs) {
  if (!getAccessToken()) return redirect("/login");
  const data = await request.formData();
  try {
    const company = (await loadUserCompanies(request.signal)).find(
      (company) =>
        company.id === data.get("companyId") &&
        company.companyIsActive !== false,
    );
    if (!company)
      return { isError: true, message: i18n.t("selectCompanyRequired") };
    await openCompany(company, request.signal);
    return replace("/home");
  } catch (error) {
    if (request.signal.aborted || error instanceof Response) throw error;
    if (isUnauthorized(error)) return redirect("/login");
    return { isError: true, message: errorMessage(error) };
  }
}
export async function selectedCompanyLoader({ request }: LoaderFunctionArgs) {
  if (!getAccessToken()) throw redirect("/login");
  const current = getSelectedCompany();
  if (current) {
    if (store.getState().company.status === "idle")
      await openCompany(current, request.signal);
    return current;
  }
  try {
    const company = automaticCompany(await loadUserCompanies(request.signal));
    if (!company) throw replace("/companies");
    await openCompany(company, request.signal);
    return company; // Keep the refreshed page URL when an automatic company is available.
  } catch (error) {
    if (request.signal.aborted || error instanceof Response) throw error;
    if (isUnauthorized(error)) throw redirect("/login");
    throw replace("/companies");
  }
}
