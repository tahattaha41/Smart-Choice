#!/usr/bin/env python3
"""يجلب مشاهدات الصفحات الحقيقية من Blogger API ويكتب reports/stats.json وسجلاً يومياً reports/stats-history.json."""
import json, os, datetime
from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

def main():
    ROOT = Path(__file__).resolve().parent.parent
    creds = Credentials(token=None, refresh_token=os.environ["BLOGGER_REFRESH_TOKEN"], client_id=os.environ["BLOGGER_CLIENT_ID"],
                        client_secret=os.environ["BLOGGER_CLIENT_SECRET"], token_uri="https://oauth2.googleapis.com/token",
                        scopes=["https://www.googleapis.com/auth/blogger"])
    svc = build("blogger", "v3", credentials=creds, cache_discovery=False)
    blog_id = os.environ["BLOGGER_BLOG_ID"]
    pv = svc.pageViews().get(blogId=blog_id, range=["7DAYS", "30DAYS", "all"]).execute()
    counts = {c["timeRange"]: int(c["count"]) for c in pv.get("counts", [])}
    blog = svc.blogs().get(blogId=blog_id).execute()
    now = datetime.datetime.now(datetime.timezone.utc)
    stats = {"updated": now.strftime("%Y-%m-%d %H:%M UTC"), "d7": counts.get("SEVEN_DAYS", counts.get("7DAYS", 0)),
             "d30": counts.get("THIRTY_DAYS", counts.get("30DAYS", 0)), "all": counts.get("ALL_TIME", counts.get("all", 0)),
             "posts": blog.get("posts", {}).get("totalItems"), "pages": blog.get("pages", {}).get("totalItems")}
    (ROOT / "reports").mkdir(exist_ok=True)
    (ROOT / "reports" / "stats.json").write_text(json.dumps(stats, ensure_ascii=False, indent=1), encoding="utf-8")
    hp = ROOT / "reports" / "stats-history.json"
    hist = json.loads(hp.read_text(encoding="utf-8")) if hp.exists() else []
    today = now.strftime("%Y-%m-%d")
    hist = [h for h in hist if h["date"] != today] + [{"date": today, "all": stats["all"], "d7": stats["d7"], "d30": stats["d30"]}]
    hp.write_text(json.dumps(hist[-180:], ensure_ascii=False), encoding="utf-8")
    print(stats)


def diag():
    import os
    out = ["تشخيص (بدون كشف القيم):"]
    for k in ("BLOGGER_CLIENT_ID", "BLOGGER_CLIENT_SECRET", "BLOGGER_REFRESH_TOKEN", "BLOGGER_BLOG_ID"):
        v = os.environ.get(k, "")
        out.append("- %s: طول=%d، مسافات/أسطر في الأطراف=%s، يبدأ بـ %s" % (k, len(v), v != v.strip(), v[:4] if k != "BLOGGER_CLIENT_SECRET" else v[:6]))
    cid = os.environ.get("BLOGGER_CLIENT_ID", "")
    out.append("- client_id يبدأ بـ 306962213730-s37ce: %s" % cid.startswith("306962213730-s37ce"))
    return "\n".join(out)


try:
    main()
    (Path(__file__).resolve().parent.parent / "reports" / "stats-error.md").unlink(missing_ok=True)
except Exception as exc:
    r = Path(__file__).resolve().parent.parent / "reports"
    r.mkdir(exist_ok=True)
    (r / "stats-error.md").write_text("# خطأ الإحصائيات\n\n" + exc.__class__.__name__ + ": " + str(exc)[:500] + "\n\n" + diag() + "\n", encoding="utf-8")
    print("ERR", exc)
