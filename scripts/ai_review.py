#!/usr/bin/env python3
"""مراجعة جودة بالذكاء الاصطناعي عبر GitHub Models (مجاني ضمن حدود GitHub، بدون مفاتيح خارجية).
تقرأ تقرير adsense_audit.json وعيّنات من المحتوى وتكتب reports/ai-review.md بتوصيات. لا تعدّل أي ملف محتوى."""
import json, os, re, sys, urllib.request, urllib.error, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reports" / "ai-review.md"
token = os.environ.get("GITHUB_TOKEN", "")
audit = json.loads((ROOT / "reports" / "adsense-audit.json").read_text(encoding="utf-8"))

def strip(t):
    t = t.split("---", 2)[-1]
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)).strip()

samples = []
for p in sorted((ROOT / "posts").glob("*.md"))[:40]:
    if p.name.startswith("_"): continue
    txt = p.read_text(encoding="utf-8")
    m = re.search(r"^title:\s*(.+)$", txt, re.M)
    samples.append(f"- {m.group(1) if m else p.stem}: {strip(txt)[:350]}")
failing = [f"{c['level']}: {c['title']} {c['detail']}"[:300] for c in audit["checks"] if c["level"] in ("warn", "fail")]
prompt = (
    "أنت مراجع جودة لموقع عربي اسمه Smart Choice (أدوات حساب ومقالات تسوق ذكي) يستعد لطلب Google AdSense. "
    "اعتمد فقط على المعلومات أدناه ولا تخترع حقائق عن الموقع.\n\n"
    f"نتيجة الفحص الآلي: {audit['score']}% — مقالات: {audit['posts']} — متوسط الكلمات: {audit['avg_words']}\n"
    "ملاحظات الفحص:\n" + "\n".join(failing or ["لا ملاحظات"]) + "\n\nعيّنات من المقالات:\n" + "\n".join(samples) +
    "\n\nاكتب بالعربية: (1) أهم 5 مخاطر لرفض AdSense بالترتيب، (2) لكل خطر إجراء محدد قابل للتنفيذ، "
    "(3) 5 أفكار مقالات جديدة غير مكررة بعناوين مقترحة، (4) ملاحظات على جودة الصياغة إن وجدت. اجعلها موجزة ومرتبة في قوائم."
)
body = json.dumps({"model": "openai/gpt-4.1-mini", "messages": [
    {"role": "system", "content": "مراجع محتوى دقيق وصادق؛ لا تَعِد بالقبول في AdSense."},
    {"role": "user", "content": prompt}], "temperature": 0.3, "max_tokens": 1500}).encode()
ENDPOINTS = [
    ("https://models.github.ai/inference/chat/completions", "openai/gpt-4.1-mini"),
    ("https://models.inference.ai.azure.com/chat/completions", "gpt-4o-mini"),
]
def make_req(url, model):
    body = json.dumps({"model": model, "messages": [
        {"role": "system", "content": "مراجع محتوى دقيق وصادق؛ لا تَعِد بالقبول في AdSense."},
        {"role": "user", "content": prompt}], "temperature": 0.3, "max_tokens": 1500}).encode()
    return urllib.request.Request(url, data=body, headers={
        "Authorization": "Bearer " + token, "Content-Type": "application/json", "Accept": "application/json", "X-GitHub-Api-Version": "2022-11-28"})
now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
try:
    text, errs = None, []
    for url, model in ENDPOINTS:
        try:
            with urllib.request.urlopen(make_req(url, model), timeout=90) as r:
                raw = r.read().decode("utf-8", "ignore"); status = r.status
            try:
                text = json.loads(raw)["choices"][0]["message"]["content"]; break
            except Exception:
                errs.append("%s -> HTTP %s: %s" % (url.split("/")[2], status, raw[:120].replace("\n", " ")))
        except urllib.error.HTTPError as e:
            errs.append("%s -> HTTP %s %s" % (url.split("/")[2], e.code, e.read().decode("utf-8", "ignore")[:120].replace("\n", " ")))
    if text is None:
        raise RuntimeError(" | ".join(errs))
    OUT.write_text(f"# مراجعة الذكاء الاصطناعي ({now})\n\n> توصيات استشارية تُراجع يدوياً ولا تُطبَّق تلقائياً.\n\n{text}\n", encoding="utf-8")
    print("ok")
except urllib.error.HTTPError as e:
    detail = ""
    try: detail = e.read().decode("utf-8", "ignore")[:300].replace("\n", " ")
    except Exception: pass
    OUT.write_text(f"# مراجعة الذكاء الاصطناعي ({now})\n\nتعذر التشغيل: HTTP {e.code}. {detail}\n", encoding="utf-8")
    print("http error", e.code)
except Exception as e:
    OUT.write_text(f"# مراجعة الذكاء الاصطناعي ({now})\n\nتعذر التشغيل: {type(e).__name__}: {str(e)[:300]}\n", encoding="utf-8")
    print("error", type(e).__name__)
