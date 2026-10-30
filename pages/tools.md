---
title: الأدوات الذكية | Smart Choice
labels: أدوات, Smart Choice
publish: true
---
<!-- Smart Choice interactive tools: responsive RTL, no external libraries -->
<div class="sc-page" dir="rtl" lang="ar">
<style>
.sc-page{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#182338;max-width:980px;margin:auto;line-height:1.8}
.sc-hero{background:linear-gradient(130deg,#102b50,#176b87);color:#fff;padding:28px;border-radius:22px;margin:16px 0 24px}
.sc-hero h1{font-size:clamp(26px,5vw,38px);margin:0 0 8px}.sc-hero p{margin:0;color:#e4f1fa}
.sc-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.sc-tabs button,.sc-btn{border:0;border-radius:12px;padding:11px 16px;background:#176b87;color:#fff;font-weight:700;cursor:pointer}
.sc-tabs button[aria-selected=true]{background:#102b50}.sc-card{border:1px solid #dce5ed;border-radius:18px;padding:20px;margin:14px 0;background:#fff;box-shadow:0 5px 20px #102b500d}
.sc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}.sc-field label{display:block;font-weight:650;margin-bottom:5px}.sc-field input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #cbd5df;border-radius:10px;font:inherit}
.sc-result{background:#eef7f8;border:1px solid #c8e3e7;padding:14px;border-radius:12px;margin-top:14px}.sc-result strong{font-size:24px;color:#10566e}.sc-muted{color:#5c6c7e;font-size:14px}.sc-tool[hidden]{display:none}
</style>
<section class="sc-hero"><h1>أدوات Smart Choice الذكية</h1><p>احسب، قارن، وخطط ببياناتك أنت. كل النتائج تُحسب داخل متصفحك ولا تحتاج إلى تسجيل.</p></section>
<nav class="sc-tabs" aria-label="اختيار الأداة">
<button type="button" data-tab="discount" aria-selected="true">حاسبة الخصم</button>
<button type="button" data-tab="budget" aria-selected="false">الميزانية الشهرية</button>
<button type="button" data-tab="unit" aria-selected="false">مقارنة سعر الوحدة</button>
</nav>
<section class="sc-card sc-tool" id="sc-discount">
<h2>حاسبة الخصم والسعر النهائي</h2><p class="sc-muted">أدخل السعر والخصم لمعرفة ما ستدفعه وقيمة التوفير.</p>
<div class="sc-grid">
<div class="sc-field"><label for="sc-price">السعر الأصلي</label><input id="sc-price" type="number" min="0" step="0.01" value="1500"></div>
<div class="sc-field"><label for="sc-rate">نسبة الخصم %</label><input id="sc-rate" type="number" min="0" max="100" step="0.1" value="20"></div>
</div><div class="sc-result" aria-live="polite">السعر بعد الخصم: <strong id="sc-final">1,200</strong><br>قيمة التوفير: <b id="sc-saving">300</b></div>
</section>
<section class="sc-card sc-tool" id="sc-budget" hidden>
<h2>حاسبة الميزانية الشهرية</h2><p class="sc-muted">اكتب دخلك ومصروفاتك لتعرف المتبقي ونسبة ما تنفقه.</p>
<div class="sc-grid">
<div class="sc-field"><label for="sc-income">الدخل الشهري</label><input id="sc-income" type="number" min="0" value="10000"></div>
<div class="sc-field"><label for="sc-expenses">إجمالي المصروفات</label><input id="sc-expenses" type="number" min="0" value="6500"></div>
</div><div class="sc-result" aria-live="polite">المتبقي: <strong id="sc-balance">3,500</strong><br>نسبة الإنفاق: <b id="sc-ratio">65%</b></div>
</section>
<section class="sc-card sc-tool" id="sc-unit" hidden>
<h2>مقارنة سعر الوحدة</h2><p class="sc-muted">قارن منتجين على أساس السعر لكل وحدة قياس. أدخل نفس نوع الوحدة للمنتجين.</p>
<div class="sc-grid">
<div><h3>المنتج الأول</h3><div class="sc-field"><label for="sc-p1">السعر</label><input id="sc-p1" type="number" min="0" step="0.01" value="120"></div><div class="sc-field"><label for="sc-q1">الكمية</label><input id="sc-q1" type="number" min="0" step="0.01" value="500"></div></div>
<div><h3>المنتج الثاني</h3><div class="sc-field"><label for="sc-p2">السعر</label><input id="sc-p2" type="number" min="0" step="0.01" value="180"></div><div class="sc-field"><label for="sc-q2">الكمية</label><input id="sc-q2" type="number" min="0" step="0.01" value="900"></div></div>
</div><div class="sc-result" aria-live="polite" id="sc-unit-result">أدخل الأسعار والكميات للمقارنة.</div>
</section>
<p class="sc-muted">ملاحظة: النتائج حسابية بناءً على البيانات التي تدخلها، ولا تمثل أسعار سوق مباشرة أو نصيحة مالية.</p>
</div>
<script>
(function(){
const root=document.querySelector('.sc-page');if(!root)return;
const $=id=>root.querySelector('#'+id),num=id=>Number($(id).value),fmt=n=>n.toLocaleString('ar-EG',{maximumFractionDigits:2});
function discount(){let p=num('sc-price'),r=num('sc-rate');let ok=Number.isFinite(p)&&Number.isFinite(r)&&p>=0&&r>=0&&r<=100;$('sc-final').textContent=ok?fmt(p*(1-r/100)):'تحقق من المدخلات';$('sc-saving').textContent=ok?fmt(p*r/100):'—'}
function budget(){let i=num('sc-income'),e=num('sc-expenses'),ok=i>=0&&e>=0&&Number.isFinite(i)&&Number.isFinite(e);$('sc-balance').textContent=ok?fmt(i-e):'تحقق من المدخلات';$('sc-ratio').textContent=ok?(i?fmt(e/i*100)+'%':(e?'غير متاح':'0%')):'—'}
function unit(){let p1=num('sc-p1'),q1=num('sc-q1'),p2=num('sc-p2'),q2=num('sc-q2'),el=$('sc-unit-result');if([p1,q1,p2,q2].some(x=>!Number.isFinite(x)||x<0)||q1===0||q2===0){el.textContent='أدخل أسعارًا غير سالبة وكميات أكبر من صفر.';return}let a=p1/q1,b=p2/q2;el.innerHTML='سعر وحدة المنتج الأول: <b>'+fmt(a)+'</b><br>سعر وحدة المنتج الثاني: <b>'+fmt(b)+'</b><br><strong>'+(a===b?'السعر متساوٍ لكل وحدة':a<b?'المنتج الأول أوفر لكل وحدة':'المنتج الثاني أوفر لكل وحدة')+'</strong>'}
['sc-price','sc-rate'].forEach(id=>$(id).addEventListener('input',discount));
['sc-income','sc-expenses'].forEach(id=>$(id).addEventListener('input',budget));
['sc-p1','sc-q1','sc-p2','sc-q2'].forEach(id=>$(id).addEventListener('input',unit));
root.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{root.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===btn)));root.querySelectorAll('.sc-tool').forEach(s=>s.hidden=s.id!=='sc-'+btn.dataset.tab)}));
discount();budget();unit();
})();
</script>