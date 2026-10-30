import { fill, h, T, setUrl, data } from './core.mjs';
import { installment } from '../lib/finance.mjs';
import { readNumbers, writeNumbers } from '../lib/urlstate.mjs';
import { numField, kpi, actions, errMsg, money, pct, root } from './tool-common.mjs';

const v = readNumbers(location.search, ['p', 'd', 'm', 'n', 'f']);
const s = { p: v.p, d: v.d, m: v.m, n: v.n ?? 12, f: v.f };
const out = h('div', { class: 'panel', 'aria-live': 'polite' });
const fields = [
  numField('i-p', T('js.calc.price'), s.p, (x) => { s.p = x; run(); }),
  numField('i-d', T('js.calc.down'), s.d, (x) => { s.d = x; run(); }),
  numField('i-m', T('js.calc.monthly'), s.m, (x) => { s.m = x; run(); }),
  numField('i-n', T('js.calc.months'), s.n, (x) => { s.n = x; run(); }, { step: '1', min: '1', max: '120' }),
  numField('i-f', T('js.calc.fee'), s.f, (x) => { s.f = x; run(); }),
];
root().append(h('div', { class: 'calc' }, h('div', { class: 'panel' }, fields.map((f) => f.el), actions(() => s)), out));

function run() {
  setUrl(writeNumbers(s));
  if (s.p === undefined && s.m === undefined) { fill(out, h('div', { class: 'msg info' }, T('js.err.required'))); return; }
  const r = installment({ price: s.p, down: s.d, monthly: s.m, months: s.n, fee: s.f });
  if (!r.valid) { fill(out, errMsg(r.reason)); return; }
  fill(out, h('div', { class: 'kpis flash' },
    kpi(T('js.inst.total'), `${money(r.total)} ${T('js.currency')}`),
    kpi(T('js.inst.extra'), `${money(r.extra)} ${T('js.currency')}`, r.extra > 0 ? 'bad' : ''),
    kpi(T('js.inst.extraPct'), pct(r.extraPct)),
    kpi(T('js.inst.monthlyRate'), pct(r.monthlyRate)),
    kpi(T('js.inst.apr'), pct(r.effectiveAnnual), 'big')),
    r.cheaperThanCash ? h('div', { class: 'msg info' }, T('js.inst.cheaper')) : null,
    h('p', { class: 'count', style: 'font-size:.82rem;margin:10px 0 0' }, T('js.inst.hint')));
}
run();
