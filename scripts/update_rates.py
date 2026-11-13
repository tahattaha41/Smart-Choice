#!/usr/bin/env python3
"""يجلب أسعاراً مرجعية ويكتب assets/content/rates.json (تقرؤه الواجهة مباشرة من GitHub دون إعادة نشر القالب):
- العملات مقابل الجنيه: open.er-api.com (بلا مفتاح). المصدر نفسه يتجدد مرة كل 24 ساعة، فلا نطلبه أكثر من مرة كل 3 ساعات.
- الذهب والفضة: XAUS (xaus.com/api، بلا مفتاح، سعر فوري عالمي بالدولار للأوقية) في كل تشغيلة، ويُحوَّل للجنيه بسعر الدولار أعلاه.
  احتياطي عند تعذّره: GoldAPI.io (السر GOLD_API_KEY) مرة كل ~20 ساعة لحماية حصته المجانية.
- يحفظ القيم السابقة (prev) عند تغيّر أي سعر ليعرض الموقع اتجاه التغيّر.
عند فشل أي جزء يُبقي بياناته القديمة (الواجهة تخفي ما تجاوز حدّ الحداثة) ويكتب السبب في reports/rates-error.md. لا يطبع المفتاح ولا يخزّنه."""
import copy, datetime, json, os, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/content/rates.json"
ERR = ROOT / "reports/rates-error.md"
CUR = ["USD", "EUR", "GBP", "SAR", "AED", "KWD", "QAR"]
OZ = 31.1034768  # جرام في الأوقية الترويسية
FX_EVERY = 3 * 3600
WRITE_EVERY = 6 * 3600  # نكتب الملف حتى دون تغيّر كل 6 ساعات ليبقى «آخر فحص» حديثاً

try:
    data = json.loads(OUT.read_text(encoding="utf-8"))
except Exception:
    data = {}
old = copy.deepcopy(data)
errors = []
now = time.time()


def get_json(url, headers=None):
    h = {"User-Agent": "smart-choice-rates"}
    h.update(headers or {})
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=30))


# --- العملات ---
if old.get("egp") and now - old.get("fetched", 0) < FX_EVERY:
    print("fx fresh, skip")
else:
    try:
        d = get_json("https://open.er-api.com/v6/latest/USD")
        if d.get("result") != "success":
            raise RuntimeError("api result=" + str(d.get("result")))
        r = d["rates"]
        egp = r["EGP"]
        if not (5 < egp < 500):
            raise RuntimeError("implausible EGP rate %s" % egp)
        data.update({"source": "open.er-api.com", "note": "سعر مرجعي لمنتصف السوق", "updated": int(d["time_last_update_unix"]),
                     "fetched": int(now), "egp": {c: round(egp / r[c], 4) for c in CUR if c in r and r[c]}})
        print("fx ok", data["egp"])
    except Exception as e:
        errors.append("FX %s: %s" % (e.__class__.__name__, str(e)[:200]))


# --- المعادن ---
def find(o, *keys):
    """أول قيمة رقمية تحت أحد المفاتيح (بحث متداخل) لأن شكل الاستجابة غير مثبّت."""
    if isinstance(o, dict):
        for k in keys:
            v = o.get(k)
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                return float(v)
        for v in o.values():
            r = find(v, *keys)
            if r is not None:
                return r
    elif isinstance(o, list):
        for v in o:
            r = find(v, *keys)
            if r is not None:
                return r
    return None


def to_epoch(v):
    if isinstance(v, (int, float)) and v > 0:
        return int(v / 1000) if v > 1e12 else int(v)
    if isinstance(v, str) and v:
        try:
            return int(datetime.datetime.fromisoformat(v.replace("Z", "+00:00")).timestamp())
        except ValueError:
            return None
    return None


def jump_ok(new, prev_block, field):
    """حماية: قفزة >15% خلال 48 ساعة تُعتبر قراءة خاطئة."""
    prev = (prev_block or {}).get(field)
    if prev and now - (prev_block or {}).get("fetched", 0) < 48 * 3600 and abs(new / prev - 1) > 0.15:
        raise RuntimeError("implausible jump %s -> %s" % (prev, new))


usd_egp = (data.get("egp") or {}).get("USD")
metals_ok = False
fx_fresh = data.get("fetched") and now - data["fetched"] < 48 * 3600
if not (usd_egp and fx_fresh):
    errors.append("METALS: سعر الدولار غير متاح أو قديم فلا يمكن تحويل المعادن للجنيه")
else:
    try:
        d = get_json("https://xaus.com/api/v1/spot?compact=1")
        gold_oz = find(d, "spot_usd_oz") or ((find(d, "per_gram_usd") or 0) * OZ) or None
        silver_oz = find(d, "silver_usd_oz")
        ds = d.get("data_state") if isinstance(d.get("data_state"), dict) else {}
        age = ds.get("age_seconds")
        if isinstance(age, (int, float)) and age > 7 * 86400:
            raise RuntimeError("source data too old (%ss)" % age)
        ts = to_epoch(d.get("updated_at")) or to_epoch(ds.get("as_of")) or int(now)
        status = str(ds.get("status") or "")[:30]
        if not (gold_oz and 300 < gold_oz < 50000):
            raise RuntimeError("implausible gold usd/oz %s" % gold_oz)
        jump_ok(gold_oz, old.get("gold"), "usd_oz")
        g24 = gold_oz / OZ * usd_egp
        data["gold"] = {"source": "xaus.com", "note": "سعر مرجعي عالمي محوّل للجنيه، لا يشمل المصنعية ولا فرق السوق المحلي",
                        "updated": ts, "fetched": int(now), "status": status, "usd_oz": round(gold_oz, 2),
                        "egp_gram": {"24": round(g24, 2), "21": round(g24 * 21 / 24, 2), "18": round(g24 * 18 / 24, 2)}}
        print("gold ok", data["gold"]["egp_gram"])
        metals_ok = True
        if silver_oz and 3 < silver_oz < 2000:
            jump_ok(silver_oz, old.get("silver"), "usd_oz")
            s999 = silver_oz / OZ * usd_egp
            data["silver"] = {"source": "xaus.com", "note": "سعر مرجعي عالمي للفضة الخالصة محوّل للجنيه", "updated": ts,
                              "fetched": int(now), "status": status, "usd_oz": round(silver_oz, 2),
                              "egp_gram": {"999": round(s999, 2), "925": round(s999 * 0.925, 2)}}
            print("silver ok", data["silver"]["egp_gram"])
        else:
            errors.append("SILVER: لم يرد سعر فضة معقول من XAUS (%s)" % silver_oz)
    except Exception as e:
        errors.append("XAUS %s %s: %s" % (e.__class__.__name__, getattr(e, "code", ""), str(e)[:200]))

# --- احتياطي: GoldAPI.io (حصة محدودة) ---
key = os.environ.get("GOLD_API_KEY", "").strip()


def gapi(sym):
    return get_json("https://www.goldapi.io/api/%s/EGP" % sym, {"x-access-token": key, "Content-Type": "application/json"})


def fresh(blk, hours=20):
    return blk and now - blk.get("fetched", 0) < hours * 3600


if not metals_ok:
    if not key:
        errors.append("GOLD: لا مصدر متاح (XAUS فشل ولا يوجد GOLD_API_KEY)")
    elif fresh(data.get("gold")) and fresh(data.get("silver")):
        print("metals fresh (fallback not needed)")
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
            if not ts or abs(now - ts) > 86400:
                raise RuntimeError("stale or missing gold timestamp %s" % ts)
            data["gold"] = {"source": "GoldAPI.io", "note": "سعر مرجعي عالمي محوّل للجنيه، لا يشمل المصنعية ولا فرق السوق المحلي",
                            "updated": ts, "fetched": int(now), "egp_gram": {"24": round(p24, 2), "21": round(p21, 2), "18": round(p18, 2)}}
            print("gold ok (fallback)", data["gold"]["egp_gram"])
        except Exception as e:
            errors.append("GOLD %s %s: %s" % (e.__class__.__name__, getattr(e, "code", ""), str(e)[:200]))
        try:
            s_ = gapi("XAG")
            pg = s_.get("price_gram_24k") or (s_.get("price") or 0) / OZ
            ts = int(s_.get("timestamp") or 0)
            if not (5 < pg < 10000) or not ts or abs(now - ts) > 86400:
                raise RuntimeError("implausible silver %s ts=%s" % (pg, ts))
            data["silver"] = {"source": "GoldAPI.io", "note": "سعر مرجعي عالمي للفضة الخالصة محوّل للجنيه", "updated": ts, "fetched": int(now),
                              "egp_gram": {"999": round(pg, 2), "925": round(pg * 0.925, 2)}}
            print("silver ok (fallback)", data["silver"]["egp_gram"])
        except Exception as e:
            errors.append("SILVER %s %s: %s" % (e.__class__.__name__, getattr(e, "code", ""), str(e)[:200]))

# --- اتجاه التغيّر: نحفظ القيمة السابقة كلما تغيّرت القيمة الحالية ---
def same(a, b):
    return json.dumps(a, sort_keys=True) == json.dumps(b, sort_keys=True)


prev = dict(data.get("prev") or {})
if old.get("egp") and not same(old.get("egp"), data.get("egp")):
    prev["egp"] = old["egp"]
for name in ("gold", "silver"):
    o = (old.get(name) or {}).get("egp_gram"); n = (data.get(name) or {}).get("egp_gram")
    if o and not same(o, n):
        prev[name] = o
if prev:
    data["prev"] = prev


def core(d):
    return [d.get("egp"), (d.get("gold") or {}).get("egp_gram"), (d.get("silver") or {}).get("egp_gram"),
            (d.get("gold") or {}).get("updated"), (d.get("silver") or {}).get("updated"), d.get("updated")]


if same(core(old), core(data)) and now - old.get("fetched", 0) < WRITE_EVERY and old:
    print("no price change; file left untouched")
else:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("rates.json written")

if errors:
    ERR.parent.mkdir(exist_ok=True)
    ERR.write_text("# خطأ الأسعار المرجعية\n\n" + "\n".join("- " + x for x in errors) + "\n", encoding="utf-8")
    print("ERR", errors)
else:
    ERR.unlink(missing_ok=True)
