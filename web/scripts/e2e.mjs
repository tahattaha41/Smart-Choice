// اختبار شامل في متصفح حقيقي. يتطلب Playwright، وخادماً يعرض مجلد dist على BASE_URL.
// الاستخدام: BASE_URL=http://127.0.0.1:8765/Smart-Choice node scripts/e2e.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import assert from 'node:assert/strict';

const B = process.env.BASE_URL || 'http://127.0.0.1:8765/Smart-Choice';
const browser = await chromium.launch();
const problems = [];
let passed = 0;
const step = async (name, fn) => { try { await fn(); passed++; console.log('  ✓', name); } catch (e) { problems.push(`${name}: ${e.message.split('\n')[0]}`); console.log('  ✗', name, '-', e.message.split('\n')[0]); } };

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...opts });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => problems.push(`pageerror ${p.url()}: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') problems.push(`console.error ${p.url()}: ${m.text()}`); });
  p.on('response', (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()} ${r.url()}`); });
  return { ctx, p };
}
const txt = (p, sel) => p.locator(sel).first().innerText();

console.log('المقارنة');
{
  const { ctx, p } = await newPage();
  await p.goto(`${B}/ar/compare/`, { waitUntil: 'networkidle' });
  await step('لا يوجد نص [object] في الصفحة', async () => assert.ok(!(await p.content()).includes('[object')));
  await step('6 نتائج للموبايلات', async () => assert.match(await txt(p, '.count'), /6/));
  await step('فلتر الميزانية يقلّل النتائج لاثنين', async () => { await p.fill('#f-max', '7000'); await p.waitForTimeout(150); assert.equal(await p.locator('.pcard').count(), 2); });
  await step('فلتر الحد الأدنى للرام', async () => { await p.fill('#f-max', ''); await p.selectOption('#f-ram_gb', '12'); await p.waitForTimeout(150); assert.equal(await p.locator('.pcard').count(), 2); await p.selectOption('#f-ram_gb', '0'); });
  await step('بحث بلا نتائج يعرض حالة فارغة', async () => { await p.fill('#f-q', 'zzzzzz'); await p.waitForTimeout(150); assert.equal(await p.locator('.pcard').count(), 0); assert.ok(await p.locator('.empty').count()); await p.fill('#f-q', ''); });
  await step('اختيار منتجين وعرض جدول المقارنة', async () => {
    await p.locator('.pcard[data-slug="p1"] .btn.sm[aria-pressed]').click();
    await p.locator('.pcard[data-slug="p3"] .btn.sm[aria-pressed]').click();
    assert.ok(await p.locator('.tray.show').count());
    await p.locator('.tray .btn.primary').click();
    await p.waitForSelector('table.cmp');
    assert.equal(await p.locator('table.cmp thead th').count(), 3);
    assert.ok((await p.locator('td.best').count()) > 0);
  });
  await step('الأفضل في الرام هو المنتج 3 (8 جيجا)', async () => { const row = p.locator('table.cmp tbody tr', { has: p.locator('th', { hasText: 'الرام' }) }); const cells = row.locator('td'); assert.ok(!(await cells.nth(0).getAttribute('class'))?.includes('best')); assert.ok((await cells.nth(1).getAttribute('class')).includes('best')); });
  await step('الرابط يحمل حالة المقارنة', async () => assert.match(p.url(), /cmp=p1(%2C|,)p3/));
  await step('إظهار الفروقات فقط يخفي الصفوف المتطابقة (p1 وp2 يتشابهان في البطارية والضمان)', async () => { await p.goto(`${B}/ar/compare/?c=phones&cmp=p1,p2&show=1`, { waitUntil: 'networkidle' }); const before = await p.locator('table.cmp tbody tr').count(); await p.check('#diff'); await p.waitForTimeout(100); assert.ok((await p.locator('table.cmp tbody tr').count()) < before); });
  await step('حد أقصى 4 منتجات', async () => { await p.goto(`${B}/ar/compare/?c=phones&cmp=p1,p3`, { waitUntil: 'networkidle' }); await p.locator('.pcard[data-slug="p2"] .btn.sm[aria-pressed]').click(); await p.locator('.pcard[data-slug="p4"] .btn.sm[aria-pressed]').click(); await p.locator('.pcard[data-slug="p5"] .btn.sm[aria-pressed]').click(); assert.equal(await p.locator('.tray-item').count(), 4); assert.ok(await p.locator('.toast.show').count()); });
  await step('تغيير القسم يمسح الاختيار', async () => { await p.locator('.filters .seg button', { hasText: 'اللابتوبات' }).click(); await p.waitForTimeout(150); assert.equal(await p.locator('.tray.show').count(), 0); assert.equal(await p.locator('.pcard').count(), 6); });
  await step('فتح الرابط المشارَك يعيد نفس المقارنة', async () => { await p.goto(`${B}/ar/compare/?c=phones&cmp=p1,p3&show=1`, { waitUntil: 'networkidle' }); assert.equal(await p.locator('table.cmp thead th').count(), 3); });
  await ctx.close();
}

console.log('مركز القرار');
{
  const { ctx, p } = await newPage();
  await p.goto(`${B}/ar/decide/`, { waitUntil: 'networkidle' });
  await step('لا يوجد نص [object]', async () => assert.ok(!(await p.content()).includes('[object')));
  await step('نتائج مرتبة بدرجات من 0 إلى 100', async () => { const s = await p.locator('.score b').allInnerTexts(); assert.ok(s.length >= 3); s.forEach((x) => assert.ok(+x >= 0 && +x <= 100)); const n = s.map(Number); assert.deepEqual(n, [...n].sort((a, b) => b - a)); });
  await step('وزن السعر فقط يجعل الأرخص أولاً', async () => {
    await p.evaluate(() => document.querySelectorAll('input[type=range]').forEach((el) => { el.value = el.id === 'w-price' ? '5' : '0'; el.dispatchEvent(new Event('input', { bubbles: true })); }));
    await p.waitForTimeout(200);
    assert.match(await txt(p, '.rank-item h3'), /١|1/);
  });
  await step('الميزانية تستبعد وتعرض رسالة', async () => { await p.fill('#d-budget', '10000'); await p.waitForTimeout(200); assert.ok((await p.locator('.rank-item').count()) <= 3); assert.match(await p.locator('.msg.info').first().innerText(), /3/); });
  await step('ميزانية صغيرة جداً تعرض حالة فارغة', async () => { await p.fill('#d-budget', '100'); await p.waitForTimeout(200); assert.equal(await p.locator('.rank-item').count(), 0); assert.ok(await p.locator('.empty').count()); });
  await step('كل الأوزان صفر تعرض تنبيهاً', async () => { await p.fill('#d-budget', ''); await p.evaluate(() => document.querySelectorAll('input[type=range]').forEach((el) => { el.value = '0'; el.dispatchEvent(new Event('input', { bubbles: true })); })); await p.waitForTimeout(200); assert.equal(await p.locator('.rank-item').count(), 0); assert.ok(await p.locator('.msg.info').count()); });
  await ctx.close();
}

console.log('الأدوات');
{
  const { ctx, p } = await newPage();
  await p.goto(`${B}/ar/tools/installment/?p=12000&d=2000&m=1000&n=12`, { waitUntil: 'networkidle' });
  await step('التقسيط: الإجمالي 14,000 والزيادة 2,000', async () => { const t = await p.locator('.kpis').innerText(); assert.match(t, /14,000/); assert.match(t, /2,000/); });
  await step('التقسيط: المعدل الفعلي بين 41% و43%', async () => { const big = await txt(p, '.kpi.big strong'); const v = parseFloat(big); assert.ok(v > 41 && v < 43, big); });
  await step('التقسيط: مقدم أكبر من السعر يعرض خطأ', async () => { await p.fill('#i-d', '13000'); await p.waitForTimeout(150); assert.ok(await p.locator('.msg.err').count()); });
  await step('التقسيط: التغيير يحدّث الرابط', async () => { await p.fill('#i-d', '0'); await p.waitForTimeout(150); assert.match(p.url(), /d=0/); });
  await p.goto(`${B}/ar/tools/vat/?p=2000&x=15&a=1000&r=14`, { waitUntil: 'networkidle' });
  await step('الخصم: 2000 بخصم 15% = 1,700', async () => assert.match(await p.locator('.kpis').first().innerText(), /1,700/));
  await step('الضريبة: 1000 + 14% = 1,140', async () => assert.match(await p.locator('.kpis').nth(1).innerText(), /1,140/));
  await step('الضريبة: استخراج من سعر شامل', async () => { await p.locator('.seg button').nth(1).click(); await p.waitForTimeout(150); assert.match(await p.locator('.kpis').nth(1).innerText(), /877/); });
  await p.goto(`${B}/ar/tools/ownership/?ap=20000&ay=3&ar=30&bp=30000&by=5&br=40`, { waitUntil: 'networkidle' });
  await step('الامتلاك: الخيار ب أوفر شهرياً', async () => assert.match(await txt(p, '.callout'), /الخيار ب/));
  await ctx.close();
}

console.log('المفضلة');
{
  const { ctx, p } = await newPage();
  await p.goto(`${B}/ar/products/p3/`, { waitUntil: 'networkidle' });
  await step('زر القلب يُضاف للمفضلة وعداد الهيدر يتحدث', async () => { await p.locator('aside .heart').click(); await p.waitForTimeout(150); assert.equal((await txt(p, '#fav-count')).trim(), '1'); });
  await step('صفحة المفضلة تعرض المنتج وتحتفظ به بعد التحديث', async () => { await p.goto(`${B}/ar/favorites/`, { waitUntil: 'networkidle' }); assert.equal(await p.locator('.pcard').count(), 1); await p.reload({ waitUntil: 'networkidle' }); assert.equal(await p.locator('.pcard').count(), 1); });
  await step('حفظ مقارنة يظهر في المفضلة', async () => { await p.goto(`${B}/ar/compare/?c=phones&cmp=p1,p2&show=1`, { waitUntil: 'networkidle' }); await p.locator('.cmp-head button', { hasText: 'احفظ' }).click(); await p.goto(`${B}/ar/favorites/`, { waitUntil: 'networkidle' }); assert.ok((await p.locator('.card h3').count()) >= 1); });
  await step('إزالة من المفضلة', async () => { await p.locator('.pcard .heart').click(); await p.waitForTimeout(150); assert.equal(await p.locator('.pcard').count(), 0); });
  await ctx.close();
}

console.log('الإنجليزية والتجاوب');
{
  const { ctx, p } = await newPage();
  await p.goto(`${B}/en/`, { waitUntil: 'networkidle' });
  await step('الإنجليزية: dir=ltr و lang=en', async () => { assert.equal(await p.getAttribute('html', 'dir'), 'ltr'); assert.equal(await p.getAttribute('html', 'lang'), 'en'); });
  await step('زر اللغة يذهب لنفس الصفحة بالعربية', async () => { await p.locator('.hdr-tools a').first().click(); await p.waitForLoadState(); assert.match(p.url(), /\/ar\/$/); assert.equal(await p.getAttribute('html', 'dir'), 'rtl'); });
  await p.goto(`${B}/en/compare/`, { waitUntil: 'networkidle' });
  await step('الإنجليزية: المقارنة تعمل', async () => { assert.match(await txt(p, '.count'), /6 results/); });
  await step('تبديل المظهر يحفظ الاختيار', async () => { await p.click('#theme-btn'); const th = await p.getAttribute('html', 'data-theme'); await p.reload({ waitUntil: 'networkidle' }); assert.equal(await p.getAttribute('html', 'data-theme'), th); });
  await ctx.close();
  const m = await newPage({ viewport: { width: 375, height: 800 }, hasTouch: true });
  for (const path of ['/ar/', '/ar/compare/', '/ar/decide/', '/ar/tools/installment/?p=1000&m=100&n=12', '/ar/products/p1/', '/ar/methodology/', '/en/compare/']) {
    await m.p.goto(B + path, { waitUntil: 'networkidle' });
    await step(`موبايل 375px بلا تمدد أفقي: ${path}`, async () => { const o = await m.p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.ok(o <= 1, o + 'px'); });
  }
  await step('قائمة الموبايل تفتح', async () => { await m.p.goto(`${B}/ar/`, { waitUntil: 'networkidle' }); await m.p.click('#menu-btn'); assert.ok(await m.p.locator('#nav.open').count()); });
  await m.ctx.close();
}

console.log('الروابط الداخلية');
{
  const { ctx, p } = await newPage();
  const seen = new Set(), queue = [`${B}/ar/`, `${B}/en/`];
  while (queue.length && seen.size < 80) {
    const u = queue.shift().split('#')[0]; if (seen.has(u)) continue; seen.add(u);
    const r = await p.goto(u, { waitUntil: 'domcontentloaded' });
    if (r.status() >= 400) { problems.push(`رابط مكسور ${u} => ${r.status()}`); continue; }
    const links = await p.$$eval('a[href]', (as) => as.map((a) => a.href));
    for (const l of links) if (l.startsWith(B) && !seen.has(l.split('#')[0]) && !/\.(xml|txt|svg)$/.test(l)) queue.push(l.split('?')[0]);
  }
  console.log(`  فُحصت ${seen.size} صفحة داخلية`);
  await ctx.close();
}

await browser.close();
console.log(`\nنجح ${passed} | مشاكل ${problems.length}`);
if (problems.length) { console.log([...new Set(problems)].map((x) => ' - ' + x).join('\n')); process.exit(1); }
