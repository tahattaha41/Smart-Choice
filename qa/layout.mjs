// تجاوز أفقي + أهداف لمس صغيرة + تباين النص الأساسي على الصفحات الرئيسية بثلاثة عروض
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>l.startsWith('@import')?false:true).join('\n');
const body=f=>fs.readFileSync(R+'/pages/'+f,'utf8').split('---').slice(2).join('---');
const now=Math.floor(Date.now()/1000);
const rates={updated:now-60,fetched:now-60,egp:{USD:53.45,EUR:59.16,GBP:70.78,SAR:14.25,AED:14.55,KWD:174.2,QAR:14.68},gold:{source:'xaus.com',updated:now,fetched:now,usd_oz:4150,egp_gram:{24:7131,21:6240,18:5348}},silver:{source:'xaus.com',updated:now,fetched:now,usd_oz:52,egp_gram:{999:89.4,925:82.7}}};
const titles=['الأدوات الذكية','أسعار اليوم','مقارنة المنتجات','مركز القرار','من نحن','اتصل بنا','شروط الاستخدام وإخلاء المسؤولية'];
const shell=m=>`<!doctype html><html lang=ar dir=rtl><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><style>${css}</style><body><header class="sc-head"><div class="sc-wrap sc-headin"><a class="sc-brand" href="/">Smart <span>Choice</span></a><nav class="sc-nav"><a href="/">الرئيسية</a></nav></div></header><main id="main-content" class="sc-wrap sc-main">${m}</main><footer class="sc-footer"><div class="sc-wrap"><strong>Smart Choice</strong><div class="sc-footlinks"></div></div></footer></body></html>`;
const b=await chromium.launch(); let bad=0;
for (const theme of ['light','dark']) for (const w of [390,820,1024,1280]) for (const [n,m,home] of [['home','',1],['tools',body('tools.md')],['tool-loan',body('tool-loan.md')],['rates',body('rates.md')],['about',body('about.md')]]) {
  const p=await b.newPage({viewport:{width:w,height:900}});
  await p.route('https://raw.githubusercontent.com/**',r=>r.fulfill({json:r.request().url().includes('rates')?rates:{},headers:{'access-control-allow-origin':'*'}}));
  await p.route('https://x.test/**',r=>{const u=r.request().url(); if(u.includes('/feeds/pages')) return r.fulfill({json:{feed:{entry:titles.map((t,i)=>({title:{$t:t+' | Smart Choice'},link:[{rel:'alternate',href:'https://x.test/p/p'+i+'.html'}]}))}}}); if(u.includes('/feeds/posts')) return r.fulfill({json:{feed:{entry:[]}}}); return r.fulfill({contentType:'text/html; charset=utf-8',body:shell(m)});});
  await p.goto('https://x.test/'+(home?'?m=1':'p/'+n+'.html')); await p.addScriptTag({content:js}); await p.evaluate(t=>{ if(t==='dark') document.documentElement.setAttribute('data-sc-theme','dark'); },theme); await p.waitForTimeout(900);
  const r=await p.evaluate(()=>{const o=document.documentElement.scrollWidth>innerWidth+2; const small=[...document.querySelectorAll('a,button,input,select,summary')].filter(e=>{const b=e.getBoundingClientRect(); return b.width>0&&b.height>0&&getComputedStyle(e).visibility!=='hidden'&&(b.height<30&&b.width<30)&&!e.closest('[hidden]')}).map(e=>(e.tagName+'.'+e.className).slice(0,40)); return {over:o,small:small.slice(0,3)};});
  if(r.over||r.small.length){bad++;console.log('PROBLEM',theme,w,n,JSON.stringify(r));}
  await p.close();
}
console.log(bad?'LAYOUT PROBLEMS '+bad:'LAYOUT OK (light+dark × 390/820/1024/1280 × 5 pages)'); await b.close(); process.exit(bad?1:0);
