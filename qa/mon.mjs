import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const bundle=JSON.parse(fs.readFileSync(R+'/assets/content/bundle.json','utf8'));
const tools=bundle.items.find(i=>i.title.startsWith('الأدوات'));
const b=await chromium.launch(); const errs=[];
async function t(path,inner,cfg){
 const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage(); p.on('pageerror',e=>errs.push(e.message));
 await p.route('https://raw.githubusercontent.com/**',r=>r.fulfill({json:cfg}));
 await p.route('https://pagead2.googlesyndication.com/**',r=>r.abort());
 await p.route('https://x.test/**',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><html dir=rtl><head><meta charset=utf-8><style>${css}</style></head><body><main class='sc-wrap sc-main' id='main-content'>${inner}</main><footer class='sc-footer'><div class='sc-wrap'>f</div></footer></body></html>`}));
 await p.goto('https://x.test'+path); await p.addScriptTag({content:js}); await p.waitForTimeout(2500);
 console.log(path,await p.evaluate(()=>({ad:document.querySelectorAll('.sc-ad ins').length,offers:[...document.querySelectorAll('.sc-offer')].map(a=>a.rel),disc:!!document.querySelector('.sc-disc'),donate:!!document.querySelector('.sc-donate'),ld:document.querySelectorAll('script[type="application/ld+json"]').length})));
 await p.close();
}
const cfg={adSlots:{inArticle:'123',afterTool:'456'},donateUrl:'https://example.com/x',offers:[{title:'منتج',url:'https://example.com',desc:'وصف'},{title:'سيء',url:'javascript:alert(1)'}]};
const para=Array.from({length:8},(_,i)=>`<p>${'فقرة طويلة '.repeat(20)}${i}</p>`).join('');
await t('/2026/10/p.html',`<div class="post-body">${para}</div>`,cfg);
await t('/p/tools.html',`<article class="sc-injected">${tools.html}</article>`,cfg);
await t('/2026/10/p.html',`<div class="post-body">${para}</div>`,{adSlots:{},offers:[]});
console.log('errors',errs.length?errs:'none'); await b.close();
