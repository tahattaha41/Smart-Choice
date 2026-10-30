// أدوات مشتركة للمتصفح
import { interpolate } from '../lib/format.mjs';
import { freshness } from '../lib/freshness.mjs';
import { createStore, browserStorage } from './store.mjs';

const el = document.getElementById('site-data');
export const data = el ? JSON.parse(el.textContent) : { lang: 'ar', i18n: {}, products: [], categories: [], base: '', staleAfterDays: 30 };
export const lang = data.lang;
export const T = (k, p) => interpolate(data.i18n[k] ?? k, p);
export const L = (o) => (o && (o[lang] ?? o.ar ?? o.en)) ?? '';
export const store = createStore(browserStorage());
export const productUrl = (slug) => `${data.base}/${lang}/products/${slug}/`;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/** إنشاء عناصر DOM بأمان (نصوص فقط، لا innerHTML) */
export function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v === null || v === undefined) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') e.innerHTML = v; // للأيقونات الثابتة فقط
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  for (const k of kids.flat(Infinity)) if (k !== null && k !== undefined && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
}

let toastEl, toastTimer;
/** استبدال محتوى عنصر مع تسطيح المصفوفات وتجاهل القيم الفارغة */
export function fill(el, ...kids) {
  el.replaceChildren(...kids.flat(Infinity).filter((k) => k !== null && k !== undefined && k !== false).map((k) => (k.nodeType ? k : document.createTextNode(String(k)))));
}

export function toast(msg) {
  if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(toastEl); }
  toastEl.textContent = msg; toastEl.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

export function setUrl(qs) {
  const u = location.pathname + (qs ? '?' + qs : '') + location.hash;
  try { history.replaceState(null, '', u); } catch {}
}
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const t = h('textarea', { style: 'position:fixed;opacity:0' }); t.value = text; document.body.append(t); t.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); return ok;
  }
}

export function freshBadge(offer) {
  const f = freshness(offer, new Date(), data.staleAfterDays);
  const text = f.state === 'fresh' || f.state === 'stale' ? T('js.fresh.' + f.state, { n: f.days }) : T('js.fresh.' + f.state);
  return h('span', { class: 'badge ' + f.state }, text);
}

export const heartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.2C1.6 8 3.6 4.8 6.9 4.8c2 0 3.7 1.1 5.1 3 1.4-1.9 3.1-3 5.1-3 3.3 0 5.3 3.2 4.1 6.5-1.7 4.6-9.2 9.2-9.2 9.2z"/></svg>';

export function favButton(slug, name) {
  const btn = h('button', { class: 'heart', type: 'button', html: heartSvg });
  const sync = () => {
    const on = store.isFav(slug);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', (on ? T('js.fav.remove') : T('js.fav.add')) + ': ' + name);
    btn.title = on ? T('js.fav.remove') : T('js.fav.add');
  };
  btn.addEventListener('click', () => { const on = store.toggleFav(slug); toast(on ? T('js.fav.added') : T('js.fav.removed')); });
  store.subscribe(sync); sync();
  return btn;
}

export function seg(options, value, onChange, label) {
  const wrap = h('div', { class: 'seg', role: 'group', 'aria-label': label });
  const draw = (cur) => {
    fill(wrap, ...options.map((o) => h('button', { type: 'button', 'aria-pressed': String(o.value === cur), onclick: () => { onChange(o.value); draw(o.value); } }, o.label)));
  };
  draw(value);
  return { el: wrap, set: draw };
}
