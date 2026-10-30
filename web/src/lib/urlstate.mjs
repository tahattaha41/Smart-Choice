// @ts-check
// حالة الصفحات في الرابط (قابلة للمشاركة). نقية وقابلة للاختبار.

const SORTS = ['value', 'priceAsc', 'priceDesc', 'name'];
const num = (v) => { if (v === null || v === undefined || v === '') return undefined; const n = Number(v); return Number.isFinite(n) ? n : undefined; };

export function parseCompare(search, categories) {
  const p = new URLSearchParams(search);
  const first = categories[0]?.id;
  const cat = categories.some((c) => c.id === p.get('c')) ? p.get('c') : first;
  const minSpecs = {};
  for (const [k, v] of p) if (k.startsWith('m.') && num(v) !== undefined && num(v) > 0) minSpecs[k.slice(2)] = num(v);
  return {
    cat,
    q: (p.get('q') || '').slice(0, 80),
    min: num(p.get('min')), max: num(p.get('max')),
    sort: SORTS.includes(p.get('s') || '') ? p.get('s') : 'value',
    minSpecs,
    sel: (p.get('cmp') || '').split(',').filter(Boolean).slice(0, 4),
    show: p.get('show') === '1', diff: p.get('diff') === '1',
  };
}

export function serializeCompare(s, defaults = {}) {
  const p = new URLSearchParams();
  if (s.cat && s.cat !== defaults.cat) p.set('c', s.cat);
  if (s.q) p.set('q', s.q);
  if (s.min !== undefined) p.set('min', String(s.min));
  if (s.max !== undefined) p.set('max', String(s.max));
  if (s.sort && s.sort !== 'value') p.set('s', s.sort);
  for (const [k, v] of Object.entries(s.minSpecs || {})) if (v > 0) p.set('m.' + k, String(v));
  if (s.sel?.length) p.set('cmp', s.sel.join(','));
  if (s.show && s.sel?.length >= 2) p.set('show', '1');
  if (s.diff) p.set('diff', '1');
  return p.toString();
}

export function parseDecide(search, categories, defaultWeightsFor) {
  const p = new URLSearchParams(search);
  const first = categories[0]?.id;
  const cat = categories.some((c) => c.id === p.get('c')) ? p.get('c') : first;
  const category = categories.find((c) => c.id === cat);
  const weights = { ...defaultWeightsFor(category) };
  for (const [k, v] of p) if (k.startsWith('w.') && k.slice(2) in weights) { const n = num(v); if (n !== undefined) weights[k.slice(2)] = Math.min(5, Math.max(0, Math.round(n))); }
  return { cat, budget: num(p.get('b')), weights };
}

export function serializeDecide(s, defaultCat, defaultWeights) {
  const p = new URLSearchParams();
  if (s.cat !== defaultCat) p.set('c', s.cat);
  if (s.budget !== undefined && s.budget > 0) p.set('b', String(s.budget));
  for (const [k, v] of Object.entries(s.weights)) if (v !== defaultWeights[k]) p.set('w.' + k, String(v));
  return p.toString();
}

/** معاملات الأدوات: يقرأ مفاتيح محددة فقط كأرقام */
export function readNumbers(search, keys) {
  const p = new URLSearchParams(search);
  /** @type {Record<string, number|undefined>} */
  const out = {};
  for (const k of keys) out[k] = num(p.get(k));
  return out;
}
export function writeNumbers(values) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) if (v !== undefined && v !== null && v !== '' && Number.isFinite(Number(v))) p.set(k, String(v));
  return p.toString();
}
