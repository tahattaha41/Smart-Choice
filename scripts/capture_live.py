#!/usr/bin/env python3
"""يحفظ ملخصاً لجسم صفحات الموقع الحي (بدون CSS/JS) في reports/ لتشخيص ما يراه الزائر فعلاً."""
import re, sys, time, urllib.request
BASE = "https://smartchoicee1.blogspot.com"
PAGES = {"tools": "/p/smart-choice_02145436434.html", "post": "/2026/10/blog-post_971.html", "contact": "/p/smart-choice_02092521556.html"}
import os
os.makedirs("reports", exist_ok=True)
for name, path in PAGES.items():
    html = ""
    for attempt in range(5):
        try:
            html = urllib.request.urlopen(urllib.request.Request(BASE + path, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read().decode("utf-8", "replace")
            break
        except Exception as e:
            html = f"ERROR {e}"; time.sleep(8 * (attempt + 1))
    i = html.find("<body")
    body = html[i:] if i >= 0 else html
    body = re.sub(r"<script[\s\S]*?</script>", "<script/>", body)
    body = re.sub(r"<style[\s\S]*?</style>", "<style/>", body)
    open(f"reports/live-{name}.txt", "w", encoding="utf-8").write(f"{len(html)} bytes total\n" + body[:6000])
    time.sleep(5)
