import { h, T, setUrl, copyText, toast, $ } from './core.mjs';
import { writeNumbers } from '../lib/urlstate.mjs';

export const money = (n) => Math.round(n).toLocaleString('en-US');
export const pct = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 1 }) + '%';

/** حقل رقمي مسمّى */
export function numField(id, label, value, onInput, { step = 'any', min = '0', max } = {}) {
  const inp = h('input', { type: 'number', id, min, max, step, inputmode: 'decimal', value: value ?? '', oninput: () => onInput(inp.value === '' ? undefined : Number(inp.value)) });
  return { el: h('div', { class: 'field' }, h('label', { for: id }, label), inp), input: inp };
}

export function kpi(label, value, cls = '') { return h('div', { class: 'kpi ' + cls }, h('span', {}, label), h('strong', { class: 'num' }, value)); }

export function actions(getValues) {
  return h('div', { class: 'tool-actions no-print' },
    h('button', { class: 'btn sm', type: 'button', onclick: async () => { setUrl(writeNumbers(getValues())); toast((await copyText(location.href)) ? T('js.copied') : T('js.err.generic')); } }, T('js.cmp.share')),
    h('button', { class: 'btn sm', type: 'button', onclick: () => window.print() }, T('js.cmp.print')));
}

export function errMsg(reason) { return h('div', { class: 'msg err', role: 'alert' }, T('js.err.' + (['required', 'down', 'fee', 'number', 'negative'].includes(reason) ? reason : 'generic'))); }
export const root = () => $('#tool-root');
