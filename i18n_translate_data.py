#!/usr/bin/env python3
"""v4.63 i18n: translate curiosita, poi, city-itineraries, data.js.
For each file we load its top-level array/object via node, walk objects, and for
each translatable base key ensure an EN sibling (if missing) and an ES sibling.
Field-level append. Preserves URLs, prices, coords, HTML, emoji.
"""
import json, os, subprocess, sys, argparse, concurrent.futures as cf
from i18n_common import chat_json

ROOT = "/home/ubuntu/quo-vadis"

# base keys that hold human text in these data files
TEXT_KEYS = {"text","desc","name","title","short","intro","tips","hours","price","note",
             "label","ore","tragitto","summary","schedule","location","address","notes",
             "city","country","subtitle","caption"}
# keys we must NOT treat as translatable proper-noun-only when they are place identifiers
SKIP_VALUES_PREFIX = ("http","#")

def load_json_via_node(varname, filename):
    js = f'const fs=require("fs");let src=fs.readFileSync("{filename}","utf8");eval(src);process.stdout.write(JSON.stringify({varname}));'
    return json.loads(subprocess.check_output(["node","-e",js], cwd=ROOT))

def dump_js(varname, data, header, filename):
    out = header + "var " + varname + " = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    open(os.path.join(ROOT, filename), "w").write(out)

def is_tr(k, v):
    if not isinstance(v,str) or not v.strip(): return False
    base = k
    if base not in TEXT_KEYS: return False
    if v.startswith(SKIP_VALUES_PREFIX): return False
    return True

def en_key(k):
    # figure out EN sibling name conventions already used
    return [k+"EN", k+"En"]
def es_key(k):
    return k+"ES"

def collect_refs(obj, en_suffixes=("EN","En")):
    """Collect refs needing ES always; needing EN if no EN sibling exists."""
    refs=[]
    def has_sibling(container, key, suffixes):
        return any((key+s) in container for s in suffixes)
    def walk(o):
        if isinstance(o,dict):
            for k,v in list(o.items()):
                if k.endswith(("EN","En","ES","Es")): continue
                if isinstance(v,(dict,list)): walk(v)
                elif is_tr(k,v):
                    need_en = not has_sibling(o,k,("EN","En"))
                    need_es = not has_sibling(o,k,("ES","Es"))
                    if need_en or need_es:
                        refs.append({"c":o,"k":k,"t":v,"en":need_en,"es":need_es})
        elif isinstance(o,list):
            for v in o:
                if isinstance(v,(dict,list)): walk(v)
    walk(obj); return refs

SYS = ("You are a professional travel-guide translator for a family road-trip app. "
    "Translate the given Italian strings into English (en) and European Spanish (es-ES). "
    "CRITICAL: Preserve EXACTLY any HTML tags, URLs, emoji, prices (\u20ac, numbers), measurements, and "
    "proper nouns/place names. Do NOT translate place names, brand names, or local dish names (keep them, "
    "translating only any Italian gloss). Keep tone and length. Return ONLY JSON with 'en' and 'es' objects "
    "mapping the SAME numeric keys you received.")

def schema_for(keys):
    props={k:{"type":"string"} for k in keys}
    inner={"type":"object","properties":props,"required":list(keys),"additionalProperties":False}
    return {"type":"object","properties":{"en":inner,"es":inner},"required":["en","es"],"additionalProperties":False}

def translate_chunk(chunk_id, refs):
    strings={str(i):r["t"] for i,r in enumerate(refs)}
    if not strings: return chunk_id, {"en":{},"es":{}}
    user=("Translate these Italian strings. Return 'en' and 'es', each mapping the SAME keys.\n"
          + json.dumps(strings, ensure_ascii=False))
    data=chat_json(SYS, user, schema_for(list(strings.keys())))
    return chunk_id, data

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--var", required=True)
    ap.add_argument("--file", required=True)
    ap.add_argument("--chunk", type=int, default=25)
    args=ap.parse_args()

    data=load_json_via_node(args.var, args.file)
    header_lines=[]
    with open(os.path.join(ROOT,args.file)) as fh:
        for line in fh:
            if line.lstrip().startswith("var "+args.var): break
            header_lines.append(line)
    header="".join(header_lines)

    refs=collect_refs(data)
    print(f"{args.file}: {len(refs)} refs to translate", flush=True)
    # chunk refs
    chunks=[refs[i:i+args.chunk] for i in range(0,len(refs),args.chunk)]
    results={}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs={ex.submit(translate_chunk,i,c):i for i,c in enumerate(chunks)}
        done=0
        for f in cf.as_completed(futs):
            cid,res=f.result(); results[cid]=res; done+=1
            print(f"  chunk {done}/{len(chunks)} {'OK' if res else 'FAILED'}", flush=True)

    fails=0
    for cid,chunk in enumerate(chunks):
        res=results.get(cid)
        if not res: fails+=len(chunk); continue
        en,es=res.get("en",{}),res.get("es",{})
        for i,r in enumerate(chunk):
            k=str(i); c=r["c"]; key=r["k"]
            if r["en"] and k in en and not any((key+s) in c for s in ("EN","En")):
                c[key+"EN"]=en[k]
            if r["es"] and k in es and not any((key+s) in c for s in ("ES","Es")):
                c[key+"ES"]=es[k]
    dump_js(args.var, data, header, args.file)
    print(f"{args.file} rewritten. failed refs: {fails}")

if __name__=="__main__":
    main()
