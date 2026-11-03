import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const bundle=JSON.parse(fs.readFileSync(R+'/assets/content/bundle.json','utf8'));
const it=bundle.items.find(i=>i.title.startsWith('الأدوات'));
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.route('https://x.test/**',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><html dir=rtl><head><meta charset=utf-8><style>${css}</style></head><body><main class='sc-wrap sc-main' id='main-content'><article class="sc-injected">${it.html}</article></main></body></html>`}));
await p.goto('https://x.test/page'); await p.addScriptTag({content:js}); await p.waitForTimeout(1200);
await p.evaluate(()=>document.querySelector('[data-tab=assistant]').click()); await p.waitForTimeout(300);
const Q=["الفائدة الفعلية سعر الكاش 20000 مقدم 2000 لمدة 12 شهر قسط 1700","كاش باك 8000 بنسبة 2% رسوم 300","سداد مبكر قرض 200000 بفائدة 14% قسط 6000 إضافي 1500","كم يتضاعف مالي بعائد 9%","اشتراك شهري 120 وسنوي 1000"];
for(const q of Q){ await p.fill('#sc-ask',q); await p.click('#sc-ask-go'); console.log(q,'=>',(await p.textContent('#sc-assistant-result')).slice(0,170)); }
for(const t of ['effrate','sub','rule72','cashback','payoff']){ await p.evaluate(t=>document.querySelector(`[data-tab=${t}]`).click(),t); await p.waitForTimeout(300); console.log(t,'ex:',await p.evaluate(t=>{const b=[...document.querySelectorAll('#sc-'+t+' button')].find(x=>/مثال/.test(x.textContent)); if(b)b.click(); return document.querySelector('#sc-'+t+'-result').innerText.slice(0,160);},t)); }
console.log('errors',errs.length?errs:'none'); await b.close();
