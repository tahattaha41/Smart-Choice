#!/usr/bin/env python3
"""Sync pages/*.md to Blogger static Pages API. Existing page IDs are tracked separately."""
import hashlib, json, os, sys
from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

ROOT=Path("pages")
STATE=Path(".blogger-pages-state.json")
TOKEN_URI="https://oauth2.googleapis.com/token"
def parse(path):
    text=path.read_text(encoding="utf-8")
    meta={}
    body=text
    if text.startswith("---"):
        parts=text.split("---",2)
        if len(parts)==3:
            for line in parts[1].strip().splitlines():
                if ":" in line:
                    k,v=line.split(":",1); meta[k.strip().lower()]=v.strip()
            body=parts[2].strip()
    return {"title":meta.get("title",path.stem),"content":body,"publish":meta.get("publish","false").lower()=="true"}
def main():
    dry="--dry-run" in sys.argv
    blog=os.environ.get("BLOGGER_BLOG_ID","")
    state=json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
    files=sorted(p for p in ROOT.glob("*.md") if not p.name.startswith("_")) if ROOT.exists() else []
    current={p.name:parse(p) for p in files}
    service=None
    if not dry:
        required=("BLOGGER_CLIENT_ID","BLOGGER_CLIENT_SECRET","BLOGGER_REFRESH_TOKEN","BLOGGER_BLOG_ID")
        missing=[k for k in required if not os.environ.get(k)]
        if missing: raise SystemExit("Missing GitHub Secrets: "+", ".join(missing))
        creds=Credentials(token=None,refresh_token=os.environ["BLOGGER_REFRESH_TOKEN"],client_id=os.environ["BLOGGER_CLIENT_ID"],client_secret=os.environ["BLOGGER_CLIENT_SECRET"],token_uri=TOKEN_URI,scopes=["https://www.googleapis.com/auth/blogger"])
        service=build("blogger","v3",credentials=creds,cache_discovery=False)
    changed=False
    for name,page in current.items():
        digest=hashlib.sha256(json.dumps(page,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
        old=state.get(name)
        if old and old.get("hash")==digest:
            print("= unchanged:",name); continue
        body={"title":page["title"],"content":page["content"]}
        print(("update" if old else "create"),"published page" if page["publish"] else "draft page",name)
        if dry: continue
        result=None
        if old:
            try:
                result=service.pages().update(blogId=blog,pageId=old["id"],body=body).execute()
                if page["publish"] and result.get("status")=="DRAFT":
                    result=service.pages().publish(blogId=blog,pageId=old["id"]).execute()
            except HttpError as e:
                if getattr(e.resp,"status",None)!=404: raise
                print(" ! page was deleted on Blogger; recreating:",name)
                result=None
        if result is None:
            result=service.pages().insert(blogId=blog,body=body,isDraft=not page["publish"]).execute()
        state[name]={"id":result["id"],"hash":digest}
        print(" ->",result.get("url",result["id"]))
        changed=True
    if changed:
        STATE.write_text(json.dumps(state,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf-8")
if __name__=="__main__": main()
