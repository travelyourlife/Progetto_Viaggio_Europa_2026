#!/usr/bin/env python3
"""v4.63 i18n PASS 2: fill ALL remaining translatable day text fields to EN+ES.
Only translates leaves whose EN/ES sibling is missing; preserves existing translations.
"""
import json, os, subprocess, concurrent.futures as cf
from i18n_common import chat_json

ROOT="/home/ubuntu/quo-vadis"
# Explicit allowlist of human-text keys to translate (everything else is left as-is)
TR_KEYS={"title","text","desc","name","notes","schedule","fuel","budget","location","address",
         "narrative","scooter","waterSports","fishing","tolls","beer","cond","daylight","dates",
         "duration","note","info","license","zone","city","linkLabel","price"}
# keys that must NEVER be translated even if strings
DENY={"id","date","country","region","type","icon","maps","url","link","flags","lat","lon",
      "phones","star","familyFriendly"}

def load_days():
    js='const fs=require("fs");let src=fs.readFileSync("days-data.js","utf8");eval(src);process.stdout.write(JSON.stringify(DAYS_DATA));'
    return json.loads(subprocess.check_output(["node","-e",js],cwd=ROOT))

def sib(base):
    cap=base[:1].upper()+base[1:]
    return base+"EN", base+"En", base+"ES", base+"Es"

def is_tr(k,v):
    if k in DENY: return False
    if k not in TR_KEYS: return False
    if not isinstance(v,str) or not v.strip(): return False
    if v.startswith(("http","#")): return False
    return True

def collect_refs(day):
    refs=[]
    def walk(o):
        if isinstance(o,dict):
            for k,v in list(o.items()):
                if k.endswith(("EN","En","ES","Es")): continue
                if isinstance(v,(dict,list)): walk(v)
                elif is_tr(k,v):
                    enk,enk2,esk,esk2=sib(k)
                    need_en=(enk not in o and enk2 not in o)
                    need_es=(esk not in o and esk2 not in o)
                    if need_en or need_es:
                        refs.append({"c":o,"k":k,"t":v,"need_en":need_en,"need_es":need_es})
        elif isinstance(o,list):
            for v in o:
                if isinstance(v,(dict,list)): walk(v)
    walk(day); return refs

SYS=("You are a professional travel-guide translator for a family road-trip app. "
    "Translate the given Italian strings into English (en) and European Spanish (es-ES). "
    "CRITICAL: Preserve EXACTLY any HTML tags (<a ...>, <strong>, <em>), URLs, emoji, prices (\u20ac, numbers), "
    "measurements (km, h, \u00b0C, L), and proper nouns/place/brand/dish names. Translate only the human-readable "
    "prose around them. Keep tone and length. Return ONLY JSON with 'en' and 'es' objects mapping the SAME numeric keys.")

def schema_for(keys):
    props={k:{"type":"string"} for k in keys}
    inner={"type":"object","properties":props,"required":list(keys),"additionalProperties":False}
    return {"type":"object","properties":{"en":inner,"es":inner},"required":["en","es"],"additionalProperties":False}

def translate_day(idx,day):
    refs=collect_refs(day)
    if not refs: return idx,refs,{"en":{},"es":{}}
    strings={str(i):r["t"] for i,r in enumerate(refs)}
    keys=list(strings.keys())
    user="Translate these Italian strings. Return 'en' and 'es', each mapping the SAME keys.\n"+json.dumps(strings,ensure_ascii=False)
    data=chat_json(SYS,user,schema_for(keys))
    return idx,refs,data

def main():
    days=load_days(); results={}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs={ex.submit(translate_day,i,d):i for i,d in enumerate(days)}
        done=0
        for f in cf.as_completed(futs):
            idx,refs,data=f.result(); results[idx]=(refs,data); done+=1
            print(f"day {idx}: {len(refs)} pending {'OK' if data else 'FAILED'} ({done}/{len(days)})",flush=True)
    fails=[]
    for idx,day in enumerate(days):
        refs,data=results[idx]
        if refs and not data: fails.append(idx); continue
        en,es=(data or {}).get("en",{}),(data or {}).get("es",{})
        for i,r in enumerate(refs):
            k=str(i); c=r["c"]; key=r["k"]
            if r["need_en"] and k in en: c[key+"EN"]=en[k]
            if r["need_es"] and k in es: c[key+"ES"]=es[k]
    out="/* Quo Vadis \u2014 Days Data v1.49 */\n/* Auto-generated \u2014 do not edit manually */\nvar DAYS_DATA = "+json.dumps(days,ensure_ascii=False,indent=2)+";\n"
    open(os.path.join(ROOT,"days-data.js"),"w").write(out)
    print("days-data.js rewritten. failed days:",fails)

if __name__=="__main__":
    main()
