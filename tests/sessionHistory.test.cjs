const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const ts = require('typescript');

const source = fs.readFileSync(path.resolve(__dirname, '../src/utils/sessionHistory.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
let token = 'access';
let listener;
const moves = [];
const fakeWindow = {
  history: { state: { idx: 4 }, go: delta => moves.push(delta) },
  addEventListener: (type, callback) => { assert.equal(type, 'popstate'); listener = callback; },
};
const mod = { exports: {} };
new Function('require', 'module', 'exports', 'window', code)(() => ({ getAccessToken: () => token }), mod, mod.exports, fakeWindow);
mod.exports.installSessionHistoryGuard();
mod.exports.beginSessionHistory();
function pop(idx) {
  let blocked = false;
  listener({ state: idx === null ? null : { idx }, stopImmediatePropagation: () => { blocked = true; } });
  return blocked;
}
assert.equal(pop(3), true);
assert.equal(pop(0), true); // Also reject a multi-entry Back jump before login.
assert.deepEqual(moves, [1, 4]);
assert.equal(pop(4), false);
assert.equal(pop(5), false); // Navigation inside the signed-in session remains usable.
assert.equal(pop(null), false);
token = null;
assert.equal(pop(2), false); // Logout releases the boundary.
token = 'new-access';
fakeWindow.history.state = { idx: 7 };
mod.exports.beginSessionHistory();
assert.equal(pop(6), true);
assert.equal(moves.at(-1), 1);
assert.equal(pop(7), false);
console.log('Passed session history: block pre-login Back and multi-entry jumps, allow session navigation, release on logout and reset on next login.');
