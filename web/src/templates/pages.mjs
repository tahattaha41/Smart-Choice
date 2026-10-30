import { escapeHtml as esc, money } from '../lib/format.mjs';
import { icon } from '../lib/icons.mjs';
import { jsDict } from '../i18n.mjs';
import { lowestOffer, cheaperAlternatives, defaultWeights } from '../lib/compare.mjs';
import { freshness } from '../lib/freshness.mjs';
import { crumbs, crumbsLd } from './layout.mjs';
import * as C from './content.mjs';

const L = (o, lang) => o[lang] ?? o.ar;
const TOOLS = [
  { id: 'installment', icon: 'calc', script: 'tool-installment.js' },
  { id: 'vat', icon: 'percent', script: 'tool-vat.js' },
  { id: 'ownership', icon: 'scale', script: 'tool-ownership.js' },
];
const CAT_ICON = { phones: 'phone', laptops: 'laptop' };
const NOSCRIPT = { ar: 'هذه الصفحة تحتاج تفعيل JavaScript لتعمل الأدوات التفاعلية.', en: 'This page needs JavaScript enabled for the interactive tools to work.' };

const head = (ctx, { title, lead, trail = [] }) => `<section class="page-head"><div class="wrap">${crumbs(ctx, trail)}<h1>${esc(title)}</h1>${lead ? `<p>${esc(lead)}</p>` : ''}</div></section>`;
const clientData = (ctx) => ({ lang: ctx.lang, base: ctx.cfg.basePath, i18n: jsDict(ctx.lang), products: ctx.products, categories: ctx.categories, staleAfterDays: ctx.cfg.staleAfterDays, vatRate: ctx.cfg.vatRate });
const fill = (html, ctx) => html.replaceAll('{{methodology}}', ctx.urlFor(ctx.lang, 'methodology/'));

const heroArt = (ctx) => `<svg class="scale-art" viewBox="0 0 400 340" role="img" aria-label="${esc(ctx.t('hero.pill'))}">
<defs><linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent2)"/></linearGradient></defs>
<ellipse cx="200" cy="322" rx="92" ry="11" fill="rgba(0,0,0,.35)"/><path d="M146 318q54-30 108 0z" fill="url(#hg1)"/>
<rect x="192" y="84" width="16" height="226" rx="8" fill="url(#hg1)"/>
<g class="beam-big"><rect x="52" y="66" width="296" height="10" rx="5" fill="url(#hg1)"/>
 <g class="pan-l"><path d="M60 76 20 192M60 76l40 116" stroke="var(--muted)" stroke-width="2" fill="none"/><path d="M6 192q54 52 108 0z" fill="url(#hg1)"/>
  <rect x="44" y="136" width="32" height="54" rx="7" style="fill:var(--surface);stroke:var(--accent)" stroke-width="3"/><path d="M54 180h12" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/></g>
 <g class="pan-r"><path d="M340 76 300 192M340 76l40 116" stroke="var(--muted)" stroke-width="2" fill="none"/><path d="M286 192q54 52 108 0z" fill="url(#hg1)"/>
  <rect x="308" y="150" width="64" height="38" rx="5" style="fill:var(--surface);stroke:var(--accent2)" stroke-width="3"/><path d="M300 190h80" stroke="var(--accent2)" stroke-width="4" stroke-linecap="round"/></g></g>
<circle cx="200" cy="71" r="14" style="fill:var(--surface2);stroke:var(--accent)" stroke-width="4"/></svg>`;

function offerFresh(ctx, offer) {
  const f = freshness(offer, new Date(), ctx.cfg.staleAfterDays);
  const text = f.state === 'fresh' || f.state === 'stale' ? ctx.t('fresh.' + f.state, { n: f.days }) : ctx.t('fresh.' + f.state);
  return `<span class="badge ${f.state}">${esc(text)}</span>`;
}

function postCards(ctx, posts) {
  return posts.map((p) => `<a class="card blog-card reveal" href="${esc(p.url)}"><div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" decoding="async">` : ''}</div><div class="body"><time datetime="${esc(p.published)}">${esc(p.published.slice(0, 10))}</time><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="more">${esc(ctx.t('blog.read'))}</span></div></a>`).join('');
}
const blogEmpty = (ctx, title, p) => `<div class="empty"><h3>${esc(title)}</h3><p>${esc(p)}</p>${ctx.lang === 'en' ? `<a class="btn primary" href="${ctx.urlFor('ar', 'blog/')}" hreflang="ar">العربية</a>` : ''}</div>`;

export function buildRoutes(ctx) {
  const { t, lang, cfg, urlFor, categories, products, posts } = ctx;
  const routes = [];
  const add = (route, render, meta = {}) => routes.push({ route, render, ...meta });

  /* ---------- الرئيسية ---------- */
  add('', () => {
    const catCards = categories.map((c) => {
      const n = products.filter((p) => p.category === c.id).length;
      return `<a class="card reveal" href="${urlFor(lang, 'compare/')}?c=${c.id}"><div class="ico">${icon(CAT_ICON[c.id] || 'scale')}</div><h3>${esc(L(c.name, lang))}</h3><p>${esc(t('home.cats.count', { n }))}</p><span class="more">${esc(t('home.cats.open'))}</span></a>`;
    }).join('');
    const toolCards = TOOLS.map((x) => `<a class="card reveal" href="${urlFor(lang, `tools/${x.id}/`)}"><div class="ico">${icon(x.icon)}</div><h3>${esc(t(`tool.${x.id}.name`))}</h3><p>${esc(t(`tool.${x.id}.desc`))}</p><span class="more">${esc(t('tools.open'))}</span></a>`).join('');
    const steps = [1, 2, 3, 4].map((i) => `<div class="step reveal"><h3>${esc(t(`home.how.${i}.t`))}</h3><p>${esc(t(`home.how.${i}.p`))}</p></div>`).join('');
    const promises = [1, 2, 3, 4].map((i) => `<div class="promise reveal"><i>✓</i><div><b>${esc(t(`home.promise.${i}.t`))}</b><span>${esc(t(`home.promise.${i}.p`, { n: cfg.staleAfterDays }))}</span></div></div>`).join('');
    const marq = [...categories.map((c) => L(c.name, lang)), ...TOOLS.map((x) => t(`tool.${x.id}.name`)), t('hero.chip1'), t('hero.chip2'), t('hero.chip3')].map((s) => `<span><em>◆</em> ${esc(s)}</span>`).join('');
    const blog = posts.length ? `<div class="grid g-cats">${postCards(ctx, posts.slice(0, 3))}</div>` : blogEmpty(ctx, t('blog.emptyTitle'), t('home.blog.empty'));
    return {
      home: true, title: t('tagline'), description: t('meta.home'),
      jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.siteName[lang], url: cfg.siteUrl + urlFor(lang, ''), inLanguage: lang }],
      body: `<section class="hero"><div class="aurora"><i></i><i></i><i></i></div><div class="grid-bg"></div><div class="wrap hero-in">
<div><span class="pill"><b></b>${esc(t('hero.pill'))}</span>
<h1>${esc(t('hero.title1'))}<span class="rot" aria-live="off"><span>${esc(t('hero.rot1'))}</span><span>${esc(t('hero.rot2'))}</span><span>${esc(t('hero.rot3'))}</span><span>${esc(t('hero.rot4'))}</span></span></h1>
<p class="lead">${esc(t('hero.lead'))}</p>
<div class="cta-row"><a class="btn primary" href="${urlFor(lang, 'compare/')}">${esc(t('hero.cta.compare'))}</a><a class="btn" href="${urlFor(lang, 'decide/')}">${esc(t('hero.cta.decide'))}</a></div>
<form class="hero-search" action="${urlFor(lang, 'compare/')}" method="get" role="search"><label class="sr-only" for="hq">${esc(t('hero.search'))}</label><input id="hq" type="search" name="q" placeholder="${esc(t('hero.search'))}"><button class="btn primary sm" type="submit">${esc(t('hero.searchBtn'))}</button></form></div>
<div class="hero-art">${heroArt(ctx)}<span class="chip c1">${esc(t('hero.chip1'))}</span><span class="chip c2">${esc(t('hero.chip2'))}</span><span class="chip c3">${esc(t('hero.chip3'))}</span></div></div></section>
<div class="marquee" aria-hidden="true"><div>${marq}${marq}</div></div>
<section class="section"><div class="wrap"><div class="sec-head reveal"><h2>${esc(t('home.cats.title'))}</h2><p>${esc(t('home.cats.sub'))}</p></div><div class="grid g-cats">${catCards}</div></div></section>
<section class="section"><div class="wrap"><div class="sec-head reveal"><h2>${esc(t('home.tools.title'))}</h2><p>${esc(t('home.tools.sub'))}</p></div><div class="grid g-tools">${toolCards}</div></div></section>
<section class="section"><div class="wrap"><div class="sec-head reveal"><h2>${esc(t('home.how.title'))}</h2><p>${esc(t('home.how.sub'))}</p></div><div class="grid g-4 steps">${steps}</div></div></section>
<section class="section"><div class="wrap"><div class="sec-head reveal"><h2>${esc(t('home.promise.title'))}</h2></div><div class="grid g-4">${promises}</div></div></section>
<section class="section"><div class="wrap"><div class="sec-head reveal"><h2>${esc(t('home.blog.title'))}</h2><p>${esc(t('home.blog.sub'))}</p></div>${blog}${posts.length ? `<p style="margin-top:20px"><a class="btn" href="${urlFor(lang, 'blog/')}">${esc(t('home.blog.all'))}</a></p>` : ''}</div></section>`,
    };
  });

  /* ---------- المقارنة ---------- */
  add('compare/', () => ({
    title: t('compare.title'), description: t('compare.meta'), scripts: ['compare-page.js'], data: clientData(ctx),
    jsonld: [crumbsLd(ctx, [[t('compare.title')]])],
    body: `${head(ctx, { title: t('compare.title'), lead: t('compare.lead', { n: 4 }), trail: [[t('compare.title')]] })}<div class="wrap"><div id="explorer-root"></div><noscript><p class="msg err">${NOSCRIPT[lang]}</p></noscript></div>`,
  }));

  /* ---------- مركز القرار ---------- */
  add('decide/', () => ({
    title: t('decide.title'), description: t('decide.meta'), scripts: ['decide-page.js'], data: clientData(ctx),
    jsonld: [crumbsLd(ctx, [[t('decide.title')]])],
    body: `${head(ctx, { title: t('decide.title'), lead: t('decide.lead'), trail: [[t('decide.title')]] })}<div class="wrap" style="padding-bottom:60px"><div id="decide-root"></div><noscript><p class="msg err">${NOSCRIPT[lang]}</p></noscript></div>`,
  }));

  /* ---------- الأدوات ---------- */
  add('tools/', () => ({
    title: t('tools.title'), description: t('tools.lead'), jsonld: [crumbsLd(ctx, [[t('tools.title')]])],
    body: `${head(ctx, { title: t('tools.title'), lead: t('tools.lead'), trail: [[t('tools.title')]] })}<div class="wrap" style="padding-bottom:50px"><div class="grid g-tools">${TOOLS.map((x) => `<a class="card reveal" href="${urlFor(lang, `tools/${x.id}/`)}"><div class="ico">${icon(x.icon)}</div><h3>${esc(t(`tool.${x.id}.name`))}</h3><p>${esc(t(`tool.${x.id}.desc`))}</p><span class="more">${esc(t('tools.open'))}</span></a>`).join('')}</div></div>`,
  }));
  for (const x of TOOLS) {
    add(`tools/${x.id}/`, () => {
      const name = t(`tool.${x.id}.name`), trail = [[t('tools.title'), urlFor(lang, 'tools/')], [name]];
      return {
        title: name, description: t(`tool.${x.id}.desc`), scripts: [x.script], data: clientData(ctx),
        jsonld: [crumbsLd(ctx, trail), { '@context': 'https://schema.org', '@type': 'WebApplication', name, description: t(`tool.${x.id}.desc`), applicationCategory: 'FinanceApplication', operatingSystem: 'Any', inLanguage: lang, offers: { '@type': 'Offer', price: '0', priceCurrency: cfg.currencyCode } }],
        body: `${head(ctx, { title: name, lead: t(`tool.${x.id}.desc`), trail })}<div class="wrap" style="padding-bottom:50px"><div id="tool-root"></div><noscript><p class="msg err">${NOSCRIPT[lang]}</p></noscript><div class="prose" style="margin-top:30px">${C.toolContent[x.id][lang]}<p><a href="${urlFor(lang, 'tools/')}">← ${esc(t('tool.back'))}</a></p></div></div>`,
      };
    });
  }

  /* ---------- المدونة ---------- */
  add('blog/', () => ({
    title: t('blog.title'), description: t('blog.meta'), jsonld: [crumbsLd(ctx, [[t('blog.title')]])],
    body: `${head(ctx, { title: t('blog.title'), lead: t('blog.lead'), trail: [[t('blog.title')]] })}<div class="wrap" style="padding-bottom:50px">${posts.length ? `<div class="grid g-cats">${postCards(ctx, posts)}</div>` : blogEmpty(ctx, t('blog.emptyTitle'), t('blog.emptyP'))}</div>`,
  }));


  /* ---------- صفحات المقالات ---------- */
  for (const a of posts) {
    add(`blog/${a.slug}/`, () => {
      const trail = [[t('blog.title'), urlFor(lang, 'blog/')], [a.title]];
      const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, datePublished: a.published, dateModified: a.updated || a.published, inLanguage: lang, author: { '@type': 'Organization', name: cfg.siteName[lang] }, publisher: { '@type': 'Organization', name: cfg.siteName[lang] }, mainEntityOfPage: `${cfg.siteUrl}${urlFor(lang, `blog/${a.slug}/`)}` };
      return {
        title: a.title, description: a.description, jsonld: [crumbsLd(ctx, trail), ld], type: 'article',
        body: `<section class="page-head"><div class="wrap">${crumbs(ctx, trail)}<h1>${esc(a.title)}</h1><p><time datetime="${esc(a.published)}">${esc(a.published)}</time></p></div></section><div class="wrap" style="padding-bottom:60px"><article class="prose">${a.html.replaceAll('{{base}}', urlFor(lang, '').replace(/\/$/, ''))}<p><a href="${urlFor(lang, 'blog/')}">← ${esc(t('blog.title'))}</a></p></article></div>`,
      };
    });
  }

  /* ---------- المفضلة ---------- */
  add('favorites/', () => ({
    title: t('fav.title'), description: t('fav.meta'), noindex: true, scripts: ['favorites-page.js'], data: clientData(ctx),
    body: `${head(ctx, { title: t('fav.title'), lead: t('fav.lead'), trail: [[t('fav.title')]] })}<div class="wrap" style="padding-bottom:60px"><div id="fav-root"></div><noscript><p class="msg err">${NOSCRIPT[lang]}</p></noscript></div>`,
  }), { sitemap: false });

  /* ---------- صفحات ثابتة ---------- */
  const statics = [['about/', 'about', C.about], ['methodology/', 'methodology', C.methodology], ['privacy/', 'privacy', C.privacy], ['terms/', 'terms', C.terms], ['contact/', 'contact', C.contact]];
  for (const [route, key, fn] of statics) {
    add(route, () => ({
      title: t(`${key}.title`), description: t(`${key}.meta`), jsonld: [crumbsLd(ctx, [[t(`${key}.title`)]])],
      body: `${head(ctx, { title: t(`${key}.title`), trail: [[t(`${key}.title`)]] })}<div class="wrap" style="padding-bottom:60px"><div class="prose">${fill(fn(cfg, lang), ctx)}</div></div>`,
    }));
  }

  /* ---------- صفحات المنتجات ---------- */
  for (const p of products) {
    add(`products/${p.slug}/`, () => {
      const cat = categories.find((c) => c.id === p.category);
      const name = L(p.name, lang), off = lowestOffer(p);
      const trail = [[t('compare.title'), urlFor(lang, 'compare/')], [L(cat.name, lang), `${urlFor(lang, 'compare/')}?c=${cat.id}`], [name]];
      const specRows = cat.specs.map((s) => `<tr><th scope="row">${esc(L(s.label, lang))}</th><td class="num">${esc(String(p.specs[s.key] ?? '—'))}${L(s.unit, lang) ? ' ' + esc(L(s.unit, lang)) : ''}</td></tr>`).join('');
      const offerRows = p.offers.map((o) => `<tr><td>${esc(L(o.store, lang))}</td><td class="num"><b>${money(o.price)}</b> ${esc(t('currency'))}</td><td>${o.inStock === false ? esc(t('product.stock.out')) : esc(t('product.stock.in'))}</td><td>${offerFresh(ctx, o)}</td><td>${o.source === 'demo' ? esc(t('product.source.demo')) : esc(String(o.source))}<br><small>${esc(t('product.verified'))}: ${esc(o.verifiedAt)}</small></td><td>${o.url && o.url !== '#' ? `<a class="btn sm" href="${esc(o.url)}" rel="sponsored nofollow noopener" target="_blank">${esc(t('product.buy'))}</a>` : ''}</td></tr>`).join('');
      const alts = cheaperAlternatives(p, products, cat, { weights: defaultWeights(cat) });
      const altHtml = alts.length ? `<ul>${alts.map((a) => `<li><a href="${urlFor(lang, `products/${a.product.slug}/`)}">${esc(L(a.product.name, lang))}</a> — ${money(a.price)} ${esc(t('currency'))} (${esc(t('product.saves', { n: money(a.saving) }))})${a.tradeoffs.length ? `<br><small>${esc(t('product.worse'))}: ${a.tradeoffs.map((x) => esc(`${L(cat.specs.find((s) => s.key === x.key).label, lang)} (${x.mine} → ${x.alt})`)).join(lang === 'ar' ? '، ' : ', ')}</small>` : ''}</li>`).join('')}</ul>` : `<p class="count">${esc(t('product.altNone'))}</p>`;
      const ld = p.demo ? [] : [{ '@context': 'https://schema.org', '@type': 'Product', name, brand: { '@type': 'Brand', name: L(p.brand, lang) }, offers: p.offers.map((o) => ({ '@type': 'Offer', price: o.price, priceCurrency: cfg.currencyCode, availability: o.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', url: o.url })) }];
      return {
        title: name, description: `${name} — ${L(cat.name, lang)}`, noindex: p.demo && !cfg.indexDemoData, jsonld: [crumbsLd(ctx, trail), ...ld], data: clientData(ctx),
        body: `<section class="page-head"><div class="wrap">${crumbs(ctx, trail)}<h1>${esc(name)} ${p.demo ? `<span class="badge demo">${esc(t('js.demoTag'))}</span>` : ''}</h1><p>${esc(L(p.brand, lang))}</p></div></section>
<div class="wrap" style="padding-bottom:60px"><div class="product-grid"><div>
<div class="panel" style="margin-bottom:20px"><h2 style="font-size:1.2rem">${esc(t('product.specs'))}</h2><table class="spec-table"><tbody>${specRows}</tbody></table></div>
<div class="panel" style="margin-bottom:20px"><h2 style="font-size:1.2rem">${esc(t('product.offers'))}</h2><div class="tbl-wrap"><table class="offers"><thead><tr><th>${esc(t('product.store'))}</th><th>${esc(t('product.price'))}</th><th></th><th></th><th>${esc(t('product.source'))}</th><th></th></tr></thead><tbody>${offerRows}</tbody></table></div></div>
<div class="panel"><h2 style="font-size:1.2rem">${esc(t('product.alt'))}</h2>${altHtml}</div></div>
<aside class="panel" style="position:sticky;top:90px">${off ? `<div class="count">${esc(t('price.from'))}</div><div class="big-price num">${money(off.price)} <small style="font-size:1rem">${esc(t('currency'))}</small></div>${offerFresh(ctx, off)}` : esc(t('price.na'))}
<div class="tool-actions" style="margin-top:16px"><a class="btn primary" href="${urlFor(lang, 'compare/')}?c=${cat.id}&amp;cmp=${p.slug}">${esc(t('product.addCompare'))}</a><span data-fav-slug="${p.slug}" data-fav-name="${esc(name)}"></span></div></aside></div></div>`,
      };
    }, { sitemap: !(p.demo && !cfg.indexDemoData) });
  }
  return routes;
}

export const notFoundPage = (ctx) => ({
  title: ctx.t('notfound.title'), noindex: true,
  body: `<section class="page-head"><div class="wrap"><h1>${esc(ctx.t('notfound.title'))}</h1><p>${esc(ctx.t('notfound.p'))}</p><p style="margin-top:20px"><a class="btn primary" href="${ctx.urlFor(ctx.lang, '')}">${esc(ctx.t('notfound.home'))}</a></p></div></section>`,
});
