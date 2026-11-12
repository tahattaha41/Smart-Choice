#!/usr/bin/env python3
"""يجلب أسعاراً مرجعية: العملات مقابل الجنيه (open.er-api.com، بلا مفتاح) والذهب (GoldAPI.io عبر السر GOLD_API_KEY).
يكتب assets/content/rates.json. عند فشل أي جزء يُبقي بياناته القديمة (الواجهة تخفي ما تجاوز حدّ الحداثة)
ويكتب السبب في reports/rates-error.md. لا يطبع المفتاح ولا يخزّنه."""
import json, os, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/content/rates.json"
ERR = ROOT / "reports/rates-error.md"
CUR = ["USD", "EUR", "SAR", "GBP", "AED"]

try:
    data = json.loads(OUT.read_text(encoding="utf-8"))
except Exception:
    data = {}
errors = []

# --- العملات ---
try:
    req = urllib.request.Request("https://open.er-api.com/v6/latest/USD", headers={"User-Agent": "smart-choice-rates"})
    d = json.load(urllib.request.urlopen(req, timeout=30))
    if d.get("result") != "success":
        raise RuntimeError("api result=" + str(d.get("result")))
    r = d["rates"]; egp = r["EGP"]
    if not (5 < egp < 500):
        raise RuntimeError("implausible EGP rate %s" % egp)
    data.update({"source": "open.er-api.com", "note": "سعر مرجعي لمنتصف السوق", "updated": int(d["time_last_update_unix"]),
                 "fetched": int(time.time()), "egp": {c: round(egp / r[c], 4) for c in CUR if c in r and r[c]}})
    print("fx ok", data["egp"])
except Exception as e:
    errors.append("FX %s: %s" % (e.__class__.__name__, str(e)[:200]))

# --- المعادن (GoldAPI.io): مرة كل ~20 ساعة لتوفير حصة الخطة المجانية (~100 طلب/شهر) ---
key = os.environ.get("GOLD_API_KEY", "").strip()
def gapi(sym):
    req = urllib.request.Request("https://www.goldapi.io/api/%s/EGP" % sym, headers={"x-access-token": key, "Content-Type": "application/json", "User-Agent": "smart-choice-rates"})
    return json.load(urllib.request.urlopen(req, timeout=30))
def fresh(blk):
    return blk and time.time() - blk.get("fetched", 0) < 20 * 3600
if not key:
    errors.append("GOLD: السر GOLD_API_KEY غير متاح")
elif fresh(data.get("gold")) and fresh(data.get("silver")):
    print("metals fresh, skip")
else:
    try:
        g = gapi("XAU")
        p24 = g.get("price_gram_24k"); p21 = g.get("price_gram_21k"); p18 = g.get("price_gram_18k")
        if not p21 and p24: p21 = p24 * 21 / 24
        if not p18 and p24: p18 = p24 * 18 / 24
        if not p24 and p21: p24 = p21 * 24 / 21
        ts = int(g.get("timestamp") or 0)
        if not (p24 and 500 < p24 < 100000):
            raise RuntimeError("implausible gold price %s" % p24)
        if not ts or abs(time.time() - ts) > 86400:
            raise RuntimeError("stale or missing gold timestamp %s" % ts)
        data["gold"] = {"source": "GoldAPI.io", "note": "سعر مرجعي عالمي محوّل للجنيه، لا يشمل المصنعية ولا فرق السوق المحلي",
                        "updated": ts, "fetched": int(time.time()),
                        "egp_gram": {"24": round(p24, 2), "21": round(p21, 2), "18": round(p18, 2)}}
        print("gold ok", data["gold"]["egp_gram"])
    except Exception as e:
        errors.append("GOLD %s %s: %s" % (e.__class__.__name__, getattr(e, "code", ""), str(e)[:200]))
    try:
        s_ = gapi("XAG")
        pg = s_.get("price_gram_24k") or (s_.get("price") or 0) / 31.1035
        ts = int(s_.get("timestamp") or 0)
        if not (5 < pg < 10000) or not ts or abs(time.time() - ts) > 86400:
            raise RuntimeError("implausible silver %s ts=%s" % (pg, ts))
        data["silver"] = {"source": "GoldAPI.io", "note": "سعر مرجعي عالمي للفضة الخالصة محوّل للجنيه", "updated": ts, "fetched": int(time.time()),
                          "egp_gram": {"999": round(pg, 2), "925": round(pg * 0.925, 2)}}
        print("silver ok", data["silver"]["egp_gram"])
    except Exception as e:
        errors.append("SILVER %s %s: %s" % (e.__class__.__name__, getattr(e, "code", ""), str(e)[:200]))

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
if errors:
    ERR.parent.mkdir(exist_ok=True)
    ERR.write_text("# خطأ الأسعار المرجعية\n\n" + "\n".join("- " + x for x in errors) + "\n", encoding="utf-8")
    print("ERR", errors)
else:
    ERR.unlink(missing_ok=True)
