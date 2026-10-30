import { fill, data, h, $, T, L, setUrl, seg, freshBadge, productUrl, favButton, copyText, toast } from './core.mjs';
import { rank, defaultWeights, cheaperAlternatives, lowestOffer } from '../lib/compare.mjs';
import { parseDecide, serializeDecide } from '../lib/urlstate.mjs';
import { money } from '../lib/format.mjs';

const cats = data.categories, products = data.products;
const state = parseDecide(location.search, cats, defaultWeights);
const cat = () => cats.find((c) => c.id === state.cat);
const root = $('#decide-root');
const left = h('div', { class: 'panel' });
const right = h('div', { 'aria-live': 'polite' });
root.append(h('div', { class: 'decide' }, left, right));

function buildLeft() {
  const c = cat();
  const budgetInput = h('input', { type: 'number', id: 'd-budget', min: '0', inputmode: 'numeric', value: state.budget ?? '', placeholder: T('js.decide.budgetHint'), oninput: () => { state.budget = budgetInput.value === '' ? undefined : Number(budgetInput.value); update(); } });
  const catSeg = seg(cats.map((x) => ({ value: x.id, label: L(x.name) })), state.cat, (v) => { state.cat = v; state.weights = defaultWeights(cat()); buildLeft(); update(); }, T('js.category'));
  const crit = [{ key: 'price', label: T('js.decide.price') }, ...c.specs.filter((s) => s.better && s.priority).map((s) => ({ key: s.key, label: L(s.label) }))];
  fill(left, 
    h('div', { class: 'field' }, h('label', {}, T('js.category')), catSeg.el),
    h('div', { class: 'field' }, h('label', { for: 'd-budget' }, T('js.decide.budget')), budgetInput),
    h('h2', { style: 'font-size:1.05rem;margin-top:20px' }, T('js.decide.priorities')),
    h('p', { class: 'count', style: 'font-size:.82rem;margin-bottom:12px' }, T('js.decide.prioritiesHint')),
    crit.map((k) => {
      const out = h('span', { class: 'val' }, String(state.weights[k.key] ?? 0));
      const inp = h('input', { type: 'range', min: '0', max: '5', step: '1', id: 'w-' + k.key, value: String(state.weights[k.key] ?? 0), 'aria-label': k.label, oninput: () => { state.weights[k.key] = Number(inp.value); out.textContent = inp.value; update(); } });
      return h('div', { class: 'prio' }, h('div', { class: 'lab' }, h('label', { for: 'w-' + k.key, style: 'margin:0' }, k.label), out), inp);
    }),
    h('button', { class: 'btn sm', type: 'button', onclick: async () => { toast((await copyText(location.href)) ? T('js.copied') : T('js.err.generic')); } }, T('js.cmp.share')));
}

function labelOf(c, key) { return key === 'price' ? T('js.decide.price') : L(c.specs.find((s) => s.key === key).label); }

function renderResults() {
  const c = cat();
  const pool = products.filter((p) => p.category === state.cat);
  const { items, excluded, criteriaCount } = rank(pool, c, { weights: state.weights, budget: state.budget });
  const out = [h('h2', { style: 'font-size:1.3rem' }, T('js.decide.results'))];
  if (excluded) out.push(h('div', { class: 'msg info' }, T('js.decide.excluded', { n: excluded })));
  if (!criteriaCount) { out.push(h('div', { class: 'msg info' }, T('js.decide.noWeights'))); fill(right, ...out); return; }
  if (!items.length) { out.push(h('div', { class: 'empty' }, h('h3', {}, T('js.decide.none')), h('p', {}, T('js.decide.noneHint')))); fill(right, ...out); return; }
  items.slice(0, 5).forEach((it, i) => {
    const p = it.product, off = lowestOffer(p);
    const top = it.parts.filter((x) => x.key !== 'price' && x.norm >= 0.5).sort((a, b) => b.contribution - a.contribution).slice(0, 2).map((x) => labelOf(c, x.key));
    const why = [top.length ? T('js.decide.whyTop', { list: top.join(data.lang === 'ar' ? '، ' : ', ') }) : null, state.budget ? T('js.decide.whyPrice', { p: money(it.price) }) : null].filter(Boolean).join('. ');
    const alt = i === 0 ? cheaperAlternatives(p, pool, c, { weights: state.weights, minScoreRatio: 0.85, limit: 1 })[0] : null;
    out.push(h('article', { class: 'rank-item', style: `--i:${i}` },
      h('div', { class: 'rank-no', 'aria-label': T('js.decide.rank') + ' ' + (i + 1) }, String(i + 1)),
      h('div', {},
        h('h3', {}, h('a', { href: productUrl(p.slug) }, L(p.name)), ' ', p.demo ? h('span', { class: 'badge demo' }, T('js.demoTag')) : null),
        h('div', { class: 'brand-line', style: 'color:var(--faint);font-size:.85rem' }, L(p.brand), ' · ', money(it.price), ' ', T('js.currency'), ' ', off ? freshBadge(off) : null),
        why ? h('p', { class: 'why' }, h('b', {}, T('js.decide.why') + ' '), why) : null,
        h('div', { class: 'bars' }, it.parts.filter((x) => x.weight > 0).map((x) => h('div', { class: 'bar' }, h('span', {}, labelOf(c, x.key)), h('div', { class: 'track' }, h('div', { class: 'fill', style: `--w:${Math.round(x.norm * 100)}%` })), h('span', { class: 'num' }, Math.round(x.norm * 100) + '%')))),
        alt ? h('div', { class: 'alt' }, h('b', {}, T('js.decide.cheaper') + ': '), h('a', { href: productUrl(alt.product.slug) }, L(alt.product.name)), ' — ', T('js.decide.cheaperSave', { n: money(alt.saving) }),
          alt.tradeoffs.length ? h('div', {}, T('js.decide.trade') + ': ', alt.tradeoffs.map((t) => `${labelOf(c, t.key)} (${t.mine} → ${t.alt})`).join(data.lang === 'ar' ? '، ' : ', ')) : null) : null),
      h('div', { class: 'score' }, h('b', {}, String(Math.round(it.score))), h('span', {}, T('js.decide.score')), h('div', { style: 'margin-top:8px' }, favButton(p.slug, L(p.name))))));
  });
  out.push(h('p', { class: 'count', style: 'font-size:.85rem' }, T('js.decide.note') + ' ', h('a', { href: `${data.base}/${data.lang}/methodology/#scoring` }, T('js.decide.how'))));
  fill(right, ...out);
}

function update() { setUrl(serializeDecide(state, cats[0].id, defaultWeights(cat()))); renderResults(); }
buildLeft(); update();
