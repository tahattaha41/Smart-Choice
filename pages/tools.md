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
  <button type="button" data-tab="percent" aria-selected="false">النسبة المئوية</button>
  <button type="button" data-tab="saving" aria-selected="false">هدف الادخار</button>
  <button type="button" data-tab="total" aria-selected="false">التكلفة الإجمالية</button>
  <button type="button" data-tab="installment" aria-selected="false">التقسيط</button>
  <button type="button" data-tab="convert" aria-selected="false">تحويل الوحدات</button>
  <button type="button" data-tab="dates" aria-selected="false">فرق الأيام</button>
  <button type="button" data-tab="assistant" aria-selected="false">المساعد الذكي</button>
  <button type="button" data-tab="compound" aria-selected="false">نمو الادخار</button>
  <button type="button" data-tab="breakeven" aria-selected="false">نقطة التعادل</button>
  <button type="button" data-tab="hourly" aria-selected="false">قيمة ساعتك</button>
  <button type="button" data-tab="trip" aria-selected="false">تكلفة الرحلة</button>
  <button type="button" data-tab="fx" aria-selected="false">تحويل عملة</button>
  <button type="button" data-tab="bmi" aria-selected="false">كتلة الجسم BMI</button>
  <button type="button" data-tab="age" aria-selected="false">حاسبة العمر</button>
  <button type="button" data-tab="zakat" aria-selected="false">حاسبة الزكاة</button>
  <button type="button" data-tab="grade" aria-selected="false">الدرجة المطلوبة</button>
  <button type="button" data-tab="hijri" aria-selected="false">هجري ↔ ميلادي</button>
  <button type="button" data-tab="wordcount" aria-selected="false">عدّاد الكلمات</button>
  <button type="button" data-tab="calories" aria-selected="false">السعرات اليومية</button>
  <button type="button" data-tab="speed" aria-selected="false">السرعة والوتيرة</button>
  <button type="button" data-tab="roi" aria-selected="false">العائد على الاستثمار</button>
  <button type="button" data-tab="inflation" aria-selected="false">التضخم والقوة الشرائية</button>
  <button type="button" data-tab="stack" aria-selected="false">خصومات متتالية</button>
  <button type="button" data-tab="effrate" aria-selected="false">الفائدة الفعلية للتقسيط</button>
  <button type="button" data-tab="sub" aria-selected="false">اشتراك سنوي أم شهري</button>
  <button type="button" data-tab="rule72" aria-selected="false">مضاعفة المال (قاعدة 72)</button>
  <button type="button" data-tab="cashback" aria-selected="false">قيمة الكاش باك</button>
  <button type="button" data-tab="payoff" aria-selected="false">سداد القرض مبكراً</button>
  <button type="button" data-tab="taxeg" aria-selected="false">ضريبة المرتبات في مصر</button>
  <button type="button" data-tab="bankdep" aria-selected="false">عائد شهادة الادخار</button>
  <button type="button" data-tab="gold" aria-selected="false">حاسبة الذهب والمصنعية</button>
  <button type="button" data-tab="loancompare" aria-selected="false">مقارنة عرضي تمويل</button>
  <button type="button" data-tab="random" aria-selected="false">قرعة وأرقام عشوائية</button>
  <button type="button" data-tab="password" aria-selected="false">مولّد كلمات المرور</button>
</nav>
<section class="sc-tool-card sc-tool" id="sc-discount">
  <h2>حاسبة الخصم والسعر النهائي</h2><p class="sc-muted">أدخل السعر والخصم لمعرفة ما ستدفعه وقيمة التوفير.</p>
  <div class="sc-tool-grid">
    <div class="sc-field"><label for="sc-price">السعر الأصلي</label><input id="sc-price" type="number" min="0" step="0.01" inputmode="decimal"></div>
    <div class="sc-field"><label for="sc-rate">نسبة الخصم %</label><input id="sc-rate" type="number" min="0" max="100" step="0.1" inputmode="decimal"></div>
  </div>
  <div class="sc-tool-result sc-kpis" data-static="1" aria-live="polite"><div class="kpi"><span>السعر بعد الخصم</span><strong id="sc-final">أدخل البيانات</strong></div><div class="kpi"><span>قيمة التوفير</span><b id="sc-discount-saved">—</b></div></div>
</section>
<section class="sc-tool-card sc-tool" id="sc-budget" hidden>
  <h2>حاسبة الميزانية الشهرية</h2><p class="sc-muted">اكتب دخلك ومصروفاتك لتعرف المتبقي ونسبة ما تنفقه.</p>
  <div class="sc-tool-grid">
    <div class="sc-field"><label for="sc-income">الدخل الشهري</label><input id="sc-income" type="number" min="0" step="0.01" inputmode="decimal"></div>
    <div class="sc-field"><label for="sc-expenses">إجمالي المصروفات</label><input id="sc-expenses" type="number" min="0" step="0.01" inputmode="decimal"></div>
  </div>
  <div class="sc-tool-result sc-kpis" data-static="1" aria-live="polite"><div class="kpi"><span>المتبقي</span><strong id="sc-balance">أدخل البيانات</strong></div><div class="kpi"><span>نسبة الإنفاق</span><b id="sc-ratio">—</b></div></div>
</section>
<section class="sc-tool-card sc-tool" id="sc-unit" hidden>
  <h2>مقارنة سعر الوحدة</h2><p class="sc-muted">قارن منتجين على أساس السعر لكل وحدة قياس. استخدم نفس نوع الوحدة للمنتجين.</p>
  <div class="sc-tool-grid">
    <div><h3>المنتج الأول</h3><div class="sc-field"><label for="sc-p1">السعر</label><input id="sc-p1" type="number" min="0" step="0.01" inputmode="decimal"></div><div class="sc-field"><label for="sc-q1">الكمية</label><input id="sc-q1" type="number" min="0" step="0.01" inputmode="decimal"></div></div>
    <div><h3>المنتج الثاني</h3><div class="sc-field"><label for="sc-p2">السعر</label><input id="sc-p2" type="number" min="0" step="0.01" inputmode="decimal"></div><div class="sc-field"><label for="sc-q2">الكمية</label><input id="sc-q2" type="number" min="0" step="0.01" inputmode="decimal"></div></div>
  </div>
  <div class="sc-tool-result" aria-live="polite" id="sc-unit-result">أدخل الأسعار والكميات للمقارنة.</div>
</section>

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
<div class="sc-tool-result" id="sc-decide-result" data-static="1" aria-live="polite">أدخل الدرجات لعرض الترتيب.</div>
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

<section class="sc-tool-card sc-tool" id="sc-assistant" hidden>
<h2>المساعد الذكي</h2><p class="sc-muted">اكتب سؤالك بالعربية بأرقامك، مثل: «خصم 25% على 1800» أو «قرض 100000 بفائدة 12% لمدة سنتين». يفهم السؤال ويشغّل الأداة المناسبة ويعرض النتيجة. يعمل داخل متصفحك ولا يرسل ما تكتبه لأي جهة.</p>
<div class="sc-field"><label for="sc-ask">سؤالك</label><textarea id="sc-ask" rows="3" placeholder="مثال: ضريبة 14% على 5000"></textarea></div>
<div class="sc-actions"><button type="button" class="sc-ghost" id="sc-ask-go">اسأل</button><button type="button" class="sc-ghost sc-chip" data-q="خصم 25% على 1800">خصم 25% على 1800</button><button type="button" class="sc-ghost sc-chip" data-q="قرض 100000 بفائدة 12% لمدة سنتين">قرض 100000 بفائدة 12% سنتين</button><button type="button" class="sc-ghost sc-chip" data-q="تكلفة 80 وسعر البيع 100 كم الهامش">هامش: تكلفة 80 وبيع 100</button><button type="button" class="sc-ghost sc-chip" data-q="هدف ادخار 30000 وأدخر 2000 شهرياً">هدف ادخار 30000 بـ 2000 شهرياً</button></div>
<div class="sc-tool-result" id="sc-assistant-result" aria-live="polite" data-static="1">اكتب سؤالك أو اختر مثالاً.</div>
<p class="sc-muted" id="sc-assistant-open"></p>
</section>
<section class="sc-tool-card sc-tool" id="sc-compound" hidden>
<h2>نمو الادخار والفائدة المركبة</h2><p class="sc-muted">كم يصبح مبلغك بعد سنوات مع إضافة شهرية؟ أدخل معدل عائد سنوي تفترضه أنت؛ لا نعرض معدلات سوق ولا نضمن عائداً.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-cp-start">المبلغ الحالي</label><input id="sc-cp-start" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cp-add">الإضافة الشهرية</label><input id="sc-cp-add" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cp-rate">العائد السنوي المفترض %</label><input id="sc-cp-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cp-years">المدة بالسنوات</label><input id="sc-cp-years" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-compound-result" aria-live="polite">أدخل البيانات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-breakeven" hidden>
<h2>نقطة التعادل</h2><p class="sc-muted">كم وحدة تبيع حتى تغطي تكاليفك الثابتة؟ مفيد لأي مشروع صغير قبل تحديد السعر.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-be-fixed">التكاليف الثابتة الشهرية (إيجار، اشتراكات…)</label><input id="sc-be-fixed" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-be-price">سعر بيع الوحدة</label><input id="sc-be-price" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-be-var">التكلفة المتغيرة للوحدة</label><input id="sc-be-var" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-breakeven-result" aria-live="polite">أدخل البيانات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-hourly" hidden>
<h2>قيمة ساعتك وسعر الشراء بساعات العمل</h2><p class="sc-muted">اعرف كم تساوي ساعة عملك، وكم ساعة تحتاج لتدفع ثمن منتج ما.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-hr-income">دخلك الشهري الصافي</label><input id="sc-hr-income" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-hr-hours">ساعات العمل في اليوم</label><input id="sc-hr-hours" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-hr-days">أيام العمل في الأسبوع</label><input id="sc-hr-days" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-hr-price">سعر المنتج (اختياري)</label><input id="sc-hr-price" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-hourly-result" aria-live="polite">أدخل البيانات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-trip" hidden>
<h2>تكلفة الرحلة بالسيارة</h2><p class="sc-muted">احسب تكلفة الوقود للرحلة ونصيب كل راكب. استهلاك سيارتك وسعر اللتر من أرقامك أنت.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-trip-km">المسافة (كم)</label><input id="sc-trip-km" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-trip-cons">الاستهلاك (لتر/100 كم)</label><input id="sc-trip-cons" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-trip-price">سعر لتر الوقود</label><input id="sc-trip-price" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-trip-people">عدد الركاب (بمن فيهم السائق)</label><input id="sc-trip-people" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-trip-way">نوع الرحلة</label><select id="sc-trip-way"><option value="1">ذهاب فقط</option><option value="2">ذهاب وعودة</option></select></div></div>
<div class="sc-tool-result" id="sc-trip-result" aria-live="polite">أدخل البيانات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-fx" hidden>
<h2>تحويل العملة بسعر تحدده أنت</h2><p class="sc-muted">أدخل السعر الذي تراه في بنكك أو تطبيقك، أو اختر سعراً مرجعياً محدّثاً من الأسعار المعروضة أدناه (كم وحدة من العملة الهدف تساوي وحدة واحدة من الأصلية) وأضف عمولة إن وُجدت.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-fx-amount">المبلغ بالعملة الأصلية</label><input id="sc-fx-amount" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-fx-rate">سعر الصرف</label><input id="sc-fx-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-fx-fee">عمولة التحويل %</label><input id="sc-fx-fee" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-fx-result" aria-live="polite">أدخل البيانات.</div>
</section>

<section class="sc-tool-card sc-tool" id="sc-bmi" hidden>
<h2>حاسبة كتلة الجسم (BMI)</h2><p class="sc-muted">مؤشر عام للبالغين يقارن الوزن بالطول. ليس تشخيصاً طبياً، ولا يناسب الرياضيين والحوامل والأطفال.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-bmi-w">الوزن (كجم)</label><input id="sc-bmi-w" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-bmi-h">الطول (سم)</label><input id="sc-bmi-h" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-bmi-result" aria-live="polite">أدخل الوزن والطول.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-age" hidden>
<h2>حاسبة العمر</h2><p class="sc-muted">عمرك بالسنوات والشهور والأيام، وكم يوماً بقي على عيد ميلادك القادم.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-age-birth">تاريخ الميلاد</label><input id="sc-age-birth" type="date"></div><div class="sc-field"><label for="sc-age-to">حتى تاريخ (اتركه فارغاً لليوم)</label><input id="sc-age-to" type="date"></div></div>
<div class="sc-tool-result" id="sc-age-result" aria-live="polite">أدخل تاريخ الميلاد.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-zakat" hidden>
<h2>حاسبة الزكاة على المال</h2><p class="sc-muted">تقدير مبسّط لزكاة المال بنسبة 2.5% إذا بلغ صافي مالك النصاب وحال عليه الحول. أدخل قيمة النصاب الحالية من مصدر موثوق؛ لا نعرض أسعار ذهب. للفتوى في حالتك راجع جهة شرعية.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-z-cash">النقد والمدخرات</label><input id="sc-z-cash" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-z-gold">قيمة الذهب والفضة المدّخرة</label><input id="sc-z-gold" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-z-trade">عروض التجارة (بضاعة للبيع)</label><input id="sc-z-trade" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-z-debt">ديون حالّة عليك</label><input id="sc-z-debt" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-z-nisab">قيمة النصاب الحالية</label><input id="sc-z-nisab" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-zakat-result" aria-live="polite">أدخل بياناتك.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-grade" hidden>
<h2>الدرجة المطلوبة في الاختبار النهائي</h2><p class="sc-muted">كم تحتاج في الاختبار النهائي لتحقق الدرجة التي تريدها في المادة؟</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-g-cur">درجتك الحالية %</label><input id="sc-g-cur" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-g-weight">وزن الاختبار النهائي %</label><input id="sc-g-weight" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-g-target">الدرجة المستهدفة %</label><input id="sc-g-target" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-grade-result" aria-live="polite">أدخل البيانات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-hijri" hidden>
<h2>تحويل التاريخ الهجري والميلادي</h2><p class="sc-muted">تحويل بتقويم أم القرى المدمج في متصفحك. قد يختلف يوماً عن الرؤية الشرعية أو التقويم الرسمي في بلدك.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-h-greg">تاريخ ميلادي</label><input id="sc-h-greg" type="date"></div><div class="sc-field"><label for="sc-h-y">سنة هجرية</label><input id="sc-h-y" type="number" min="1300" max="1600" step="1" inputmode="numeric"></div><div class="sc-field"><label for="sc-h-m">شهر هجري (1–12)</label><input id="sc-h-m" type="number" min="1" max="12" step="1" inputmode="numeric"></div><div class="sc-field"><label for="sc-h-d">يوم هجري (1–30)</label><input id="sc-h-d" type="number" min="1" max="30" step="1" inputmode="numeric"></div></div>
<div class="sc-tool-result" id="sc-hijri-result" aria-live="polite">اختر تاريخاً ميلادياً أو أدخل تاريخاً هجرياً.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-wordcount" hidden>
<h2>عدّاد الكلمات والحروف</h2><p class="sc-muted">الصق نصاً لتعرف عدد الكلمات والحروف والجمل ووقت القراءة. النص لا يغادر متصفحك.</p>
<div class="sc-field"><label for="sc-wc-text">النص</label><textarea id="sc-wc-text" rows="7" placeholder="اكتب أو الصق النص هنا"></textarea></div>
<div class="sc-tool-result" id="sc-wordcount-result" aria-live="polite">ابدأ بالكتابة.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-password" hidden>
<h2>مولّد كلمات مرور قوية</h2><p class="sc-muted">كلمات عشوائية تُولَّد داخل متصفحك بمولّد أرقام عشوائي آمن (crypto) ولا تُرسل ولا تُحفظ في أي مكان.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-pw-len">الطول (8–64)</label><input id="sc-pw-len" type="number" min="8" max="64" step="1" inputmode="numeric"></div><div class="sc-field"><label>المحارف</label><label class="sc-check"><input type="checkbox" id="sc-pw-up" checked> أحرف كبيرة</label><label class="sc-check"><input type="checkbox" id="sc-pw-lo" checked> أحرف صغيرة</label><label class="sc-check"><input type="checkbox" id="sc-pw-di" checked> أرقام</label><label class="sc-check"><input type="checkbox" id="sc-pw-sy" checked> رموز</label></div></div>
<div class="sc-actions"><button type="button" class="sc-ghost" id="sc-pw-go">ولّد كلمة مرور</button><button type="button" class="sc-ghost" id="sc-pw-copy">نسخ</button></div>
<div class="sc-tool-result" id="sc-password-result" aria-live="polite" data-static="1" dir="ltr" style="direction:ltr;text-align:left;font-family:monospace;word-break:break-all">اضغط «ولّد كلمة مرور».</div>
<p class="sc-muted" id="sc-pw-strength"></p>
</section>

<section class="sc-tool-card sc-tool" id="sc-calories" hidden>
<h2>حاسبة السعرات اليومية</h2><p class="sc-muted">تقدير احتياجك اليومي بمعادلة Mifflin-St Jeor الشائعة. تقدير عام وليس خطة غذائية؛ استشر مختصاً عند وجود حالة صحية.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-cal-sex">الجنس</label><select id="sc-cal-sex"><option value="m">ذكر</option><option value="f">أنثى</option></select></div><div class="sc-field"><label for="sc-cal-age">العمر (سنة)</label><input id="sc-cal-age" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cal-w">الوزن (كجم)</label><input id="sc-cal-w" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cal-h">الطول (سم)</label><input id="sc-cal-h" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cal-act">مستوى النشاط</label><select id="sc-cal-act"><option value="1.2">قليل الحركة</option><option value="1.375">نشاط خفيف (1-3 أيام)</option><option value="1.55" selected>نشاط متوسط (3-5 أيام)</option><option value="1.725">نشاط عالٍ (6-7 أيام)</option></select></div></div>
<div class="sc-tool-result" id="sc-calories-result" aria-live="polite">أدخل بياناتك.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-speed" hidden>
<h2>السرعة والوتيرة</h2><p class="sc-muted">احسب متوسط سرعتك ووتيرة الجري أو المشي من المسافة والزمن.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-sp-km">المسافة (كم)</label><input id="sc-sp-km" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-sp-h">الساعات</label><input id="sc-sp-h" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-sp-m">الدقائق</label><input id="sc-sp-m" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-speed-result" aria-live="polite">أدخل المسافة والزمن.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-roi" hidden>
<h2>العائد على الاستثمار (ROI)</h2><p class="sc-muted">اعرف ربحك الفعلي ونسبة العائد الكلية والسنوية لأي استثمار أو مشروع صغير.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-roi-cost">المبلغ المستثمر</label><input id="sc-roi-cost" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-roi-final">القيمة النهائية (شاملة الأرباح)</label><input id="sc-roi-final" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-roi-years">المدة بالسنوات</label><input id="sc-roi-years" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-roi-result" aria-live="polite">أدخل المبلغ والقيمة النهائية.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-inflation" hidden>
<h2>التضخم والقوة الشرائية</h2><p class="sc-muted">كم ستكلّف سلعة بسعر اليوم بعد سنوات، وكم ستساوي مدخراتك فعلياً مع ارتفاع الأسعار.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-inf-amount">المبلغ اليوم</label><input id="sc-inf-amount" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-inf-rate">معدل التضخم السنوي %</label><input id="sc-inf-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-inf-years">عدد السنوات</label><input id="sc-inf-years" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-inflation-result" aria-live="polite">أدخل المبلغ ومعدل التضخم والمدة.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-stack" hidden>
<h2>خصومات متتالية وكوبون</h2><p class="sc-muted">خصمان متتاليان (مثل 20% ثم 10%) وكوبون ثابت: ما السعر النهائي والخصم الحقيقي؟ الخصمان لا يُجمعان عادةً.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-st-price">السعر الأصلي</label><input id="sc-st-price" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-st-d1">الخصم الأول %</label><input id="sc-st-d1" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-st-d2">الخصم الثاني %</label><input id="sc-st-d2" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-st-coupon">كوبون ثابت (اختياري)</label><input id="sc-st-coupon" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-stack-result" aria-live="polite">أدخل السعر والخصومات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-effrate" hidden>
<h2>الفائدة الفعلية للتقسيط</h2><p class="sc-muted">كثير من عروض التقسيط تُعلن «بدون فوائد» وسعر الكاش أقل. احسب الفائدة السنوية الحقيقية المخفية في القسط.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-er-cash">سعر الكاش</label><input id="sc-er-cash" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-er-down">المقدم (إن وجد)</label><input id="sc-er-down" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-er-months">عدد الأشهر</label><input id="sc-er-months" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-er-pay">القسط الشهري</label><input id="sc-er-pay" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-effrate-result" aria-live="polite">أدخل سعر الكاش والمقدم وعدد الأشهر والقسط.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-sub" hidden>
<h2>اشتراك سنوي أم شهري</h2><p class="sc-muted">اعرف هل الاشتراك السنوي يوفر فعلاً، وبعد كم شهر يتعادل مع الدفع الشهري.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-sb-month">سعر الاشتراك الشهري</label><input id="sc-sb-month" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-sb-year">سعر الاشتراك السنوي</label><input id="sc-sb-year" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-sub-result" aria-live="polite">أدخل سعر الباقتين.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-rule72" hidden>
<h2>مضاعفة المال وقاعدة 72</h2><p class="sc-muted">كم سنة يحتاج مبلغك ليتضاعف (أو يتضاعف أكثر) بعائد سنوي معيّن؟ تعرض النتيجة الدقيقة والتقدير بقاعدة 72.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-r7-rate">العائد السنوي %</label><input id="sc-r7-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-r7-mult">كم ضعفاً تريد (مثلاً 2)</label><input id="sc-r7-mult" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-rule72-result" aria-live="polite">أدخل العائد وعدد الأضعاف.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-cashback" hidden>
<h2>قيمة الكاش باك</h2><p class="sc-muted">هل بطاقة الكاش باك تستحق رسومها؟ احسب العائد السنوي الصافي مع سقف الاسترداد الشهري.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-cb-spend">إنفاقك الشهري بالبطاقة</label><input id="sc-cb-spend" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cb-pct">نسبة الكاش باك %</label><input id="sc-cb-pct" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cb-cap">سقف الكاش باك الشهري (اختياري)</label><input id="sc-cb-cap" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-cb-fee">الرسوم السنوية</label><input id="sc-cb-fee" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-cashback-result" aria-live="polite">أدخل الإنفاق والنسبة.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-payoff" hidden>
<h2>سداد القرض مبكراً</h2><p class="sc-muted">كم توفّر من الفوائد وكم شهراً تختصر لو دفعت مبلغاً إضافياً كل شهر؟</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-po-bal">المتبقي من القرض</label><input id="sc-po-bal" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-po-rate">الفائدة السنوية %</label><input id="sc-po-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-po-pay">القسط الشهري الحالي</label><input id="sc-po-pay" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-po-extra">مبلغ إضافي شهرياً</label><input id="sc-po-extra" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-payoff-result" aria-live="polite">أدخل المتبقي والفائدة والقسط والمبلغ الإضافي.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-taxeg" hidden>
<h2>حاسبة ضريبة الدخل على المرتبات في مصر</h2><p class="sc-muted">قدّر الضريبة وصافي راتبك الشهري حسب الشرائح المعلنة: معفى حتى 40 ألف جنيه سنوياً، ثم 10% و15% و20% و22.5% و25% و27.5%، مع إعفاء شخصي 20 ألف جنيه سنوياً.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-tx-gross">الراتب الشهري الإجمالي (جنيه)</label><input id="sc-tx-gross" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-tx-ins">خصم التأمينات الاجتماعية الشهري (من شيت المرتب)</label><input id="sc-tx-ins" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-taxeg-result" aria-live="polite">أدخل راتبك الشهري وخصم التأمينات.</div>
<p class="sc-muted">تقدير استرشادي بناءً على الشرائح المنشورة في أغسطس 2026 (المصدر: تقرير مصراوي بتاريخ 2/8/2026). لا يشمل أي إعفاءات أو خصومات خاصة بحالتك. المرجع النهائي هو شيت مرتبك وقسم الحسابات أو مصلحة الضرائب المصرية.</p>
</section>
<section class="sc-tool-card sc-tool" id="sc-bankdep" hidden>
<h2>عائد شهادة الادخار أو الوديعة</h2><p class="sc-muted">اعرف عائدك الشهري وإجمالي ما ستحصل عليه خلال مدة الشهادة، مع خصم ضريبة إن كانت مطبقة على عائدك.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-bd-amt">مبلغ الشهادة (جنيه)</label><input id="sc-bd-amt" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-bd-rate">العائد السنوي %</label><input id="sc-bd-rate" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-bd-months">المدة بالأشهر</label><input id="sc-bd-months" type="number" min="1" step="1" inputmode="numeric"></div><div class="sc-field"><label for="sc-bd-tax">ضريبة على العائد % (اختياري)</label><input id="sc-bd-tax" type="number" min="0" max="100" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-bankdep-result" aria-live="polite">أدخل المبلغ والعائد والمدة.</div>
<p class="sc-muted">الحساب لعائد يُصرف شهرياً دون إعادة استثمار. اسأل البنك عن نسبة العائد الحالية وأي ضريبة أو رسوم تنطبق على شهادتك.</p>
</section>
<section class="sc-tool-card sc-tool" id="sc-gold" hidden>
<h2>حاسبة الذهب والمصنعية</h2><p class="sc-muted">من سعر جرام عيار 21 احسب سعر العيارات الأخرى، وقيمة القطعة، وأثر المصنعية على الإجمالي قبل أن تدفع.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-gd-p21">سعر جرام عيار 21 اليوم (جنيه)</label><input id="sc-gd-p21" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-gd-w">وزن القطعة (جرام)</label><input id="sc-gd-w" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-gd-mk">المصنعية للجرام (جنيه)</label><input id="sc-gd-mk" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-gold-result" aria-live="polite">أدخل السعر والوزن والمصنعية.</div>
<p class="sc-muted">اكتب سعر الجرام الحالي من مصدر تثق به؛ الأداة لا تعرض أسعاراً مباشرة. لا تشمل الحسبة الدمغة أو أي ضرائب.</p>
</section>
<section class="sc-tool-card sc-tool" id="sc-loancompare" hidden>
<h2>مقارنة عرضي تمويل</h2><p class="sc-muted">قارن عرضين لنفس المبلغ بفائدة ومدة مختلفتين: أيهما أقل في إجمالي الفوائد وأيهما أخف في القسط؟</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-lc-amount">مبلغ التمويل</label><input id="sc-lc-amount" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-lc-ra">فائدة العرض (أ) سنوياً %</label><input id="sc-lc-ra" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-lc-ma">مدة العرض (أ) بالأشهر</label><input id="sc-lc-ma" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-lc-rb">فائدة العرض (ب) سنوياً %</label><input id="sc-lc-rb" type="number" min="0" step="any" inputmode="decimal"></div><div class="sc-field"><label for="sc-lc-mb">مدة العرض (ب) بالأشهر</label><input id="sc-lc-mb" type="number" min="0" step="any" inputmode="decimal"></div></div>
<div class="sc-tool-result" id="sc-loancompare-result" aria-live="polite">أدخل البيانات.</div>
</section>
<section class="sc-tool-card sc-tool" id="sc-random" hidden>
<h2>قرعة وأرقام عشوائية</h2><p class="sc-muted">ولّد أرقاماً عشوائية في نطاق، أو اختر عشوائياً من قائمة أسماء (واحد في كل سطر). يعمل بمولّد عشوائي آمن داخل متصفحك.</p>
<div class="sc-tool-grid"><div class="sc-field"><label for="sc-rn-min">من</label><input id="sc-rn-min" type="number" step="1" inputmode="numeric"></div><div class="sc-field"><label for="sc-rn-max">إلى</label><input id="sc-rn-max" type="number" step="1" inputmode="numeric"></div><div class="sc-field"><label for="sc-rn-count">كم رقماً</label><input id="sc-rn-count" type="number" min="1" max="50" step="1" inputmode="numeric"></div></div>
<div class="sc-field"><label for="sc-rn-list">أو قائمة للاختيار منها (اسم في كل سطر)</label><textarea id="sc-rn-list" rows="4" placeholder="أحمد&#10;سارة&#10;محمد"></textarea></div>
<div class="sc-actions"><button type="button" class="sc-ghost" id="sc-rn-go">ولّد أرقاماً</button><button type="button" class="sc-ghost" id="sc-rn-pick">اختر من القائمة</button></div>
<div class="sc-tool-result" id="sc-random-result" aria-live="polite" data-static="1">اضغط أحد الزرين.</div>
</section>

<p class="sc-muted">ملاحظة: النتائج حسابية بناءً على البيانات التي تدخلها، ولا تمثل أسعار سوق مباشرة أو نصيحة مالية.</p>
</div>