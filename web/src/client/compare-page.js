import { fill, data, h, $, T, L, store, toast, setUrl, copyText, seg, favButton, freshBadge, productUrl } from './core.mjs';
import { productCard } from './product-card.mjs';
import { filterProducts, rank, defaultWeights, lowestOffer, bestFlags, differs, priceOf } from '../lib/compare.mjs';
import { parseCompare, serializeCompare } from '../lib/urlstate.mjs';
import { money } from '../lib/format.mjs';

const MAX = 4;
const cats = data.categories, products = data.products;
const bySlug = new Map(products.map((p) => [p.slug, p]));
const defaults = { cat: cats[0].id };
const state = parseCompare(location.search, cats);
state.sel = state.sel.filter((s) => bySlug.has(s));
const cat = () => cats.find((c) => c.id === state.cat);

const root = $('#explorer-root');
const filtersEl = h('aside', { class: 'filters', 'aria-label': T('js.category') });
const panelHost = h('div', { id: 'cmp-host' });
const countEl = h('div', { class: 'count', 'aria-live': 'polite' });
const sortSel = h('select', { id: 'sort', 'aria-label': T('js.sort') },
  ['value', 'priceAsc', 'priceDesc', 'name'].map((v) => h('option', { value: v }, T('js.sort.' + v))));
const grid = h('div', { class: 'grid g-products', id: 'results' });
const tray = h('div', { class: 'tray', role: 'region', 'aria-label': T('js.cmp.title') });
root.append(h('div', { class: 'explorer' }, filtersEl, h('section', {}, panelHost, h('div', { class: 'toolbar' }, countEl, h('label', { class: 'sr-only', for: 'sort' }, T('js.sort')), sortSel), grid)), tray);

let catSeg, qInput, minInput, maxInput, specSelects = {};

function buildFilters() {
  specSelects = {};
  const c = cat();
  catSeg = seg(cats.map((x) => ({ value: x.id, label: L(x.name) })), state.cat, (v) => { state.cat = v; state.minSpecs = {}; state.sel = []; state.show = false; buildFilters(); update(); }, T('js.category'));
  qInput = h('input', { type: 'search', id: 'f-q', value: state.q, placeholder: T('js.search'), 'aria-label': T('js.search'), oninput: () => { state.q = qInput.value; update(); } });
  minInput = h('input', { type: 'number', min: '0', inputmode: 'numeric', id: 'f-min', value: state.min ?? '', placeholder: T('js.min'), 'aria-label': T('js.min'), oninput: () => { state.min = minInput.value === '' ? undefined : Number(minInput.value); update(); } });
  maxInput = h('input', { type: 'number', min: '0', inputmode: 'numeric', id: 'f-max', value: state.max ?? '', placeholder: T('js.max'), 'aria-label': T('js.max'), oninput: () => { state.max = maxInput.value === '' ? undefined : Number(maxInput.value); update(); } });
  const specFields = c.specs.filter((s) => s.filter).map((s) => {
    const sel = h('select', { id: 'f-' + s.key, 'aria-label': T('js.minSpec', { label: L(s.label) }), onchange: () => { const v = Number(sel.value); if (v > 0) state.minSpecs[s.key] = v; else delete state.minSpecs[s.key]; update(); } },
      h('option', { value: '0' }, T('js.any')), s.filter.map((v) => h('option', { value: String(v) }, `${v} ${L(s.unit)}`)));
    sel.value = String(state.minSpecs[s.key] ?? 0); specSelects[s.key] = sel;
    return h('div', { class: 'field' }, h('label', { for: 'f-' + s.key }, T('js.minSpec', { label: L(s.label) })), sel);
  });
  fill(filtersEl, 
    h('h2', {}, T('js.category')), h('div', { class: 'field' }, catSeg.el),
    h('div', { class: 'field' }, h('label', { for: 'f-q' }, T('js.search')), qInput),
    h('div', { class: 'field' }, h('label', {}, T('js.budget') + ' (' + T('js.currency') + ')'), h('div', { class: 'row2' }, minInput, maxInput)),
    specFields,
    h('button', { class: 'btn sm', type: 'button', onclick: () => { state.q = ''; state.min = state.max = undefined; state.minSpecs = {}; buildFilters(); update(); } }, T('js.reset')));
}

function toggle(slug) {
  const i = state.sel.indexOf(slug);
  if (i >= 0) state.sel.splice(i, 1);
  else if (state.sel.length >= MAX) { toast(T('js.max4', { n: MAX })); return; }
  else state.sel.push(slug);
  if (state.sel.length < 2) state.show = false;
  update();
}

function visible() {
  const c = cat();
  let list = filterProducts(products, { category: state.cat, q: state.q, minPrice: state.min, maxPrice: state.max, minSpecs: state.minSpecs });
  if (state.sort === 'value') {
    const order = rank(list, c, { weights: defaultWeights(c) }).items.map((i) => i.product.slug);
    list = order.map((s) => bySlug.get(s)).concat(list.filter((p) => !order.includes(p.slug)));
  } else if (state.sort === 'priceAsc') list = [...list].sort((a, b) => (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity));
  else if (state.sort === 'priceDesc') list = [...list].sort((a, b) => (priceOf(b) ?? -1) - (priceOf(a) ?? -1));
  else list = [...list].sort((a, b) => L(a.name).localeCompare(L(b.name), data.lang));
  return list;
}

function renderResults() {
  const c = cat(), list = visible();
  countEl.textContent = list.length === 0 ? T('js.results.none') : list.length === 1 ? T('js.results.one') : T('js.results', { n: list.length });
  if (!list.length) {
    fill(grid, h('div', { class: 'empty', style: 'grid-column:1/-1' }, h('h3', {}, T('js.results.none')), h('p', {}, T('js.noResultsHint')),
      h('button', { class: 'btn sm', type: 'button', onclick: () => { state.q = ''; state.min = state.max = undefined; state.minSpecs = {}; buildFilters(); update(); } }, T('js.reset'))));
    return;
  }
  fill(grid, ...list.map((p, i) => productCard(p, c, { selected: state.sel.includes(p.slug), onToggle: toggle, index: i })));
}

function renderTray() {
  const n = state.sel.length;
  tray.classList.toggle('show', n > 0);
  if (!n) { fill(tray, ); return; }
  fill(tray, h('div', { class: 'tray-in' },
    h('div', { class: 'tray-items' }, state.sel.map((s) => h('span', { class: 'tray-item' }, L(bySlug.get(s).name), h('button', { type: 'button', 'aria-label': T('js.clear') + ': ' + L(bySlug.get(s).name), onclick: () => toggle(s) }, '×')))),
    n < 2 ? h('span', { class: 'count' }, T('js.needTwo')) : null,
    h('button', { class: 'btn primary', type: 'button', disabled: n < 2, onclick: () => { state.show = true; update(); $('#cmp-host').scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, T('js.compareNow', { n })),
    h('button', { class: 'btn', type: 'button', onclick: () => { state.sel = []; state.show = false; update(); } }, T('js.clear'))));
}

function renderPanel() {
  if (!(state.show && state.sel.length >= 2)) { fill(panelHost, ); return; }
  const c = cat(), ps = state.sel.map((s) => bySlug.get(s));
  const flags = bestFlags(ps, c.specs);
  const priceFlags = (() => { const v = ps.map(priceOf); const m = Math.min(...v.filter((x) => x !== null)); return v.map((x, i) => (x === m ? i : -1)).filter((i) => i >= 0); })();
  const specs = c.specs.filter((s) => !state.diff || differs(ps, s.key));
  const diffCb = h('input', { type: 'checkbox', id: 'diff', checked: state.diff || null, onchange: () => { state.diff = diffCb.checked; update(); } });
  const table = h('div', { class: 'tbl-wrap' }, h('table', { class: 'cmp' },
    h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, ''), ps.map((p) => h('th', { scope: 'col' }, h('a', { href: productUrl(p.slug) }, L(p.name)), h('span', { class: 'tiny' }, L(p.brand)))))),
    h('tbody', {},
      h('tr', {}, h('th', { scope: 'row' }, T('js.cmp.price')), ps.map((p, i) => { const o = lowestOffer(p); return h('td', { class: priceFlags.includes(i) && ps.length > 1 && new Set(ps.map(priceOf)).size > 1 ? 'best' : '' }, o ? money(o.price) + ' ' + T('js.currency') : '—', o ? h('span', { class: 'tiny' }, freshBadge(o)) : null); })),
      specs.map((s) => h('tr', {}, h('th', { scope: 'row' }, L(s.label)), ps.map((p, i) => { const v = p.specs[s.key]; const u = L(s.unit); return h('td', { class: flags[s.key]?.includes(i) ? 'best' : '', 'data-best': flags[s.key]?.includes(i) ? '1' : null }, v === undefined ? '—' : `${v}${u ? ' ' + u : ''}`); }))))));
  fill(panelHost, h('section', { class: 'cmp-panel', 'aria-labelledby': 'cmp-title' },
    h('div', { class: 'cmp-head' }, h('h2', { id: 'cmp-title' }, T('js.cmp.title')),
      h('div', { class: 'tool-actions' },
        h('label', { class: 'check', for: 'diff' }, diffCb, T('js.onlyDiff')),
        h('button', { class: 'btn sm', type: 'button', onclick: () => { store.saveComparison({ name: T('js.fav.cmpName', { d: new Date().toLocaleDateString(data.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB') }), slugs: state.sel }); toast(T('js.cmp.saved')); } }, T('js.cmp.save')),
        h('button', { class: 'btn sm', type: 'button', onclick: async () => { toast((await copyText(location.href)) ? T('js.copied') : T('js.err.generic')); } }, T('js.cmp.share')),
        h('button', { class: 'btn sm', type: 'button', onclick: () => window.print() }, T('js.cmp.print')),
        h('button', { class: 'btn sm', type: 'button', onclick: () => { state.show = false; update(); } }, T('js.cmp.close')))),
    table, h('p', { class: 'count', style: 'margin:10px 0 0;font-size:.85rem' }, '★ = ' + T('js.best'))));
}

function update() {
  sortSel.value = state.sort;
  setUrl(serializeCompare(state, defaults));
  renderResults(); renderTray(); renderPanel();
}
sortSel.addEventListener('change', () => { state.sort = sortSel.value; update(); });
buildFilters(); update();
