import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const md=fs.readFileSync(R+'/pages/tools.md','utf8').split('---').slice(2).join('---');
const b=await chromium.launch(); const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.route('https://x.test/',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><meta charset=utf-8><style>${css}</style><body>${md}</body>`}));
await p.goto('https://x.test/'); await p.addScriptTag({content:js}); await p.waitForTimeout(500);
const tabs=await p.$$eval('[data-tab]',els=>els.map(e=>e.dataset.tab).filter((v,i,a)=>a.indexOf(v)===i));
let bad=0, n=0;
for (const w of [390,1280]) {
  await p.setViewportSize({width:w,height:800});
  await p.goto('https://x.test/'); await p.addScriptTag({content:js}); await p.waitForTimeout(500);
  for (const t of tabs) {
    if(!(await p.$(`[data-tab="${t}"]`))) continue;
    await p.click(`[data-tab="${t}"]`); await p.waitForTimeout(80); n++;
    const info=await p.evaluate(t=>{const s=document.getElementById('sc-'+t); if(!s) return {missing:true}; const vis=!s.hidden; const r=s.querySelector('.sc-tool-result'); const txt=(r?r.innerText:s.innerText)||''; const over=document.documentElement.scrollWidth>window.innerWidth+2; return {vis,txt:txt.slice(0,140),over,empty:!txt.trim()};},t);
    const flag = info.missing||!info.vis||/NaN|undefined|Infinity|null/.test(info.txt)||info.over||info.empty;
    if(flag){bad++; console.log('PROBLEM',w,t,JSON.stringify(info));}
  }
}
console.log('tabs',tabs.length,'checks',n,'problems',bad,'js errors',errs.length?errs:'none'); await b.close();
