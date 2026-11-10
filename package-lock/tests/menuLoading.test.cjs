const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync(path.resolve(__dirname, '../src/hooks/useCompanyMenu.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup() {
  let effect, cleanup, deadline, resolve, reject, requestSignal, state, writes = 0;
  const states = [];
  const fakeWindow = { setTimeout: (callback, delay) => { assert.equal(delay, 20000); deadline = callback; return 1; }, clearTimeout: () => {} };
  const mod = { exports: {} };
  const mocks = {
    react: { useEffect: callback => { effect = callback; }, useState: initial => { const index = states.length; states.push(initial); return [initial, value => { states[index] = value; if (index === 1) { state = value; writes++; } }]; } },
    'react-router-dom': { useNavigate: () => () => {} },
    'react-i18next': { useTranslation: () => ({ t: key => key }) },
    '../services/menuService': { getAllowedMenu: (_id, signal) => { requestSignal = signal; return new Promise((yes, no) => { resolve = yes; reject = no; }); } },
    '../utils/authToken': { getAccessToken: () => 'access' },
    '../api/client': { ApiError: class extends Error {} },
  };
  new Function('require', 'module', 'exports', 'window', code)(name => mocks[name], mod, mod.exports, fakeWindow);
  mod.exports.useCompanyMenu('selected-company');
  cleanup = effect();
  return { resolve: value => resolve(value), reject: value => reject(value), timeout: () => deadline(), cleanup, get signal() { return requestSignal; }, get state() { return state; }, get writes() { return writes; } };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
(async () => {
  let flow = setup();
  flow.resolve([{ id: 1 }]); await flush();
  assert.deepEqual(flow.state.tree, [{ id: 1 }]); assert.equal(flow.state.error, ''); flow.cleanup();
  flow = setup(); flow.reject(new Error('Server database unavailable')); await flush();
  assert.equal(flow.state.error, 'Server database unavailable'); flow.cleanup();
  flow = setup(); flow.timeout();
  assert.equal(flow.state.error, 'menuTimeout'); assert.equal(flow.signal.aborted, true);
  flow.resolve([{ id: 99 }]); await flush(); assert.equal(flow.state.error, 'menuTimeout'); assert.equal(flow.writes, 1); flow.cleanup();
  flow = setup(); flow.cleanup(); flow.reject(new Error('Cancelled request')); await flush(); assert.equal(flow.writes, 0);
  console.log('Passed menu loading: success, server error, timeout, late response rejection and cleanup cancellation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
