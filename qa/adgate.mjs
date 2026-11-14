// يختبر بوابة AdSense في القالب: تُحمَّل على المقال/الدليل الطويل فقط
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const xml = fs.readFileSync('../theme/smart-choice-blogger.xml', 'utf8');
const gate = xml.slice(xml.indexOf('/*SC-AD-GATE*/') + 14, xml.indexOf('//]]></script>', xml.indexOf('/*SC-AD-GATE*/')));
const long = ('كلمة طويلة للاختبار ').repeat(200);
const cases = [
  ['home', '/', 'index', '<div class="sc-main"><section class="sc-h-hero"></section><p>' + long + '</p></div>', false],
  ['hub', '/p/x.html', 'static_page', '<div class="sc-main"><div class="sc-tabs"></div><div class="sc-tool"></div><p>' + long + '</p></div>', false],
  ['search', '/search?q=a', 'index', '<div class="sc-main"><p>' + long + '</p></div>', false],
  ['error', '/404', 'error_page', '<div class="sc-main"><p>' + long + '</p></div>', false],
  ['thin-post', '/2026/01/a.html', 'item', '<div class="sc-main"><p>قصير</p></div>', false],
  ['static-nontool', '/p/about.html', 'static_page', '<div class="sc-main"><p>' + long + '</p></div>', false],
  ['post', '/2026/01/a.html', 'item', '<div class="sc-main"><article><p>' + long + '</p></article></div>', true],
  ['tool-page', '/p/t.html', 'static_page', '<div class="sc-main"><section class="sc-tool"></section><div class="sc-guide"><p>' + long + '</p></div></div>', true],
];
const b = await chromium.launch(); let bad = 0;
for (const [name, path, pt, body, want] of cases) {
  const p = await b.newPage(); let hit = false;
  await p.route('**/*', r => { const u = r.request().url(); if (u.includes('googlesyndication')) { hit = true; return r.abort(); } return r.fulfill({ status: 200, contentType: 'text/html', body: `<html><head><meta name="sc-pagetype" content="${pt}"></head><body>${body}</body></html>` }); });
  await p.goto('http://t.test' + path); await p.evaluate(gate); await p.waitForTimeout(2500);
  const ok = hit === want; if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + name + ' ads=' + hit + ' expected=' + want); await p.close();
}
await b.close(); if (bad) process.exit(1); console.log('ADGATE OK');
