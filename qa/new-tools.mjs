import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const md=fs.readFileSync(R+'/pages/tools.md','utf8').split('---').slice(2).join('---');
const b=await chromium.launch(); const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.route('https://x.test/',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><meta charset=utf-8><style>${css}</style><body>${md}</body>`}));
await p.goto('https://x.test/'); await p.addScriptTag({content:js}); await p.waitForTimeout(600); await p.evaluate(()=>document.querySelectorAll('[data-href]').forEach(x=>x.removeAttribute('data-href')));
for (const t of ['compound','breakeven','hourly','trip','fx']) { await p.click(`[data-tab="${t}"]`); console.log(t,'->',(await p.innerText(`#sc-${t} .sc-tool-result`)).replace(/\n+/g,' | ')); }
const qs=['خصم 25% على 1800','ضريبة 14% على ٥٠٠٠','قرض 100000 بفائدة 12% لمدة سنتين','قرض 100,000 بفائدة 10% لمدة 3 سنوات','تكلفة 80 وسعر البيع 100 كم الهامش','هدف ادخار 30000 وأدخر 2000 شهرياً','فاتورة 900 نقسمها على 3 أشخاص مع إكرامية 10%','نسبة من 200 إلى 250','ما عاصمة فرنسا'];
await p.click('[data-tab="assistant"]');
for (const q of qs){ await p.fill('#sc-ask',q); await p.click('#sc-ask-go'); console.log('Q:',q,'\n  A:',(await p.innerText('#sc-assistant-result')).slice(0,170)); }
await p.click('[data-tab="assistant"]'); await p.fill('#sc-ask','خصم 25% على 1800'); await p.click('#sc-ask-go');
const ids=await p.$$eval('[id]',e=>{const c={};e.forEach(x=>c[x.id]=(c[x.id]||0)+1);return Object.keys(c).filter(k=>c[k]>1)});
console.log('dup ids',ids,'errors',errs.length?errs:'none');
await p.setViewportSize({width:1100,height:900}); await p.screenshot({path:'/tmp/qa-assist.png',fullPage:true}); await b.close();
