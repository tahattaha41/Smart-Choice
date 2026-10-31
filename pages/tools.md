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
  <button type="button" data-tab="vat" aria-selected="false">الضريبة</button>
  <button type="button" data-tab="compare" aria-selected="false">مقارنة المنتجات</button>
  <button type="button" data-tab="decide" aria-selected="false">مركز القرار</button>
  <button type="button" data-tab="loan" aria-selected="false">القرض</button>
  <button type="button" data-tab="margin" aria-selected="false">هامش الربح</button>
  <button type="button" data-tab="split" aria-selected="false">قسمة الفاتورة</button>
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
<section class="sc-tool-card sc-tool" id="sc-vat" hidden>
<h2>حاسبة ضريبة القيمة المضافة</h2><p class="sc-muted">أضف الضريبة إلى سعر، أو استخرجها من سعر نهائي. النسبة تختلف حسب السلعة والبلد، فتأكد منها من مصدر رسمي.</p>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-vat-amount">المبلغ</label><input id="sc-vat-amount" type="number" min="0" step="any" inputmode="decimal"></div>
<div class="sc-field"><label for="sc-vat-rate">نسبة الضريبة %</label><input id="sc-vat-rate" type="number" min="0" step="any" inputmode="decimal"></div>
<div class="sc-field"><label for="sc-vat-mode">العملية</label><select id="sc-vat-mode"><option value="add">إضافة الضريبة إلى السعر</option><option value="extract">استخراج الضريبة من السعر النهائي</option></select></div>
</div><div class="sc-tool-result" id="sc-vat-result" aria-live="polite">أدخل المبلغ والنسبة.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-compare" hidden>
<h2>مقارنة منتجين بالتكلفة الشهرية الحقيقية</h2><p class="sc-muted">المنتج الأرخص اليوم قد يكون الأغلى على المدى الطويل. أدخل أرقامك أنت: السعر وتكاليف الملحقات والشحن وعمرك المتوقع للاستخدام بالأشهر.</p>
<div class="sc-tool-grid">
<div class="sc-field"><label for="sc-c-p1">سعر المنتج الأول</label><input id="sc-c-p1" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-c-e1">ملحقات/شحن المنتج الأول</label><input id="sc-c-e1" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-c-l1">عمر الاستخدام المتوقع (أشهر)</label><input id="sc-c-l1" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-c-w1">الضمان (أشهر)</label><input id="sc-c-w1" type="number" min="0" step="any" inputmode="decimal"></div>
<div class="sc-field"><label for="sc-c-p2">سعر المنتج الثاني</label><input id="sc-c-p2" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-c-e2">ملحقات/شحن المنتج الثاني</label><input id="sc-c-e2" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-c-l2">عمر الاستخدام المتوقع (أشهر)</label><input id="sc-c-l2" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-c-w2">الضمان (أشهر)</label><input id="sc-c-w2" type="number" min="0" step="any" inputmode="decimal"></div>
</div><div class="sc-tool-result" id="sc-compare-result" aria-live="polite">أدخل بيانات المنتجين.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-decide" hidden>
<h2>مركز القرار: مصفوفة قرار بأوزانك</h2><p class="sc-muted">اكتب خياراتك ومعايير مهمة لك، أعطِ كل معيار وزنًا من 0 إلى 10 ودرجة لكل خيار من 0 إلى 10. الترتيب يعتمد على تقديرك أنت، وليس على بيانات سوق.</p>
<div class="sc-tbl"><table class="sc-matrix"><thead><tr><th scope="col">المعيار</th><th scope="col">الوزن</th><th scope="col"><input id="sc-d-o0" type="text" value="الخيار A" aria-label="اسم الخيار 1"></th><th scope="col"><input id="sc-d-o1" type="text" value="الخيار B" aria-label="اسم الخيار 2"></th><th scope="col"><input id="sc-d-o2" type="text" value="الخيار C" aria-label="اسم الخيار 3"></th></tr></thead><tbody><tr><th scope="row"><input id="sc-d-c0" type="text" value="السعر" aria-label="المعيار 1"></th><td><input id="sc-d-w0" type="number" min="0" max="10" step="1" value="3" aria-label="وزن المعيار 1"></td><td><input id="sc-d-s0-0" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 1 في المعيار 1"></td><td><input id="sc-d-s0-1" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 2 في المعيار 1"></td><td><input id="sc-d-s0-2" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 3 في المعيار 1"></td></tr><tr><th scope="row"><input id="sc-d-c1" type="text" value="الجودة" aria-label="المعيار 2"></th><td><input id="sc-d-w1" type="number" min="0" max="10" step="1" value="3" aria-label="وزن المعيار 2"></td><td><input id="sc-d-s1-0" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 1 في المعيار 2"></td><td><input id="sc-d-s1-1" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 2 في المعيار 2"></td><td><input id="sc-d-s1-2" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 3 في المعيار 2"></td></tr><tr><th scope="row"><input id="sc-d-c2" type="text" value="الضمان والدعم" aria-label="المعيار 3"></th><td><input id="sc-d-w2" type="number" min="0" max="10" step="1" value="3" aria-label="وزن المعيار 3"></td><td><input id="sc-d-s2-0" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 1 في المعيار 3"></td><td><input id="sc-d-s2-1" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 2 في المعيار 3"></td><td><input id="sc-d-s2-2" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 3 في المعيار 3"></td></tr><tr><th scope="row"><input id="sc-d-c3" type="text" value="الملاءمة لاحتياجي" aria-label="المعيار 4"></th><td><input id="sc-d-w3" type="number" min="0" max="10" step="1" value="3" aria-label="وزن المعيار 4"></td><td><input id="sc-d-s3-0" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 1 في المعيار 4"></td><td><input id="sc-d-s3-1" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 2 في المعيار 4"></td><td><input id="sc-d-s3-2" type="number" min="0" max="10" step="1" aria-label="درجة الخيار 3 في المعيار 4"></td></tr></tbody></table></div>
<div class="sc-tool-result" id="sc-decide-result" aria-live="polite">أدخل الدرجات لعرض الترتيب.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-loan" hidden>
<h2>حاسبة القسط الشهري للقرض</h2><p class="sc-muted">قرض بفائدة سنوية ثابتة ومدة بالأشهر. النتيجة تقديرية ولا تشمل الرسوم أو التأمين.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-loan-amount">مبلغ القرض</label><input id="sc-loan-amount" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-loan-rate">الفائدة السنوية %</label><input id="sc-loan-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-loan-months">المدة (أشهر)</label><input id="sc-loan-months" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-loan-result" aria-live="polite">أدخل بيانات القرض.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-margin" hidden>
<h2>حاسبة هامش الربح</h2><p class="sc-muted">أدخل التكلفة وسعر البيع لمعرفة الربح والهامش ونسبة الزيادة على التكلفة.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-margin-cost">التكلفة</label><input id="sc-margin-cost" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-margin-price">سعر البيع</label><input id="sc-margin-price" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-margin-result" aria-live="polite">أدخل التكلفة وسعر البيع.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-split" hidden>
<h2>قسمة الفاتورة</h2><p class="sc-muted">قسّم إجمالي الفاتورة بين عدة أشخاص مع نسبة إكرامية اختيارية.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-split-total">إجمالي الفاتورة</label><input id="sc-split-total" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-split-tip">الإكرامية %</label><input id="sc-split-tip" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-split-people">عدد الأشخاص</label><input id="sc-split-people" type="number" min="0" step="any" inputmode="decimal" value="2"></div></div>
<div class="sc-tool-result" id="sc-split-result" aria-live="polite">أدخل إجمالي الفاتورة.</div>
</section>

<p class="sc-muted">ملاحظة: النتائج حسابية بناءً على البيانات التي تدخلها، ولا تمثل أسعار سوق مباشرة أو نصيحة مالية.</p>
</div>