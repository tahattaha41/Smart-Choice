// مولّد الموقع الثابت: بدون أي مكتبات خارجية. الاستخدام: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as cfg } from './src/config.mjs';
import { makeT } from './src/i18n.mjs';
import { layout, makeUrl } from './src/templates/layout.mjs';
import { buildRoutes, notFoundPage } from './src/templates/pages.mjs';
import { loadArticles } from './src/lib/articles.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const categories = read('src/data/categories.json');
const products = read('src/data/products.json');
const hasDemo = products.some((p) => p.demo);
const urlFor = makeUrl(cfg);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const articles = loadArticles(join(root, 'content/articles'));
console.log(`المقالات: ${articles.length}`);

const write = (rel, content) => { const f = join(dist, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); };
const sitemap = [];
let pages = 0;

for (const lang of cfg.locales) {
  const t = makeT(lang);
  const ctx = { lang, t, cfg, urlFor, hasDemo, categories, products, articles, posts: articles.filter((a) => a.lang === lang) };
  for (const r of buildRoutes(ctx)) {
    const page = r.render();
    write(`${lang}/${r.route}index.html`, layout({ ...ctx, route: r.route }, page));
    pages++;
    if (r.sitemap !== false && !page.noindex) sitemap.push(r.route);
  }
  write(`${lang}/404.html`, layout({ ...ctx, route: '404.html' }, notFoundPage(ctx)));
}

// الجذر: توجيه حسب لغة المتصفح (الافتراضي العربية)
const base = cfg.basePath;
write('index.html', `<!doctype html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${cfg.siteName.ar}</title>
<link rel="canonical" href="${cfg.siteUrl}${urlFor('ar', '')}"><meta http-equiv="refresh" content="0;url=${urlFor('ar', '')}">
<script>var l=(navigator.language||'ar').slice(0,2)==='en'?'en':'ar';location.replace('${base}/'+l+'/'+location.search+location.hash)</script></head>
<body><p><a href="${urlFor('ar', '')}">العربية</a> · <a href="${urlFor('en', '')}">English</a></p></body></html>`);
write('404.html', readFileSync(join(dist, 'ar/404.html'), 'utf8'));

// خريطة الموقع مع hreflang
const uniq = [...new Set(sitemap)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${cfg.locales.flatMap((l) => uniq.map((r) => `<url><loc>${cfg.siteUrl}${urlFor(l, r)}</loc>${cfg.locales.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${cfg.siteUrl}${urlFor(a, r)}"/>`).join('')}</url>`)).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${cfg.siteUrl}${base}/sitemap.xml\n`);
write('.nojekyll', '');

// الأصول: CSS + وحدات JS المشتركة (نفس ملفات الاختبار تعمل في المتصفح)
mkdirSync(join(dist, 'assets'), { recursive: true });
cpSync(join(root, 'src/styles/main.css'), join(dist, 'assets/main.css'));
cpSync(join(root, 'src/client'), join(dist, 'assets/client'), { recursive: true });
cpSync(join(root, 'src/lib'), join(dist, 'assets/lib'), { recursive: true });
writeFileSync(join(dist, 'assets/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2de2b3"/><stop offset="1" stop-color="#7a86ff"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="#060b1c"/><rect x="22.5" y="13" width="3" height="26" rx="1.5" fill="url(#g)"/><rect x="8" y="12" width="32" height="3" rx="1.5" fill="url(#g)"/><path d="M14 40h20" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/><path d="M11 15 6 26h10zM37 15l-5 11h10z" fill="none" stroke="url(#g)" stroke-width="2" stroke-linejoin="round"/></svg>`);

console.log(`تم بناء ${pages} صفحة + ${cfg.locales.length} صفحة 404 → ${dist}`);

// عوائق الإطلاق (لا توقف البناء، لكنها تُطبع بوضوح)
const blockers = [];
if (!cfg.contactEmail) blockers.push('بريد التواصل غير مضبوط (CONTACT_EMAIL) وهو مطلوب في صفحات الخصوصية والتواصل');
if (hasDemo) blockers.push('بيانات المنتجات تجريبية: استبدلها ببيانات حقيقية بمصادر معلنة قبل الإعلان العام');
if (blockers.length) console.log('\nعوائق الإطلاق:\n' + blockers.map((b) => ' - ' + b).join('\n'));
