#!/usr/bin/env python3
"""Smart Choice — فحص جاهزية AdSense (محتوى المستودع + فحوص حية اختيارية).
يكتب reports/adsense-audit.json و reports/adsense-audit.md. لا يضمن القبول؛ يكشف أسباب الرفض الشائعة."""
import json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://smartchoicee1.blogspot.com"
PUB = "pub-1235197294708204"
checks = []

def add(level, title, detail="", fix=""):
    checks.append({"level": level, "title": title, "detail": detail, "fix": fix})

def parse(path):
    t = path.read_text(encoding="utf-8"); meta = {}; body = t
    if t.startswith("---"):
        parts = t.split("---", 2)
        if len(parts) == 3:
            for l in parts[1].strip().splitlines():
                if ":" in l:
                    k, v = l.split(":", 1); meta[k.strip().lower()] = v.strip()
            body = parts[2]
    return meta, body

def words(html):
    txt = re.sub(r"<[^>]+>", " ", html)
    return len(re.findall(r"[\w؀-ۿ]+", txt))

posts = []
for p in sorted((ROOT / "posts").glob("*.md")):
    if p.name.startswith("_"): continue
    m, b = parse(p)
    if m.get("publish", "").lower() == "true":
        posts.append({"file": p.name, "title": m.get("title", p.stem), "labels": m.get("labels", ""), "words": words(b), "html": b})
pages = {}
for p in sorted((ROOT / "pages").glob("*.md")):
    m, b = parse(p); pages[p.stem] = {"title": m.get("title", p.stem), "words": words(b), "html": b}

# 1) حجم المحتوى
n = len(posts)
add("pass" if n >= 20 else ("warn" if n >= 10 else "fail"), f"عدد المقالات المنشورة: {n}",
    "يفضَّل عادةً 20 مقالاً أصلياً أو أكثر قبل طلب المراجعة.", "أضف مقالات جديدة طويلة ومفيدة في ملف posts/.")
thin = [p for p in posts if p["words"] < 500]
add("pass" if not thin else "warn", "طول المقالات",
    "كلها 500 كلمة فأكثر." if not thin else "مقالات أقل من 500 كلمة: " + "، ".join(f'{p["title"]} ({p["words"]})' for p in thin),
    "وسّع المقالات القصيرة بأمثلة وخطوات وأسئلة شائعة.")
avg = sum(p["words"] for p in posts) // max(1, n)
add("info", f"متوسط طول المقال: {avg} كلمة")

# 2) الصفحات المطلوبة
need = {"about": "من نحن", "contact": "اتصل بنا", "privacy": "سياسة الخصوصية", "terms": "شروط الاستخدام"}
for k, label in need.items():
    ok = k in pages and pages[k]["words"] >= 80
    add("pass" if ok else "fail", f"صفحة {label}", "" if ok else "غير موجودة أو قصيرة جداً.", f"أنشئ/وسّع pages/{k}.md")
add("pass" if "mailto:" in pages.get("contact", {}).get("html", "") else "fail", "وسيلة تواصل ظاهرة في صفحة اتصل بنا")
priv = pages.get("privacy", {}).get("html", "")
add("pass" if ("AdSense" in priv and "ملفات تعريف الارتباط" in priv) else "fail", "الخصوصية تذكر AdSense وملفات تعريف الارتباط")

# 3) جودة وتكرار
def sig(h): return set(re.findall(r"[؀-ۿ]{4,}", re.sub(r"<[^>]+>", " ", h)))
dups = []
for i in range(n):
    for j in range(i + 1, n):
        a, b = sig(posts[i]["html"]), sig(posts[j]["html"])
        if a and b and len(a & b) / len(a | b) > 0.6: dups.append((posts[i]["title"], posts[j]["title"]))
add("pass" if not dups else "warn", "تشابه المحتوى بين المقالات", "لا تشابه مفرط." if not dups else "؛ ".join(f"{a} ~ {b}" for a, b in dups), "اجعل كل مقال يغطي زاوية مختلفة.")
bad = re.compile(r"lorem ipsum|TODO|قريباً جداً|تحت الإنشاء|utilityra|flarivo|toolora", re.I)
hits = [x["title"] for x in posts if bad.search(x["html"])] + [v["title"] for v in pages.values() if bad.search(v["html"])]
add("pass" if not hits else "fail", "نصوص تجريبية أو أسماء قديمة", "لا يوجد." if not hits else "، ".join(hits), "احذف النص التجريبي أو الاسم القديم.")
labels = {l.strip() for x in posts for l in x["labels"].split(",") if l.strip()}
add("pass" if len(labels) >= 3 else "warn", f"تنوع الأقسام: {len(labels)}")
nolabel = [x["title"] for x in posts if not x["labels"].strip()]
add("pass" if not nolabel else "warn", "كل مقال له تصنيف", "، ".join(nolabel))

# 4) القالب
theme = (ROOT / "theme" / "smart-choice-blogger.xml").read_text(encoding="utf-8")
add("pass" if "adsbygoogle.js?client=ca-" + PUB in theme else "fail", "كود AdSense مثبت في القالب")
add("pass" if "viewport" in theme else "fail", "وسم viewport (متوافق مع الهاتف)")
add("pass" if "G-" in theme else "warn", "Google Analytics مثبت")

# 5) فحوص حية
def fetch(path):
    try:
        req = urllib.request.Request(BASE + path, headers={"User-Agent": "SmartChoiceAudit/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r: return r.status, r.read().decode("utf-8", "ignore")
    except Exception as e: return None, str(e)
if "--live" in sys.argv:
    s, t = fetch("/ads.txt")
    ok = s == 200 and PUB in t
    add("pass" if ok else "fail", "ملف ads.txt", "" if ok else f"غير متاح/خاطئ (حالة {s}).",
        "Blogger › الإعدادات › الأرباح › ads.txt مخصص، والصق: google.com, " + PUB + ", DIRECT, f08c47fec0942fa0")
    s, t = fetch("/robots.txt"); add("pass" if s == 200 else "warn", "robots.txt متاح", "" if s == 200 else str(s))
    s, t = fetch("/sitemap.xml"); add("pass" if s == 200 else "warn", "sitemap.xml متاح", "" if s == 200 else str(s))
    s, t = fetch("/"); add("pass" if s == 200 else "fail", "الصفحة الرئيسية تعمل (HTTPS)", "" if s == 200 else str(s))

# 6) أمور خارج قدرة الكود
manual = [
    "عمر الموقع وزيارات حقيقية: لا حد رسمي، لكن المواقع الجديدة جداً بلا زوار قد تُؤجَّل.",
    "نطاق خاص (مثل smartchoice.com): غير إلزامي مع blogspot، لكنه يزيد الثقة.",
    "أضف الموقع في Search Console وأرسل sitemap.xml وانتظر الفهرسة قبل طلب المراجعة.",
    "لا تضغط على إعلاناتك ولا تطلب من أحد فعل ذلك.",
    "أي محتوى منسوخ أو مولَّد دون مراجعة قد يُرفض؛ راجع كل مقال بنفسك.",
]
score = round(100 * sum(1 for c in checks if c["level"] == "pass") / max(1, sum(1 for c in checks if c["level"] in ("pass", "warn", "fail"))))
out = {"score": score, "posts": n, "avg_words": avg, "checks": checks, "manual": manual}
(ROOT / "reports").mkdir(exist_ok=True)
(ROOT / "reports" / "adsense-audit.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
icon = {"pass": "✅", "warn": "⚠️", "fail": "❌", "info": "ℹ️"}
md = [f"# فحص جاهزية AdSense — {score}%", ""]
for c in checks:
    md.append(f"- {icon[c['level']]} **{c['title']}**" + (f" — {c['detail']}" if c["detail"] else "") + (f"  \n  الحل: {c['fix']}" if c["level"] in ("warn", "fail") and c["fix"] else ""))
md += ["", "## يدوي (خارج قدرة الكود)"] + [f"- {m}" for m in manual]
(ROOT / "reports" / "adsense-audit.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print("\n".join(md))
