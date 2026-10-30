import { escapeHtml as esc } from '../lib/format.mjs';
import { icon } from '../lib/icons.mjs';
import { dirOf, otherLang } from '../i18n.mjs';

export const jsonForScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const themeInit = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: light)').matches)document.documentElement.dataset.theme='light'}catch(e){}`;

export const brandMark = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent2)"/></linearGradient></defs><rect x="22.500" y="15" width="3" height="26" rx="1.500" fill="url(#bg1)"/><path d="M14 43h20" stroke="url(#bg1)" stroke-width="3" stroke-linecap="round"/><g class="bm-beam"><rect x="6" y="13.500" width="36" height="3" rx="1.500" fill="url(#bg1)"/><path d="M9 16.500 4 28h10zM39 16.500 34 28h10z" fill="none" stroke="url(#bg1)" stroke-width="2" stroke-linejoin="round"/></g></svg>`;

/** يبني رابط داخلي */
export const makeUrl = (cfg) => (lang, path = '') => `${cfg.basePath}/${lang}/${path}`;

export function layout(ctx, page) {
  const { lang, t, cfg, urlFor, hasDemo, route } = ctx;
  const dir = dirOf(lang);
  const siteName = cfg.siteName[lang];
  const title = page.home ? `${siteName} | ${t('tagline')}` : `${page.title} | ${siteName}`;
  const canonical = `${cfg.siteUrl}${urlFor(lang, route)}`;
  const alt = (l) => `${cfg.siteUrl}${urlFor(l, route)}`;
  const nav = [
    ['', 'nav.home'], ['compare/', 'nav.compare'], ['decide/', 'nav.decide'], ['tools/', 'nav.tools'], ['blog/', 'nav.blog'],
  ];
  const isCur = (p) => (p === '' ? route === '' : route.startsWith(p));
  const asset = (p) => `${cfg.basePath}/assets/${p}`;
  const robots = page.noindex ? '<meta name="robots" content="noindex,follow">' : '';
  const scripts = (page.scripts || []).map((s) => `<script type="module" src="${asset('client/' + s)}"></script>`).join('\n');
  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description || t('meta.home'))}">
${robots}
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="ar" href="${esc(alt('ar'))}">
<link rel="alternate" hreflang="en" href="${esc(alt('en'))}">
<link rel="alternate" hreflang="x-default" href="${esc(alt('ar'))}">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description || t('meta.home'))}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_EG' : 'en_US'}">
<meta property="og:site_name" content="${esc(siteName)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#060b1c">
<link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${asset('main.css')}">
<script>${themeInit}</script>
${(page.jsonld || []).map((j) => `<script type="application/ld+json">${jsonForScript(j)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">${esc(t('skip'))}</a>
<div id="progress" aria-hidden="true"></div>
${hasDemo ? `<div class="demo-banner" role="note">${esc(t('demo.banner'))}</div>` : ''}
<header class="site-header">
  <div class="wrap hdr">
    <a class="brand" href="${urlFor(lang, '')}" aria-label="${esc(siteName)}">${brandMark}<span>${esc(siteName)}</span></a>
    <nav id="nav" class="nav" aria-label="${esc(t('nav.menu'))}">
      ${nav.map(([p, k]) => `<a class="link" href="${urlFor(lang, p)}"${isCur(p) ? ' aria-current="page"' : ''}>${esc(t(k))}</a>`).join('')}
      <a class="link" href="${urlFor(lang, 'favorites/')}"${route === 'favorites/' ? ' aria-current="page"' : ''}>${esc(t('nav.favorites'))}<span class="fav-count" id="fav-count" hidden>0</span></a>
    </nav>
    <div class="hdr-tools">
      <a class="icon-btn" href="${urlFor(otherLang(lang), route)}" hreflang="${otherLang(lang)}" lang="${otherLang(lang)}">${esc(t('nav.lang'))}</a>
      <button class="icon-btn" id="theme-btn" type="button" aria-label="${esc(t('nav.theme'))}" aria-pressed="false">${icon('sun')}</button>
    </div>
    <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="${esc(t('nav.menu'))}">${icon('menu')}</button>
  </div>
</header>
<main id="main">
${page.body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="f-grid">
      <div><a class="brand" href="${urlFor(lang, '')}">${brandMark}<span>${esc(siteName)}</span></a><p style="margin-top:10px">${esc(t('tagline'))}</p></div>
      <div><h4>${esc(t('footer.explore'))}</h4><ul>
        <li><a href="${urlFor(lang, 'compare/')}">${esc(t('nav.compare'))}</a></li><li><a href="${urlFor(lang, 'decide/')}">${esc(t('nav.decide'))}</a></li>
        <li><a href="${urlFor(lang, 'tools/')}">${esc(t('nav.tools'))}</a></li><li><a href="${urlFor(lang, 'blog/')}">${esc(t('nav.blog'))}</a></li></ul></div>
      <div><h4>${esc(t('footer.trust'))}</h4><ul>
        <li><a href="${urlFor(lang, 'about/')}">${esc(t('about.title'))}</a></li><li><a href="${urlFor(lang, 'methodology/')}">${esc(t('methodology.title'))}</a></li>
        <li><a href="${urlFor(lang, 'privacy/')}">${esc(t('privacy.title'))}</a></li><li><a href="${urlFor(lang, 'terms/')}">${esc(t('terms.title'))}</a></li>
        <li><a href="${urlFor(lang, 'contact/')}">${esc(t('contact.title'))}</a></li></ul></div>
    </div>
    <div class="f-note">${esc(t('footer.note'))}<br>© <span id="yr">${new Date().getFullYear()}</span> ${esc(siteName)}. ${esc(t('footer.rights'))}.</div>
  </div>
</footer>
${page.data ? `<script type="application/json" id="site-data">${jsonForScript(page.data)}</script>` : ''}
<script type="module" src="${asset('client/app.js')}"></script>
${scripts}
</body>
</html>`;
}

export const crumbs = (ctx, items) => {
  const { lang, urlFor, t } = ctx;
  const all = [[t('nav.home'), urlFor(lang, '')], ...items];
  return `<nav class="crumbs" aria-label="breadcrumb">${all.map(([l, h], i) => (h && i < all.length - 1 ? `<a href="${h}">${esc(l)}</a>` : `<span aria-current="page">${esc(l)}</span>`)).join('<span aria-hidden="true">/</span>')}</nav>`;
};
export const crumbsLd = (ctx, items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [[ctx.t('nav.home'), ctx.urlFor(ctx.lang, '')], ...items].map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(href ? { item: ctx.cfg.siteUrl + href } : {}) })),
});
