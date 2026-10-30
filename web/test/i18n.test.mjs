import test from 'node:test';
import assert from 'node:assert/strict';
import { ui } from '../src/ui.mjs';
import { makeT } from '../src/i18n.mjs';

test('مفاتيح الترجمة متطابقة في اللغتين', () => {
  const a = Object.keys(ui.ar).sort(), e = Object.keys(ui.en).sort();
  assert.deepEqual(a.filter((k) => !(k in ui.en)), [], 'ناقصة في الإنجليزية');
  assert.deepEqual(e.filter((k) => !(k in ui.ar)), [], 'ناقصة في العربية');
});
test('المتغيرات {x} متطابقة في اللغتين', () => {
  const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
  for (const k of Object.keys(ui.ar)) assert.equal(vars(ui.ar[k]), vars(ui.en[k]), k);
});
test('t صارمة', () => {
  const t = makeT('ar');
  assert.equal(t('home.cats.count', { n: 3 }), '3 منتجات');
  assert.throws(() => t('no.such.key'));
});
