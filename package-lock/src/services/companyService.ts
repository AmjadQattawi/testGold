import { API } from "../api/endpoints";
import { apiRequest, ApiError } from "../api/client";
import type { Company } from "../utils/selectedCompany";
import i18n from "../i18n";
export async function getCompanies(signal?: AbortSignal): Promise<Company[]> {
  const response = await apiRequest<unknown>(API.GET_COMPANIES(), { signal });
  const content =
    response &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    "content" in response
      ? response.content
      : response;
  const items = Array.isArray(content)
    ? content
    : content && typeof content === "object" && "companies" in content
      ? content.companies
      : null;
  if (!Array.isArray(items))
    throw new ApiError(i18n.t("companiesFormatError"), 200);
  return items.map((item) => {
    if (!item || typeof item !== "object")
      throw new ApiError(i18n.t("companiesFormatError"), 200);
    const id = item.companyId ?? item.id;
    const name = item.companyName ?? item.name;
    if (
      (typeof id !== "string" && typeof id !== "number") ||
      typeof name !== "string"
    )
      throw new ApiError(i18n.t("companiesFormatError"), 200);
    return { id: String(id), name };
  });
}
