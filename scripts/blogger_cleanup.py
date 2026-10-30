#!/usr/bin/env python3
"""جرد صفحات ومقالات Blogger، وحذف غير المُدارة منها التي تحمل اسماً قديماً (Utilityra) عند الطلب فقط.

الوضع الافتراضي: تقرير فقط (reports/blogger-inventory.json) بدون أي حذف.
--delete: ينسخ احتياطياً كل عنصر إلى backup/ ثم يحذفه. لا يحذف أبداً ما هو مسجل في ملفات الحالة
(.blogger-state.json / .blogger-pages-state.json) ولا ما لا يحتوي العنوان على الكلمة المطلوبة.
"""
import json, os, re, sys
from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

PATTERN = re.compile(os.environ.get("CLEANUP_PATTERN", "utilityra"), re.I)
DELETE = "--delete" in sys.argv

def managed_ids(file):
    p = Path(file)
    return {v["id"] for v in json.loads(p.read_text(encoding="utf-8")).values() if v.get("id")} if p.exists() else set()

def listing(call, **kw):
    req = call.list(**kw)
    while req is not None:
        resp = req.execute()
        for item in resp.get("items", []):
            yield item
        req = call.list_next(req, resp)

def main():
    for v in ("BLOGGER_CLIENT_ID", "BLOGGER_CLIENT_SECRET", "BLOGGER_REFRESH_TOKEN", "BLOGGER_BLOG_ID"):
        if not os.environ.get(v):
            sys.exit(f"Missing {v}")
    blog = os.environ["BLOGGER_BLOG_ID"]
    creds = Credentials(token=None, refresh_token=os.environ["BLOGGER_REFRESH_TOKEN"], client_id=os.environ["BLOGGER_CLIENT_ID"],
                        client_secret=os.environ["BLOGGER_CLIENT_SECRET"], token_uri="https://oauth2.googleapis.com/token",
                        scopes=["https://www.googleapis.com/auth/blogger"])
    svc = build("blogger", "v3", credentials=creds, cache_discovery=False)
    keep_posts, keep_pages = managed_ids(".blogger-state.json"), managed_ids(".blogger-pages-state.json")
    pages = list(listing(svc.pages(), blogId=blog, fetchBodies=True, status=["LIVE", "DRAFT"]))
    posts = list(listing(svc.posts(), blogId=blog, fetchBodies=True, status=["LIVE", "DRAFT"], maxResults=500))
    inv = {"pages": [], "posts": []}
    targets = []
    for kind, items, keep in (("pages", pages, keep_pages), ("posts", posts, keep_posts)):
        for it in items:
            managed = it["id"] in keep
            match = bool(PATTERN.search(it.get("title", "")))
            inv[kind].append({"id": it["id"], "title": it.get("title"), "url": it.get("url"), "status": it.get("status"), "managed": managed, "matches_old_name": match})
            if match and not managed:
                targets.append((kind, it))
    Path("reports").mkdir(exist_ok=True)
    Path("reports/blogger-inventory.json").write_text(json.dumps(inv, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"pages={len(pages)} posts={len(posts)} deletion-candidates={len(targets)} delete={DELETE}")
    if DELETE and targets:
        Path("backup").mkdir(exist_ok=True)
        Path("backup/removed-blogger-items.json").write_text(json.dumps([{"kind": k, **it} for k, it in targets], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        for kind, it in targets:
            (svc.pages().delete(blogId=blog, pageId=it["id"]) if kind == "pages" else svc.posts().delete(blogId=blog, postId=it["id"])).execute()
            print("deleted", kind, it["id"], it.get("title"))

if __name__ == "__main__":
    import traceback
    try:
        main()
    except Exception as e:  # نكتب الخطأ في ملف لأن سجلات Actions قد لا تكون متاحة للمراجعة
        Path("reports").mkdir(exist_ok=True)
        msg = type(e).__name__ + ": " + str(e)
        for secret in ("BLOGGER_CLIENT_SECRET", "BLOGGER_REFRESH_TOKEN"):
            if os.environ.get(secret):
                msg = msg.replace(os.environ[secret], "***")
        Path("reports/last-error.txt").write_text(msg[:3000] + "\n", encoding="utf-8")
        print(msg)
        sys.exit(1)
