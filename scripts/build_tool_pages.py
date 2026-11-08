#!/usr/bin/env python3
"""يولّد صفحة مستقلة لكل أداة من pages/tools.md (مصدر الحقيقة) ويحقن روابطها في صفحة الفهرس.
- pages/tool-<key>.md لكل أداة (عدا compare/decide لهما صفحتان قائمتان، والمساعد يبقى في الفهرس).
- assets/content/tool-urls.json: key -> مسار الصفحة (من .blogger-pages-state.json بعد المزامنة).
شغّله قبل المزامنة وبعدها (الثانية لحقن الروابط). آمن لإعادة التشغيل."""
import json, re
from pathlib import Path
from urllib.parse import urlparse
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pages/tools.md"
STATE = ROOT / ".blogger-pages-state.json"
SPECIAL = {"compare": "compare.md", "decide": "decide.md"}
HUB_ONLY = {"assistant"}
state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
def path_of(fname):
    u = (state.get(fname) or {}).get("url")
    return urlparse(u).path if u else None
src = SRC.read_text(encoding="utf-8")
m = re.match(r"^---\n(.*?)\n---\n(.*)$", src, re.S)
body = m.group(2)
btns = re.findall(r'<button type="button" data-tab="([a-z0-9]+)"[^>]*>([^<]*)</button>', body)
names = {k: v.strip() for k, v in btns}
secs = {mm.group(1): mm.group(0) for mm in re.finditer(r'<section class="sc-tool-card sc-tool" id="sc-([a-z0-9]+)"[^>]*>.*?</section>', body, re.S)}
js = (ROOT / "assets/js/smart-choice.js").read_text(encoding="utf-8")
cat = {}
mc = re.search(r"const TAB_CAT = \{(.*?)\};", js, re.S)
for k, v in re.findall(r"([a-z0-9]+):\"([a-z]+)\"", mc.group(1) if mc else ""): cat[k] = v
urls = {}
for k in names:
    p = path_of(SPECIAL.get(k) or ("tool-%s.md" % k))
    if p: urls[k] = p
(ROOT / "assets/content/tool-urls.json").write_text(json.dumps(urls, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
hub = path_of("tools.md") or "/p/tools.html"
n = 0
for k, sec in secs.items():
    if k in HUB_ONLY or k in SPECIAL: continue
    name = names.get(k, k)
    s = re.sub(r"(<section[^>]*?)\s+hidden(>)", r"\1\2", sec, count=1)
    rel = [x for x in names if x != k and x not in HUB_ONLY and cat.get(x) == cat.get(k)][:5] or [x for x in names if x != k and x not in HUB_ONLY][:5]
    links = " ".join('<a class="sc-rel" href="%s">%s</a>' % (urls.get(x, hub), names[x]) for x in rel)
    page = ("---\ntitle: %s | Smart Choice\nlabels: أدوات, Smart Choice\npublish: true\n---\n"
            '<div class="sc-page sc-toolpage" dir="rtl" lang="ar">\n'
            '<nav class="sc-crumbs" aria-label="مسار التصفح"><a href="/">الرئيسية</a> › <a href="%s">الأدوات</a> › <span>%s</span></nav>\n'
            "%s\n"
            '<section class="sc-tool-card sc-prose"><h2>أدوات ذات صلة</h2><p class="sc-relrow">%s</p><p><a href="%s">عرض كل الأدوات ←</a></p></section>\n'
            "</div>\n") % (name, hub, name, s, links, hub)
    out = ROOT / ("pages/tool-%s.md" % k)
    if not out.exists() or out.read_text(encoding="utf-8") != page:
        out.write_text(page, encoding="utf-8"); n += 1
# حقن data-href في أزرار الفهرس
def inj(mo):
    k = mo.group(1); tag = re.sub(r'\sdata-href="[^"]*"', "", mo.group(0))
    return tag.replace('data-tab="%s"' % k, 'data-tab="%s"%s' % (k, ' data-href="%s"' % urls[k] if k in urls else ""), 1)
new = re.sub(r'<button type="button" data-tab="([a-z0-9]+)"[^>]*>', inj, src)
if new != src: SRC.write_text(new, encoding="utf-8")
print("generated/updated pages:", n, "| urls known:", len(urls), "| hub updated:", new != src)
