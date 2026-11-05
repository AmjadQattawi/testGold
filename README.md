# testGold

Run npm install then npm run dev. Routes: /login and /signup.

Shared components in src/components: AuthLayout (background and footer), AuthCard (card and section heading), HeaderCard (brand and decorative language badges), FormField (label, input, optional adornments and error), PasswordField (visibility control), SubmitButton.

Colors remain centralized in src/colors.css. Login retains its design. Signup follows the supplied reference. No theme or language switching. Authentication and password recovery require a backend. Signup validates password confirmation but does not create an account.

Forms now submit POST data through React Router route actions in src/actions/authActions.ts. Action results display field errors and pending button state. The hidden mobileNo input submits the normalized international value, rather than the formatted visible input. API calls are intentionally left for integration; no account or session is created.

Email request pages: /forgot-password and /resend-confirmation. Both use EmailRequestPage and route actions for email validation; actual delivery requires an email API integration.

API organization: src/api/endpoints.ts centralizes the supplied endpoints; .env.example defines VITE_API_BASE_URL; src/api/client.ts handles JSON, HTTP/network errors and cancellation; src/services/authService.ts contains POST request helpers. Route actions remain validation-only until request DTOs and cookie/token authentication are confirmed. Pass request.signal from actions to service options. For cookie auth use credentials: include after confirming server CORS configuration; for bearer auth pass the confirmed Authorization header. No live authentication requests were sent.

Login and signup actions now call their live API endpoints. Current JSON: login { email, password }; signup { email, password, username, mobileNo }. These field names follow the current forms and must be checked against backend DTOs. Tokens/session persistence and redirects are not configured because the authentication response contract is not supplied. No real account was created during verification.

Successful login now stores the submitted email in sessionStorage and redirects to /home inside AppLayout. The /home loader requires that local session. Logout POSTs { email } from the stored login session to api/Auth/logout, then clears the session and redirects to login. Failed logout keeps the session and shows an error; HTTP 401 clears the expired session. This local route guard is UI state; backend authorization and token/cookie persistence still require the API response contract. Passwords are never stored, and logout does not erase the persistent deviceId.

Development API requests use /backend through the Vite proxy to the configured API host. Restart npm run dev after changing proxy configuration. Production requests use VITE_API_BASE_URL directly and require backend CORS permissions for the deployed frontend origin. Login uses api/Auth/login with email, password and the generated persistent browser deviceId.

Authentication and companies flow:
- Login must return accessToken at the root or inside content. refreshToken is optional. Returned tokens are kept in module memory only. No token is written to localStorage, sessionStorage or a JavaScript cookie.
- Protected API calls automatically send Authorization: Bearer. A 401 triggers one shared POST api/Auth/refresh-token with { refreshToken, deviceId } when available, otherwise with credentials included and no body for a backend HttpOnly refresh cookie; its new access token and optional rotated refresh token replace the memory values. The failed request is retried once. Public authentication endpoints never trigger refresh.
- Refresh rotation must be implemented by the backend. This frontend consumes a rotated refreshToken if returned; it cannot implement server-side rotation itself.
- Reloading the tab loses both tokens and requires login again. Only the login email remains in the existing sessionStorage; it is display metadata and does not authorize a route.
- After login, /companies loads GET api/Companies/my. Expected companies are content: [{ companyId, companyName }] or an array of { id, name }; adapt the mapper if the API DTO differs. No sample companies are invented.
- Selecting a company rechecks it against the authenticated company list and opens /home. The choice is stored only in memory. No server-side company-switch endpoint or company header has been supplied, so selection does not alter backend permissions or server tenant context.
- Logout posts the stored login email and clears tokens and company choice on success. A stale refresh cannot restore tokens after logout.
- Vite proxies must preserve cookies if cookie credentials are also enabled; deployments still need backend CORS and cookie settings. Current refresh body schema must be confirmed with the backend.
- Run npm test for mocked refresh, token rotation, retry and companies checks. No production account is accessed by these tests.
