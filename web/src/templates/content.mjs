import { installment, ownership, compareOwnership } from '../lib/finance.mjs';
import { money, pct, escapeHtml as esc } from '../lib/format.mjs';

const ex1 = installment({ price: 12000, down: 2000, monthly: 1000, months: 12 });
const oA = ownership({ price: 20000, years: 3, resalePct: 30 });
const oB = ownership({ price: 30000, years: 5, resalePct: 40 });
const exOwn = compareOwnership(oA, oB);

const mail = (cfg, lang) => cfg.contactEmail
  ? `<a href="mailto:${esc(cfg.contactEmail)}">${esc(cfg.contactEmail)}</a>`
  : (lang === 'ar' ? '<em>(سيُضاف بريد التواصل قبل الإطلاق الرسمي)</em>' : '<em>(a contact email will be added before the official launch)</em>');

export const toolContent = {
  installment: {
    ar: `<h2>كيف تُحسب النتيجة؟</h2>
<ul><li><b>إجمالي ما ستدفعه</b> = المقدم + المصاريف الإدارية + (القسط الشهري × عدد الأشهر).</li>
<li><b>الزيادة عن الكاش</b> = الإجمالي − السعر نقداً.</li>
<li><b>المعدل السنوي الفعلي</b>: نحسب المعدل الشهري الذي يجعل القيمة الحالية للأقساط تساوي المبلغ الممول فعلاً (السعر − المقدم − المصاريف)، ثم نحوله إلى معدل سنوي فعلي بالصيغة <code>(1 + r)^12 − 1</code>.</li></ul>
<div class="example"><b>مثال:</b> سعر الكاش ${money(12000)} ج.م، مقدم ${money(2000)}، وقسط ${money(1000)} لمدة 12 شهراً. الإجمالي ${money(ex1.total)} ج.م، والزيادة ${money(ex1.extra)} ج.م (${pct(ex1.extraPct)} من السعر)، والمعدل السنوي الفعلي نحو ${pct(ex1.effectiveAnnual)}.</div>
<h2>ملاحظات</h2>
<ul><li>النتيجة تقريبية لأغراض المقارنة، ولا تمثل عرضاً من أي جهة تمويل. راجع العقد قبل التوقيع.</li>
<li>أدخل المصاريف الإدارية أو التأمين إن وُجدت، فهي ترفع المعدل الفعلي.</li>
<li>إن كان إجمالي التقسيط أقل من سعر الكاش فلا تُحسب فائدة.</li>
<li>لا تُرسل القيم التي تدخلها لأي جهة؛ الحساب يتم في متصفحك.</li></ul>`,
    en: `<h2>How is the result calculated?</h2>
<ul><li><b>Total you will pay</b> = down payment + admin fees + (monthly installment × number of months).</li>
<li><b>Extra over cash</b> = total − cash price.</li>
<li><b>Effective annual rate</b>: we solve for the monthly rate that makes the present value of the installments equal the amount actually financed (price − down payment − fees), then convert it to an effective annual rate with <code>(1 + r)^12 − 1</code>.</li></ul>
<div class="example"><b>Example:</b> cash price ${money(12000)} EGP, down payment ${money(2000)}, and ${money(1000)} per month for 12 months. The total is ${money(ex1.total)} EGP, the extra is ${money(ex1.extra)} EGP (${pct(ex1.extraPct)} of the price), and the effective annual rate is about ${pct(ex1.effectiveAnnual)}.</div>
<h2>Notes</h2>
<ul><li>The result is approximate and for comparison only; it is not an offer from any financier. Read the contract before signing.</li>
<li>Enter admin fees or insurance if any; they raise the effective rate.</li>
<li>If the installment total is below the cash price, no interest is computed.</li>
<li>The values you enter are never sent anywhere; the math runs in your browser.</li></ul>`,
  },
  vat: {
    ar: `<h2>كيف تُحسب النتيجة؟</h2>
<ul><li><b>الخصم:</b> السعر بعد الخصم = السعر × (1 − النسبة ÷ 100).</li>
<li><b>إضافة الضريبة:</b> المبلغ بعد الضريبة = المبلغ × (1 + النسبة ÷ 100).</li>
<li><b>استخراج الضريبة من سعر شامل:</b> المبلغ قبل الضريبة = السعر الشامل ÷ (1 + النسبة ÷ 100).</li></ul>
<div class="example"><b>مثال:</b> مبلغ 1,000 ج.م بنسبة 14%: الضريبة 140 والإجمالي 1,140. وإذا كان السعر الشامل 1,140 فالمبلغ قبل الضريبة 1,000.</div>
<div class="callout warn"><b>تنبيه</b>النسبة الافتراضية 14% هي النسبة العامة لضريبة القيمة المضافة في مصر وقت إعداد الصفحة، وقد تختلف المعاملة الضريبية حسب السلعة والقوانين. عدّل النسبة حسب حالتك وتحقق من الجهة الرسمية.</div>`,
    en: `<h2>How is the result calculated?</h2>
<ul><li><b>Discount:</b> price after discount = price × (1 − rate ÷ 100).</li>
<li><b>Adding tax:</b> amount after tax = amount × (1 + rate ÷ 100).</li>
<li><b>Extracting tax from a tax-inclusive price:</b> amount before tax = inclusive price ÷ (1 + rate ÷ 100).</li></ul>
<div class="example"><b>Example:</b> an amount of 1,000 EGP at 14%: tax is 140 and the total is 1,140. If the inclusive price is 1,140, the amount before tax is 1,000.</div>
<div class="callout warn"><b>Note</b>The default 14% is Egypt's general VAT rate at the time this page was prepared. Tax treatment can vary by item and law. Adjust the rate for your case and verify with the official authority.</div>`,
  },
  ownership: {
    ar: `<h2>كيف تُحسب النتيجة؟</h2>
<ul><li><b>صافي التكلفة</b> = السعر + التكاليف الإضافية − قيمة إعادة البيع المتوقعة.</li>
<li><b>التكلفة الشهرية</b> = صافي التكلفة ÷ (عدد السنوات × 12).</li></ul>
<div class="example"><b>مثال:</b> الخيار أ بسعر ${money(20000)} ويُستخدم 3 سنوات وتُقدَّر إعادة بيعه بـ 30%: صافي التكلفة ${money(oA.net)} أي نحو ${money(oA.perMonth)} ج.م شهرياً. الخيار ب بسعر ${money(30000)} لمدة 5 سنوات وإعادة بيع 40%: صافي التكلفة ${money(oB.net)} أي ${money(oB.perMonth)} ج.م شهرياً، فهو أوفر شهرياً بنحو ${money(exOwn.diffPerMonth)} ج.م رغم أن سعره أعلى.</div>
<h2>ملاحظات</h2>
<ul><li>قيمة إعادة البيع تقدير منك وليست ضماناً، فكن متحفظاً.</li><li>أضف في "التكاليف الإضافية" الملحقات والصيانة المتوقعة.</li><li>الأداة تقارن التكلفة فقط، ولا تقيس الجودة أو الأداء. استخدمها مع المقارنة.</li></ul>`,
    en: `<h2>How is the result calculated?</h2>
<ul><li><b>Net cost</b> = price + extra costs − expected resale value.</li>
<li><b>Monthly cost</b> = net cost ÷ (years × 12).</li></ul>
<div class="example"><b>Example:</b> Option A costs ${money(20000)}, is used for 3 years and resells at 30%: net cost ${money(oA.net)}, about ${money(oA.perMonth)} EGP per month. Option B costs ${money(30000)}, is used for 5 years and resells at 40%: net cost ${money(oB.net)}, or ${money(oB.perMonth)} EGP per month, so it is cheaper per month by about ${money(exOwn.diffPerMonth)} EGP despite the higher price.</div>
<h2>Notes</h2>
<ul><li>Resale value is your own estimate, not a guarantee, so be conservative.</li><li>Use "extra costs" for accessories and expected maintenance.</li><li>The tool compares cost only, not quality or performance. Use it alongside the comparison.</li></ul>`,
  },
};

export function about(cfg, lang) {
  return lang === 'ar' ? `
<h2>ما الذي نقدمه اليوم</h2>
<p>موقع يساعدك على اتخاذ قرار الشراء: <b>مقارنة</b> جنباً إلى جنب مع فلاتر للميزانية والمواصفات، و<b>مركز قرار</b> يرتب الخيارات بمعايير تعدّلها بنفسك، و<b>أدوات حسابية</b> مثل التكلفة الحقيقية للتقسيط، و<b>مدونة</b> بأدلة شراء مفصلة.</p>
<div class="callout warn"><b>الحالة الحالية</b>هذه نسخة أولى تعمل بالكامل داخل المتصفح. بيانات المنتجات والأسعار المعروضة حالياً <b>تجريبية</b> ومعلّمة بذلك في كل مكان، وسنستبدلها ببيانات حقيقية بمصادر معلنة قبل الاعتماد عليها.</div>
<h2>ما الذي نخطط له</h2>
<p>حسابات مستخدمين وقاعدة بيانات، تنبيهات أسعار، مساعد ذكي يعتمد على بيانات الموقع، ودليل خدمات. <b>لن نعرض أي ميزة قبل أن تعمل فعلاً.</b></p>
<h2>كيف نعمل</h2>
<p>نكتب منهجيتنا علناً، ونذكر مصدر كل سعر وتاريخ التحقق منه، ونفصح عن أي عمولة. اقرأ <a href="${'{{methodology}}'}">المنهجية وإفصاح العمولات</a>.</p>
<h2>تواصل معنا</h2><p>لتصحيح معلومة أو اقتراح تحسين: ${mail(cfg, lang)}</p>` : `
<h2>What we offer today</h2>
<p>A site that helps you make a buying decision: side-by-side <b>comparison</b> with budget and spec filters, a <b>decision center</b> that ranks options with criteria you adjust, <b>calculators</b> such as the true cost of installments, and a <b>blog</b> of detailed buying guides.</p>
<div class="callout warn"><b>Current status</b>This is a first version that runs entirely in the browser. The product and price data shown today is <b>sample data</b>, labeled as such everywhere, and will be replaced with real data from open sources before you should rely on it.</div>
<h2>What we plan next</h2>
<p>User accounts and a database, price alerts, an AI assistant grounded in the site's data, and a services directory. <b>We will not show any feature before it actually works.</b></p>
<h2>How we work</h2>
<p>We publish our methodology, state the source and verification date of every price, and disclose any commission. Read the <a href="${'{{methodology}}'}">methodology and affiliate disclosure</a>.</p>
<h2>Contact</h2><p>To correct a fact or suggest an improvement: ${mail(cfg, lang)}</p>`;
}

export function methodology(cfg, lang) {
  const n = cfg.staleAfterDays;
  return lang === 'ar' ? `
<h2>مصادر البيانات</h2>
<p>نستخدم المواصفات المعلنة من الشركات المصنّعة والمتاجر، وأسعاراً من واجهات رسمية أو مصادر مسموح باستخدامها. لا نجمع الأسعار آلياً من مواقع تمنع ذلك. لكل سعر: المتجر، والمصدر، وتاريخ آخر تحقق.</p>
<h2>حداثة الأسعار</h2>
<p>نعلّم كل سعر بحالته: <b>تم التحقق</b> (خلال ${n} يوماً)، أو <b>سعر قديم</b> إن مضى أكثر من ${n} يوماً، أو <b>سعر تجريبي</b> للبيانات الاختبارية. الأسعار تتغير سريعاً، فتحقق من المتجر قبل الشراء.</p>
<h2 id="scoring">كيف نرتّب الخيارات؟</h2>
<p>نستخدم مجموعاً موزوناً شفافاً:</p>
<ol><li>نختار المعايير (مثل البطارية والرام والسعر) وتحدد أنت وزن كل معيار من 0 إلى 5.</li>
<li>نحوّل قيمة كل معيار إلى مقياس من 0 إلى 1 بين أقل وأعلى قيمة <b>في الخيارات المعروضة</b>. للسعر والوزن الأقل أفضل، وللباقي الأعلى أفضل.</li>
<li>الدرجة = مجموع (الوزن × القيمة المحوّلة) ÷ مجموع الأوزان × 100.</li>
<li>إن حددت ميزانية، نستبعد ما يتجاوزها قبل الحساب.</li></ol>
<div class="callout"><b>الدرجة نسبية</b>هي مقارنة بين الخيارات الظاهرة فقط، وليست تقييماً مطلقاً للجودة. تغيير الميزانية أو الفلاتر قد يغيّر الدرجات.</div>
<p><b>البدائل الأرخص:</b> نعرض منتجاً أقل سعراً وبدرجة لا تقل عن 85% من درجة المنتج الأصلي، ونوضح المواصفات التي ستتنازل عنها.</p>
<h2 id="affiliate">إفصاح العمولات</h2>
<p>قد تحتوي بعض الروابط على روابط تابعة (Affiliate)، فنحصل على عمولة إذا اشتريت عبرها <b>دون أي تكلفة إضافية عليك</b>. هذه العمولة <b>لا تؤثر على الترتيب أو الدرجات</b>، فهي تُحسب بالمعايير المعلنة أعلاه فقط. الروابط التابعة تُعلّم بسمة <code>sponsored</code>.</p>
<h2>التصحيحات</h2>
<p>إن وجدت خطأً في مواصفات أو سعر، راسلنا: ${mail(cfg, lang)}. نصحح الأخطاء المؤكدة بأسرع وقت.</p>`
 : `
<h2>Data sources</h2>
<p>We use specs published by manufacturers and stores, and prices from official APIs or sources we are allowed to use. We do not scrape prices from sites that forbid it. Every price shows the store, the source, and the last verification date.</p>
<h2>Price freshness</h2>
<p>Each price is labeled: <b>verified</b> (within ${n} days), <b>stale</b> if more than ${n} days have passed, or <b>sample price</b> for test data. Prices change fast, so verify with the store before buying.</p>
<h2 id="scoring">How do we rank options?</h2>
<p>We use a transparent weighted sum:</p>
<ol><li>We pick the criteria (e.g. battery, RAM, price) and you set each weight from 0 to 5.</li>
<li>Each criterion is rescaled to 0–1 between the lowest and highest value <b>among the options shown</b>. For price and weight lower is better; for the rest higher is better.</li>
<li>Score = sum(weight × rescaled value) ÷ sum of weights × 100.</li>
<li>If you set a budget, options above it are excluded before scoring.</li></ol>
<div class="callout"><b>The score is relative</b>It compares only the options shown and is not an absolute quality rating. Changing the budget or filters can change the scores.</div>
<p><b>Cheaper alternatives:</b> we show a lower-priced product whose score is at least 85% of the original's, and list the specs you would give up.</p>
<h2 id="affiliate">Affiliate disclosure</h2>
<p>Some links may be affiliate links, so we may earn a commission if you buy through them <b>at no extra cost to you</b>. The commission <b>does not affect ranking or scores</b>, which use only the criteria above. Affiliate links are marked with <code>sponsored</code>.</p>
<h2>Corrections</h2>
<p>If you find a wrong spec or price, write to us: ${mail(cfg, lang)}. We correct confirmed errors as quickly as we can.</p>`;
}

export function privacy(cfg, lang) {
  return lang === 'ar' ? `
<p class="meta">آخر تحديث: ${cfg.lastUpdated}</p>
<p>نحترم خصوصيتك ونجمع أقل قدر ممكن من البيانات. توضح هذه الصفحة ما نفعله حالياً.</p>
<h2>ما الذي نجمعه</h2>
<ul><li><b>لا نطلب حساباً ولا نجمع بيانات شخصية</b> عبر نماذج في هذه النسخة.</li>
<li>المنتجات المفضلة والمقارنات المحفوظة وتفضيل المظهر (فاتح/داكن) تُحفظ في <b>التخزين المحلي لمتصفحك</b> على جهازك فقط، ولا تُرسل إلينا. يمكنك حذفها بمسح بيانات الموقع من إعدادات المتصفح.</li>
<li>الأدوات الحسابية تعمل في متصفحك، ولا تُرسل القيم التي تدخلها لأي جهة. إن شاركت رابط نتيجة فستظهر القيم داخل الرابط نفسه.</li></ul>
<h2>سجلات الاستضافة</h2>
<p>قد تسجّل جهة الاستضافة بيانات تقنية مثل عنوان IP ونوع المتصفح لأغراض التشغيل والأمان، وفق سياستها الخاصة.</p>
<h2>المدونة</h2>
<p>المدونة مستضافة على Blogger (Google) وتخضع لسياسة خصوصية Google. يقرأ هذا الموقع خلاصتها العامة وقت البناء فقط، ولا يرسل إليها بيانات زواره.</p>
<h2>الإعلانات وروابط الإحالة</h2>
<p>لا نعرض إعلانات حالياً. إذا فعّلنا إعلانات Google AdSense مستقبلاً، فقد تستخدم Google وشركاؤها ملفات تعريف الارتباط لعرض إعلانات، ويمكنك إدارة تفضيلاتها من <a href="https://adssettings.google.com" rel="noopener">إعدادات إعلانات Google</a>، وسنحدّث هذه الصفحة ونطلب موافقتك حيث يلزم. الروابط التابعة تنقلك لمواقع خارجية لها سياسات خصوصية خاصة بها.</p>
<h2>التحليلات</h2>
<p>لا نستخدم أدوات تحليل الزيارات حالياً. إن أضفناها فسنذكرها هنا ونوضح ما تجمعه.</p>
<h2>الأطفال</h2><p>الموقع غير موجّه للأطفال دون 13 عاماً، ولا نجمع عمداً بيانات منهم.</p>
<h2>التغييرات</h2><p>قد نحدّث هذه السياسة، وسنعدّل تاريخ آخر تحديث أعلاه.</p>
<h2>التواصل</h2><p>لأي سؤال عن الخصوصية: ${mail(cfg, lang)}</p>`
 : `
<p class="meta">Last updated: ${cfg.lastUpdated}</p>
<p>We respect your privacy and collect as little data as possible. This page explains what we currently do.</p>
<h2>What we collect</h2>
<ul><li><b>We do not ask for an account and do not collect personal data</b> through forms in this version.</li>
<li>Favorite products, saved comparisons and your theme preference (light/dark) are stored in your <b>browser's local storage</b> on your device only, and are never sent to us. You can delete them by clearing the site's data in your browser settings.</li>
<li>The calculators run in your browser and the values you enter are not sent anywhere. If you share a result link, the values appear in the link itself.</li></ul>
<h2>Hosting logs</h2>
<p>The hosting provider may log technical data such as IP address and browser type for operations and security, under its own policy.</p>
<h2>The blog</h2>
<p>The blog is hosted on Blogger (Google) and is subject to Google's privacy policy. This site reads its public feed at build time only and does not send visitor data to it.</p>
<h2>Ads and affiliate links</h2>
<p>We do not show ads at the moment. If we enable Google AdSense in the future, Google and its partners may use cookies to serve ads, and you can manage preferences in <a href="https://adssettings.google.com" rel="noopener">Google Ads Settings</a>; we will update this page and request consent where required. Affiliate links take you to external sites that have their own privacy policies.</p>
<h2>Analytics</h2>
<p>We do not currently use traffic analytics. If we add it, we will list it here and explain what it collects.</p>
<h2>Children</h2><p>The site is not directed to children under 13 and we do not knowingly collect data from them.</p>
<h2>Changes</h2><p>We may update this policy and will change the date above.</p>
<h2>Contact</h2><p>For any privacy question: ${mail(cfg, lang)}</p>`;
}

export function terms(cfg, lang) {
  return lang === 'ar' ? `
<p class="meta">آخر تحديث: ${cfg.lastUpdated}</p>
<h2>القبول</h2><p>باستخدامك الموقع فإنك توافق على هذه الشروط. إن لم توافق فيرجى عدم استخدامه.</p>
<h2>طبيعة المعلومات</h2><p>المعلومات والأدوات المعروضة للإرشاد فقط، وليست نصيحة مالية أو قانونية أو فنية. قد تتغير الأسعار والمواصفات والتوفر دون إشعار، ويجب التحقق منها مع المتجر قبل الشراء. البيانات الموسومة "تجريبية" ليست عروضاً حقيقية.</p>
<h2>الأدوات الحسابية</h2><p>نتائج الحاسبات تقريبية ومبنية على ما تدخله، ولا تمثل عرضاً من أي جهة. أنت مسؤول عن مراجعة العقود والأسعار الفعلية.</p>
<h2>الروابط الخارجية والعمولات</h2><p>قد يحتوي الموقع على روابط لمواقع أخرى لا نتحكم في محتواها أو سياساتها، وبعضها روابط تابعة نحصل منها على عمولة كما هو موضح في صفحة <a href="${'{{methodology}}'}">المنهجية</a>.</p>
<h2>الملكية الفكرية</h2><p>تصميم الموقع ومحتواه الأصلي محميان. يمكنك الاقتباس القصير مع ذكر المصدر ورابط الصفحة. أسماء المنتجات والعلامات التجارية ملك لأصحابها.</p>
<h2>حدود المسؤولية</h2><p>يُقدَّم الموقع "كما هو" دون ضمانات من أي نوع، ولا نتحمل مسؤولية عن قرارات الشراء أو الخسائر الناتجة عن الاعتماد على المعلومات، بالقدر الذي يسمح به القانون.</p>
<h2>التغييرات</h2><p>قد نعدّل هذه الشروط، واستمرارك في الاستخدام يعني قبولك للنسخة المحدّثة.</p>
<h2>التواصل</h2><p>${mail(cfg, lang)}</p>`
 : `
<p class="meta">Last updated: ${cfg.lastUpdated}</p>
<h2>Acceptance</h2><p>By using the site you agree to these terms. If you do not agree, please do not use it.</p>
<h2>Nature of the information</h2><p>The information and tools are for guidance only and are not financial, legal or technical advice. Prices, specs and availability may change without notice and must be verified with the store before buying. Data labeled "sample" is not a real offer.</p>
<h2>Calculators</h2><p>Calculator results are approximate and based on what you enter; they are not an offer from any party. You are responsible for reviewing contracts and actual prices.</p>
<h2>External links and commissions</h2><p>The site may link to other sites whose content and policies we do not control, and some links are affiliate links from which we earn a commission, as described in the <a href="${'{{methodology}}'}">methodology</a> page.</p>
<h2>Intellectual property</h2><p>The site's design and original content are protected. You may quote briefly with attribution and a link to the page. Product names and trademarks belong to their owners.</p>
<h2>Limitation of liability</h2><p>The site is provided "as is" without warranties of any kind, and we are not liable for purchase decisions or losses resulting from reliance on the information, to the extent permitted by law.</p>
<h2>Changes</h2><p>We may modify these terms, and continued use means you accept the updated version.</p>
<h2>Contact</h2><p>${mail(cfg, lang)}</p>`;
}

export function contact(cfg, lang) {
  return lang === 'ar'
    ? `<p>لتصحيح معلومة أو اقتراح تحسين أو الاستفسار عن التعاون، راسلنا على: ${mail(cfg, lang)}</p><p>نحاول الرد بأسرع وقت ممكن. لا نطلب منك إرسال كلمات مرور أو بيانات بنكية أبداً.</p>`
    : `<p>To correct a fact, suggest an improvement, or ask about collaboration, write to: ${mail(cfg, lang)}</p><p>We try to reply as quickly as we can. We will never ask you to send passwords or banking details.</p>`;
}
