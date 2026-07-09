#!/usr/bin/env python3
"""v4.63 i18n: translate city-itineraries.js. It is an IIFE exposing
window.CITY_ITINERARIES (an object of cities -> {stops:[...]}). We load it via
node (window shim), add ES siblings (EN already present), and rebuild the file by
replacing the object literal between 'var CITY_ITINERARIES = ' and the line
'window.CITY_ITINERARIES = CITY_ITINERARIES;'.
"""
import json, os, subprocess, sys, concurrent.futures as cf
from i18n_common import chat_json

ROOT="/home/ubuntu/quo-vadis"
FILE="city-itineraries.js"
TEXT_KEYS={"city","country","intro","desc","name","short","tips","title","note","hours","price","subtitle","caption"}

def load():
    js=('global.window=global;const fs=require("fs");let src=fs.readFileSync("%s","utf8");'
        'eval(src);process.stdout.write(JSON.stringify(window.CITY_ITINERARIES));'%FILE)
    return json.loads(subprocess.check_output(["node","-e",js],cwd=ROOT))

def is_tr(k,v):
    return isinstance(v,str) and v.strip() and k in TEXT_KEYS and not v.startswith(("http","#"))

def collect_refs(obj):
    refs=[]
    def walk(o):
        if isinstance(o,dict):
            for k,v in list(o.items()):
                if k.endswith(("EN","En","ES","Es")): continue
                if isinstance(v,(dict,list)): walk(v)
                elif is_tr(k,v):
                    if not any((k+s) in o for s in ("ES","Es")):
                        refs.append({"c":o,"k":k,"t":v})
        elif isinstance(o,list):
            for v in o:
                if isinstance(v,(dict,list)): walk(v)
    walk(obj); return refs

SYS=("You are a professional travel-guide translator. Translate Italian strings into European "
    "Spanish (es-ES) only. Preserve EXACTLY HTML tags, URLs, emoji, prices, measurements, and proper "
    "nouns/place names (do not translate place/brand names; translate only any Italian gloss). Keep tone "
    "and length. Return ONLY JSON: an 'es' object mapping the SAME numeric keys to translations.")

def schema_for(keys):
    props={k:{"type":"string"} for k in keys}
    inner={"type":"object","properties":props,"required":list(keys),"additionalProperties":False}
    return {"type":"object","properties":{"es":inner},"required":["es"],"additionalProperties":False}

def translate_chunk(cid,chunk):
    strings={str(i):r["t"] for i,r in enumerate(chunk)}
    user="Translate to European Spanish. Return 'es' mapping SAME keys.\n"+json.dumps(strings,ensure_ascii=False)
    data=chat_json(SYS,user,schema_for(list(strings.keys())))
    return cid,data

def main():
    data=load()
    refs=collect_refs(data)
    print(f"{FILE}: {len(refs)} ES refs", flush=True)
    CH=15
    chunks=[refs[i:i+CH] for i in range(0,len(refs),CH)]
    results={}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs={ex.submit(translate_chunk,i,c):i for i,c in enumerate(chunks)}
        done=0
        for f in cf.as_completed(futs):
            cid,res=f.result(); results[cid]=res; done+=1
            print(f"  chunk {done}/{len(chunks)} {'OK' if res else 'FAILED'}",flush=True)
    fails=0
    for cid,chunk in enumerate(chunks):
        res=results.get(cid)
        if not res: fails+=len(chunk); continue
        es=res.get("es",{})
        for i,r in enumerate(chunk):
            k=str(i); c=r["c"]; key=r["k"]
            if k in es and not any((key+s) in c for s in ("ES","Es")):
                c[key+"ES"]=es[k]
    # Rebuild file
    src=open(os.path.join(ROOT,FILE)).read()
    start_marker="var CITY_ITINERARIES = "
    end_marker="  // Expose globally (read by city-itineraries-ui.js)"
    si=src.index(start_marker)
    ei=src.index(end_marker)
    head=src[:si+len(start_marker)]
    tail=src[ei:]
    new_obj=json.dumps(data,ensure_ascii=False,indent=2)
    new_src=head+new_obj+";\n"+tail
    open(os.path.join(ROOT,FILE),"w").write(new_src)
    print(f"{FILE} rewritten. failed refs: {fails}")

if __name__=="__main__":
    main()
