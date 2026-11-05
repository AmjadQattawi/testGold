const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const rr = require('react-router-dom');

const loaded = [];
const modules = new Map();
let guardInstalled = 0;
let authenticated = false;
let holdCompanyLoader = false;
let releaseCompanyLoader;
const session = {
  homeLoader: () => ({ email: 'user@example.test' }),
  loginLoader: () => null,
  logoutAction: () => null,
};
const companies = {
  selectedCompanyLoader: () => holdCompanyLoader
    ? new Promise(resolve => { releaseCompanyLoader = () => resolve({ id: '1', name: 'Company' }); })
    : ({ id: '1', name: 'Company' }),
  companiesLoader: () => ({ companies: [], message: undefined }),
  selectCompanyAction: () => null,
};
const auth = Object.fromEntries(['loginAction', 'signupAction', 'forgotPasswordAction', 'resendConfirmationAction'].map(key => [key, () => null]));
const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/router.tsx'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
let routes;
const mocks = {
  'react-router-dom': { ...rr, createBrowserRouter: value => { routes = value; return null; } },
  './utils/sessionHistory': { installSessionHistoryGuard: () => { guardInstalled++; } },
  './utils/authToken': { getAccessToken: () => authenticated ? 'access' : null },
  './actions/sessionActions': session,
  './actions/companyActions': companies,
  './actions/authActions': auth,
  './actions/resetPasswordAction': { resetPasswordAction: () => null },
  './actions/confirmEmailLoader': { confirmEmailLoader: () => null },
};
function resolve(name) {
  if (mocks[name]) return mocks[name];
  if (name === 'react/jsx-runtime') return require(name);
  loaded.push(name);
  if (!modules.has(name)) modules.set(name, { default: () => null });
  return modules.get(name);
}
const mod = { exports: {} };
new Function('require', 'module', 'exports', code)(resolve, mod, mod.exports);
assert.equal(guardInstalled, 1);
assert.deepEqual(loaded, ['./components/RouteLoading']);
assert.equal(routes.find(route => route.path === '/login').loader, session.loginLoader);
assert.equal(routes.find(route => route.path === '/login').action, auth.loginAction);
const appRoute = routes.find(route => route.path === '/');
assert.equal(appRoute.children.find(route => route.path === 'companies').loader, companies.companiesLoader);
assert.equal(appRoute.children.find(route => route.path === 'companies').action, companies.selectCompanyAction);
assert.equal(appRoute.children.find(route => route.path === 'accountingTrans/GeneralVoucher').loader, companies.selectedCompanyLoader);
assert.ok(routes.every(route => route.HydrateFallback));

function initialized(router) {
  if (router.state.initialized) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { unsubscribe(); reject(new Error('Router initialization timeout')); }, 2000);
    const unsubscribe = router.subscribe(state => {
      if (state.initialized) { clearTimeout(timer); unsubscribe(); resolve(); }
    });
  });
}
(async () => {
  const router = rr.createMemoryRouter(routes, { initialEntries: ['/login'] });
  const loadingCode = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/components/RouterLoading.tsx'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const loadingModule = { exports: {} };
  const loadingMocks = {
    react: { useSyncExternalStore: (subscribe, snapshot) => { assert.equal(subscribe, router.subscribe); return snapshot(); } },
    './RouteLoading': { default: () => null },
    'react/jsx-runtime': require('react/jsx-runtime'),
  };
  new Function('require', 'module', 'exports', loadingCode)(name => loadingMocks[name], loadingModule, loadingModule.exports);
  const loading = () => loadingModule.exports.default({ router });
  try {
    assert.equal(loading(), null); // Initial loading is handled by HydrateFallback.
    await initialized(router);
    assert.ok(loaded.includes('./pages/Login'));
    assert.equal(loaded.includes('./pages/JournalVoucher'), false);
    assert.equal(loaded.includes('./components/AppLayout'), false);
    authenticated = true;
    holdCompanyLoader = true;
    const navigation = router.navigate('/home');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(router.state.navigation.state, 'loading');
    assert.equal(loading().props.overlay, true);
    releaseCompanyLoader();
    await navigation;
    holdCompanyLoader = false;
    assert.equal(loading(), null);
    assert.ok(loaded.includes('./pages/MenuRouteLayout'));
    assert.ok(loaded.includes('./pages/Home'));
    assert.equal(loaded.includes('./pages/JournalVoucher'), false);
    await router.navigate('/accountingTrans/GeneralVoucher/');
    assert.ok(loaded.includes('./pages/JournalVoucher'));
    assert.equal(router.state.errors, null);
    assert.equal(loading(), null);
    await router.navigate('/login');
    assert.equal(loaded.filter(name => name === './pages/Login').length, 1);
    authenticated = false;
    await router.navigate('/unknown/page');
    assert.ok(loaded.includes('./pages/MenuRouteLayout'));
    assert.ok(loaded.includes('./pages/MenuPage'));
    assert.equal(router.state.location.pathname, '/unknown/page');
    assert.equal(router.state.errors, null);
    console.log('Passed lazy routing: no eager page imports, on-demand navigation, cached route modules, retained loaders/actions, initial fallback and public unknown URLs.');
  } finally { router.dispose(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
