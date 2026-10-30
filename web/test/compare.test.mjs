import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterProducts, rank, normalize, bestFlags, cheaperAlternatives, lowestOffer, defaultWeights, differs } from '../src/lib/compare.mjs';
import { freshness } from '../src/lib/freshness.mjs';

const products = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url)));
const categories = JSON.parse(readFileSync(new URL('../src/data/categories.json', import.meta.url)));
const phones = categories.find((c) => c.id === 'phones');
const phoneList = products.filter((p) => p.category === 'phones');

test('البيانات: كل منتج صالح ومعلّم تجريبي', () => {
  const slugs = new Set();
  for (const p of products) {
    assert.ok(!slugs.has(p.slug), 'slug مكرر ' + p.slug); slugs.add(p.slug);
    const cat = categories.find((c) => c.id === p.category);
    assert.ok(cat, 'تصنيف غير موجود ' + p.slug);
    assert.equal(p.demo, true);
    assert.ok(p.name.ar && p.name.en && p.brand.ar && p.brand.en);
    for (const s of cat.specs) assert.ok(p.specs[s.key] !== undefined, `${p.slug} ينقصه ${s.key}`);
    assert.ok(p.offers.length > 0);
    for (const o of p.offers) { assert.ok(o.price > 0); assert.ok(!Number.isNaN(Date.parse(o.verifiedAt))); assert.equal(o.source, 'demo'); }
  }
});

test('lowestOffer: يفضّل المتوفر ثم الأقل سعراً', () => {
  const p = { offers: [{ price: 100, inStock: false }, { price: 150, inStock: true }, { price: 120, inStock: true }] };
  assert.equal(lowestOffer(p).price, 120);
  assert.equal(lowestOffer({ offers: [{ price: 100, inStock: false }] }).price, 100);
  assert.equal(lowestOffer({ offers: [] }), null);
});

test('filterProducts: ميزانية ومواصفات وبحث', () => {
  assert.ok(filterProducts(products, { category: 'phones' }).every((p) => p.category === 'phones'));
  const cheap = filterProducts(products, { category: 'phones', maxPrice: 7000 });
  assert.deepEqual(cheap.map((p) => p.slug).sort(), ['p1', 'p2']);
  const ram = filterProducts(products, { category: 'phones', minSpecs: { ram_gb: 12 } });
  assert.deepEqual(ram.map((p) => p.slug).sort(), ['p5', 'p6']);
  assert.deepEqual(filterProducts(products, { q: 'demo phone 3' }).map((p) => p.slug), ['p3']);
  assert.deepEqual(filterProducts(products, { q: 'هاتف تجريبي ٤' }).map((p) => p.slug), ['p4']);
  assert.equal(filterProducts(products, { q: 'لا-يوجد-هذا' }).length, 0);
});

test('normalize', () => {
  assert.deepEqual(normalize([1, 2, 3], 'higher'), [0, 0.5, 1]);
  assert.deepEqual(normalize([1, 2, 3], 'lower'), [1, 0.5, 0]);
  assert.deepEqual(normalize([5, 5], 'higher'), [0.5, 0.5]);
  assert.deepEqual(normalize([1, NaN, 3], 'higher'), [0, 0, 1]);
});

test('rank: الميزانية تستبعد، والأوزان تغيّر الترتيب', () => {
  const r1 = rank(phoneList, phones, { weights: { price: 5 }, budget: 10000 });
  assert.ok(r1.items.every((i) => i.price <= 10000));
  assert.equal(r1.excluded, 3);
  assert.equal(r1.items[0].product.slug, 'p1'); // الأرخص عند وزن السعر فقط
  const r2 = rank(phoneList, phones, { weights: { battery_mah: 5 } });
  assert.equal(r2.items[0].product.slug, 'p3'); // أكبر بطارية 5500
  for (const i of r2.items) assert.ok(i.score >= 0 && i.score <= 100);
  const sum = r2.items[0].parts.reduce((a, x) => a + x.contribution, 0) * 100;
  assert.ok(Math.abs(sum - r2.items[0].score) < 1e-9);
});

test('rank: بدون أوزان لا يعطي درجات وهمية', () => {
  const r = rank(phoneList, phones, { weights: {} });
  assert.equal(r.criteriaCount, 0);
  assert.ok(r.items.every((i) => i.score === 0));
});

test('rank: ثبات الترتيب (حتمي)', () => {
  const w = defaultWeights(phones);
  const a = rank(phoneList, phones, { weights: w }).items.map((i) => i.product.slug);
  const b = rank([...phoneList].reverse(), phones, { weights: w }).items.map((i) => i.product.slug);
  assert.deepEqual(a, b);
});

test('bestFlags: يحدد الأفضل فقط عند وجود اختلاف', () => {
  const pair = [phoneList[0], phoneList[2]]; // p1 vs p3
  const f = bestFlags(pair, phones.specs);
  assert.deepEqual(f.ram_gb, [1]);
  assert.deepEqual(f.weight_g, [0]); // الأقل وزناً هو الأفضل
  assert.equal(f.screen_in, undefined); // better=null
  assert.equal(bestFlags([phoneList[0]], phones.specs).ram_gb, undefined);
  assert.equal(differs(pair, 'ram_gb'), true);
  assert.equal(differs([phoneList[0], phoneList[0]], 'ram_gb'), false);
});

test('cheaperAlternatives: أرخص وأقل تنازلاً ومرتبة بالسعر', () => {
  const target = phoneList.find((p) => p.slug === 'p5');
  const alts = cheaperAlternatives(target, phoneList, phones, { weights: defaultWeights(phones), minScoreRatio: 0.5 });
  assert.ok(alts.length > 0);
  for (const a of alts) { assert.ok(a.saving > 0); assert.ok(a.price < 17900); }
  const prices = alts.map((a) => a.price);
  assert.deepEqual(prices, [...prices].sort((x, y) => x - y));
  assert.ok(alts.every((a) => Array.isArray(a.tradeoffs)));
});

test('freshness', () => {
  const now = new Date('2026-10-29');
  assert.equal(freshness({ verifiedAt: '2026-10-27', source: 'demo' }, now).state, 'demo');
  assert.equal(freshness({ verifiedAt: '2026-10-27', source: 'store-api' }, now).state, 'fresh');
  assert.equal(freshness({ verifiedAt: '2026-08-01', source: 'store-api' }, now).state, 'stale');
  assert.equal(freshness({ source: 'store-api' }, now).state, 'unknown');
  assert.equal(freshness(null, now).state, 'unknown');
});
