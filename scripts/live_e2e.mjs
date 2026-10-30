// اختبار حقيقي بمتصفح للموقع الحي: هل تظهر الأدوات وتعمل؟ هل يظهر محتوى الصفحات والمقالات؟
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = 'https://smartchoicee1.blogspot.com';
const out = []; let failed = 0;
const rec = (ok, msg) => { out.push((ok ? 'OK    ' : 'FAIL  ') + msg); if (!ok) failed++; };
let browser;
try {
browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'ar-EG', viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
const go = async (url) => { for (let i = 0; i < 4; i++) { try { const r = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); if (r && r.ok()) return true; } catch {} await page.waitForTimeout(8000 * (i + 1)); } return false; };

// نسخة الواجهة المنشورة على CDN
const cdn = await page.evaluate(async () => { try { return await (await fetch('https://cdn.jsdelivr.net/gh/tahattaha41/Smart-Choice@main/assets/js/smart-choice.js')).text(); } catch { return ''; } }).catch(() => '');
// (يُقيَّم بعد فتح الصفحة الأولى)
// الرئيسية
rec(await go(BASE + '/'), 'Home loads');
rec((await page.locator('.sc-hero').count()) > 0, 'Home shows hero');
const cdn2 = await page.evaluate(async () => { try { return await (await fetch('https://cdn.jsdelivr.net/gh/tahattaha41/Smart-Choice@main/assets/js/smart-choice.js')).text(); } catch { return ''; } });
rec(cdn2.includes('content bundle'), 'CDN serves latest front-end JS (self-heal present)');
await page.waitForTimeout(2500);
const nav = (await page.locator('.sc-nav').innerText()).replace(/\s+/g, ' ');
rec(!/utilityra|flarivo|toolora/i.test(nav), 'Nav has no old-brand pages: ' + nav.slice(0, 120));

// الصفحات من الخلاصة
const feed = await page.evaluate(async () => (await (await fetch('/feeds/pages/default?alt=json&max-results=50')).json()).feed.entry.map((e) => ({ t: e.title.$t, u: e.link.find((l) => l.rel === 'alternate').href })));
const find = (s) => feed.find((p) => p.t.includes(s))?.u;

// صفحة الأدوات: ظهور وعمل
const tools = find('الأدوات');
rec(!!tools && (await go(tools)), 'Tools page loads');
try { await page.waitForSelector('.sc-tool', { timeout: 20000 }); rec(true, 'Tools: tool sections rendered'); } catch { rec(false, 'Tools: NO tool section rendered (page is interface only)'); }
if ((await page.locator('#sc-price').count()) > 0) {
  await page.fill('#sc-price', '2000'); await page.fill('#sc-rate', '20');
  const txt = await page.locator('#sc-discount .sc-tool-result').innerText();
  rec(/١٬?٦٠٠|1,?600/.test(txt), 'Tools: discount calculator works -> ' + txt.replace(/\s+/g, ' '));
  await page.click('[data-tab="decide"]'); rec(await page.locator('#sc-decide').isVisible(), 'Tools: decision tab opens');
  await page.click('[data-tab="compare"]'); rec(await page.locator('#sc-compare').isVisible(), 'Tools: compare tab opens');
} else rec(false, 'Tools: discount input missing');

// صفحات أخرى ومقال
for (const [key, label] of [['من نحن', 'About'], ['اتصل بنا', 'Contact'], ['الخصوصية', 'Privacy'], ['الشروط', 'Terms'], ['مركز القرار', 'Decision page'], ['مقارنة', 'Compare page']]) {
  const u = find(key);
  if (!u) { rec(false, label + ': not in feed'); continue; }
  rec(await go(u), label + ' loads');
  await page.waitForTimeout(2500);
  const len = (await page.locator('.post-body, .entry-content, .sc-page').first().innerText().catch(() => '')).length;
  rec(len > 150, `${label}: body text length ${len}`);
  if (label === 'Contact') rec((await page.content()).includes('skyloom32'), 'Contact shows email');
}
const posts = await page.evaluate(async () => (await (await fetch('/feeds/posts/default?alt=json&max-results=20')).json()).feed.entry.map((e) => e.link.find((l) => l.rel === 'alternate').href));
rec(posts.length >= 6, 'Posts in feed: ' + posts.length);
if (posts[0]) { await go(posts[0]); await page.waitForTimeout(2500); const len = (await page.locator('.post-body, .entry-content').first().innerText().catch(() => '')).length; rec(len > 300, 'Latest post body length ' + len); }
rec(errors.length === 0, 'No JS errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
} catch (e) { rec(false, 'Test crashed: ' + String(e && e.message || e).split('\n')[0].slice(0, 300)); }
finally { if (browser) await browser.close().catch(() => {}); }
mkdirSync('reports', { recursive: true });
writeFileSync('reports/live-e2e.txt', out.join('\n') + `\nfailed=${failed}\n`);
console.log(out.join('\n'));
process.exit(0);
