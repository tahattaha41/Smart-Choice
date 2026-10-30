---
title: الأدوات الذكية | Smart Choice
labels: أدوات, Smart Choice
publish: true
---
<div class="sc-page" dir="rtl" lang="ar">
<section class="sc-tools-hero">
  <h1>أدوات Smart Choice الذكية</h1>
  <p>احسب، قارن، وخطط ببياناتك أنت. النتائج تُحسب داخل متصفحك ولا تحتاج إلى تسجيل.</p>
</section>
<nav class="sc-tabs" aria-label="اختيار الأداة">
  <button type="button" data-tab="discount" aria-selected="true">حاسبة الخصم</button>
  <button type="button" data-tab="budget" aria-selected="false">الميزانية الشهرية</button>
  <button type="button" data-tab="unit" aria-selected="false">مقارنة سعر الوحدة</button>
</nav>
<section class="sc-tool-card sc-tool" id="sc-discount">
  <h2>حاسبة الخصم والسعر النهائي</h2><p class="sc-muted">أدخل السعر والخصم لمعرفة ما ستدفعه وقيمة التوفير.</p>
  <div class="sc-tool-grid">
    <div class="sc-field"><label for="sc-price">السعر الأصلي</label><input id="sc-price" type="number" min="0" step="0.01" value="1500" inputmode="decimal"></div>
    <div class="sc-field"><label for="sc-rate">نسبة الخصم %</label><input id="sc-rate" type="number" min="0" max="100" step="0.1" value="20" inputmode="decimal"></div>
  </div>
  <div class="sc-tool-result" aria-live="polite">السعر بعد الخصم: <strong id="sc-final">١٬٢٠٠</strong><br>قيمة التوفير: <b id="sc-saving">٣٠٠</b></div>
</section>
<section class="sc-tool-card sc-tool" id="sc-budget" hidden>
  <h2>حاسبة الميزانية الشهرية</h2><p class="sc-muted">اكتب دخلك ومصروفاتك لتعرف المتبقي ونسبة ما تنفقه.</p>
  <div class="sc-tool-grid">
    <div class="sc-field"><label for="sc-income">الدخل الشهري</label><input id="sc-income" type="number" min="0" step="0.01" value="10000" inputmode="decimal"></div>
    <div class="sc-field"><label for="sc-expenses">إجمالي المصروفات</label><input id="sc-expenses" type="number" min="0" step="0.01" value="6500" inputmode="decimal"></div>
  </div>
  <div class="sc-tool-result" aria-live="polite">المتبقي: <strong id="sc-balance">٣٬٥٠٠</strong><br>نسبة الإنفاق: <b id="sc-ratio">٦٥٪</b></div>
</section>
<section class="sc-tool-card sc-tool" id="sc-unit" hidden>
  <h2>مقارنة سعر الوحدة</h2><p class="sc-muted">قارن منتجين على أساس السعر لكل وحدة قياس. استخدم نفس نوع الوحدة للمنتجين.</p>
  <div class="sc-tool-grid">
    <div><h3>المنتج الأول</h3><div class="sc-field"><label for="sc-p1">السعر</label><input id="sc-p1" type="number" min="0" step="0.01" value="120" inputmode="decimal"></div><div class="sc-field"><label for="sc-q1">الكمية</label><input id="sc-q1" type="number" min="0" step="0.01" value="500" inputmode="decimal"></div></div>
    <div><h3>المنتج الثاني</h3><div class="sc-field"><label for="sc-p2">السعر</label><input id="sc-p2" type="number" min="0" step="0.01" value="180" inputmode="decimal"></div><div class="sc-field"><label for="sc-q2">الكمية</label><input id="sc-q2" type="number" min="0" step="0.01" value="900" inputmode="decimal"></div></div>
  </div>
  <div class="sc-tool-result" aria-live="polite" id="sc-unit-result">أدخل الأسعار والكميات للمقارنة.</div>
</section>
<p class="sc-muted">ملاحظة: النتائج حسابية بناءً على البيانات التي تدخلها، ولا تمثل أسعار سوق مباشرة أو نصيحة مالية.</p>
</div>