import { fill, h, T, setUrl } from './core.mjs';
import { ownership, compareOwnership } from '../lib/finance.mjs';
import { readNumbers, writeNumbers } from '../lib/urlstate.mjs';
import { numField, kpi, actions, money, root } from './tool-common.mjs';

const v = readNumbers(location.search, ['ap', 'ay', 'ar', 'ae', 'bp', 'by', 'br', 'be']);
const s = { ap: v.ap, ay: v.ay ?? 3, ar: v.ar ?? 30, ae: v.ae, bp: v.bp, by: v.by ?? 3, br: v.br ?? 30, be: v.be };
const aOut = h('div', { class: 'kpis' }), bOut = h('div', { class: 'kpis' }), verdict = h('div', { 'aria-live': 'polite' });
const col = (k, title, out) => h('div', { class: 'panel' }, h('h2', { style: 'font-size:1.15rem' }, title),
  numField(k + '-p', T('js.own.price'), s[k + 'p'], (x) => { s[k + 'p'] = x; run(); }).el,
  numField(k + '-y', T('js.own.years'), s[k + 'y'], (x) => { s[k + 'y'] = x; run(); }, { min: '0.5', step: '0.5' }).el,
  numField(k + '-r', T('js.own.resale'), s[k + 'r'], (x) => { s[k + 'r'] = x; run(); }, { max: '100' }).el,
  numField(k + '-e', T('js.own.extra'), s[k + 'e'], (x) => { s[k + 'e'] = x; run(); }).el, out);
root().append(h('div', { class: 'calc' }, col('a', T('js.own.optA'), aOut), col('b', T('js.own.optB'), bOut)), verdict, actions(() => s));

const calc = (k) => ownership({ price: s[k + 'p'], years: s[k + 'y'], resalePct: s[k + 'r'], extra: s[k + 'e'] });
const show = (r, out) => fill(out, ...(r.valid ? [kpi(T('js.own.net'), `${money(r.net)} ${T('js.currency')}`), kpi(T('js.own.year'), `${money(r.perYear)} ${T('js.currency')}`), kpi(T('js.own.month'), `${money(r.perMonth)} ${T('js.currency')}`, 'big')] : []));
function run() {
  setUrl(writeNumbers(s));
  const a = calc('a'), b = calc('b'); show(a, aOut); show(b, bOut);
  const c = compareOwnership(a, b);
  fill(verdict, !c.valid ? h('div', { class: 'msg info' }, T('js.own.fill')) :
    h('div', { class: 'callout flash' }, h('b', {}, c.winner === 'a' ? T('js.own.winA', { n: money(c.diffPerMonth) }) : c.winner === 'b' ? T('js.own.winB', { n: money(c.diffPerMonth) }) : T('js.own.tie'))));
}
run();
