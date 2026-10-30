import { fill, data, h, $, T, L, store, productUrl } from './core.mjs';
import { productCard } from './product-card.mjs';

const root = $('#fav-root');
const bySlug = new Map(data.products.map((p) => [p.slug, p]));
const catOf = (p) => data.categories.find((c) => c.id === p.category);

function render() {
  const favs = store.favorites().map((s) => bySlug.get(s)).filter(Boolean);
  const cmps = store.comparisons();
  fill(root, 
    h('h2', {}, T('js.fav.products')),
    favs.length ? h('div', { class: 'grid g-products' }, favs.map((p, i) => productCard(p, catOf(p), { index: i })))
      : h('div', { class: 'empty' }, h('h3', {}, T('js.fav.empty')), h('p', {}, T('js.fav.emptyHint')), h('a', { class: 'btn primary', href: `${data.base}/${data.lang}/compare/` }, T('js.compare'))),
    h('h2', { style: 'margin-top:36px' }, T('js.fav.comparisons')),
    cmps.length ? h('div', { class: 'grid g-4' }, cmps.map((c) => {
      const ps = c.slugs.map((s) => bySlug.get(s)).filter(Boolean);
      if (ps.length < 2) return null;
      const href = `${data.base}/${data.lang}/compare/?c=${ps[0].category}&cmp=${ps.map((p) => p.slug).join(',')}&show=1`;
      return h('div', { class: 'card' }, h('h3', {}, c.name), h('p', {}, ps.map((p) => L(p.name)).join(' · ')),
        h('div', { class: 'tool-actions' }, h('a', { class: 'btn sm primary', href }, T('js.fav.open')), h('button', { class: 'btn sm', type: 'button', onclick: () => store.deleteComparison(c.id) }, T('js.fav.delete'))));
    }).filter(Boolean)) : h('p', { class: 'count' }, T('js.fav.noCmp')));
}
store.subscribe(render); render();
