import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const md=fs.readFileSync(R+'/pages/tools.md','utf8').split('---').slice(2).join('---');
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1100,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.route('**/feeds/posts/**',r=>r.fulfill({json:{feed:{entry:[{title:{$t:'كيف تحسب الخصم الحقيقي'},link:[{rel:'alternate',href:'https://x.test/a'}]}]}}}));
await p.route('https://x.test/p/tools',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><meta charset=utf-8><style>${css}</style><body>${md}</body>`}));
await p.goto('https://x.test/p/tools'); await p.addScriptTag({content:js}); await p.waitForTimeout(800);
for (const t of ['calories','speed','loancompare']) { await p.click(`[data-tab="${t}"]`); console.log(t,'->',(await p.innerText(`#sc-${t} .sc-tool-result`)).replace(/\n+/g,' | ')); }
await p.click('[data-tab="hijri"]'); await p.fill('#sc-h-greg',''); await p.fill('#sc-h-y','1448'); await p.fill('#sc-h-m','1'); await p.fill('#sc-h-d','1'); console.log('hijri->greg',await p.innerText('#sc-hijri-result'));
await p.fill('#sc-h-greg','2026-03-20'); console.log('greg->hijri',await p.innerText('#sc-hijri-result'));
await p.click('[data-tab="password"]'); await p.click('#sc-pw-go'); console.log('pw len',(await p.textContent('#sc-password-result')).length, await p.textContent('#sc-pw-strength'));
await p.click('.sc-chips button:nth-child(3)'); console.log('visible tabs money:',await p.$$eval('[data-tab]',e=>e.filter(x=>x.style.display!=='none').length));
await p.fill('.sc-filter input','ضريبة'); await p.click('.sc-chips button:nth-child(1)'); console.log('search ضريبة:',await p.$$eval('[data-tab]',e=>e.filter(x=>x.style.display!=='none').map(x=>x.textContent)));
await p.fill('.sc-filter input',''); await p.click('.sc-chips button:nth-child(1)'); await p.click('[data-tab="discount"]'); console.log('readmore:',await p.textContent('#sc-discount .sc-readmore'));
const ids=await p.$$eval('[id]',e=>{const c={};e.forEach(x=>c[x.id]=(c[x.id]||0)+1);return Object.keys(c).filter(k=>c[k]>1)}); console.log('dup ids',ids,'errors',errs.length?errs:'none');
await p.screenshot({path:'/tmp/qa-tools3.png',fullPage:false}); await b.close();
