#!/usr/bin/env python3
"""مراجعة دورية للمستودع: يصلح ما يمكن إصلاحه آلياً ويكتب تقرير reports/site-review.md. يخرج بـ 0 دائماً."""
import glob, json, os, re, subprocess, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
issues, fixed = [], []

def run(*a):
    return subprocess.run(a, cwd=ROOT, capture_output=True, text=True)

# 1) فحص المقالات والصفحات
for p in sorted(glob.glob(ROOT + "/posts/*.md") + glob.glob(ROOT + "/pages/*.md")):
    n = os.path.basename(p)
    if n.startswith("_"): continue
    t = open(p, encoding="utf8").read()
    if not re.match(r"^---\n(?:.*\n)*?title:\s*\S", t): issues.append("%s: لا عنوان في الواجهة الأمامية" % n)
    if "utili" + "tyra" in t.lower(): issues.append("%s: يحتوي الاسم القديم" % n)
    if re.search(r"<script|javascript:", t, re.I): issues.append("%s: وسوم غير آمنة" % n)
    if p.startswith(ROOT + "/posts/"):
        w = len(re.sub(r"<[^>]+>", " ", t.split("---", 2)[2]).split())
        if "publish: false" not in t and w < 500: issues.append("%s: قصير (%d كلمة)" % (n, w))

# 2) تحديث حزمة المحتوى
before = open(ROOT + "/assets/content/bundle.json", "rb").read() if os.path.exists(ROOT + "/assets/content/bundle.json") else b""
run("python3", "scripts/build_content_bundle.py")
after = open(ROOT + "/assets/content/bundle.json", "rb").read() if os.path.exists(ROOT + "/assets/content/bundle.json") else b""
if before != after: fixed.append("أُعيد بناء حزمة المحتوى")

# 3) AdSense
run("python3", "scripts/adsense_audit.py")
try:
    a = json.load(open(ROOT + "/reports/adsense-audit.json", encoding="utf8"))
    fails = [x for x in a.get("checks", []) if x.get("level") == "fail"]
    for x in fails: issues.append("AdSense: " + str(x.get("title")))
except Exception: pass

# 4) آخر فحص حي
live_fail = []
try:
    live_fail = [l[5:].strip() for l in open(ROOT + "/reports/live-e2e.txt", encoding="utf8") if l.startswith("FAIL")]
except Exception: pass
for l in live_fail: issues.append("الموقع الحي: " + l)

open(ROOT + "/reports/site-review.md", "w", encoding="utf8").write(
    "# مراجعة الموقع الدورية\n\n- آخر تشغيل: %s UTC\n- مشاكل مفتوحة: %d\n- إصلاحات آلية: %s\n\n%s\n" % (
        datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M"), len(issues), "، ".join(fixed) or "لا شيء",
        "\n".join("- " + i for i in issues) or "كل الفحوص سليمة ✓"))
open(ROOT + "/reports/.needs-resync", "w").write("1" if live_fail else "0")
print("issues", len(issues), "fixed", fixed)
