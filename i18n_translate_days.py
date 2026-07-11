#!/usr/bin/env python3
"""v4.63 i18n: translate days-data.js to EN (missing) + ES (new). Rate-limit aware."""
import json, os, subprocess, sys, concurrent.futures as cf
from i18n_common import chat_json

ROOT = "/home/ubuntu/quo-vadis"
TEXT_LEAF_KEYS = {"title","text","desc","name","notes","schedule","fuel","budget","location","address"}

def load_days():
    js = 'const fs=require("fs");let src=fs.readFileSync("days-data.js","utf8");' \
         'eval(src);process.stdout.write(JSON.stringify(DAYS_DATA));'
    return json.loads(subprocess.check_output(["node","-e",js], cwd=ROOT))

def is_tr(k, v):
    return isinstance(v,str) and v.strip() and k in TEXT_LEAF_KEYS and not v.startswith(("http","#"))

def collect_refs(day):
    refs=[]
    def walk(o):
        if isinstance(o,dict):
            for k,v in list(o.items()):
                if k.endswith(("EN","En","ES","Es")): continue
                if isinstance(v,(dict,list)): walk(v)
                elif is_tr(k,v): refs.append({"c":o,"k":k,"t":v})
        elif isinstance(o,list):
            for v in o:
                if isinstance(v,(dict,list)): walk(v)
    walk(day); return refs

SYS = ("You are a professional travel-guide translator for a family road-trip app. "
    "Translate the given Italian strings into English (en) and European Spanish (es-ES). "
    "CRITICAL: Preserve EXACTLY any HTML tags (<a ...>, <em>, etc.), URLs, emoji, prices (\u20ac, numbers), "
    "measurements (km, h, \u00b0C), and proper nouns/place names. Do NOT translate place names, brand names, "
    "or local dish names that are proper nouns (keep them, translating only any Italian gloss). Keep tone and "
    "length. Return ONLY JSON with 'en' and 'es' objects mapping the SAME numeric keys you received.")

def schema_for(keys):
    props={k:{"type":"string"} for k in keys}
    inner={"type":"object","properties":props,"required":list(keys),"additionalProperties":False}
    return {"type":"object","properties":{"en":inner,"es":inner},"required":["en","es"],"additionalProperties":False}

def translate_day(idx, day):
    refs=collect_refs(day)
    strings={str(i):r["t"] for i,r in enumerate(refs)}
    if not strings: return idx, refs, {"en":{},"es":{}}
    keys=list(strings.keys())
    user=("Translate these Italian strings. Return 'en' and 'es', each mapping the SAME keys.\n"
          + json.dumps(strings, ensure_ascii=False))
    data=chat_json(SYS, user, schema_for(keys))
    return idx, refs, data

def main():
    days=load_days(); results={}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs={ex.submit(translate_day,i,d):i for i,d in enumerate(days)}
        for f in cf.as_completed(futs):
            idx,refs,data=f.result(); results[idx]=(refs,data)
            print(f"day {idx}: {len(refs)} strings {'OK' if data else 'FAILED'}", flush=True)
    fails=[]
    for idx,d in enumerate(days):
        refs,data=results[idx]
        if not data: fails.append(idx); continue
        en,es=data.get("en",{}),data.get("es",{})
        for i,r in enumerate(refs):
            k=str(i); c=r["c"]; key=r["k"]
            if k in en and (key+"EN") not in c and (key+"En") not in c: c[key+"EN"]=en[k]
            if k in es: c[key+"ES"]=es[k]
    out="/* Quo Vadis \u2014 Days Data v1.48 */\n/* Auto-generated \u2014 do not edit manually */\nvar DAYS_DATA = "+json.dumps(days,ensure_ascii=False,indent=2)+";\n"
    open(os.path.join(ROOT,"days-data.js"),"w").write(out)
    print("days-data.js rewritten. failed days:", fails)

if __name__=="__main__":
    main()
