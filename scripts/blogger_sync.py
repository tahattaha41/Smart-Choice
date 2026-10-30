#!/usr/bin/env python3
"""
Smart Choice — مزامنة محتوى Blogger

مزامنة ملفات posts/*.md مع مدونة Smart Choice على بلوجر عبر Blogger API v3.

كل ملف مقال شكله:

    ---
    title: عنوان المقال
    labels: تقنية, نصائح
    publish: false
    ---
    <p>محتوى المقال بصيغة HTML</p>

القواعد:
- publish: true  => ينشر المقال. أي قيمة تانية => يتحفظ كمسودة.
- الملفات اللي اسمها بيبدأ بـ _ بتتجاهل.
- ملف جديد => مقال جديد. ملف اتغيّر => تحديث نفس المقال.
- حذف ملف لا يحذف المقال من بلوجر إلا لو ALLOW_DELETE=1.
- --dry-run يطبع اللي هيحصل من غير أي اتصال ببلوجر.

المتغيرات المطلوبة (من GitHub Secrets):
  BLOGGER_CLIENT_ID, BLOGGER_CLIENT_SECRET, BLOGGER_REFRESH_TOKEN, BLOGGER_BLOG_ID
"""
import argparse
import hashlib
import json
import os
import sys
from pathlib import Path

POSTS_DIR = Path("posts")
STATE_FILE = Path(".blogger-state.json")  # ملف -> {id, hash}
SCOPES = ["https://www.googleapis.com/auth/blogger"]
TOKEN_URI = "https://oauth2.googleapis.com/token"


def parse_post(path):
    text = path.read_text(encoding="utf-8")
    meta, body = {}, text
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            for line in parts[1].strip().splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip().lower()] = v.strip()
            body = parts[2].strip()
    title = meta.get("title") or path.stem
    labels = [l.strip() for l in meta.get("labels", "").split(",") if l.strip()]
    publish = meta.get("publish", "false").lower() == "true"
    return {"title": title, "labels": labels, "publish": publish, "content": body}


def digest(post):
    raw = json.dumps(post, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {}


def save_state(state):
    STATE_FILE.write_text(
        json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def get_service():
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build

    creds = Credentials(
        token=None,
        refresh_token=os.environ["BLOGGER_REFRESH_TOKEN"],
        client_id=os.environ["BLOGGER_CLIENT_ID"],
        client_secret=os.environ["BLOGGER_CLIENT_SECRET"],
        token_uri=TOKEN_URI,
        scopes=SCOPES,
    )
    return build("blogger", "v3", credentials=creds, cache_discovery=False)


PREFERRED_POST_PATHS = {
    "how-to-calculate-discount.md": "/2026/10/blog-post_971.html",
    "monthly-budget-practical-guide.md": "/2026/10/blog-post_893.html",
    "unit-price-comparison-guide.md": "/2026/10/blog-post_82.html",
}


def find_existing_post(service, blog_id, post, filename):
    """Recover a Blogger post by title and known published URL; stop on ambiguity."""
    matches = []
    request = service.posts().list(blogId=blog_id, fetchBodies=True, maxResults=500, status=["LIVE", "DRAFT"])
    while request is not None:
        response = request.execute()
        matches.extend(item for item in response.get("items", []) if item.get("title") == post["title"])
        request = service.posts().list_next(request, response)
    if len(matches) > 1:
        preferred_path = PREFERRED_POST_PATHS.get(filename)
        preferred = [item for item in matches if preferred_path and item.get("url", "").endswith(preferred_path)]
        if len(preferred) == 1:
            return preferred[0]
        exact = [item for item in matches if item.get("content", "").strip() == post["content"].strip()]
        if len(exact) == 1:
            return exact[0]
        details = "; ".join("id=" + str(item.get("id")) + " url=" + str(item.get("url")) for item in matches)
        raise RuntimeError("توجد مقالات متعددة بنفس العنوان ولا يوجد تطابق محتوى فريد؛ أوقفت المزامنة منعاً لتحديث مقال خاطئ. " + details)
    return matches[0] if matches else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    blog_id = os.environ.get("BLOGGER_BLOG_ID", "")
    allow_delete = os.environ.get("ALLOW_DELETE") == "1"
    state = load_state()

    files = sorted(
        p for p in POSTS_DIR.glob("*.md") if not p.name.startswith("_")
    ) if POSTS_DIR.exists() else []
    current = {p.name: parse_post(p) for p in files}

    service = None
    if not args.dry_run:
        for var in ("BLOGGER_CLIENT_ID", "BLOGGER_CLIENT_SECRET",
                    "BLOGGER_REFRESH_TOKEN", "BLOGGER_BLOG_ID"):
            if not os.environ.get(var):
                sys.exit(f"المتغير {var} مش متضبط (ضيفه في GitHub Secrets).")
        service = get_service()

    changed = False

    for name, post in current.items():
        h = digest(post)
        entry = state.get(name)
        if entry and entry.get("hash") == h and entry.get("id"):
            print(f"= بدون تغيير: {name}")
            continue

        body = {"title": post["title"], "content": post["content"]}
        if post["labels"]:
            body["labels"] = post["labels"]
        action = "تحديث" if entry else "إنشاء"
        mode = "نشر" if post["publish"] else "مسودة"
        print(f"* {action} ({mode}): {name}")
        if args.dry_run:
            continue

        existing = None
        if entry and entry.get("id") and entry.get("hash"):
            try:
                existing = service.posts().get(blogId=blog_id, postId=entry["id"]).execute()
            except Exception:
                existing = None
        if existing is None:
            existing = find_existing_post(service, blog_id, post, name)
        if existing:
            post_id = existing["id"]
            result = service.posts().update(blogId=blog_id, postId=post_id, body=body).execute()
            if post["publish"] and result.get("status") == "DRAFT":
                result = service.posts().publish(blogId=blog_id, postId=post_id).execute()
            print("  -> استعادة/تحديث مقال موجود دون إنشاء نسخة جديدة")
        else:
            result = service.posts().insert(blogId=blog_id, body=body, isDraft=not post["publish"]).execute()
        state[name] = {"id": result["id"], "hash": h}
        print(f"  -> {result.get('url', result['id'])}")
        changed = True

    for name in [n for n in state if n not in current]:
        if allow_delete:
            print(f"- حذف من بلوجر: {name}")
            if not args.dry_run:
                service.posts().delete(
                    blogId=blog_id, postId=state[name]["id"]
                ).execute()
                del state[name]
                changed = True
        else:
            print(f"! الملف {name} اتحذف من المستودع لكن المقال لسه على بلوجر "
                  "(فعّل ALLOW_DELETE=1 لو عايز يتحذف).")

    if changed:
        save_state(state)


if __name__ == "__main__":
    main()
