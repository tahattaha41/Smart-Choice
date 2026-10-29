# Smart Choice — Blogger Content Sync

المستودع ده مسؤول حالياً عن مزامنة محتوى مدونة Smart Choice على Blogger. **ده جزء إدارة المحتوى فقط، وليس تطبيق Smart Choice الكامل أو لوحة التحكم النهائية.**

أي مقال في `posts/` بيتزامن مع بلوجر تلقائياً عند الـ push على `main`.

## شكل المقال

ملف `posts/اسم-المقال.md`:

```
---
title: عنوان المقال
labels: تصنيف1, تصنيف2
publish: false
---
<p>محتوى المقال بصيغة HTML</p>
```

- `publish: true` ينشر المقال، وأي قيمة تانية تحفظه كمسودة.
- تعديل الملف يحدّث نفس المقال على بلوجر.
- الملفات اللي بتبدأ بـ `_` بتتجاهل.
- حذف ملف مش بيحذف المقال من بلوجر إلا لو ضبطت متغير المستودع `ALLOW_DELETE=1`.

## الإعداد (مرة واحدة)

1. في Google Cloud: فعّل **Blogger API v3**، وأنشئ **OAuth client ID** من نوع **Desktop app**، ونزّل الملف باسم `client_secret.json`.
2. على جهازك: `pip install -r requirements.txt` ثم `python scripts/get_refresh_token.py` ووافق في المتصفح.
3. في **Settings > Secrets and variables > Actions** ضيف أربع Secrets:
   `BLOGGER_CLIENT_ID`, `BLOGGER_CLIENT_SECRET`, `BLOGGER_REFRESH_TOKEN`, `BLOGGER_BLOG_ID`.
4. في Google Cloud اعمل الـ OAuth consent screen **In production**، وإلا الـ refresh token بيتنتهي بعد 7 أيام.

ماتحطش `client_secret.json` أو `token.json` في المستودع.

## تجربة من غير نشر

```
python scripts/blogger_sync.py --dry-run
```
