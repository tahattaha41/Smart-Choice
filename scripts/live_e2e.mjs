// اختبار حقيقي بمتصفح للموقع الحي: هل تظهر الأدوات وتعمل؟ هل يظهر محتوى الصفحات والمقالات؟
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = 'https://smartchoicee1.blogspot.com';
const out = []; let failed = 0;
const rec = (ok, msg) => { out.push((ok ? 'OK    ' : 'FAIL  ') + msg); if (!ok) failed++; };
let browser; let botLoads = 0;
// منع إعلانات/تحليلات جوجل عن متصفح الاختبار (حتى لا تُحتسب مشاهدات أو ظهور إعلانات من الروبوت)، وعدّ تحميلات الصفحات الآلية لاستبعادها من إحصائيات الزوار
const guard = async (c) => {
  await c.route(/(googlesyndication|doubleclick|googletagmanager|google-analytics|googleadservices|adtrafficquality)/, (r) => r.abort());
  c.on('response', (r) => { try { if (r.request().resourceType() === 'document' && r.url().startsWith(BASE) && r.request().frame() && !r.request().frame().parentFrame()) botLoads++; } catch {} });
};
try {
browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'ar-EG', viewport: { width: 390, height: 800 } });
await guard(ctx);
const page = await ctx.newPage();
const errors = []; page.on('pageerror', (e) => { if (!/solveSimpleChallenge/.test(e.message)) errors.push(e.message); }); // خطأ تصدره صفحات Blogger نفسها لمتصفحات الاختبار
const go = async (url) => { await page.waitForTimeout(2500); for (let i = 0; i < 6; i++) { try { const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); if (r && r.ok()) { await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); return true; } } catch {} await page.waitForTimeout(15000 * (i + 1)); } return false; };

// نسخة الواجهة المنشورة على CDN
const cdn = await page.evaluate(async () => { try { return await (await fetch('https://cdn.jsdelivr.net/gh/tahattaha41/Smart-Choice@main/assets/js/smart-choice.js')).text(); } catch { return ''; } }).catch(() => '');
// (يُقيَّم بعد فتح الصفحة الأولى)
// الرئيسية
{ const okH = await go(BASE + '/'); rec(okH, 'Home loads'); if (!okH && /google\.com\/sorry/.test(page.url())) { mkdirSync('reports', { recursive: true }); writeFileSync('reports/live-e2e-blocked.md', '# الفحص الحي متوقف مؤقتاً\n\nجوجل حجبت عنوان سيرفر GitHub مؤقتاً (صفحة sorry) بسبب كثرة الطلبات، وهذا ليس عطلاً في الموقع. آخر نتيجة سليمة في live-e2e.txt محفوظة. ' + new Date().toISOString() + '\n'); console.log('blocked by google rate limit'); await browser.close().catch(() => {}); process.exit(0); } if (!okH) { const r2 = await fetch(BASE + '/', { redirect: 'manual' }).catch((e) => ({ status: 'neterr ' + e.message })); out.push('INFO  Home fetch status=' + r2.status + ' location=' + (r2.headers ? r2.headers.get('location') : '') + ' page.url=' + page.url()); } }
rec((await page.locator('.sc-hero2, .sc-hero').count()) > 0, 'Home shows hero');
await page.waitForTimeout(3500);
rec((await page.locator('#sc-hq-p').count()) > 0, 'Design v4 live: hero calculator present (if FAIL: new JS not loading)');
const dsn = await page.evaluate(() => ({ font: getComputedStyle(document.body).fontFamily.slice(0, 40), btn: (document.querySelector('.sc-btn') ? getComputedStyle(document.querySelector('.sc-btn')).backgroundColor : '') }));
out.push('INFO  Home style probe: font=' + dsn.font + ' | button=' + dsn.btn);
rec((await page.content()).includes('Smart Choice loader'), 'Installed theme has the GitHub loader (if FAIL: upload theme/smart-choice-blogger.xml once)');
const cdn2 = await page.evaluate(async () => { try { return await (await fetch('https://cdn.jsdelivr.net/gh/tahattaha41/Smart-Choice@main/assets/js/smart-choice.js')).text(); } catch { return ''; } });
rec(cdn2.includes('content bundle'), 'CDN serves latest front-end JS (self-heal present)');
await page.waitForTimeout(2500);
const nav = (await page.locator('.sc-nav').innerText()).replace(/\s+/g, ' ');
rec(!/utilit[y]ra|flarivo|toolora/i.test(nav), 'Nav has no old-brand pages: ' + nav.slice(0, 120));

// ads.txt (تحذير فقط: إجراء على المالك في إعدادات بلوجر)
try { const ar = await page.request.get(BASE + '/ads.txt'); const at = ar.ok() ? await ar.text() : ''; out.push((at.includes('pub-1235197294708204') ? 'OK    ' : 'WARN  ') + 'ads.txt ' + (at.includes('pub-1235197294708204') ? 'يحتوي معرّف الناشر' : 'غير مفعّل بعد في إعدادات بلوجر')); } catch { out.push('WARN  ads.txt تعذر الفحص'); }
// الصفحات من الخلاصة
const feed = await page.evaluate(async () => { const all = []; for (let st = 1; st <= 201; st += 25) { try { const r = await fetch('/feeds/pages/default?alt=json&max-results=25&start-index=' + st); if (!r.ok) break; const en = (await r.json()).feed.entry || []; for (const e of en) all.push({ t: e.title.$t, u: e.link.find((l) => l.rel === 'alternate').href }); if (en.length < 25) break; } catch { break; } } return all; });
out.push('INFO  Pages feed entries: ' + feed.length);
const find = (s) => (feed.find((p) => p.t.startsWith(s)) || feed.find((p) => p.t.includes(s)))?.u;

// صفحة الأدوات: ظهور وعمل
const tools = find('الأدوات');
rec(!!tools && (await go(tools)), 'Tools page loads');
try { await page.waitForSelector('.sc-tool', { timeout: 20000 }); rec(true, 'Tools: tool sections rendered'); await page.waitForTimeout(5000); const nOff = await page.locator('.sc-offer').count(); out.push((nOff > 0 ? 'OK    ' : 'INFO  ') + 'Tools: affiliate ad cards shown (paused until AdSense approval) = ' + nOff); } catch { rec(false, 'Tools: NO tool section rendered (page is interface only)'); }
if ((await page.locator('#sc-price').count()) > 0) {
  await page.fill('#sc-price', '2000'); await page.fill('#sc-rate', '20');
  const txt = await page.locator('#sc-discount .sc-tool-result').innerText();
  rec(/١٬?٦٠٠|1,?600/.test(txt), 'Tools: discount calculator works -> ' + txt.replace(/\s+/g, ' '));
  await page.click('[data-tab="decide"]'); rec(await page.locator('#sc-decide').isVisible(), 'Tools: decision tab opens');
  await page.click('[data-tab="compare"]'); rec(await page.locator('#sc-compare').isVisible(), 'Tools: compare tab opens');
} else rec(false, 'Tools: discount input missing');

// صفحات الأدوات المستقلة: الأيقونة تفتح صفحتها وفيها الأداة ظاهرة
try {
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('[data-href]')].map((b) => b.getAttribute('data-href')));
  rec(hrefs.length >= 30, 'Hub: icons carry page links (' + hrefs.length + ')');
  for (const h of [hrefs[0], hrefs[Math.floor(hrefs.length / 2)], hrefs[hrefs.length - 1]].filter(Boolean)) {
    const ok = await go(h.startsWith('http') ? h : BASE + h);
    const vis = ok && (await page.waitForSelector('.sc-tool', { timeout: 20000 }).then(() => true).catch(() => false));
    const shown = vis && (await page.locator('.sc-tool:visible').count()) > 0;
    rec(!!shown, 'Tool page opens with its tool visible: ' + h);
  }
} catch (e) { rec(false, 'Tool pages check error: ' + e.message); }

// صفحات أخرى ومقال
for (const [key, label] of [['من نحن', 'About'], ['اتصل بنا', 'Contact'], ['الخصوصية', 'Privacy'], ['شروط', 'Terms'], ['مركز القرار', 'Decision page'], ['مقارنة', 'Compare page'], ['سياسة المحتوى', 'Editorial page'], ['لوحة الإدارة', 'Admin page']]) {
  const u = find(key);
  if (!u) { rec(false, label + ': not in feed'); continue; }
  const okLoad = await go(u); rec(okLoad, label + ' loads'); if (!okLoad) { const r2 = await fetch(u, { redirect: 'manual' }).catch(() => null); out.push('INFO  ' + label + ' url=' + u + ' status=' + (r2 ? r2.status : 'neterr')); }
  await page.waitForTimeout(2500);
  const len = (await page.locator('.post-body, .entry-content, .sc-page').first().innerText().catch(() => '')).length;
  rec(len > (label === 'Admin page' ? 40 : 150), `${label}: body text length ${len}`);
  if (label === 'Admin page') { try { await page.waitForSelector('#sc-admin-root input[type=password]', { timeout: 20000 }); const leaked = await page.locator('.sc-admin-table').count(); rec(leaked === 0, 'Admin: password gate shown and no data exposed before login'); } catch { rec(false, 'Admin: password gate NOT shown'); } }
  if (label === 'Contact') rec((await page.content()).includes('skyloom32'), 'Contact shows email');
}
const posts = await page.evaluate(async () => (await (await fetch('/feeds/posts/default?alt=json&max-results=20')).json()).feed.entry.map((e) => e.link.find((l) => l.rel === 'alternate').href));
rec(posts.length >= 14, 'Posts in feed: ' + posts.length);
if (posts[0]) { await go(posts[0]); await page.waitForTimeout(2500); const len = (await page.locator('.post-body, .entry-content').first().innerText().catch(() => '')).length; rec(len > 300, 'Latest post body length ' + len); }
rec(errors.length === 0, 'No JS errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));

// سيناريو الهاتف مع ?m=1 (القالب المحمول في Blogger)
{
  const { devices } = await import('playwright');
  const mctx = await browser.newContext({ ...devices['Pixel 7'], locale: 'ar-EG' });
  await guard(mctx);
const mp = await mctx.newPage();
  const mgo = async (url) => { await mp.waitForTimeout(2500); for (let i = 0; i < 5; i++) { try { const r = await mp.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); if (r && r.ok()) { await mp.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); return true; } else { console.log('mobile status', url, r && r.status()); } } catch (e) { console.log('mobile err', url, String(e).slice(0, 120)); } await mp.waitForTimeout(12000 * (i + 1)); } return false; };
  rec(await mgo(BASE + '/?m=1'), 'Mobile: home?m=1 loads');
  await mp.waitForTimeout(3000);
  const hl = (await mp.locator('#main-content').innerText().catch(() => '')).length;
  rec(hl > 200, 'Mobile: home content length ' + hl);
  const tu = feed.find((p) => p.t.includes('الأدوات'))?.u;
  rec(!!tu && (await mgo(tu + '?m=1')), 'Mobile: tools?m=1 loads');
  try { await mp.waitForSelector('.sc-tool', { timeout: 20000 }); rec(true, 'Mobile: tools rendered'); } catch { rec(false, 'Mobile: tools NOT rendered'); }
  const du = feed.find((p) => p.t.includes('من نحن'))?.u;
  if (du) { await mgo(du + '?m=1'); await mp.waitForTimeout(3000); const l = (await mp.locator('#main-content').innerText().catch(() => '')).length; rec(l > 150, 'Mobile: about content length ' + l); }
  await mctx.close();
}
} catch (e) { rec(false, 'Test crashed: ' + String(e && e.message || e).split('\n')[0].slice(0, 300)); }
finally { if (browser) await browser.close().catch(() => {}); }
mkdirSync('reports', { recursive: true });
try { const { readFileSync, existsSync } = await import('node:fs'); const f = 'reports/bot-views.json'; const d = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : { measured: {}, estimated: {} }; const day = new Date().toISOString().slice(0, 10); d.measured[day] = (d.measured[day] || 0) + botLoads; writeFileSync(f, JSON.stringify(d)); } catch {}
try { (await import('node:fs')).unlinkSync('reports/live-e2e-blocked.md'); } catch {}
writeFileSync('reports/live-e2e.txt', out.join('\n') + `\nfailed=${failed}\n`);
console.log(out.join('\n'));
process.exit(0);
