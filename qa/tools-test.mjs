import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root='/home/claude/smart-choice';
const md=fs.readFileSync(root+'/pages/tools.md','utf8').split('---').slice(2).join('---');
const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${fs.readFileSync(root+'/assets/css/smart-choice.css','utf8')}</style></head><body>${md}<script>${fs.readFileSync(root+'/assets/js/smart-choice.js','utf8')}</script></body></html>`;
const b=await chromium.launch(); const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.setContent(html);
const tabs=await p.$$eval('[data-tab]',e=>e.map(x=>x.dataset.tab)); console.log('tabs',tabs.join(','));
for (const t of tabs){ await p.click(`[data-tab="${t}"]`); const vis=await p.$$eval('.sc-tool',e=>e.filter(x=>!x.hidden).map(x=>x.id)); console.log(t,'->',vis.join(',')); }
await p.click('[data-tab="discount"]');
const ids=await p.$$eval('#sc-discount input',e=>e.map(x=>x.id)); console.log('discount inputs',ids.join(','));
await p.fill('#'+ids[0],'2000'); await p.fill('#'+ids[1],'20');
console.log('discount result:',(await p.textContent('#sc-discount .sc-tool-result')).trim());
await p.click('[data-tab="installment"]');
await p.fill('#sc-cash','20000'); await p.fill('#sc-down','0'); await p.fill('#sc-months','12'); await p.fill('#sc-monthpay','1750');
console.log('installment result:',(await p.textContent('#sc-installment-result')).trim());
console.log('errors',errs.length?errs:'none'); await b.close();
