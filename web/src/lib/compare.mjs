// @ts-check
// محرك المقارنة والترتيب: نقي بالكامل (بدون DOM) وقابل للاختبار.

/** أقل عرض متاح (يفضّل المتوفر بالمخزون) */
export function lowestOffer(product) {
  const offers = (product.offers || []).filter((o) => Number.isFinite(o.price) && o.price > 0);
  if (!offers.length) return null;
  const inStock = offers.filter((o) => o.inStock !== false);
  const pool = inStock.length ? inStock : offers;
  return pool.reduce((a, b) => (b.price < a.price ? b : a));
}
export const priceOf = (p) => lowestOffer(p)?.price ?? null;

const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[ً-ْ]/g, '');

/**
 * @param {any[]} products
 * @param {{category?:string, q?:string, minPrice?:number, maxPrice?:number, minSpecs?:Record<string,number>}} f
 */
export function filterProducts(products, f = {}) {
  const q = norm(f.q).trim();
  return products.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    const price = priceOf(p);
    if (Number.isFinite(f.minPrice) && (price === null || price < /** @type {number} */ (f.minPrice))) return false;
    if (Number.isFinite(f.maxPrice) && (price === null || price > /** @type {number} */ (f.maxPrice))) return false;
    if (f.minSpecs) {
      for (const [k, v] of Object.entries(f.minSpecs)) {
        if (!(Number(p.specs?.[k]) >= v)) return false;
      }
    }
    if (q) {
      const hay = norm([p.name?.ar, p.name?.en, p.brand?.ar, p.brand?.en, p.slug].join(' '));
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
}

/** تطبيع min-max إلى [0,1] */
export function normalize(values, better) {
  const nums = values.filter((v) => Number.isFinite(v));
  if (!nums.length) return values.map(() => 0);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return values.map((v) => {
    if (!Number.isFinite(v)) return 0;
    if (max === min) return 0.5;
    const x = (v - min) / (max - min);
    return better === 'lower' ? 1 - x : x;
  });
}

/**
 * ترتيب شفاف: مجموع موزون لمعايير مطبّعة ضمن الخيارات المعروضة (نسبي وليس تقييماً مطلقاً).
 * @param {any[]} products
 * @param {any} category
 * @param {{weights?:Record<string,number>, budget?:number}} opts
 */
export function rank(products, category, opts = {}) {
  const weights = opts.weights || {};
  const budget = Number(opts.budget);
  let pool = products.filter((p) => priceOf(p) !== null);
  let excluded = 0;
  if (Number.isFinite(budget) && budget > 0) {
    const before = pool.length;
    pool = pool.filter((p) => /** @type {number} */ (priceOf(p)) <= budget);
    excluded = before - pool.length;
  }
  const criteria = [
    ...category.specs.filter((s) => s.better && (weights[s.key] ?? 0) > 0).map((s) => ({ key: s.key, better: s.better, w: weights[s.key] })),
  ];
  if ((weights.price ?? 0) > 0) criteria.push({ key: 'price', better: 'lower', w: weights.price });
  const totalW = criteria.reduce((a, c) => a + c.w, 0);
  const columns = criteria.map((c) =>
    normalize(pool.map((p) => (c.key === 'price' ? priceOf(p) : Number(p.specs?.[c.key]))), c.better),
  );
  const items = pool.map((p, i) => {
    const parts = criteria.map((c, j) => ({ key: c.key, weight: c.w, norm: columns[j][i], contribution: totalW ? (c.w * columns[j][i]) / totalW : 0 }));
    const score = totalW ? parts.reduce((a, x) => a + x.contribution, 0) * 100 : 0;
    return { product: p, price: /** @type {number} */ (priceOf(p)), score, parts };
  });
  items.sort((a, b) => b.score - a.score || a.price - b.price || a.product.slug.localeCompare(b.product.slug));
  return { items, excluded, criteriaCount: criteria.length };
}

/** مؤشرات أفضل قيمة لكل مواصفة (تُحسب فقط عند وجود اختلاف فعلي) */
export function bestFlags(products, specs) {
  /** @type {Record<string, number[]>} */
  const out = {};
  for (const s of specs) {
    if (!s.better || products.length < 2) continue;
    const vals = products.map((p) => Number(p.specs?.[s.key]));
    const finite = vals.filter(Number.isFinite);
    if (finite.length < 2) continue;
    const best = s.better === 'higher' ? Math.max(...finite) : Math.min(...finite);
    if (Math.min(...finite) === Math.max(...finite)) continue;
    out[s.key] = vals.map((v, i) => (v === best ? i : -1)).filter((i) => i >= 0);
  }
  return out;
}

/** هل تختلف قيم المواصفة بين المنتجات؟ */
export function differs(products, key) {
  const set = new Set(products.map((p) => JSON.stringify(p.specs?.[key] ?? null)));
  return set.size > 1;
}

/**
 * بدائل أرخص: أقل سعراً وبدرجة قريبة، مع توضيح التنازلات.
 */
export function cheaperAlternatives(target, pool, category, { weights, minScoreRatio = 0.85, limit = 3 } = {}) {
  const same = pool.filter((p) => p.category === target.category);
  const { items } = rank(same, category, { weights });
  const me = items.find((i) => i.product.slug === target.slug);
  if (!me) return [];
  const price = me.price;
  return items
    .filter((i) => i.product.slug !== target.slug && i.price < price && i.score >= me.score * minScoreRatio)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit)
    .map((i) => ({
      product: i.product,
      price: i.price,
      saving: price - i.price,
      score: i.score,
      tradeoffs: category.specs
        .filter((s) => s.better)
        .map((s) => ({ key: s.key, mine: Number(target.specs?.[s.key]), alt: Number(i.product.specs?.[s.key]), better: s.better }))
        .filter((x) => Number.isFinite(x.mine) && Number.isFinite(x.alt) && (x.better === 'higher' ? x.alt < x.mine : x.alt > x.mine)),
    }));
}

export function defaultWeights(category) {
  /** @type {Record<string, number>} */
  const w = { price: category.defaultPriceWeight ?? 3 };
  for (const s of category.specs) if (s.better && s.priority) w[s.key] = s.defaultWeight ?? 3;
  return w;
}
