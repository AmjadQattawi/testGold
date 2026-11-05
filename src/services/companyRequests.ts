let active: AbortController | null = null;
export function cancelCompanyRequests() {
  active?.abort();
  active = null;
}
export function beginCompanyRequest() {
  cancelCompanyRequests();
  active = new AbortController();
  return active;
}
export function finishCompanyRequest(controller: AbortController) {
  if (active === controller) active = null;
}
