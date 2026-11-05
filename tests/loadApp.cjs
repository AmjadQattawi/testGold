const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../src');
const base = 'https://example.test/backend/';
const paths = {
  LOGIN: 'api/Auth/login', SIGNUP: 'api/Accounts/Signup', SIGN_OUT: 'api/Auth/logout',
  REFRESH_TOKEN: 'api/Auth/refresh-token', PROFILE: 'user/profile', GET_COMPANIES: 'api/Companies/my',
  GET_TREE_NODES_MENU: 'api/22-Gold/SystemModules/get-allowed',
};
const user = { userID: 3, userName: 'mahdi', userEmail: 'user@example.test', userPhone: '', userRoleID: 2, userRoleName: 'StandardUser', emailConfirmed: true };
const company = (id, isDefaultForUser = false) => ({ companyId: id, companyName: 'Company ' + id, companyIsActive: true, companyAPIPath: 'https://company.example.test/', companyVirtualPath: 'https://company.example.test/Company_' + id, companyPhysicalPath: 'D:\\Company_' + id, companyLogoURL: 'https://example.test/logo.png', subscriptionEndDate: '2026-11-26T00:00:00', isDefaultForUser });
const menuRow = (id, name) => ({ transtree: { id, ttid: 'menu-' + id, transName: name, perentID: '', winFormName: 'Page' + id, show: true } });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
function setup(values = new Map()) {
  const cache = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  global.sessionStorage = storage;
  global.window = { history: { state: { idx: 4 }, go() {} }, addEventListener() {} };
  function load(file) {
    file = path.normalize(file);
    if (cache.has(file)) return cache.get(file);
    const mod = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    cache.set(file, mod.exports);
    function resolve(name) {
      if (name.endsWith('i18n')) return { __esModule: true, default: { t: (key, options) => options?.defaultValue ?? key }, translateMessage: value => value };
      if (name.endsWith('endpoints')) return { getBaseUrl: () => base, API: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, () => base + value])) };
      if (name.endsWith('deviceId')) return { getDeviceId: () => 'test-device' };
      if (name.startsWith('.')) return load(path.join(path.dirname(file), /\.tsx?$/.test(name) ? name : name + '.ts'));
      return require(name);
    }
    new Function('require', 'module', 'exports', code)(resolve, mod, mod.exports);
    cache.set(file, mod.exports);
    return mod.exports;
  }
  const { store } = load('app/store.ts');
  return { load, store, values, storage, cleanup() {
    load('utils/authToken.ts').clearTokens();
    load('utils/authSession.ts').clearAuthSession();
  } };
}
module.exports = { setup, base, user, company, menuRow, json };
