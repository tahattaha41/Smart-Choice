import { fill, h, T, setUrl, data } from './core.mjs';
import { discount, vat } from '../lib/finance.mjs';
import { readNumbers, writeNumbers } from '../lib/urlstate.mjs';
import { numField, kpi, actions, money, root } from './tool-common.mjs';

const v = readNumbers(location.search, ['p', 'x', 'a', 'r', 'k']);
const s = { p: v.p, x: v.x, a: v.a, r: v.r ?? data.vatRate, k: v.k === 1 ? 1 : 0 };
const dOut = h('div', { class: 'kpis', 'aria-live': 'polite' }), vOut = h('div', { class: 'kpis', 'aria-live': 'polite' });
const modeBtns = h('div', { class: 'seg', role: 'group' });
const drawMode = () => fill(modeBtns, 
  h('button', { type: 'button', 'aria-pressed': String(s.k === 0), onclick: () => { s.k = 0; drawMode(); run(); } }, T('js.vat.add')),
  h('button', { type: 'button', 'aria-pressed': String(s.k === 1), onclick: () => { s.k = 1; drawMode(); run(); } }, T('js.vat.remove')));
drawMode();
root().append(h('div', { class: 'calc' },
  h('div', { class: 'panel' }, h('h2', { style: 'font-size:1.15rem' }, T('js.vat.discountTitle')),
    numField('v-p', T('js.vat.price'), s.p, (x) => { s.p = x; run(); }).el, numField('v-x', T('js.vat.pct'), s.x, (x) => { s.x = x; run(); }, { max: '100' }).el, dOut),
  h('div', { class: 'panel' }, h('h2', { style: 'font-size:1.15rem' }, T('js.vat.vatTitle')),
    numField('v-a', T('js.vat.amount'), s.a, (x) => { s.a = x; run(); }).el, numField('v-r', T('js.vat.rate'), s.r, (x) => { s.r = x; run(); }, { max: '100' }).el,
    h('div', { class: 'field' }, modeBtns), vOut)), actions(() => s));

function run() {
  setUrl(writeNumbers(s));
  const d = discount({ price: s.p, pct: s.x ?? 0 });
  fill(dOut, ...(s.p !== undefined && d.valid ? [kpi(T('js.vat.saving'), `${money(d.saving)} ${T('js.currency')}`), kpi(T('js.vat.final'), `${money(d.final)} ${T('js.currency')}`, 'big')] : []));
  const t = vat({ amount: s.a, rate: s.r ?? 0, mode: s.k ? 'remove' : 'add' });
  fill(vOut, ...(s.a !== undefined && t.valid ? [kpi(T('js.vat.net'), `${money(t.net)} ${T('js.currency')}`), kpi(T('js.vat.tax'), `${money(t.vat)} ${T('js.currency')}`), kpi(T('js.vat.gross'), `${money(t.gross)} ${T('js.currency')}`, 'big')] : []));
}
run();
