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
const Q=["تضخم 10000 بمعدل 15% لمدة 5 سنوات","خصمين 20% و10% على 2000","استثمرت 50000 وصارت 68000 بعد 3 سنوات","استثمار 10000 بفائدة 8% لمدة 5 سنوات","وزني 78 وطولي 175","سعرات عمري 30 وزني 80 طولي 180","زكاة 120000 ذهب 30000 ديون 10000","تقسيط سعر 20000 مقدم 2000 قسط 1500 لمدة 12 شهر","نقطة التعادل تكاليف ثابتة 6000 سعر البيع 100 تكلفة متغيرة 40","رحلة 250 كم استهلاك 8 لتر سعر اللتر 10","جريت 10 كم في 50 دقيقة","أيهما أرخص 50 جنيه لـ 2 كجم أو 90 جنيه لـ 4 كجم","قرض 100000 بفائدة 12% لمدة سنتين","خصم 20% على 2000"];
for(const q of Q){ await p.fill('#sc-ask',q); await p.click('#sc-ask-go'); console.log(q,'=>',(await p.textContent('#sc-assistant-result')).slice(0,170)); }
for(const t of ['roi','inflation','stack']){ await p.evaluate(t=>document.querySelector(`[data-tab=${t}]`).click(),t); await p.waitForTimeout(300); console.log(t,'ex:',await p.evaluate(t=>{const b=[...document.querySelectorAll('#sc-'+t+' button')].find(x=>/مثال/.test(x.textContent)); if(b)b.click(); return document.querySelector('#sc-'+t+'-result').innerText.slice(0,160);},t)); }
console.log('errors',errs.length?errs:'none'); await b.close();
