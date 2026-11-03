// يفحص الموقع الحي كما يراه الزاحف: HTML الخام بلا JS، ثم بعد JS، وrobots وsitemap والتحويلات والرؤوس.
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = 'https://smartchoicee1.blogspot.com';
const L = []; const add = (s) => { L.push(s); console.log(s); };
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
async function get(url, opts = {}) { try { const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA }, ...opts }); return { status: r.status, loc: r.headers.get('location'), xr: r.headers.get('x-robots-tag'), ct: r.headers.get('content-type'), text: await r.text() }; } catch (e) { return { status: 0, err: String(e).slice(0, 100), text: '' }; } }
function meta(html, n) { const m = html.match(new RegExp('<meta[^>]+name=["\']' + n + '["\'][^>]*>', 'i')); return m ? (m[0].match(/content=["']([^"']*)/i) || [])[1] || '' : null; }
add('# تشخيص الفهرسة (كما يراه الزاحف)\n');
add('- وقت الفحص: ' + new Date().toISOString());
// 1) http -> https
const h = await get('http://smartchoicee1.blogspot.com/'); add(`- http:// ← الحالة ${h.status} ${h.loc ? '→ ' + h.loc : ''}`);
// 2) robots + sitemaps
const rb = await get(BASE + '/robots.txt'); add(`- robots.txt: ${rb.status}\n\`\`\`\n${rb.text.slice(0, 600)}\n\`\`\``);
for (const s of ['/sitemap.xml', '/sitemap-pages.xml', '/atom.xml?redirect=false&max-results=1']) { const r = await get(BASE + s); const n = (r.text.match(/<loc>|<entry>/g) || []).length; add(`- ${s}: حالة ${r.status}، عناصر ${n}`); }
// 3) صفحات مهمة: خام ومُصيَّر
const posts = await get(BASE + '/feeds/posts/default?alt=json&max-results=3'); let postUrl = null;
try { postUrl = JSON.parse(posts.text).feed.entry[0].link.find(l => l.rel === 'alternate').href; } catch {}
const targets = [['الرئيسية', BASE + '/'], ['الأدوات', BASE + '/p/tools.html'], ['مقال', postUrl]].filter(t => t[1]);
const br = await chromium.launch(); const ctx = await br.newContext({ userAgent: UA, locale: 'ar-EG' });
await ctx.route(/(googlesyndication|doubleclick|googletagmanager|google-analytics)/, r => r.abort());
for (const [name, url] of targets) {
  add(`\n## ${name}: ${url}`);
  const r = await get(url);
  const raw = r.text;
  add(`- الخام (بلا JS): حالة ${r.status}، X-Robots-Tag=${r.xr || 'لا يوجد'}، meta robots=${meta(raw, 'robots')}`);
  add(`- title: ${(raw.match(/<title>([^<]*)/i) || [])[1]}`);
  add(`- description (خام): ${(meta(raw, 'description') || '(فارغ)').slice(0, 160)}`);
  add(`- canonical: ${(raw.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)/i) || [])[1] || 'لا يوجد'}`);
  const txt = raw.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  add(`- نص مرئي في HTML الخام: ${txt.length} حرف، روابط داخلية: ${(raw.match(/href=["']https:\/\/smartchoicee1\.blogspot\.com/g) || []).length}`);
  add(`- يحتوي الاسم القديم/الافتراضي: ${/Edit-Me|Powered by Blogger|عرض الملف الشخصي/.test(raw) ? 'نعم (قالب افتراضي ظاهر في الخام)' : 'لا'}`);
  try {
    const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); await p.waitForTimeout(6000);
    const d = await p.evaluate(() => ({ len: document.body.innerText.length, h1: (document.querySelector('h1') || {}).textContent, links: document.querySelectorAll('a[href]').length, desc: (document.querySelector('meta[name=description]') || {}).content }));
    add(`- بعد تنفيذ JS: نص ${d.len} حرف، روابط ${d.links}، h1="${(d.h1 || '').trim().slice(0, 60)}"، description="${(d.desc || '').slice(0, 100)}"`);
    await p.close();
  } catch (e) { add('- تعذر التصيير: ' + String(e).slice(0, 100)); }
}
await br.close();
fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync('reports/seo-diagnose.md', L.join('\n') + '\n');
