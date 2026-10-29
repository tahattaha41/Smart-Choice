#!/usr/bin/env python3
"""
يشتغل على جهازك إنت (مرة واحدة) عشان يطلّع الـ refresh token.

1) نزّل client_secret.json من Google Cloud (نوع OAuth client: Desktop app)
   وحطه جنب السكريبت ده.
2) python scripts/get_refresh_token.py
3) وافق على الصلاحية في المتصفح.
4) انسخ القيم المطبوعة وحطها في GitHub Secrets. ماتبعتهاش لأي حد.
"""
import json

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/blogger"]

flow = InstalledAppFlow.from_client_secrets_file("client_secret.json", SCOPES)
creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")

with open("client_secret.json", encoding="utf-8") as f:
    cfg = json.load(f)
cfg = cfg.get("installed") or cfg.get("web")

print("\n=== انسخ القيم دي في GitHub Secrets (Settings > Secrets and variables > Actions) ===")
print("BLOGGER_CLIENT_ID     =", cfg["client_id"])
print("BLOGGER_CLIENT_SECRET =", cfg["client_secret"])
print("BLOGGER_REFRESH_TOKEN =", creds.refresh_token)
print("(وضيف كمان BLOGGER_BLOG_ID: رقم مدونتك)")
