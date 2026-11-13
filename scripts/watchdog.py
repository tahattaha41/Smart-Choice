#!/usr/bin/env python3
"""حارس استباقي: يفحص جودة الكود وجدة البيانات وصحة العمليات، ويعيد تشغيل ما تعطّل (قائمة بيضاء)،
ويكتب reports/watchdog.md (يقرؤه المهندس الذكي). لا يعدّل أي ملف مصدر."""
import glob, json, os, py_compile, re, subprocess, datetime, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get("GITHUB_REPOSITORY", "tahattaha41/Smart-Choice")
NOW = datetime.datetime.now(datetime.timezone.utc)
problems, healed, ok = [], [], []

def sh(*a, t=60):
    try: return subprocess.run(a, cwd=ROOT, capture_output=True, text=True, timeout=t)
    except Exception as e: return subprocess.CompletedProcess(a, 1, "", str(e))
def read(p):
    try: return open(os.path.join(ROOT, p), encoding="utf8").read()
    except Exception: return ""
def age_h(p):
    try: return (time.time() - os.path.getmtime(os.path.join(ROOT, p))) / 3600
    except Exception: return 9999
def dispatch(wf, why):
    r = sh("gh", "api", "-X", "POST", "repos/%s/actions/workflows/%s/dispatches" % (REPO, wf), "-f", "ref=main")
    (healed if r.returncode == 0 else problems).append("%s: %s" % (wf, why) if r.returncode == 0 else "تعذّر تشغيل %s" % wf)

# 1) جودة الكود
bad = []
for f in glob.glob(ROOT + "/scripts/*.py"):
    try: py_compile.compile(f, doraise=True)
    except Exception as e: bad.append(os.path.basename(f))
for f in glob.glob(ROOT + "/scripts/*.mjs") + [ROOT + "/assets/js/smart-choice.js"]:
    if sh("node", "--check", f).returncode: bad.append(os.path.basename(f))
for f in glob.glob(ROOT + "/assets/content/*.json"):
    try: json.load(open(f, encoding="utf8"))
    except Exception: bad.append(os.path.basename(f))
try:
    import yaml
    for f in glob.glob(ROOT + "/.github/workflows/*.yml"):
        try: yaml.safe_load(open(f, encoding="utf8"))
        except Exception: bad.append(os.path.basename(f))
except ImportError: pass
(problems.append("أخطاء صياغة في: " + ", ".join(bad)) if bad else ok.append("الكود والملفات سليمة الصياغة"))

# 2) أخطاء مسجّلة من العمليات
for f, wf in (("reports/stats-error.md", "site-stats.yml"), ("reports/rates-error.md", "rates.yml")):
    if os.path.exists(os.path.join(ROOT, f)):
        problems.append("%s: %s" % (f, read(f).strip().splitlines()[-1][:160]))
s = read("reports/sync-posts.md")
m = re.search(r"أخطاء:\s*(\d+)", s)
if m and int(m.group(1)) > 0: problems.append("مزامنة المقالات فيها %s أخطاء (reports/sync-posts.md)" % m.group(1)); dispatch("blogger-sync.yml", "إعادة محاولة المزامنة")

# 3) جدة البيانات
try:
    u = datetime.datetime.strptime(json.load(open(ROOT + "/reports/stats.json"))["updated"].replace(" UTC", ""), "%Y-%m-%d %H:%M").replace(tzinfo=datetime.timezone.utc)
    h = (NOW - u).total_seconds() / 3600
    if h > 30: problems.append("إحصائيات الزوار قديمة (%.0f ساعة)" % h); dispatch("site-stats.yml", "الإحصائيات قديمة")
    else: ok.append("الإحصائيات محدّثة")
except Exception: problems.append("تعذّرت قراءة reports/stats.json")
try:
    r = json.load(open(ROOT + "/assets/content/rates.json"))
    h = (time.time() - r["updated"]) / 3600
    if h > 36: problems.append("أسعار العملات قديمة (%.0f ساعة) وتختفي من الموقع بعد 48" % h); dispatch("rates.yml", "الأسعار قديمة")
    else: ok.append("أسعار العملات محدّثة")
    for k, label in (("gold", "الذهب"), ("silver", "الفضة")):
        fh = (time.time() - (r.get(k) or {}).get("fetched", 0)) / 3600
        if fh > 12: problems.append("أسعار %s لم تتجدد منذ %.0f ساعة (تُخفى من الموقع بعد 36)" % (label, fh)); dispatch("rates.yml", "أسعار المعادن قديمة")
        else: ok.append("أسعار %s محدّثة" % label)
except Exception: dispatch("rates.yml", "لا يوجد ملف أسعار")
if age_h("reports/live-e2e.txt") > 30 and not os.path.exists(ROOT + "/reports/live-e2e-blocked.md"): dispatch("live-e2e.yml", "الفحص الحي قديم")
if os.path.exists(ROOT + "/reports/live-e2e-blocked.md"): ok.append("الفحص الحي محجوب مؤقتاً من جوجل (ليس عطلاً)")

# 4) عمليات فشلت مؤخراً (إعادة تشغيل واحدة لكل عملية، قائمة بيضاء)
SAFE = {"Smart Choice | Sync posts to Blogger": "blogger-sync.yml", "Smart Choice | Visitor stats (Blogger API)": "site-stats.yml", "Smart Choice | Sync static pages to Blogger": "blogger-pages-sync.yml"}
r = sh("gh", "api", "repos/%s/actions/runs?per_page=30&status=failure" % REPO, "--jq", '.workflow_runs[]|[.name,.created_at]|@tsv')
seen = set()
for line in r.stdout.splitlines():
    n, ts = line.split("\t")
    try: a = (NOW - datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))).total_seconds() / 3600
    except Exception: continue
    if a < 8 and n in SAFE and n not in seen:
        seen.add(n); problems.append("فشل تشغيل «%s» خلال آخر 8 ساعات" % n)
        if os.environ.get("WATCHDOG_RETRY") == "1": dispatch(SAFE[n], "إعادة المحاولة")

out = ["# حارس الموقع", "", "- آخر تشغيل: %s UTC" % NOW.strftime("%Y-%m-%d %H:%M"), "- مشاكل: %d" % len(problems), "", "## مشاكل"] + (["- " + p for p in problems] or ["- لا شيء"]) + ["", "## إصلاحات آلية"] + (["- " + h for h in healed] or ["- لا شيء"]) + ["", "## سليم"] + ["- " + o for o in ok]
open(ROOT + "/reports/watchdog.md", "w", encoding="utf8").write("\n".join(out) + "\n")
print("\n".join(out))
