const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const jsx = require('react/jsx-runtime');
let slots = [], cursor = 0, changed = false;
let pathname = '/home';
const navigations = [];
let dialog;
const code = ts.transpileModule(fs.readFileSync('src/components/WorkspaceTabs.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const mocks = {
  react: {
    Activity: 'activity', Suspense: 'suspense', lazy: () => 'lazy-page',
    useState: initial => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => { slots[index] = value; changed = true; }];
    },
  },
  'react/jsx-runtime': jsx,
  'react-router-dom': { Link: 'link', useLocation: () => ({ pathname }), useNavigate: () => path => navigations.push(path) },
  'react-i18next': { useTranslation: () => ({ t: key => key, i18n: { resolvedLanguage: 'en' } }) },
  '../services/menuService': { getMenuTrail: () => [] },
  './HomeSurface': { default: 'home' }, './RouteLoading': { default: 'loading' },
  '../context/dialogContext': { useDialog: () => ({ showDialog: options => { dialog = options; } }) },
};
const mod = { exports: {} };
new Function('require', 'module', 'exports', code)(name => {
  assert.ok(name in mocks, name); return mocks[name];
}, mod, mod.exports);
function render() {
  let result;
  do { changed = false; cursor = 0; result = mod.exports.default({ company: { id: '1' }, menu: { tree: [] }, retryMenu() {} }); } while (changed);
  return result;
}
function children(node) { return [node?.props?.children].flat(Infinity).filter(Boolean); }
function find(node, type) {
  if (node?.type === type) return node;
  for (const child of children(node)) { const result = find(child, type); if (result) return result; }
}
function panels(tree) { return children(tree).filter(node => node.type === 'activity'); }
render();
pathname = '/accountingTrans/GeneralVoucher/';
let tree = render();
assert.equal(panels(tree).length, 2);
assert.equal(panels(tree)[0].props.mode, 'hidden');
assert.equal(panels(tree)[1].props.mode, 'visible');
const voucherKey = panels(tree)[1].key;
pathname = '/accountingTrans/ReceiptVoucher/';
tree = render();
assert.equal(panels(tree).length, 3);
assert.equal(panels(tree)[1].key, voucherKey);
assert.equal(panels(tree)[1].props.mode, 'hidden');
pathname = '/accountingTrans/GeneralVoucher';
tree = render();
assert.equal(panels(tree).length, 3, 'Trailing slash must not duplicate a tab');
const tabs = children(find(tree, 'nav'));
find(tabs[1], 'button').props.onClick();
assert.equal(panels(render()).length, 3, 'Opening dialog keeps tab until confirmed');
assert.equal(dialog.cancelLabel, 'Keep working');
assert.equal(navigations.length, 0);
dialog.onConfirm();
assert.deepEqual(navigations, ['/home']);
assert.equal(panels(render()).length, 2, 'Closing active tab must not reopen it');
pathname = '/home';
assert.equal(panels(render())[0].props.mode, 'visible');
assert.equal(find(children(find(render(), 'nav'))[0], 'button'), undefined, 'Home is pinned');
console.log('Passed workspace tabs: retained panels, active navigation, unique paths, close/cancel, pinned home.');
