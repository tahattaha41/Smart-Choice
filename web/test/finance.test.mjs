import test from 'node:test';
import assert from 'node:assert/strict';
import { installment, solveMonthlyRate, annuityFactor, vat, discount, ownership, compareOwnership } from '../src/lib/finance.mjs';

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

test('solveMonthlyRate: الحل يحقق المعادلة', () => {
  const r = solveMonthlyRate(10000, 1000, 12);
  close(1000 * annuityFactor(r, 12), 10000, 1e-4);
  assert.ok(r > 0.028 && r < 0.031);
});

test('installment: مثال محسوب يدوياً', () => {
  // سعر 12000، مقدم 2000، قسط 1000 × 12 => الإجمالي 14000 والزيادة 2000
  const x = installment({ price: 12000, down: 2000, monthly: 1000, months: 12 });
  assert.equal(x.valid, true);
  assert.equal(x.total, 14000);
  assert.equal(x.extra, 2000);
  close(x.extraPct, (2000 / 12000) * 100);
  assert.ok(x.effectiveAnnual > 41 && x.effectiveAnnual < 43, String(x.effectiveAnnual));
  assert.ok(x.nominalAnnual < x.effectiveAnnual);
});

test('installment: المصاريف الإدارية ترفع المعدل الفعلي', () => {
  const a = installment({ price: 12000, down: 2000, monthly: 1000, months: 12, fee: 0 });
  const b = installment({ price: 12000, down: 2000, monthly: 1000, months: 12, fee: 500 });
  assert.ok(b.effectiveAnnual > a.effectiveAnnual);
  assert.equal(b.total, 14500);
});

test('installment: بدون فائدة => المعدل صفر', () => {
  const x = installment({ price: 12000, down: 0, monthly: 1000, months: 12 });
  assert.equal(x.effectiveAnnual, 0);
  assert.equal(x.extra, 0);
});

test('installment: أرخص من الكاش => لا معدل سالب', () => {
  const x = installment({ price: 12000, down: 0, monthly: 900, months: 12 });
  assert.equal(x.cheaperThanCash, true);
  assert.equal(x.effectiveAnnual, 0);
});

test('installment: مدخلات غير صالحة', () => {
  assert.equal(installment({ price: 0, monthly: 100, months: 5 }).valid, false);
  assert.equal(installment({ price: 1000, down: 1000, monthly: 100, months: 5 }).reason, 'down');
  assert.equal(installment({ price: 1000, down: 900, fee: 100, monthly: 100, months: 5 }).reason, 'fee');
  assert.equal(installment({ price: 1000, down: -1, monthly: 100, months: 5 }).reason, 'negative');
  assert.equal(installment({ price: NaN, monthly: 100, months: 5 }).valid, false);
});

test('installment: قسط واحد (n=1) يعمل', () => {
  const x = installment({ price: 1000, monthly: 1100, months: 1 });
  close(x.monthlyRate, 10, 1e-6);
});

test('vat: إضافة واستخراج متناسقان', () => {
  const add = vat({ amount: 1000, rate: 14, mode: 'add' });
  close(add.gross, 1140);
  const rem = vat({ amount: add.gross, rate: 14, mode: 'remove' });
  close(rem.net, 1000, 1e-9);
  close(rem.vat, 140, 1e-9);
  assert.equal(vat({ amount: -1, rate: 14, mode: 'add' }).valid, false);
  assert.equal(vat({ amount: 1, rate: 101, mode: 'add' }).valid, false);
});

test('discount', () => {
  const d = discount({ price: 2000, pct: 15 });
  assert.equal(d.saving, 300);
  assert.equal(d.final, 1700);
  assert.equal(discount({ price: 100, pct: 120 }).valid, false);
});

test('ownership: الأغلى قد يكون أوفر شهرياً', () => {
  const a = ownership({ price: 20000, years: 3, resalePct: 30 }); // 14000 / 36
  const b = ownership({ price: 30000, years: 5, resalePct: 40 }); // 18000 / 60
  close(a.perMonth, 14000 / 36);
  close(b.perMonth, 18000 / 60);
  const c = compareOwnership(a, b);
  assert.equal(c.winner, 'b');
  assert.equal(compareOwnership(a, a).winner, 'tie');
  assert.equal(ownership({ price: 0, years: 1 }).valid, false);
});
