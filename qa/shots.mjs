// لقطات شاشة للتصميم: node shots.mjs <outDir> [label]
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R = '/home/claude/smart-choice'; const out = process.argv[2] || '/tmp/claude-0/shots'; const label = process.argv[3] || 'cur';
fs.mkdirSync(out, { recursive: true });
const js = fs.readFileSync(R + '/assets/js/smart-choice.js', 'utf8');
const css = fs.readFileSync(R + '/assets/css/smart-choice.css', 'utf8').split('\n').filter(l => !l.startsWith('@import')).join('\n');
const body = f => fs.readFileSync(R + '/pages/' + f, 'utf8').split('---').slice(2).join('---');
const now = Math.floor(Date.now() / 1000);
const rates = { updated: now - 600, fetched: now - 60, egp: { USD: 53.45, EUR: 59.16, GBP: 70.78, SAR: 14.25, AED: 14.55, KWD: 174.2, QAR: 14.68 },
  gold: { source: 'xaus.com', updated: now - 100, fetched: now - 60, usd_oz: 4150, egp_gram: { 24: 7131, 21: 6240, 18: 5348 } }, silver: { source: 'xaus.com', updated: now - 100, fetched: now - 60, usd_oz: 52, egp_gram: { 999: 89.4, 925: 82.7 } },
  prev: { egp: { USD: 53.2, EUR: 59.4 }, gold: { 21: 6180 }, silver: { 999: 90 } } };
const titles = ['الأدوات الذكية', 'أسعار اليوم', 'مقارنة المنتجات', 'مركز القرار', 'من نحن', 'اتصل بنا', 'شروط الاستخدام وإخلاء المسؤولية'];
const toolUrls = JSON.parse(fs.readFileSync(R + '/assets/content/tool-urls.json', 'utf8'));
const shell = (main, home) => `<!doctype html><html lang="ar" dir="rtl"><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><style>${css}</style><body>
<header class="sc-head"><div class="sc-wrap sc-headin"><a class="sc-brand" href="/">Smart <span>Choice</span></a><nav class="sc-nav" aria-label="القائمة الرئيسية"><a href="/">الرئيسية</a><a href="/p/t.html">الأدوات</a><a href="/p/a.html">من نحن</a></nav></div></header>
<main id="main-content" class="sc-wrap sc-main">${main}</main>
<footer class="sc-footer"><div class="sc-wrap"><strong>Smart Choice</strong><div>أدوات عملية لقرارات يومية أفضل.</div><div class="sc-footlinks"><a href="/p/a.html">من نحن</a></div><small>© Smart Choice</small></div></footer></body></html>`;
const b = await chromium.launch();
const jobs = [['home', '', true], ['tools', body('tools.md')], ['tool-taxeg', body('tool-taxeg.md')], ['rates', body('rates.md')]];
for (const w of [1280, 390]) for (const [name, main, home] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: process.env.TOP ? 1500 : 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('https://raw.githubusercontent.com/**', r => { const u = r.request().url(); if (u.includes('rates.json')) return r.fulfill({ json: rates, headers: { 'access-control-allow-origin': '*' } }); if (u.includes('tool-urls')) return r.fulfill({ json: toolUrls, headers: { 'access-control-allow-origin': '*' } }); return r.fulfill({ status: 404, body: '' }); });
  await p.route('https://x.test/**', r => { const u = r.request().url();
    if (u.includes('/feeds/pages')) return r.fulfill({ json: { feed: { entry: titles.map((t, i) => ({ title: { $t: t + ' | Smart Choice' }, link: [{ rel: 'alternate', href: 'https://x.test/p/p' + i + '.html' }] })) } } });
    if (u.includes('/feeds/posts')) return r.fulfill({ json: { feed: { entry: ['كيف تقارن عرضي تقسيط قبل التوقيع', 'ضريبة المرتبات: ماذا يخصم من راتبك فعلاً', 'هل الخصم 30% يوفر لك فعلاً؟'].map((t, i) => ({ title: { $t: t }, summary: { $t: 'ملخص قصير يوضح فكرة المقال وما ستخرج به بعد قراءته.' }, category: [{ term: 'مال' }], link: [{ rel: 'alternate', href: 'https://x.test/a' + i + '.html' }] })) } } });
    return r.fulfill({ contentType: 'text/html; charset=utf-8', body: shell(main, home) }); });
  await p.goto('https://x.test/' + (home ? '?m=1' : 'p/' + name + '.html')); await p.addScriptTag({ content: js }); await p.waitForTimeout(1800);
  if (!process.env.TOP) { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); }); await p.waitForTimeout(1500); }
  await p.screenshot({ path: `${out}/${label}-${name}-${w}.png`, fullPage: !process.env.TOP }); console.log(name, w, errs.length ? errs : 'ok'); await p.close();
}
await b.close();
