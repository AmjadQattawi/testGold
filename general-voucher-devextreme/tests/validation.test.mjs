import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lineError, totals, voucherError } from '../src/utils/validation.js';
const row = {account:'Main cash',currency:'JOD',rate:1,debit:100,credit:0};
test('rejects empty, negative, nonfinite and double-sided amounts', () => {
  for(const change of [{debit:0},{credit:1},{debit:-1},{debit:Infinity},{rate:0},{account:''},{currency:'BAD'}]) assert.ok(lineError({...row,...change}));
  assert.equal(lineError(row),'');
});
test('balances converted amounts with four decimal precision', () => {
  const rows = [{...row,currency:'USD',rate:0.709},{...row,debit:0,credit:70.9}];
  assert.deepEqual(totals(rows),{debit:70.9,credit:70.9,difference:0,balanced:true});
  assert.equal(voucherError({date:'2026-10-25',rows}),'');
  assert.ok(voucherError({date:'2026-10-25',rows:[row,{...row,debit:0,credit:99}]}));
});
test('rejects empty vouchers, missing dates and incomplete rows', () => {
  assert.ok(voucherError({date:'2026-10-25',rows:[]}));
  assert.ok(voucherError({date:'',rows:[row,row]}));
  assert.ok(voucherError({date:'2026-10-25',rows:[row,{...row,account:''}]}));
});
