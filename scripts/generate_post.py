#!/usr/bin/env python3
"""يولّد مقالاً عربياً جديداً بـ Gemini (طبقة مجانية) ويحفظه في posts/ بعد فحوص جودة صارمة.
المتطلب: سر GEMINI_API_KEY في GitHub. بدونه يخرج بهدوء ويكتب السبب في reports/auto-posts.md."""
import os
import difflib, glob, json, os, re, sys, time, datetime
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ.get("GEMINI_API_KEY", "").strip()
MODELS = [m for m in [os.environ.get("GEMINI_MODEL", "").strip(), "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"] if m]
LOG = os.path.join(ROOT, "reports", "auto-posts.md")
BANNED = ["utili" + "tyra", "كمذكرة", "as an ai", "كنموذج لغوي", "lorem", "ضمان الربح", "مضمون 100", "اربح مليون"]
MIN_WORDS = 700

def discover_models(key):
    """يجلب نماذج flash المتاحة حالياً (الأحدث أولاً) لتفادي النماذج المتقاعدة."""
    try:
        r = requests.get("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", headers={"x-goog-api-key": key}, timeout=30)
        names = [m["name"].split("/")[-1] for m in r.json().get("models", []) if "generateContent" in m.get("supportedGenerationMethods", [])]
    except Exception:
        return []
    names = [n for n in names if "flash" in n and not re.search(r"lite|image|tts|live|audio|thinking|exp|preview|8b", n)]
    def ver(n):
        m = re.search(r"(\d+)\.?(\d*)", n); return (int(m.group(1)), int(m.group(2) or 0)) if m else (0, 0)
    return sorted(set(names), key=ver, reverse=True)

def log(msg):
    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    with open(LOG, "w", encoding="utf8") as f:
        f.write("# المقالات التلقائية\n\n- آخر تشغيل: %s UTC\n- %s\n" % (datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M"), msg))
    print(msg)

def read_posts():
    posts = []
    for p in glob.glob(os.path.join(ROOT, "posts", "*.md")):
        if os.path.basename(p).startswith("_"):
            continue
        t = open(p, encoding="utf8").read()
        m = re.search(r"^title:\s*(.+)$", t, re.M); l = re.search(r"^labels:\s*(.+)$", t, re.M)
        if m:
            posts.append((m.group(1).strip(), (l.group(1).strip() if l else ""), os.path.basename(p)))
    return posts

def read_tools():
    t = open(os.path.join(ROOT, "pages", "tools.md"), encoding="utf8").read()
    out = []
    for m in re.finditer(r'data-tab="([a-z0-9-]+)"[^>]*>([^<]+)</button>', t):
        tab, name = m.group(1), m.group(2).strip()
        sec = re.search(r'id="sc-%s"[^>]*>.*?<p class="sc-muted">(.*?)</p>' % re.escape(tab), t, re.S)
        out.append((tab, name, re.sub(r"<[^>]+>", "", sec.group(1)).strip() if sec else ""))
    return out

def pick_tool(posts_text):
    """الأداة الأقل تغطية في المقالات الحالية، لتبقى كل المقالات مرتبطة بمحتوى الموقع."""
    tools = [x for x in read_tools() if x[0] not in ("assistant", "random", "password", "wordcount", "calories", "bmi", "hijri", "age", "grade", "speed", "dates", "convert")]
    scored = sorted(tools, key=lambda x: (posts_text.count(x[1]) + posts_text.count("#" + x[0]), x[0]))
    k = int(time.time() // 43200) % 3
    return scored[min(k, len(scored) - 1)]

def words(html):
    return len(re.sub(r"<[^>]+>", " ", html).split())

PROMPT = """مهم جداً: المقال يجب أن يدور حول أداة محددة من أدوات موقعنا، وهي: «{tool}» — وصفها: {tdesc}
اشرح المشكلة الحقيقية التي تحلها هذه الأداة في حياة القارئ، ثم اشرح المعادلة أو الفكرة خلف حسابها بلغة بسيطة، ثم قدّم مثالاً رقمياً افتراضياً بأرقام صحيحة قابلة للتحقق، ثم أخطاء شائعة، ثم كيف يستخدم القارئ الأداة خطوة بخطوة. اذكر اسم الأداة «{tool}» صراحةً في المقال. لا تخرج عن هذا الموضوع.
أنت كاتب محتوى عربي محترف لموقع «Smart Choice» المتخصص في: القرارات الشرائية الذكية، المال الشخصي، الميزانية، التقسيط والقروض، التسعير للمشاريع الصغيرة، والإنتاجية.
اكتب مقالاً أصلياً جديداً مفيداً للقارئ العربي (مصر والخليج) بين 900 و1200 كلمة.
قواعد صارمة:
- زاوية جديدة لا تشبه هذه العناوين الموجودة: {titles}
- ابدأ بفقرة مقدمة، ثم 5 إلى 7 أقسام بعناوين <h2> (وعناوين فرعية <h3> عند الحاجة)، ثم خاتمة قصيرة.
- أمثلة بأرقام افتراضية واضحة وصريحة أنها افتراضية، وخطوات عملية قابلة للتطبيق.
- ممنوع: إحصاءات أو أسماء دراسات أو أسعار حالية مختلقة، ووعود أرباح مضمونة، ونصائح طبية أو قانونية قطعية، وذكر أنك نموذج ذكاء اصطناعي.
- اختم بجملة: هذه معلومات عامة وليست نصيحة مالية شخصية. وانصح بتجربة أدوات الموقع إن كانت مناسبة (الخصم، الميزانية، القرض، التقسيط، هدف الادخار، مقارنة سعر الوحدة، نقطة التعادل).
- استخدم «الجنيه المصري» كعملة وحيدة في الأمثلة ولا تكتب «ريال/جنيه» أو عملات متعددة؛ وراجع كل عملية حسابية في أمثلتك مرتين قبل كتابتها.
- الأسلوب: عربية فصحى مبسطة، فقرات قصيرة، بلا حشو.
صيغة الإخراج الحرفية:
السطر 1: TITLE: عنوان جذاب بين 40 و70 حرفاً
السطر 2: LABEL: تصنيف واحد من [التسوق الذكي، المال الشخصي، الأهداف، الأعمال الصغيرة، الإنتاجية، القروض والتمويل]
ثم سطر فارغ ثم المقال بصيغة HTML فقط (<p> و<h2> و<h3> و<ul><li>) دون <html> أو <body> ودون علامات Markdown.
زاوية موجّهة لهذه المرة: {hint}"""

HINTS = ["قرار شراء متكرر يخسر الناس فيه مالاً", "عادة مالية صغيرة بأثر كبير", "مقارنة بين خيارين شائعين في الاستهلاك", "خطأ شائع في التقسيط أو القروض", "نصيحة للتسعير أو تكاليف مشروع صغير", "تخطيط ميزانية لموسم أو مناسبة", "تقليل فواتير المنزل", "قرار بين الإيجار والشراء لسلعة"]

def call(prompt):
    last = None
    for model in (discover_models(KEY)[:3] + MODELS):
        for retry in range(2):
            gen = {"temperature": 0.8, "maxOutputTokens": 8000}
            if "2.5" in model:
                gen["thinkingConfig"] = {"thinkingBudget": 0}
            try:
                r = requests.post("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent" % model,
                                  headers={"x-goog-api-key": KEY, "Content-Type": "application/json"},
                                  json={"contents": [{"parts": [{"text": prompt}]}], "generationConfig": gen}, timeout=90)
            except requests.exceptions.RequestException as e:
                last = e; time.sleep(5); continue
            if r.status_code in (404, 400):
                last = RuntimeError("%s -> %s %s" % (model, r.status_code, r.text[:200])); break
            if r.status_code in (429, 500, 502, 503, 504):
                last = RuntimeError("%s -> %s" % (model, r.status_code)); time.sleep(8); continue
            r.raise_for_status()
            try:
                return r.json()["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                last = e; break
    raise last or RuntimeError("no model answered")

def parse(txt):
    txt = txt.strip().strip("`")
    m = re.search(r"TITLE:\s*(.+)", txt); l = re.search(r"LABEL:\s*(.+)", txt)
    if not m:
        return None
    body = txt[txt.index(l.group(0)) + len(l.group(0)):] if l else txt[txt.index(m.group(0)) + len(m.group(0)):]
    body = re.sub(r"^```(?:html)?|```$", "", body.strip(), flags=re.M).strip()
    return m.group(1).strip(), (l.group(1).strip() if l else "المال الشخصي"), body

def check(title, body, existing, tool=None):
    low = (title + body).lower()
    for b in BANNED:
        if b in low:
            return "عبارة محظورة: " + b
    if words(body) < MIN_WORDS:
        return "قصير: %d كلمة" % words(body)
    if len(re.findall(r"<h2", body)) < 4:
        return "أقسام قليلة"
    if tool and tool[1] not in body:
        return "لا يذكر الأداة: " + tool[1]
    if re.search(r"ريال\s*/\s*جنيه|جنيه\s*/\s*ريال", body):
        return "عملة مزدوجة"
    if re.search(r"<script|<iframe|on\w+=|javascript:", body, re.I):
        return "وسوم غير آمنة"
    for t, _, _ in existing:
        if difflib.SequenceMatcher(None, t, title).ratio() > 0.6:
            return "عنوان مشابه لـ: " + t
    return None

def main():
    if os.path.exists('.auto-posts-paused'):
        print('paused: .auto-posts-paused exists'); return 0
    if not KEY:
        log("لم يُنشأ مقال: سر GEMINI_API_KEY غير مضبوط في GitHub (Settings → Secrets → Actions). مفتاح مجاني من aistudio.google.com/apikey.")
        return 0
    existing = read_posts()
    titles = " | ".join(t for t, _, _ in existing)
    ptext = " ".join(open(os.path.join(ROOT, "posts", f), encoding="utf8").read() for _, _, f in existing)
    tool = pick_tool(ptext)
    reasons = []
    for attempt in range(3):
        hint = HINTS[(int(time.time() // 3600) + attempt) % len(HINTS)]
        try:
            res = parse(call(PROMPT.format(titles=titles, hint=hint, tool=tool[1], tdesc=tool[2])))
        except Exception as e:
            m = str(e)[:200]
            try: m += " | " + e.response.text[:300]
            except Exception: pass
            reasons.append("خطأ API: " + m); print(m); time.sleep(10); continue
        if not res:
            reasons.append("تعذر تحليل الرد"); continue
        title, label, body = res
        bad = check(title, body, existing, tool)
        if bad:
            reasons.append("رُفض: " + bad); print("رُفض:", bad); continue
        body += '\n<p><strong>جرّب الأداة الآن:</strong> <a href="/p/tools.html#%s">%s</a> — مجانية وتعمل داخل متصفحك دون تسجيل.</p>' % (tool[0], tool[1])
        slug = "auto-" + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d-%H%M")
        with open(os.path.join(ROOT, "posts", slug + ".md"), "w", encoding="utf8") as f:
            f.write("---\ntitle: %s\nlabels: %s\npublish: true\n---\n%s\n" % (title.replace(":", " -") if False else title, label, body))
        log("نُشر مقال جديد: %s (%d كلمة، تصنيف %s، الأداة: %s)" % (title, words(body), label, tool[1]))
        return 0
    log("لم يُنشر مقال هذه المرة. الأسباب: " + " ؛ ".join(reasons))
    return 0

if __name__ == "__main__":
    sys.exit(main())
