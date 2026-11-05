const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const req = require('node:module').createRequire(path.resolve(__dirname, '../package.json'));
const ts = req('typescript');
const root = path.resolve(__dirname, '../src') + path.sep;
const cache = new Map();
const base = 'https://example.test/backend/';
function load(file) {
  file = path.normalize(file);
  if (cache.has(file)) return cache.get(file);
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(root + file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const customRequire = name => {
    if (name.endsWith('i18n')) return { __esModule: true, default: { t: key => key }, translateMessage: text => text };
    if (name.endsWith('endpoints')) return { getBaseUrl: () => base, API: { REFRESH_TOKEN: () => base + 'api/Auth/refresh-token', GET_COMPANIES: () => base + 'api/Companies/my', GET_TREE_NODES_MENU: () => base + 'api/22-Gold/SystemModules/get-allowed' } };
    if (name.endsWith('deviceId')) return { getDeviceId: () => 'test-device' };
    if (name.startsWith('.')) return load(path.join(path.dirname(file), name + '.ts'));
    return req(name);
  };
  new Function('require', 'module', 'exports', code)(customRequire, mod, mod.exports);
  cache.set(file, mod.exports);
  return mod.exports;
}
const tokens = load('utils/authToken.ts');
const client = load('api/client.ts');
const companies = load('services/companyService.ts');
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
(async () => {
  const menu = load('services/menuService.ts');
  const menuRow = (id, ttid, perentID = '', show = true) => ({ transtree: { id, ttid, perentID, show, transName: 'Module ' + id, winFormName: '' } });
  const tree = menu.buildMenuTree({ content: [menuRow(19, '001002', '001'), menuRow(2, '001'), menuRow(3, '002', '', false)] });
  assert.equal(tree.length, 1);
  assert.equal(tree[0].children[0].id, 19);
  const parent = { ...tree[0], id: 10, ttid: 'accounting', winFormName: 'accountingTrans', children: [] };
  const general = { ...parent, id: 1, ttid: 'general', perentID: parent.ttid, winFormName: 'FrmReceiptVou' };
  const petty = { ...general, id: 54, ttid: 'petty' };
  const otherParent = { ...parent, id: 90, ttid: 'other', winFormName: 'otherTransactions' };
  const otherGeneral = { ...general, ttid: 'other-general', perentID: otherParent.ttid };
  const nestedTree = [{ ...parent, children: [general, petty] }, { ...otherParent, children: [otherGeneral] }];
  assert.equal(menu.getMenuPath(general, [parent]), '/accountingTrans/GeneralVoucher/');
  assert.equal(menu.getMenuPath(petty, [parent]), '/accountingTrans/PettyCashVoucher/');
  assert.equal(menu.getMenuPath(otherGeneral, [otherParent]), '/otherTransactions/GeneralVoucher/');
  assert.equal(menu.getActiveMenuId(nestedTree, '/accountingTrans/GeneralVoucher'), 'general');
  assert.deepEqual(menu.getMenuTrail(nestedTree, '/accountingTrans/GeneralVoucher/').map(node => node.ttid), ['accounting', 'general']);
  assert.deepEqual(menu.getMenuTrail(nestedTree, '/otherTransactions/GeneralVoucher').map(node => node.ttid), ['other', 'other-general']);
  assert.deepEqual(menu.getMenuTrail(nestedTree, '/missing'), []);
  const deepTree = [{ ...parent, children: [{ ...otherParent, children: [general] }] }];
  assert.deepEqual(menu.getMenuTrail(deepTree, '/accountingTrans/otherTransactions/GeneralVoucher').map(node => node.ttid), ['accounting', 'other', 'general']);
  assert.equal(menu.getActiveMenuId(nestedTree, '/accountingTrans/PettyCashVoucher/'), 'petty');
  assert.equal(menu.getActiveMenuId(nestedTree, '/otherTransactions/GeneralVoucher/'), 'other-general');
  assert.equal(menu.getActiveMenuId(nestedTree, '/ACCOUNTINGTRANS/GENERALVOUCHER/'), 'general');
  assert.equal(menu.getMenuPath(general), '/GeneralVoucher/');
  const nestedParent = { ...otherParent, winFormName: 'subGroup', ttid: 'sub' };
  assert.equal(menu.getMenuPath(general, [parent, nestedParent]), '/accountingTrans/subGroup/GeneralVoucher/');
  assert.equal(menu.getActiveMenuId(nestedTree, '/home'), undefined);
  assert.equal(menu.getMenuPath({ ...parent, winFormName: 'https://external.test' }), undefined);
  assert.throws(() => menu.buildMenuTree([menuRow(1, 'a', 'b'), menuRow(2, 'b', 'a')]));
  assert.throws(() => menu.buildMenuTree({ content: 'invalid' }));
  tokens.saveTokens({ accessToken: 'menu-access' });
  global.fetch = async (url, options) => {
    assert.equal(url, base + 'api/22-Gold/SystemModules/get-allowed');
    assert.equal(options.method, 'GET');
    assert.equal(options.body, undefined);
    assert.equal(options.headers.get('X-Company-Id'), 'company-7');
    assert.equal(options.headers.get('Authorization'), 'Bearer menu-access');
    return json({ content: [menuRow(1, '001')] });
  };
  assert.equal((await menu.getAllowedMenu('company-7')).length, 1);
  let menuRefreshCalls = 0, menuCalls = 0;
  global.fetch = async (url, options) => {
    if (url.endsWith('refresh-token')) {
      menuRefreshCalls++;
      assert.equal(options.method, 'POST');
      assert.equal(options.credentials, 'include');
      assert.deepEqual(JSON.parse(options.body), { deviceId: 'test-device' });
      return json({ content: { accessToken: 'refreshed-menu-access' } });
    }
    menuCalls++;
    assert.equal(options.method, 'GET');
    assert.equal(options.body, undefined);
    assert.equal(options.headers.get('Accept'), 'application/json');
    assert.equal(options.headers.get('Content-Type'), 'application/json');
    assert.equal(options.headers.get('X-Company-Id'), 'company-8');
    if (options.headers.get('Authorization') === 'Bearer menu-access') return json({}, 401);
    assert.equal(options.headers.get('Authorization'), 'Bearer refreshed-menu-access');
    return json([menuRow(19, '001')]);
  };
  assert.equal((await menu.getAllowedMenu('company-8'))[0].id, 19);
  assert.equal(menuRefreshCalls, 1);
  assert.equal(menuCalls, 2);
  await assert.rejects(menu.getAllowedMenu(''), error => error.status === 400);

  tokens.clearTokens();
  tokens.saveTokens({ content: { accessToken: 'login-access' } });
  assert.equal(tokens.getAccessToken(), 'login-access');
  assert.equal(tokens.getRefreshToken(), null);
  let cookieRefreshCalls = 0;
  global.fetch = async (url, options) => {
    if (url.endsWith('refresh-token')) {
      cookieRefreshCalls++;
      assert.equal(options.credentials, 'include');
      assert.deepEqual(JSON.parse(options.body), { deviceId: 'test-device' });
      return json({ content: { accessToken: 'cookie-access', refreshToken: 'cookie-refresh' } });
    }
    if (options.headers.get('Authorization') === 'Bearer login-access') return json({}, 401);
    assert.equal(options.headers.get('Authorization'), 'Bearer cookie-access');
    return json({ content: [] });
  };
  await companies.getCompanies();
  assert.equal(cookieRefreshCalls, 1);
  assert.equal(tokens.getRefreshToken(), 'cookie-refresh');
  tokens.saveTokens({ content: { accessToken: 'old-access', refreshToken: 'old-refresh' } }, true);
  let refreshCalls = 0, companiesCalls = 0;
  global.fetch = async (url, options) => {
    assert.equal(options.credentials, 'include');
    if (url.endsWith('refresh-token')) {
      refreshCalls++;
      assert.equal(options.headers.get('Authorization'), null);
      assert.deepEqual(JSON.parse(options.body), { refreshToken: 'old-refresh', deviceId: 'test-device' });
      return json({ content: { accessToken: 'new-access', refreshToken: 'rotated-refresh' } });
    }
    companiesCalls++;
    if (options.headers.get('Authorization') === 'Bearer old-access') return json({}, 401);
    assert.equal(options.headers.get('Authorization'), 'Bearer new-access');
    return json({ content: [{ companyId: 7, companyName: 'Example company' }] });
  };
  const result = await Promise.all([companies.getCompanies(), companies.getCompanies()]);
  assert.equal(refreshCalls, 1); assert.equal(companiesCalls, 4);
  assert.equal(result[0][0].id, '7');
  assert.equal(result[0][0].name, 'Example company');
  assert.equal(result[0][0].isDefaultForUser, false);
  assert.equal(result[0][0].companyIsActive, true);
  assert.equal(tokens.getRefreshToken(), 'rotated-refresh');
  global.fetch = async () => json({ errorMessage: 'Invalid email or password.', hasError: true }, 401);
  await assert.rejects(client.apiRequest(base + 'api/Auth/login', { auth: false }), error => error.status === 401);
  assert.equal(tokens.getAccessToken(), 'new-access');
  let attempts = 0;
  global.fetch = async url => { attempts++; return url.endsWith('refresh-token') ? json({ accessToken: 'retry-access', refreshToken: 'retry-refresh' }) : json({}, 401); };
  await assert.rejects(companies.getCompanies(), error => error.status === 401);
  assert.equal(attempts, 3); assert.equal(tokens.getAccessToken(), null); assert.equal(tokens.getRefreshToken(), null);
  await assert.rejects(client.apiRequest('https://different.test/api'), error => error.status === 0);
  tokens.saveTokens({ accessToken: 'pending', refreshToken: 'pending-refresh' }, true);
  let release;
  global.fetch = () => new Promise(resolve => { release = resolve; });
  const pending = client.refreshAccessToken();
  tokens.clearTokens();
  release(json({ accessToken: 'stale-access', refreshToken: 'stale-refresh' }));
  await assert.rejects(pending);
  assert.equal(tokens.getAccessToken(), null);
  const { companiesLoader } = load('actions/companyActions.ts');
  const { loginLoader } = load('actions/sessionActions.ts');
  assert.equal(loginLoader(), null);
  const selection = load('utils/selectedCompany.ts');
  const { setAuthSession, clearAuthSession } = load('utils/authSession.ts');
  setAuthSession({ userID: 3, userName: 'test', userEmail: 'test@example.test', userPhone: '', userRoleID: 2, userRoleName: 'StandardUser', emailConfirmed: true });
  tokens.saveTokens({ accessToken: 'company-access' });
  assert.equal(loginLoader().headers.get('Location'), '/companies');
  assert.equal(loginLoader().headers.get('X-Remix-Replace'), 'true');
  const rows = [
    { companyId: 1, companyName: 'First', isDefaultForUser: false },
    { companyId: 2, companyName: 'Default', isDefaultForUser: true },
  ];
  global.fetch = async () => json({ content: rows });
  const args = () => ({ request: new Request('https://example.test/companies') });
  selection.clearSelectedCompany();
  await assert.rejects(companiesLoader(args()), error => error.status === 302 && error.headers.get('Location') === '/home');
  assert.equal(selection.getSelectedCompany().id, '2');
  assert.equal(loginLoader().headers.get('Location'), '/home');
  assert.equal(loginLoader().headers.get('X-Remix-Replace'), 'true');
  const picker = await companiesLoader(args());
  assert.equal(picker.companies.length, 2);
  selection.clearSelectedCompany();
  rows.pop();
  await assert.rejects(companiesLoader(args()), error => error.status === 302);
  assert.equal(selection.getSelectedCompany().id, '1');
  selection.clearSelectedCompany();
  rows.push({ companyId: 3, companyName: 'Other', isDefaultForUser: false });
  await assert.rejects(companiesLoader(args()), error => error.status === 302 && error.headers.get('Location') === '/home');
  assert.equal(selection.getSelectedCompany().id, '1');
  selection.clearSelectedCompany();
  rows.length = 0;
  assert.equal((await companiesLoader(args())).companies.length, 0);
  tokens.clearTokens();
  clearAuthSession();
  console.log('Passed token flow: Bearer header, one concurrent refresh, rotated refresh in memory, companies mapping, public login exclusion, single retry limit, external-origin rejection and stale-refresh invalidation.');
})().catch(error => { console.error(error); process.exitCode = 1; });

