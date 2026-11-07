#!/usr/bin/env python3
"""يجلب أسعاراً مرجعية للعملات مقابل الجنيه من open.er-api.com (بلا مفتاح) ويكتب assets/content/rates.json.
عند الفشل يُبقي الملف القديم (الواجهة تخفي الأسعار إن تجاوزت 48 ساعة) ويكتب السبب في reports/rates-error.md."""
import json, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/content/rates.json"
ERR = ROOT / "reports/rates-error.md"
CUR = ["USD", "EUR", "SAR", "GBP", "AED"]

try:
    req = urllib.request.Request("https://open.er-api.com/v6/latest/USD", headers={"User-Agent": "smart-choice-rates"})
    d = json.load(urllib.request.urlopen(req, timeout=30))
    if d.get("result") != "success":
        raise RuntimeError("api result=" + str(d.get("result")))
    r = d["rates"]; egp = r["EGP"]
    if not (5 < egp < 500):
        raise RuntimeError("implausible EGP rate %s" % egp)
    out = {"source": "open.er-api.com", "note": "سعر مرجعي لمنتصف السوق", "updated": int(d["time_last_update_unix"]), "fetched": int(time.time()),
           "egp": {c: round(egp / r[c], 4) for c in CUR if c in r and r[c]}}
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    ERR.unlink(missing_ok=True)
    print("ok", out["egp"])
except Exception as e:
    ERR.parent.mkdir(exist_ok=True)
    ERR.write_text("# خطأ أسعار العملات\n\n%s: %s\n" % (e.__class__.__name__, str(e)[:300]), encoding="utf-8")
    print("ERR", e)
