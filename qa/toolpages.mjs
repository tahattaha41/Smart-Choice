import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const page=f=>fs.readFileSync(R+'/pages/'+f,'utf8').split('---').slice(2).join('---');
const b=await chromium.launch(); const errs=[]; let bad=0;
const files=fs.readdirSync(R+'/pages').filter(f=>/^tool-.*\.md$/.test(f));
for (const w of [390,1280]) for (const f of files) {
  const p=await b.newPage({viewport:{width:w,height:800}}); p.on('pageerror',e=>errs.push(f+': '+e.message));
  await p.route('https://x.test/**',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><meta charset=utf-8><style>${css}</style><body>${page(f)}</body>`}));
  await p.goto('https://x.test/p/x.html'); await p.addScriptTag({content:js}); await p.waitForTimeout(250);
  const key=f.replace(/^tool-|\.md$/g,'');
  const info=await p.evaluate(k=>{const s=document.getElementById('sc-'+k); const r=s&&s.querySelector('.sc-tool-result'); const t=r?r.innerText:''; return {vis:!!s&&!s.hidden, txt:t.slice(0,60), bar:!!(s&&s.querySelector('.sc-share-bar')), over:document.documentElement.scrollWidth>innerWidth+2};},key);
  if(!info.vis||!info.txt.trim()||/NaN|undefined|Infinity/.test(info.txt)||!info.bar||info.over){bad++;console.log('PROBLEM',w,key,JSON.stringify(info));}
  await p.close();
}
console.log('pages',files.length,'problems',bad,'js errors',errs.length?errs.slice(0,5):'none');
// hub
const h=await b.newPage({viewport:{width:390,height:800}}); await h.route('https://x.test/**',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><meta charset=utf-8><style>${css}</style><body>${page('tools.md')}</body>`}));
await h.goto('https://x.test/p/tools.html'); await h.addScriptTag({content:js}); await h.waitForTimeout(500);
console.log('hub: assistant visible',await h.isVisible('#sc-assistant'),'| discount hidden',!(await h.isVisible('#sc-discount')),'| chips',await h.$$eval('.sc-chips button',e=>e.map(x=>x.innerText.trim()).join(',')),'| buttons',await h.$$eval('nav.sc-tabs [data-tab]',e=>e.length));
await h.fill('#sc-ask','خصم 25% على 1800'); await h.click('#sc-ask-go'); console.log('assistant:',(await h.innerText('#sc-assistant-result')).slice(0,60));
await b.close();
