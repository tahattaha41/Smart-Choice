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
    <div class="sc-field"><label for="sc-price">السعر الأصلي</label><input id="sc-price" type="number" min="0" step="0.01" inputmode="decimal"></div>
    <div class="sc-field"><label for="sc-rate">نسبة الخصم %</label><input id="sc-rate" type="number" min="0" max="100" step="0.1" inputmode="decimal"></div>
  </div>
  <div class="sc-tool-result" aria-live="polite">السعر بعد الخصم: <strong id="sc-final">أدخل البيانات</strong><br>قيمة التوفير: <b id="sc-discount-saved">—</b></div>
</section>
<section class="sc-tool-card sc-tool" id="sc-budget" hidden>
  <h2>حاسبة الميزانية الشهرية</h2><p class="sc-muted">اكتب دخلك ومصروفاتك لتعرف المتبقي ونسبة ما تنفقه.</p>
  <div class="sc-tool-grid">
    <div class="sc-field"><label for="sc-income">الدخل الشهري</label><input id="sc-income" type="number" min="0" step="0.01" inputmode="decimal"></div>
    <div class="sc-field"><label for="sc-expenses">إجمالي المصروفات</label><input id="sc-expenses" type="number" min="0" step="0.01" inputmode="decimal"></div>
  </div>
  <div class="sc-tool-result" aria-live="polite">المتبقي: <strong id="sc-balance">أدخل البيانات</strong><br>نسبة الإنفاق: <b id="sc-ratio">—</b></div>
</section>
<section class="sc-tool-card sc-tool" id="sc-unit" hidden>
  <h2>مقارنة سعر الوحدة</h2><p class="sc-muted">قارن منتجين على أساس السعر لكل وحدة قياس. استخدم نفس نوع الوحدة للمنتجين.</p>
  <div class="sc-tool-grid">
    <div><h3>المنتج الأول</h3><div class="sc-field"><label for="sc-p1">السعر</label><input id="sc-p1" type="number" min="0" step="0.01" inputmode="decimal"></div><div class="sc-field"><label for="sc-q1">الكمية</label><input id="sc-q1" type="number" min="0" step="0.01" inputmode="decimal"></div></div>
    <div><h3>المنتج الثاني</h3><div class="sc-field"><label for="sc-p2">السعر</label><input id="sc-p2" type="number" min="0" step="0.01" inputmode="decimal"></div><div class="sc-field"><label for="sc-q2">الكمية</label><input id="sc-q2" type="number" min="0" step="0.01" inputmode="decimal"></div></div>
  </div>
  <div class="sc-tool-result" aria-live="polite" id="sc-unit-result">أدخل الأسعار والكميات للمقارنة.</div>
</section>

<nav class="sc-tabs" aria-label="المزيد من الأدوات">
  <button type="button" data-tab="percent" aria-selected="false">النسبة المئوية</button>
  <button type="button" data-tab="saving" aria-selected="false">هدف الادخار</button>
  <button type="button" data-tab="total" aria-selected="false">التكلفة الإجمالية</button>
  <button type="button" data-tab="installment" aria-selected="false">التقسيط</button>
  <button type="button" data-tab="convert" aria-selected="false">تحويل الوحدات</button>
  <button type="button" data-tab="dates" aria-selected="false">فرق الأيام</button>
</nav>
<section class="sc-tool-card sc-tool" id="sc-percent" hidden>
<h2>حاسبة النسبة المئوية والتغير</h2>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-base">القيمة الأصلية</label><input id="sc-base" type="number" step="any" inputmode="decimal"></div>
<div class="sc-field"><label for="sc-new">القيمة الجديدة</label><input id="sc-new" type="number" step="any" inputmode="decimal"></div>
</div><div class="sc-tool-result" id="sc-percent-result" aria-live="polite">أدخل القيمتين.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-saving" hidden>
<h2>حاسبة هدف الادخار</h2>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-target">المبلغ المستهدف</label><input id="sc-target" type="number" min="0" step="any"></div>
<div class="sc-field"><label for="sc-saved">المبلغ الذي ادخرته</label><input id="sc-saved" type="number" min="0" step="any"></div>
<div class="sc-field"><label for="sc-monthly">الادخار الشهري</label><input id="sc-monthly" type="number" min="0" step="any"></div>
</div><div class="sc-tool-result" id="sc-saving-result" aria-live="polite">أدخل البيانات لمعرفة المدة المتوقعة.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-total" hidden>
<h2>حاسبة التكلفة الإجمالية</h2>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-item">السعر الأساسي</label><input id="sc-item" type="number" min="0" step="any"></div>
<div class="sc-field"><label for="sc-shipping">الشحن</label><input id="sc-shipping" type="number" min="0" step="any"></div>
<div class="sc-field"><label for="sc-fees">رسوم إضافية</label><input id="sc-fees" type="number" min="0" step="any"></div>
</div><div class="sc-tool-result" id="sc-total-result" aria-live="polite">أدخل القيم لحساب الإجمالي.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-installment" hidden>
<h2>حاسبة التقسيط</h2>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-cash">السعر النقدي</label><input id="sc-cash" type="number" min="0" step="any"></div>
<div class="sc-field"><label for="sc-down">المقدم</label><input id="sc-down" type="number" min="0" step="any"></div>
<div class="sc-field"><label for="sc-months">عدد الشهور</label><input id="sc-months" type="number" min="1" step="1"></div>
<div class="sc-field"><label for="sc-monthpay">قيمة القسط الشهري</label><input id="sc-monthpay" type="number" min="0" step="any"></div>
</div><div class="sc-tool-result" id="sc-installment-result" aria-live="polite">أدخل بيانات العرض.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-convert" hidden>
<h2>محول الوحدات</h2>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-convert-value">القيمة</label><input id="sc-convert-value" type="number" step="any"></div>
<div class="sc-field"><label for="sc-convert-type">نوع التحويل</label><select id="sc-convert-type"><option value="kg-g">كيلوجرام إلى جرام</option><option value="g-kg">جرام إلى كيلوجرام</option><option value="l-ml">لتر إلى ملليلتر</option><option value="ml-l">ملليلتر إلى لتر</option><option value="m-cm">متر إلى سنتيمتر</option><option value="cm-m">سنتيمتر إلى متر</option><option value="km-m">كيلومتر إلى متر</option><option value="m-km">متر إلى كيلومتر</option></select></div>
</div><div class="sc-tool-result" id="sc-convert-result" aria-live="polite">أدخل القيمة واختر التحويل.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-dates" hidden>
<h2>حاسبة فرق الأيام</h2>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-date1">التاريخ الأول</label><input id="sc-date1" type="date"></div>
<div class="sc-field"><label for="sc-date2">التاريخ الثاني</label><input id="sc-date2" type="date"></div>
</div><div class="sc-tool-result" id="sc-dates-result" aria-live="polite">اختر تاريخين.</div>
</section>

<p class="sc-muted">ملاحظة: النتائج حسابية بناءً على البيانات التي تدخلها، ولا تمثل أسعار سوق مباشرة أو نصيحة مالية.</p>
</div>