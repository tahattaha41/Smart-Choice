import { h, L, T, productUrl, favButton, freshBadge } from './core.mjs';
import { lowestOffer } from '../lib/compare.mjs';
import { money } from '../lib/format.mjs';

/** بطاقة منتج. opts.onToggle لإظهار زر المقارنة */
export function productCard(p, category, { selected = false, onToggle, index = 0 } = {}) {
  const off = lowestOffer(p);
  const specs = category.specs.filter((s) => s.priority).slice(0, 4).map((s) => {
    const v = p.specs[s.key]; const u = L(s.unit);
    return h('span', {}, `${L(s.label)}: ${v}${u ? ' ' + u : ''}`);
  });
  const name = L(p.name);
  return h('article', { class: 'pcard' + (selected ? ' sel' : ''), style: `--i:${Math.min(index, 12)}`, 'data-slug': p.slug },
    h('div', { class: 'top' },
      h('div', {}, h('h3', {}, h('a', { href: productUrl(p.slug) }, name)), h('div', { class: 'brand-line' }, L(p.brand))),
      p.demo ? h('span', { class: 'badge demo' }, T('js.demoTag')) : null),
    h('div', { class: 'specs-mini' }, specs),
    off ? h('div', {}, h('div', { class: 'price' }, h('small', {}, T('js.from')), money(off.price), ' ', h('small', {}, T('js.currency'))), freshBadge(off)) : null,
    h('div', { class: 'actions' },
      onToggle ? h('button', { class: 'btn sm' + (selected ? ' primary' : ''), type: 'button', 'aria-pressed': String(selected), onclick: () => onToggle(p.slug) }, selected ? '✓ ' + T('js.selected') : '+ ' + T('js.compare')) : null,
      h('a', { class: 'btn sm', href: productUrl(p.slug) }, T('js.details')),
      favButton(p.slug, name)));
}
