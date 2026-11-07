#!/usr/bin/env python3
"""المهندس التقني الذكي: يقرأ تقارير الموقع ويشخّص المشاكل بـ Gemini ويكتب reports/ai-engineer.md،
ويختار إجراءات آمنة فقط من قائمة بيضاء (reports/ai-actions.json) ينفذها سير العمل. لا يعدّل كوداً بنفسه."""
import json, os, re, subprocess, sys, time, datetime
import requests
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ.get("GEMINI_API_KEY", "").strip()
MODELS = [m for m in [os.environ.get("GEMINI_MODEL", "").strip(), "gemini-2.5-flash", "gemini-flash-latest"] if m]
ALLOWED = {"resync_blogger": "إعادة مزامنة المقالات", "resync_pages": "إعادة مزامنة الصفحات", "rerun_e2e": "إعادة الفحص الحي", "new_post": "إنشاء مقال جديد"}

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

def rd(path, n=3500):
    try: return open(os.path.join(ROOT, path), encoding="utf8").read()[:n]
    except Exception: return "(غير متاح)"

def failed_runs():
    try:
        r = subprocess.run(["gh", "api", "repos/%s/actions/runs?per_page=30&status=failure" % os.environ.get("GITHUB_REPOSITORY", "tahattaha41/Smart-Choice"), "--jq", '.workflow_runs[]|[.name,.created_at,.head_sha[0:7]]|@tsv'], capture_output=True, text=True, timeout=60)
        return r.stdout[:1500] or "لا توجد"
    except Exception: return "(غير متاح)"

PROMPT = """أنت مهندس تقني (DevOps/Frontend/SEO) مسؤول عن موقع عربي على Blogger اسمه Smart Choice، ويُدار من مستودع GitHub مع GitHub Actions. اقرأ التقارير التالية وشخّص حالة الموقع.
[الفحص الحي]
{e2e}
[مراجعة المستودع]
{review}
[فحص AdSense]
{audit}
[المقالات التلقائية]
{auto}
[آخر تشغيلات فاشلة]
{fails}
أخرج JSON فقط بالمفاتيح: "status" (ok|warning|critical)، "summary" (جملتان بالعربية)، "issues" (مصفوفة كائنات: "title","severity" (high|medium|low),"cause","fix","owner_action" (true إن كان الحل يحتاج المالك)),"actions" (مصفوفة اختيارية من هذه القيم فقط: resync_blogger, resync_pages, rerun_e2e, new_post — اختر فقط ما تبرره التقارير؛ مثلاً resync عند فشل الفحص الحي في المقالات/الصفحات)، "next_steps" (حتى 3 توصيات قصيرة لتحسين الموقع). لا تخترع مشاكل غير موجودة في التقارير؛ إن كان كل شيء سليماً فقل ذلك."""

def ask(prompt):
    last = None
    for m in (discover_models(KEY)[:3] + MODELS):
        for _ in range(2):
            try:
                g = {"temperature": 0.2, "maxOutputTokens": 3000, "responseMimeType": "application/json"}
                if "2.5" in m: g["thinkingConfig"] = {"thinkingBudget": 0}
                r = requests.post("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent" % m, headers={"x-goog-api-key": KEY}, json={"contents": [{"parts": [{"text": prompt}]}], "generationConfig": g}, timeout=90)
                if r.status_code in (404, 400): last = r.text[:200]; break
                if r.status_code >= 500 or r.status_code == 429: last = str(r.status_code); time.sleep(6); continue
                r.raise_for_status()
                return json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"])
            except Exception as e:
                last = str(e)[:200]; time.sleep(4)
    raise RuntimeError(last)

def main():
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M")
    out = os.path.join(ROOT, "reports", "ai-engineer.md")
    if not KEY:
        open(out, "w", encoding="utf8").write("# المهندس التقني الذكي\n\n- آخر تشغيل: %s UTC\n- متوقف: سر GEMINI_API_KEY غير مضبوط.\n" % now); return 0
    try:
        d = ask(PROMPT.format(e2e=rd("reports/live-e2e.txt", 3500), review=rd("reports/site-review.md"), audit=rd("reports/adsense-audit.md", 2500), auto=rd("reports/auto-posts.md", 800), fails=failed_runs()))
    except Exception as e:
        open(out, "w", encoding="utf8").write("# المهندس التقني الذكي\n\n- آخر تشغيل: %s UTC\n- تعذّر التشخيص هذه المرة: %s\n" % (now, str(e)[:200])); return 0
    st = {"ok": "سليم ✓", "warning": "تحذير", "critical": "حرج"}.get(d.get("status"), "غير معروف")
    lines = ["# المهندس التقني الذكي", "", "- آخر تشغيل: %s UTC" % now, "- الحالة: **%s**" % st, "", str(d.get("summary", "")), "", "## المشاكل"]
    iss = d.get("issues") or []
    for i in iss:
        lines.append("- [%s] **%s** — السبب: %s — الحل: %s%s" % (i.get("severity", ""), i.get("title", ""), i.get("cause", ""), i.get("fix", ""), " — (يحتاج المالك)" if i.get("owner_action") else ""))
    if not iss: lines.append("- لا توجد مشاكل.")
    acts = [a for a in (d.get("actions") or []) if a in ALLOWED]
    lines += ["", "## إجراءات نُفّذت تلقائياً"] + (["- " + ALLOWED[a] for a in acts] or ["- لا شيء"])
    lines += ["", "## توصيات"] + ["- " + str(x) for x in (d.get("next_steps") or [])]
    open(out, "w", encoding="utf8").write("\n".join(lines) + "\n")
    json.dump({"actions": acts}, open(os.path.join(ROOT, "reports", "ai-actions.json"), "w"))
    print("status", st, "actions", acts)
    return 0

if __name__ == "__main__":
    sys.exit(main())
