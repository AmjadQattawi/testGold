# Application state and API lifecycle

`app/store.ts` is the single Redux store. `app/hooks.ts` exposes typed React hooks.
Nothing in the Redux store is persisted to browser storage.

## User and authentication

- `features/auth/authSlice.ts`: the complete current `user`, without tokens.
- `features/auth/authApi.ts`: existing login, cookie refresh, profile fallback and logout requests.
- `utils/authToken.ts`: tokens remain in memory, outside Redux and Redux actions.
- `utils/restoreAuthSession.ts`: restore the cookie session before importing the router.
- `utils/authSession.ts`: compatibility accessors for route loaders and voucher storage keys; reads/writes the same Redux user, with no separate session state.

The refresh response should include `user`. If it omits it, restoration calls the
already configured `API.PROFILE()` endpoint (`user/profile`) and expects the same
user shape, directly or under `user`/`content`. No JWT claims are treated as a
replacement for the server's current user response.

## Company and initialization

- `features/company/companySlice.ts`: selected company, initialization status and error.
- `features/company/companyTypes.ts`: company metadata, including API/virtual paths and subscription data. `id` and `name` are normalized compatibility fields for the existing UI.
- `features/company/companiesApi.ts`: company list cached by user ID on the platform API.
- `features/company/initializeCompany.ts`: the only production entry point for changing/initializing a company.
- `services/companyApi.ts`: company-scoped query cache. The only endpoint currently implemented is the existing allowed-menu request.

Initialization cancels running company queries/mutations, clears that API's cache,
selects the company, then requests its menu. A request ID prevents old initialization
results from changing the new company's status. Query arguments include both company
and user IDs. The UI uses `currentData` and hides old menu data during switching.
Errors have an explicit retry action; timeouts cancel the underlying request.

Add future company prerequisites to `initializeCompany` and endpoint definitions
to feature files using `companyApi.injectEndpoints`. Requests with independent
inputs can run together; dependent requests must await their prerequisites.
Do not duplicate query results in ordinary Redux slices.

The existing menu endpoint keeps its current contract: platform base URL plus
`X-Company-Id`. The supplied `companyAPIPath` and `companyVirtualPath` are retained
as metadata. No switch to either URL is inferred without the relevant API contract.
None of the proposed settings, users, currencies, sales employee, periods or
favourites endpoints have been added.

## Refresh and logout

After refresh, user and company start empty. Restore the user through the cookie,
then load the company's list. Select an active default company, otherwise the only
active company. If neither applies, show the company picker. A refreshed protected
URL is retained when automatic company selection is possible. The last manual
company selection is deliberately not restored from storage.

Logout aborts requests and clears user, company, tokens and both RTK Query caches.
Only the unrelated device ID, history boundary and existing voucher drafts retain
their previous browser-storage behavior.
