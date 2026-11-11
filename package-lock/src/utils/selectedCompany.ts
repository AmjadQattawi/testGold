export type Company = { id: string; name: string };
let selected: Company | null = null;
export function getSelectedCompany() {
  return selected;
}
export function setSelectedCompany(company: Company) {
  selected = company;
}
export function clearSelectedCompany() {
  selected = null;
}
