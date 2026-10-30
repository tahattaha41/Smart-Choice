import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCompare, serializeCompare, parseDecide, serializeDecide, readNumbers, writeNumbers } from '../src/lib/urlstate.mjs';
import { defaultWeights } from '../src/lib/compare.mjs';
import { createStore } from '../src/client/store.mjs';

const cats = JSON.parse(readFileSync(new URL('../src/data/categories.json', import.meta.url)));
const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }; };

test('compare state: ذهاب وإياب', () => {
  const s = parseCompare('?c=laptops&q=demo&min=1000&max=30000&s=priceAsc&m.ram_gb=16&cmp=l1,l2,l3,l4,l5&show=1&diff=1', cats);
  assert.equal(s.cat, 'laptops'); assert.equal(s.max, 30000); assert.deepEqual(s.minSpecs, { ram_gb: 16 });
  assert.equal(s.sel.length, 4); // حد أقصى 4
  const back = parseCompare('?' + serializeCompare(s, { cat: 'phones' }), cats);
  assert.deepEqual(back, s);
});
test('compare state: قيم تالفة تُهمل', () => {
  const s = parseCompare('?c=nope&min=abc&s=hack&m.ram_gb=-3', cats);
  assert.equal(s.cat, 'phones'); assert.equal(s.min, undefined); assert.equal(s.sort, 'value'); assert.deepEqual(s.minSpecs, {});
});
test('decide state: يقيّد الأوزان بين 0 و5 ويتجاهل المفاتيح الغريبة', () => {
  const s = parseDecide('?c=phones&b=9000&w.battery_mah=9&w.price=0&w.__proto__=5&w.zzz=3', cats, defaultWeights);
  assert.equal(s.weights.battery_mah, 5); assert.equal(s.weights.price, 0); assert.equal(s.budget, 9000);
  assert.ok(!('zzz' in s.weights));
  const dw = defaultWeights(cats[0]);
  assert.equal(serializeDecide({ cat: 'phones', weights: dw }, 'phones', dw), '');
});
test('tool numbers', () => {
  assert.deepEqual(readNumbers('?p=1000&d=x', ['p', 'd', 'm']), { p: 1000, d: undefined, m: undefined });
  assert.equal(writeNumbers({ p: 5, d: '', m: undefined, n: 'x' }), 'p=5');
});
test('store: مفضلة ومقارنات', () => {
  const st = createStore(mem()); let calls = 0; st.subscribe(() => calls++);
  assert.equal(st.toggleFav('p1'), true); assert.equal(st.isFav('p1'), true);
  assert.equal(st.toggleFav('p1'), false); assert.deepEqual(st.favorites(), []);
  st.saveComparison({ name: 'x', slugs: ['p1', 'p2'] }); st.saveComparison({ name: 'y', slugs: ['p2', 'p1'] });
  assert.equal(st.comparisons().length, 1); assert.equal(st.comparisons()[0].name, 'y');
  st.deleteComparison(st.comparisons()[0].id); assert.equal(st.comparisons().length, 0);
  assert.ok(calls >= 4);
});
test('store: بيانات تالفة لا تكسر', () => {
  const m = mem(); m.setItem('fav:v1', '{bad'); m.setItem('cmp:v1', '[1,{"id":"a","slugs":["p1"]}]');
  const st = createStore(m); assert.deepEqual(st.favorites(), []); assert.equal(st.comparisons().length, 1);
});
test('store: تخزين ممتلئ يعيد الحالة الحقيقية', () => {
  const full = { getItem: () => null, setItem: () => { throw new Error('quota'); }, removeItem() {} };
  const st = createStore(full); assert.equal(st.toggleFav('p1'), false);
});
