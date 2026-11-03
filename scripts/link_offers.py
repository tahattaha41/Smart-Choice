#!/usr/bin/env python3
"""يربط عروض الشراكة (assets/content/monetization.json) بالمقالات المناسبة فعلاً باستخدام Gemini.
لا يربط إلا عند صلة قوية (درجة 7/10 فأكثر) وبحد أقصى عرضين للمقال؛ المقالات بلا صلة لا تظهر فيها عروض."""
import glob, json, os, re, sys, time
import requests
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate_post import discover_models  # noqa
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ.get("GEMINI_API_KEY", "").strip()
OUT = os.path.join(ROOT, "assets", "content", "offer-map.json")

def titles():
    out = []
    for p in sorted(glob.glob(ROOT + "/posts/*.md")):
        if os.path.basename(p).startswith("_"): continue
        t = open(p, encoding="utf8").read()
        m = re.search(r"^title:\s*(.+)$", t, re.M)
        if m and "publish: false" not in t: out.append(m.group(1).strip())
    return out

PROMPT = """لديك قائمة عروض منتجات (أمازون) وقائمة مقالات من موقع عن القرارات الشرائية والمال الشخصي.
اربط كل مقال بالعروض المناسبة له فعلاً فقط (صلة موضوعية حقيقية بين المقال والمنتج، لا ربطاً قسرياً). أعطِ كل ربط درجة صلة من 0 إلى 10.
العروض (الفهرس: العنوان): {offers}
المقالات: {posts}
أخرج JSON فقط بالشكل: {{"links":[{{"post":"عنوان المقال حرفياً","offer":فهرس_العرض,"score":رقم}}]}}"""

def ask(prompt):
    last = None
    for m in discover_models(KEY)[:3] + ["gemini-2.5-flash"]:
        try:
            g = {"temperature": 0.1, "maxOutputTokens": 4000, "responseMimeType": "application/json"}
            if "2.5" in m: g["thinkingConfig"] = {"thinkingBudget": 0}
            r = requests.post("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent" % m, headers={"x-goog-api-key": KEY}, json={"contents": [{"parts": [{"text": prompt}]}], "generationConfig": g}, timeout=90)
            if r.status_code != 200: last = r.status_code; time.sleep(3); continue
            return json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"])
        except Exception as e:
            last = str(e)[:100]
    raise RuntimeError(last)

def main():
    if not KEY: print("no key"); return 0
    cfg = json.load(open(os.path.join(ROOT, "assets", "content", "monetization.json"), encoding="utf8"))
    offers = cfg.get("offers") or []
    if not offers: return 0
    ts = titles()
    try:
        d = ask(PROMPT.format(offers="; ".join("%d: %s — %s" % (i, o.get("title", ""), o.get("desc", "")) for i, o in enumerate(offers)), posts=" | ".join(ts)))
    except Exception as e:
        print("AI failed:", e); return 0
    m = {}
    for l in d.get("links", []):
        try:
            if l["post"] in ts and 0 <= int(l["offer"]) < len(offers) and float(l["score"]) >= 7:
                m.setdefault(l["post"], [])
                if int(l["offer"]) not in m[l["post"]] and len(m[l["post"]]) < 2: m[l["post"]].append(int(l["offer"]))
        except Exception: continue
    json.dump({"map": m}, open(OUT, "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print("linked posts:", len(m))
    return 0

if __name__ == "__main__":
    sys.exit(main())
