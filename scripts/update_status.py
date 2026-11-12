#!/usr/bin/env python3
"""يولّد docs/STATUS.md تلقائياً من حالة المستودع (للجلسات الجديدة). لا يحتاج أسراراً."""
import glob, json, os, re, subprocess, datetime
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p):
    try: return open(os.path.join(R, p), encoding="utf-8").read()
    except Exception: return ""
def words(f):
    t = rd(f).split("---", 2)[-1]
    return len(re.sub(r"<[^>]+>", " ", t).split())
def sh(*a):
    try: return subprocess.check_output(a, cwd=R, text=True, stderr=subprocess.DEVNULL).strip()
    except Exception: return ""
posts = [f for f in sorted(glob.glob(os.path.join(R, "posts/*.md"))) if not os.path.basename(f).startswith("_")]
pages = sorted(glob.glob(os.path.join(R, "pages/*.md")))
tool_pages = [f for f in pages if os.path.basename(f).startswith("tool-")]
other = [f for f in pages if f not in tool_pages]
thin_t = [(os.path.basename(f), words(f)) for f in tool_pages if words(f) < 350]
thin_p = [(os.path.basename(f), words(f)) for f in posts if words(f) < 500]
urls = {}
try: urls = json.load(open(os.path.join(R, "assets/content/tool-urls.json"), encoding="utf-8"))
except Exception: pass
tools_md = rd("pages/tools.md")
n_tabs = len(re.findall(r'data-tab="', tools_md))
n_href = tools_md.count("data-href=")
e2e = rd("reports/live-e2e.txt")
fails = [l for l in e2e.splitlines() if l.startswith("FAIL")]
css_head = rd("assets/css/smart-choice.css").splitlines()[:1]
wf = sorted(os.path.basename(f) for f in glob.glob(os.path.join(R, ".github/workflows/*.yml")))
L = ["# حالة المشروع (تُولَّد تلقائياً — لا تعدّل يدوياً)", "",
     f"> آخر توليد: {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%d %H:%M} UTC بواسطة scripts/update_status.py. للتفاصيل الثابتة والقرارات: docs/HANDOFF.md.", "",
     "## الأرقام", f"- مقالات: {len(posts)} (متوسط الكلمات {sum(words(f) for f in posts)//max(1,len(posts))})",
     f"- صفحات: {len(pages)} (صفحات أدوات {len(tool_pages)}، أخرى {len(other)})",
     f"- أدوات في الفهرس: {n_tabs} زراً، منها {n_href} برابط صفحة؛ روابط tool-urls.json: {len(urls)}",
     f"- ترويسة CSS: {css_head[0][:100] if css_head else ''}", "",
     "## جودة المحتوى (مرتبطة برفض AdSense)",
     f"- صفحات أدوات أقل من 350 كلمة: {len(thin_t)} من {len(tool_pages)}" + (" — " + "، ".join(f"{n}({w})" for n, w in thin_t[:40]) if thin_t else ""),
     f"- مقالات أقل من 500 كلمة: {len(thin_p)}" + (" — " + "، ".join(f"{n}({w})" for n, w in thin_p) if thin_p else ""), "",
     "## آخر فحص حي", f"- FAIL: {len(fails)}" + ("".join("\n  - " + l[:160] for l in fails[:10])), "",
     "## Workflows", "، ".join(wf), "",
     "## آخر الكوميتات", *["- " + l for l in sh("git", "log", "-12", "--format=%h %ad %s", "--date=short").splitlines()], ""]
open(os.path.join(R, "docs/STATUS.md"), "w", encoding="utf-8").write("\n".join(L))
print("STATUS.md written")
