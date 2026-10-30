#!/usr/bin/env python3
"""يجمع محتوى pages/*.md و posts/*.md (المنشور فقط) في assets/content/bundle.json.
يستخدمه سكربت الواجهة لعرض المحتوى حتى لو لم يطبع قالب Blogger جسم الصفحة أو كانت خلاصة المدونة مختصرة."""
import json
from pathlib import Path

def parse(path):
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
    return meta, body

items = []
for kind, folder in (("page", "pages"), ("post", "posts")):
    for p in sorted(Path(folder).glob("*.md")):
        if p.name.startswith("_"):
            continue
        meta, body = parse(p)
        if meta.get("publish", "false").lower() != "true":
            continue
        items.append({"kind": kind, "title": meta.get("title", p.stem), "html": body})
out = Path("assets/content/bundle.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({"items": items}, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"bundle: {len(items)} items, {out.stat().st_size} bytes")
