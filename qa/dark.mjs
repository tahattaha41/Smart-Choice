import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const theme=fs.readFileSync(R+'/theme/smart-choice-blogger.xml','utf8');
const skin=theme.split("<b:skin><![CDATA[")[1].split("]]>")[0];
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const bundle=JSON.parse(fs.readFileSync(R+'/assets/content/bundle.json','utf8'));
const page=(t)=>bundle.items.find(i=>i.title.startsWith(t)).html;
const posts=bundle.items.filter(i=>i.kind==='post').slice(0,6);
const shell=(inner)=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${skin}</style><style>${css}</style></head><body><div class='sc-top'><div class='sc-wrap'>أدوات مجانية تساعدك تحسب وتقارن وتختار بوعي</div></div><header class='sc-head'><div class='sc-wrap sc-headin'><a class='sc-brand' href='/'>Smart <span>Choice</span></a><nav class='sc-nav'><a href='/'>الرئيسية</a><a href='/p/tools.html'>الأدوات</a></nav></div></header><main class='sc-wrap sc-main' id='main-content'>${inner}</main><footer class='sc-footer'><div class='sc-wrap'><strong>Smart Choice</strong><div class='sc-footlinks'></div></div></footer></body></html>`;
const b=await chromium.launch(); const errs=[];
const H={'access-control-allow-origin':'*'};
async function shot(name,inner,vp,extra){
  const ctx=await b.newContext({viewport:vp,locale:'ar-EG'}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(name+': '+e.message));
  await p.route('https://x.test/**',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:shell(inner)}));
  await p.route('**/feeds/pages/**',r=>r.fulfill({json:{feed:{entry:['الأدوات الذكية','مقارنة المنتجات','مركز القرار','من نحن'].map(t=>({title:{$t:t+' | Smart Choice'},link:[{rel:'alternate',href:'https://x.test/p/'+t}]}))}}}));
  await p.route('**/feeds/posts/**',r=>r.fulfill({json:{feed:{entry:posts.map((x,i)=>({title:{$t:x.title},summary:{$t:x.html.replace(/<[^>]*>/g,' ').slice(0,200)},category:[{term:'التسوق الذكي'}],link:[{rel:'alternate',href:'https://x.test/2026/10/p'+i+'.html'}]}))}}}));
  await p.route('https://raw.githubusercontent.com/**',r=>{const u=r.request().url(); if(u.includes('stats.json')) return r.fulfill({json:{updated:'2026-11-01 07:54 UTC',d7:441,d30:862,all:1667},headers:H}); if(u.includes('stats-history')) return r.fulfill({json:[...Array(20)].map((_,i)=>({date:'2026-10-'+String(10+i).padStart(2,'0'),all:100+i*40+(i%3)*30})),headers:H}); if(u.includes('adsense-audit')) return r.fulfill({json:{score:100,posts:20,avg_words:708,manual:[],checks:[{level:'pass',title:'صفحة من نحن'}]},headers:H}); if(u.includes('live-e2e')) return r.fulfill({body:'OK    Home loads\\nOK    Tools page loads\\nWARN  ads.txt',headers:H}); if(u.includes('bot-views')) return r.fulfill({json:{measured:{},estimated:{}},headers:H}); return r.fulfill({status:404,body:'',headers:H});});
  await p.goto('https://x.test/'+(name.startsWith('home')?'':'page')); await p.addScriptTag({content:js}); await p.evaluate(()=>{localStorage.setItem('sc-theme','dark');document.documentElement.setAttribute('data-sc-theme','dark')}); await p.waitForTimeout(1800);
  if(extra) await extra(p);
  await p.waitForTimeout(400); await p.screenshot({path:`/tmp/dk-${name}.png`,fullPage:true}); await ctx.close();
}
const D={width:1280,height:900}, T={width:820,height:1000}, M={width:375,height:800};
for (const [n,vp] of [['d',D],['t',T],['m',M]]) {
  await shot('home-'+n,'',vp);
  await shot('tools-'+n,'<article class="sc-injected">'+page('الأدوات الذكية')+'</article>',vp,async p=>{await p.click('[data-tab="loan"]');});
  await shot('admin-'+n,'<article class="sc-injected">'+page('لوحة الإدارة')+'</article>',vp,async p=>{await p.fill('input[type=password]','Taha'); await p.click('#sc-admin-root .adm-btn'); await p.waitForSelector('.adm-stat b'); await p.waitForTimeout(600);});
}
console.log('errors',errs.length?errs:'none'); await b.close();
