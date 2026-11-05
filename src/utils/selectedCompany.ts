import { cancelCompanyRequests } from "../services/companyRequests";
import { store } from "../app/store";
import {
  companySelected,
  companyCleared,
} from "../features/company/companySlice";
export type { Company } from "../features/company/companyTypes";
import type { Company } from "../features/company/companyTypes";

try {
  sessionStorage.removeItem("testGold.selectedCompany");
} catch {
  /* Remove legacy selection. */
}
export function getSelectedCompany() {
  return store.getState().company.selectedCompany;
}
export function setSelectedCompany(company: Company) {
  cancelCompanyRequests();
  store.dispatch(companySelected(company));
}
export function clearSelectedCompany() {
  cancelCompanyRequests();
  store.dispatch(companyCleared());
}
