import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const R='/home/claude/smart-choice';
const theme=fs.readFileSync(R+'/theme/smart-choice-blogger.xml','utf8');
const skin=theme.split("<b:skin><![CDATA[")[1].split("]]>")[0];
const css=fs.readFileSync(R+'/assets/css/smart-choice.css','utf8').split('\n').filter(l=>!l.startsWith('@import')).join('\n');
const js=fs.readFileSync(R+'/assets/js/smart-choice.js','utf8');
const bundle=JSON.parse(fs.readFileSync(R+'/assets/content/bundle.json','utf8'));
const pageT=(t)=>bundle.items.find(i=>i.title.startsWith(t)).html;
const shell=(inner)=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${skin}</style><style>${css}</style></head><body>
<div class='sc-top'><div class='sc-wrap'>أدوات مجانية تساعدك تحسب وتقارن وتختار بوعي</div></div>
<header class='sc-head'><div class='sc-wrap sc-headin'><a class='sc-brand' href='/'>Smart <span>Choice</span></a><nav class='sc-nav'><a href='/'>الرئيسية</a><a href='/p/tools.html'>الأدوات</a></nav></div></header>
<main class='sc-wrap sc-main' id='main-content'>${inner}</main>
<footer class='sc-footer'><div class='sc-wrap'><strong>Smart Choice</strong><div>أدوات عملية لقرارات يومية أفضل.</div><div class='sc-footlinks'><a href='#'>من نحن</a><a href='#'>سياسة الخصوصية</a></div><small>© Smart Choice · Created by Taha</small></div></footer></body></html>`;
const pages=[['الأدوات الذكية','tools.html'],['مقارنة','compare.html'],['مركز القرار','decide.html'],['من نحن','about.html']];
const posts=bundle.items.filter(i=>i.kind==='post').slice(0,6);
const b=await chromium.launch(); const errs=[];
async function shot(name,url,inner,vp,actions){
  const ctx=await b.newContext({viewport:vp,locale:'ar-EG'}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(name+': '+e.message));
  await p.route('https://x.test/feeds/pages/**',r=>r.fulfill({json:{feed:{entry:pages.map(([t,f])=>({title:{$t:t+' | Smart Choice'},link:[{rel:'alternate',href:'https://x.test/p/'+f}]}))}}}));
  await p.route('https://x.test/feeds/posts/**',r=>r.fulfill({json:{feed:{entry:posts.map((x,i)=>({title:{$t:x.title},summary:{$t:x.html.replace(/<[^>]*>/g,' ').slice(0,200)},category:[{term:'التسوق الذكي'}],link:[{rel:'alternate',href:'https://x.test/2026/10/p'+i+'.html'}]}))}}}));
  await p.route('https://x.test/p/**',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:shell(url.includes('tools')?'':'')}));
  await p.route('https://x.test/',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:shell(inner)}));
  await p.route('https://x.test/page',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:shell(inner)}));
  await p.goto(url); await p.addScriptTag({content:js}); await p.waitForTimeout(1200);
  if(actions) await actions(p);
  await p.waitForTimeout(500);
  await p.screenshot({path:`/tmp/qa-${name}.png`,fullPage:true}); await ctx.close();
}
const D={width:1280,height:900}, M={width:390,height:800};
await (async()=>{const ctx=await b.newContext({viewport:D,locale:'ar-EG'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.route('https://x.test/feeds/posts/**',r=>r.fulfill({json:{feed:{entry:posts.map((x,i)=>({title:{$t:x.title},category:[{term:'التسوق الذكي'}],link:[{rel:'alternate',href:'https://x.test/2026/10/p'+i+'.html'}]}))}}}));
await p.route('https://x.test/feeds/pages/**',r=>r.fulfill({json:{feed:{entry:[]}}}));
await p.route('https://x.test/2026/10/p0.html',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:shell('<article class="sc-post"><h1 class="post-title">'+posts[0].title+'</h1><div class="post-body entry-content">'+posts[0].html+'</div></article>')}));
await p.goto('https://x.test/2026/10/p0.html');await p.addScriptTag({content:js});await p.waitForTimeout(2500);
console.log('readtime:',await p.textContent('.sc-readtime'),'| share links',await p.$$eval('.sc-share a',e=>e.length),'| related',await p.$$eval('.sc-related .sc-card',e=>e.length),'| search',await p.$$eval('.sc-search',e=>e.length),'| ld',await p.$$eval('script[type="application/ld+json"]',e=>e.length));
await p.evaluate(()=>window.scrollTo(0,1500));await p.waitForTimeout(400);await p.screenshot({path:'/tmp/qa-post2.png'});
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(300);await p.screenshot({path:'/tmp/qa-post3.png'});await ctx.close();})();
console.log('errors',errs.length?errs:'none'); await b.close();
