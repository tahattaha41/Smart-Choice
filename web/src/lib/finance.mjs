// @ts-check
// حسابات مالية نقية (بدون DOM) — تُستخدم في المتصفح وفي الاختبارات.

/** معامل القسط الشهري: (1-(1+r)^-n)/r */
export function annuityFactor(r, n) {
  return r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r;
}

/**
 * يحل معدل الفائدة الشهري r بحيث: pay * annuityFactor(r, n) = pv
 * @returns {number} معدل شهري (0 لو مفيش فائدة)، أو NaN لو المدخلات غير صالحة
 */
export function solveMonthlyRate(pv, pay, n) {
  if (!(pv > 0 && pay > 0 && n > 0)) return NaN;
  if (pay * n <= pv) return 0;
  let lo = 0;
  let hi = 1;
  while (pay * annuityFactor(hi, n) > pv && hi < 1e6) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pay * annuityFactor(mid, n) > pv) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * التكلفة الحقيقية للتقسيط.
 * @param {{price:number, down?:number, monthly:number, months:number, fee?:number}} o
 */
export function installment(o) {
  const price = Number(o.price);
  const down = Number(o.down || 0);
  const monthly = Number(o.monthly);
  const months = Math.round(Number(o.months));
  const fee = Number(o.fee || 0);
  if (![price, down, monthly, months, fee].every(Number.isFinite)) return { valid: false, reason: 'number' };
  if (price <= 0 || monthly <= 0 || months <= 0) return { valid: false, reason: 'required' };
  if (down < 0 || fee < 0) return { valid: false, reason: 'negative' };
  if (down >= price) return { valid: false, reason: 'down' };
  const advance = price - down - fee; // القيمة الصافية المموَّلة فعلياً
  if (advance <= 0) return { valid: false, reason: 'fee' };
  const total = down + fee + monthly * months;
  const extra = total - price;
  const monthlyRate = solveMonthlyRate(advance, monthly, months);
  const effectiveAnnual = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
  return {
    valid: true,
    financed: price - down,
    advance,
    total,
    extra,
    extraPct: (extra / price) * 100,
    monthlyRate: monthlyRate * 100,
    nominalAnnual: monthlyRate * 12 * 100,
    effectiveAnnual,
    cheaperThanCash: extra < 0,
  };
}

/** خصم ثم ضريبة (إضافة أو استخراج) */
export function discount({ price, pct }) {
  price = Number(price); pct = Number(pct);
  if (!(price >= 0) || !(pct >= 0 && pct <= 100)) return { valid: false };
  const saving = (price * pct) / 100;
  return { valid: true, saving, final: price - saving };
}

/**
 * @param {{amount:number, rate:number, mode:'add'|'remove'}} o
 */
export function vat({ amount, rate, mode }) {
  amount = Number(amount); rate = Number(rate);
  if (!(amount >= 0) || !(rate >= 0 && rate <= 100)) return { valid: false };
  if (mode === 'remove') {
    const net = amount / (1 + rate / 100);
    return { valid: true, net, vat: amount - net, gross: amount };
  }
  const v = (amount * rate) / 100;
  return { valid: true, net: amount, vat: v, gross: amount + v };
}

/** تكلفة الامتلاك: هل الأغلى أوفر على المدى الطويل؟ */
export function ownership({ price, years, resalePct, extra }) {
  price = Number(price); years = Number(years); resalePct = Number(resalePct || 0); extra = Number(extra || 0);
  if (!(price > 0 && years > 0) || !(resalePct >= 0 && resalePct <= 100) || !(extra >= 0)) return { valid: false };
  const resale = (price * resalePct) / 100;
  const net = price + extra - resale;
  const months = years * 12;
  return { valid: true, resale, net, perMonth: net / months, perYear: net / years };
}

/** مقارنة خيارين حسب التكلفة الشهرية */
export function compareOwnership(a, b) {
  if (!a.valid || !b.valid) return { valid: false };
  const diff = a.perMonth - b.perMonth;
  const winner = Math.abs(diff) < 0.005 ? 'tie' : diff < 0 ? 'a' : 'b';
  return { valid: true, winner, diffPerMonth: Math.abs(diff) };
}
