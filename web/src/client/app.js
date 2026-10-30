import { data, $, $$, store, T } from './core.mjs';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');

/* theme */
const themeBtn = $('#theme-btn');
const applyTheme = (t) => { root.dataset.theme = t; try { localStorage.setItem('theme', t); } catch {} if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'light')); };
themeBtn?.addEventListener('click', () => applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light'));

/* mobile nav */
const nav = $('#nav'), menuBtn = $('#menu-btn');
menuBtn?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.classList.contains('open')) { nav.classList.remove('open'); menuBtn?.setAttribute('aria-expanded', 'false'); menuBtn?.focus(); } });

/* header shadow + progress */
const hdr = $('.site-header'), bar = $('#progress');
const onScroll = () => {
  const st = window.scrollY || root.scrollTop;
  hdr?.classList.toggle('scrolled', st > 8);
  if (bar) { const h = root.scrollHeight - root.clientHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, st / h) : 0})`; }
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* favorites counter in header */
const favCount = $('#fav-count');
const syncFav = () => { if (!favCount) return; const n = store.favorites().length; favCount.textContent = String(n); favCount.hidden = n === 0; };
store.subscribe(syncFav); syncFav();
addEventListener('storage', syncFav);

/* reveal on scroll */
const items = $$('.reveal');
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  items.forEach((el, i) => { el.style.setProperty('--d', (i % 4) * 0.08 + 's'); io.observe(el); });
} else items.forEach((el) => el.classList.add('in'));

/* pointer glow on cards + ripple on buttons */
if (matchMedia('(hover:hover)').matches && !reduce) {
  $$('a.card').forEach((c) => c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }));
}
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest?.('.btn'); if (!b || reduce) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
  const s = document.createElement('span'); s.className = 'ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.append(s); setTimeout(() => s.remove(), 650);
});

/* static favorite buttons (product pages) */
import('./core.mjs').then(({ favButton }) => {
  $$('[data-fav-slug]').forEach((host) => host.replaceWith(favButton(host.dataset.favSlug, host.dataset.favName || '')));
});
