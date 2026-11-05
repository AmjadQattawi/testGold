const assert = require('node:assert/strict');
const { setup, user, menuRow, json } = require('./loadApp.cjs');
const fs = require('fs');
const ts = require('typescript');
const path = require('path');

(async () => {
  const app = setup();
  const tokens = app.load('utils/authToken.ts');
  const session = app.load('utils/authSession.ts');
  tokens.saveTokens({ accessToken: 'access' });
  session.setAuthSession(user);
  const { initializeCompany } = app.load('features/company/initializeCompany.ts');
  const company = { id: '1', name: 'Company' };
  const originalTimeout = AbortSignal.timeout;
  let deadline;
  AbortSignal.timeout = delay => { assert.equal(delay, 20000); deadline = new AbortController(); return deadline.signal; };
  try {
    global.fetch = async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')), { once: true });
    });
    const task = app.store.dispatch(initializeCompany(company));
    await new Promise(resolve => setImmediate(resolve));
    deadline.abort();
    await task.unwrap();
    assert.equal(app.store.getState().company.status, 'error');
    assert.equal(app.store.getState().company.error, 'menuTimeout');
    global.fetch = async () => json({ content: [menuRow(1, 'Success')] });
    await app.store.dispatch(initializeCompany(company)).unwrap();
    assert.equal(app.store.getState().company.status, 'ready');
  } finally { AbortSignal.timeout = originalTimeout; app.cleanup(); }

  // The hook must never expose cached data for a previous company.
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/hooks/useCompanyMenu.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const state = { auth: { user }, company: { selectedCompany: company, status: 'loading', error: null } };
  let effect, redirect, dispatched;
  const mod = { exports: {} };
  const mocks = {
    react: { useEffect: callback => { effect = callback; } },
    'react-router-dom': { useNavigate: () => value => { redirect = value; } },
    '../app/hooks': { useAppSelector: selector => selector(state), useAppDispatch: () => action => { dispatched = action; } },
    '../features/company/initializeCompany': { initializeCompany: value => ({ type: 'initialize', value }) },
    '../utils/authToken': { getAccessToken: () => token },
  };
  let token = 'access';
  new Function('require', 'module', 'exports', code)(name => mocks[name], mod, mod.exports);
  let result = mod.exports.useCompanyMenu('1');
  assert.deepEqual(result.state.tree, []);
  assert.equal(result.state.loading, true);
  state.company.status = 'ready';
  state.company.menu = [{ id: 1 }];
  result = mod.exports.useCompanyMenu('1');
  assert.deepEqual(result.state.tree, [{ id: 1 }]);
  state.company.status = 'error'; state.company.error = 'Unavailable';
  result = mod.exports.useCompanyMenu('1');
  assert.equal(result.state.error, 'Unavailable');
  assert.deepEqual(result.state.tree, []);
  result.retry();
  assert.equal(dispatched.type, 'initialize');
  token = null;
  mod.exports.useCompanyMenu('1');
  effect();
  assert.equal(redirect, '/login');
  console.log('Passed menu loading: Redux timeout, retry, company menu isolation, no stale display, initialization states and expired session navigation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
