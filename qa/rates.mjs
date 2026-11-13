// لوحة الأسعار الحية: عرض، اتجاه التغيّر، إخفاء القديم، شريط الرئيسية، والتحديث دون إعادة تحميل
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R = '/home/claude/smart-choice';
const js = fs.readFileSync(R + '/assets/js/smart-choice.js', 'utf8');
const css = fs.readFileSync(R + '/assets/css/smart-choice.css', 'utf8').split('\n').filter(l => !l.startsWith('@import')).join('\n');
const md = fs.readFileSync(R + '/pages/rates.md', 'utf8').split('---').slice(2).join('---');
const now = Math.floor(Date.now() / 1000);
const mk = (o = {}) => ({ source: 'open.er-api.com', updated: now - 600, fetched: now - 60,
  egp: { USD: 50, EUR: 55.5556, GBP: 62.5, SAR: 13.3333, AED: 13.6147, KWD: 166.6667, QAR: 13.7363 },
  gold: { source: 'xaus.com', updated: now - 120, fetched: now - 60, usd_oz: 2000, egp_gram: { 24: 3215.07, 21: 2813.19, 18: 2411.31 } },
  silver: { source: 'xaus.com', updated: now - 120, fetched: now - 60, usd_oz: 25, egp_gram: { 999: 40.19, 925: 37.17 } }, ...o });
let data = mk(); let bad = 0; const errs = [];
const check = (ok, msg) => { if (!ok) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
const b = await chromium.launch(); const p = await b.newPage(); p.on('pageerror', e => errs.push(e.message));
await p.route('https://x.test/**', r => r.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><meta charset=utf-8><style>${css}</style><body>${md}<div class="sc-rates-wrap" hidden><div id="sc-rates-strip" class="sc-rgrid sc-rs"></div></div></body>` }));
await p.route('https://raw.githubusercontent.com/**', r => r.fulfill({ json: data, headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://x.test/p/rates.html'); await p.addScriptTag({ content: js });
await p.waitForSelector('#sc-rates-board .sc-rcard');
const n = await p.$$eval('#sc-rates-board .sc-rcard', e => e.length);
check(n === 7 + 5 + 3, 'board cards: ' + n + ' (7 currencies + 5 gold + 3 silver)');
let txt = await p.innerText('#sc-rates-board');
check(!/NaN|undefined|Infinity/.test(txt), 'no NaN/undefined in board');
check(/٥٠٫٠٠/.test(txt) && /٣٬٢١٥٫٠٧/.test(txt) && /٤٠٫١٩/.test(txt), 'USD 50 / gold24 3215.07 / silver999 40.19 formatted in Arabic digits');
check(/٢٢٬٥٠٥٫٥٢/.test(txt), 'gold pound = 21k x 8 = 22,505.52 -> ' + (txt.match(/جنيه الذهب[\s\S]{0,40}/) || [''])[0].replace(/\s+/g, ' '));
check((await p.$$eval('.sc-delta', e => e.length)) === 0, 'no delta arrows when no prev data');
check(/Rates By Exchange Rate API/.test(txt) && /xaus\.com/.test(txt), 'sources credited');
// تغيّر: يظهر سهم دون إعادة تحميل
data = mk({ prev: { egp: { USD: 49 }, gold: { 21: 3000 }, silver: { 999: 41 } } });
await p.evaluate(() => window.__scRatesMount()); await p.waitForSelector('.sc-delta');
const d = await p.$$eval('.sc-delta', e => e.map(x => (x.classList.contains('up') ? 'up' : 'down') + ':' + x.textContent.replace(/\s+/g, ' ').trim()));
console.log('deltas', d);
check(d.some(x => x.startsWith('up')) && d.some(x => x.startsWith('down')), 'up (USD) and down (gold21, silver999) arrows after live refresh');
// بيانات قديمة تُخفى
data = mk({ fetched: now - 40 * 3600, gold: { ...mk().gold, fetched: now - 40 * 3600 }, silver: { ...mk().silver, fetched: now - 40 * 3600 } });
await p.evaluate(() => window.__scRatesMount()); await p.waitForFunction(() => /غير محدّثة/.test(document.getElementById('sc-rates-board').innerText));
check(true, 'stale data (40h) is hidden with a notice');
// شريط الرئيسية
data = mk(); await p.evaluate(() => window.__scRatesMount()); await p.waitForFunction(() => document.querySelectorAll('#sc-rates-strip .sc-rcard').length === 4);
check(await p.isVisible('#sc-rates-strip'), 'home strip shows 4 cards and its wrapper is visible');
data = mk({ fetched: 1, updated: 1, gold: null, silver: null }); await p.evaluate(() => window.__scRatesMount()); await p.waitForFunction(() => document.querySelector('.sc-rates-wrap').hidden);
check(true, 'home strip hidden when everything is stale');
for (const w of [390, 1280]) { await p.setViewportSize({ width: w, height: 800 }); data = mk(); await p.evaluate(() => window.__scRatesMount()); await p.waitForTimeout(300);
  check(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)), 'no horizontal overflow at ' + w); }
check(errs.length === 0, 'no JS errors ' + errs.join('|'));
console.log(bad ? 'PROBLEMS ' + bad : 'ALL OK'); await b.close(); process.exit(bad ? 1 : 0);
