const assert = require('node:assert/strict');
const { setup, base, user, company, menuRow, json } = require('./loadApp.cjs');
const tick = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  const values = new Map([
    ['testGold.authTokens', JSON.stringify({ accessToken: 'legacy-secret', refreshToken: 'legacy-refresh' })],
    ['testGold.selectedCompany', JSON.stringify({ id: 'old', name: 'Old' })],
    ['testGold.authSession', JSON.stringify({ email: 'old@example.test' })],
  ]);
  let app = setup(values);
  const tokens = app.load('utils/authToken.ts');
  const selection = app.load('utils/selectedCompany.ts');
  const session = app.load('utils/authSession.ts');
  const { restoreAuthSession } = app.load('utils/restoreAuthSession.ts');
  assert.equal(tokens.getAccessToken(), null);
  assert.equal(selection.getSelectedCompany(), null);
  assert.deepEqual(app.store.getState().company.menu, []);
  assert.equal(session.getAuthSession(), null);
  assert.equal(values.has('testGold.authTokens'), false);
  assert.equal(values.has('testGold.selectedCompany'), false);
  assert.equal(values.has('testGold.authSession'), false);
  let refreshCalls = 0;
  global.fetch = async (url, options) => {
    assert.equal(url, base + 'api/Auth/refresh-token');
    assert.equal(options.credentials, 'include');
    assert.deepEqual(JSON.parse(options.body), { deviceId: 'test-device' });
    refreshCalls++;
    return json({}, 401);
  };
  await restoreAuthSession();
  assert.equal(session.getAuthSession(), null);
  assert.equal(refreshCalls, 1);

  const auth = app.load('actions/authActions.ts');
  global.fetch = async (url, options) => {
    assert.equal(url, base + 'api/Auth/login');
    assert.equal(options.credentials, 'include');
    assert.equal(JSON.parse(options.body).deviceId, 'test-device');
    return json({ content: { accessToken: 'login-access', refreshToken: 'memory-refresh', user } });
  };
  const form = new FormData();
  form.set('email', user.userEmail); form.set('password', 'test-password');
  const result = await auth.loginAction({ request: new Request('https://example.test/login', { method: 'POST', body: form }) });
  assert.equal(result.headers.get('Location'), '/companies');
  assert.equal(app.store.getState().auth.user.userID, 3);
  assert.equal(tokens.getAccessToken(), 'login-access');
  assert.equal(JSON.stringify(app.store.getState()).includes('login-access'), false);
  assert.equal(JSON.stringify(app.store.getState()).includes('memory-refresh'), false);
  assert.equal(values.has('testGold.authTokens'), false);

  const actions = app.load('actions/companyActions.ts');
  let rows = [company(1), company(2, true), { ...company(9, true), companyIsActive: false }];
  let menuCalls = 0;
  global.fetch = async (url, options) => {
    if (url.endsWith('Companies/my')) return json({ content: rows });
    assert.equal(url, base + 'api/22-Gold/SystemModules/get-allowed');
    menuCalls++;
    return json({ content: [menuRow(Number(options.headers.get('X-Company-Id')), 'Menu')] });
  };
  const args = path => ({ request: new Request('https://example.test' + path) });
  await assert.rejects(actions.companiesLoader(args('/companies')), error => error.status === 302 && error.headers.get('Location') === '/home');
  assert.equal(selection.getSelectedCompany().id, '2');
  assert.equal(selection.getSelectedCompany().companyAPIPath, rows[1].companyAPIPath);
  assert.equal(selection.getSelectedCompany().companyVirtualPath, rows[1].companyVirtualPath);
  assert.equal(selection.getSelectedCompany().subscriptionEndDate, rows[1].subscriptionEndDate);
  assert.equal(app.store.getState().company.status, 'ready');
  assert.equal(menuCalls, 1);
  assert.equal(values.has('testGold.selectedCompany'), false);
  assert.equal((await actions.companiesLoader(args('/companies'))).companies.length, 2);

  const { initializeCompany } = app.load('features/company/initializeCompany.ts');
  const a = { id: '11', name: 'A', companyIsActive: true };
  const b = { id: '12', name: 'B', companyIsActive: true };
  let releaseOld, oldSignal;
  global.fetch = async (_url, options) => {
    if (options.headers.get('X-Company-Id') === '11') {
      oldSignal = options.signal;
      return new Promise(resolve => { releaseOld = resolve; });
    }
    return json({ content: [menuRow(12, 'B menu')] });
  };
  const first = app.store.dispatch(initializeCompany(a));
  await tick();
  await app.store.dispatch(initializeCompany(b)).unwrap();
  assert.equal(oldSignal.aborted, true);
  releaseOld(json({ content: [menuRow(11, 'Old A menu')] }));
  await first;
  await tick();
  assert.equal(selection.getSelectedCompany().id, '12');
  assert.equal(app.store.getState().company.status, 'ready');
  assert.equal(app.store.getState().company.menu[0].transName, 'B menu');
  assert.equal(app.store.getState().auth.user.userID, 3);
  await assert.rejects(app.store.dispatch(initializeCompany({ ...a, companyIsActive: false })).unwrap());
  assert.equal(selection.getSelectedCompany().id, '12');

  global.fetch = async () => json({ message: 'Unavailable' }, 503);
  await app.store.dispatch(initializeCompany(a)).unwrap();
  assert.equal(app.store.getState().company.status, 'error');
  global.fetch = async () => json({ content: [menuRow(11, 'Retried')] });
  await app.store.dispatch(initializeCompany(a)).unwrap();
  assert.equal(app.store.getState().company.status, 'ready');
  global.fetch = async (url, options) => {
    assert.equal(url, base + 'api/Auth/logout');
    assert.deepEqual(JSON.parse(options.body), { email: user.userEmail });
    return json({ success: true });
  };
  const logout = await app.load('actions/sessionActions.ts').logoutAction(args('/'));
  assert.equal(logout.headers.get('Location'), '/login');
  assert.equal(app.store.getState().auth.user, null);
  assert.equal(selection.getSelectedCompany(), null);
  app.cleanup();

  // A fresh document has no stored user or company. Restore from the cookie.
  app = setup(values);
  let profileCalls = 0;
  global.fetch = async (url, options) => {
    if (url.endsWith('refresh-token')) {
      assert.deepEqual(JSON.parse(options.body), { deviceId: 'test-device' });
      return json({ accessToken: 'cookie-access', user });
    }
    if (url.endsWith('Companies/my')) return json({ content: [company(7, true)] });
    if (url.endsWith('get-allowed')) return json({ content: [menuRow(7, 'Restored company')] });
    profileCalls++;
    throw new Error('Unexpected endpoint');
  };
  await app.load('utils/restoreAuthSession.ts').restoreAuthSession();
  assert.equal(profileCalls, 0);
  assert.equal(app.store.getState().auth.user.userID, 3);
  assert.equal(app.store.getState().company.selectedCompany, null);
  const restoredCompany = await app.load('actions/companyActions.ts').selectedCompanyLoader(args('/accountingTrans/GeneralVoucher?draft=12'));
  assert.equal(restoredCompany.id, '7');
  assert.equal(app.store.getState().company.status, 'ready');
  app.cleanup();

  // If refresh omits user, use the already-configured PROFILE endpoint.
  app = setup(values);
  global.fetch = async url => url.endsWith('refresh-token')
    ? json({ accessToken: 'cookie-without-user' })
    : (assert.equal(url, base + 'user/profile'), json({ user }));
  await app.load('utils/restoreAuthSession.ts').restoreAuthSession();
  assert.equal(app.store.getState().auth.user.userEmail, user.userEmail);
  app.cleanup();

  app = setup(values);
  global.fetch = async () => { throw new Error('Network unavailable'); };
  await assert.rejects(app.load('utils/restoreAuthSession.ts').restoreAuthSession(), error => error.status === 0);
  assert.equal(app.store.getState().auth.user, null);
  global.fetch = async () => json({}, 401);
  await app.load('utils/restoreAuthSession.ts').restoreAuthSession();
  assert.equal(app.store.getState().auth.user, null);
  app.cleanup();
  console.log('Passed Redux integration: memory-only user/company, cookie restore, no tokens in Redux, company metadata, defaults, cache isolation, cancelled/stale requests, retry and logout cleanup.');
})().catch(error => { console.error(error); process.exitCode = 1; });
