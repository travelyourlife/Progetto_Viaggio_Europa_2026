#!/usr/bin/env python3
"""v4.63 i18n: add ES siblings to data.js content arrays (itinerario, regioni, POI_ATTIVITA).
Robust approach:
 1. Load arrays via node.
 2. Collect (enk, en_value) for every field that has IT+EN but no ES. Also collect its IT value.
 3. Translate the UNIQUE set of IT strings to ES once.
 4. For every EN key/value token `enk: "ENVAL"` in the file, insert `, eskES: "ESVAL"` after it —
    handling ALL occurrences (not just the first) by scanning with a moving cursor.
"""
import json, os, subprocess, concurrent.futures as cf
from i18n_common import chat_json

ROOT="/home/ubuntu/quo-vadis"
FILE="data.js"
PAIRS=[("label","labelEn"),("tragitto","tragittoEn"),("ore","oreEn"),("note","noteEn"),
       ("desc","descEn"),("name","nameEn"),("price","priceEn")]

def load_arrays():
    node_src=('global.window={};var fs=require("fs");var src=fs.readFileSync("%s","utf8");'%FILE)
    node_src+='var out=new Function("window",src+";return {it:itinerario,reg:regioni,poi:POI_ATTIVITA};")(global.window);'
    node_src+='process.stdout.write(JSON.stringify(out));'
    return json.loads(subprocess.check_output(["node","-e",node_src],cwd=ROOT))

def esk_name(enk):
    assert enk.endswith("En")
    return enk[:-2]+"ES"

def esc(s):
    return s.replace("\\","\\\\").replace('"','\\"')

SYS=("You are a professional travel-guide translator. Translate the given Italian strings into European "
    "Spanish (es-ES). Preserve EXACTLY emoji, HTML, URLs, prices (\u20ac, numbers), measurements (km, h, min), and "
    "proper nouns/place names. If a string is a proper noun or identical in Spanish, return it unchanged. "
    "Keep tone and length. Return ONLY JSON: an 'es' object mapping the SAME numeric keys.")

def schema_for(keys):
    props={k:{"type":"string"} for k in keys}
    inner={"type":"object","properties":props,"required":list(keys),"additionalProperties":False}
    return {"type":"object","properties":{"es":inner},"required":["es"],"additionalProperties":False}

def tr_chunk(cid,keys,texts):
    strings={keys[i]:texts[i] for i in range(len(keys))}
    user="Translate to European Spanish. Return 'es' mapping SAME keys.\n"+json.dumps(strings,ensure_ascii=False)
    return cid,chat_json(SYS,user,schema_for(list(strings.keys())))

def main():
    arrays=load_arrays()
    # collect fields needing ES; keep list of (enk, en_value, it_value)
    fields=[]
    unique_it={}
    for arr in [arrays["it"],arrays["reg"],arrays["poi"]]:
        for obj in arr:
            for itk,enk in PAIRS:
                if itk in obj and enk in obj and esk_name(enk) not in obj:
                    itv=obj[itk]; env=obj[enk]
                    if not isinstance(itv,str) or not itv.strip(): continue
                    fields.append((enk,env,itv))
                    unique_it.setdefault(itv,None)
    uniq=list(unique_it.keys())
    print(f"data.js: {len(fields)} field-occurrences, {len(uniq)} unique IT strings", flush=True)
    # translate unique strings in chunks
    CH=20
    idx_keys=[str(i) for i in range(len(uniq))]
    chunks=[]
    for i in range(0,len(uniq),CH):
        ks=idx_keys[i:i+CH]; ts=uniq[i:i+CH]
        chunks.append((ks,ts))
    results={}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs={ex.submit(tr_chunk,i,c[0],c[1]):i for i,c in enumerate(chunks)}
        done=0
        for f in cf.as_completed(futs):
            cid,res=f.result(); results[cid]=res; done+=1
            print(f"  chunk {done}/{len(chunks)} {'OK' if res else 'FAILED'}",flush=True)
    it2es={}
    for cid,(ks,ts) in enumerate(chunks):
        res=results.get(cid)
        if not res: continue
        es=res.get("es",{})
        for j,k in enumerate(ks):
            if k in es: it2es[ts[j]]=es[k]
    # Insert ES after every EN token occurrence
    src=open(os.path.join(ROOT,FILE)).read()
    inserted=0; skipped=0
    # process occurrences: iterate fields, but insert per exact (enk,env) token; scan all occurrences
    # We must avoid re-inserting after an already-inserted ES. Since ES key differs, and we look for
    # the EN token which does not include ES, duplicate scanning is safe if we track consumed positions.
    from collections import defaultdict
    # Build mapping token -> list of ESVAL for each occurrence (in file order they should match array order)
    # token can be quoted-key ("labelEn": "..") or bare-key (labelEn: "..").
    token_es=defaultdict(list)
    for enk,env,itv in fields:
        esv=it2es.get(itv)
        if esv is None: skipped+=1; continue
        token_es[(enk,env)].append(esv)
    for (enk,env), esvals in token_es.items():
        esk=esk_name(enk)
        ev=esc(env)
        variants=[
            (f'"{enk}": "{ev}"', f', "{esk}": "{esc("__ES__")}"'),  # quoted key
            (f'{enk}: "{ev}"',   f', {esk}: "{esc("__ES__")}"'),      # bare key
        ]
        used=0
        # try each occurrence; prefer whichever variant matches next in the file
        cursor=0
        while used < len(esvals):
            # find earliest matching variant at/after cursor
            best_pos=-1; best_var=None
            for tok,instmpl in variants:
                p=src.find(tok, cursor)
                if p>=0 and (best_pos<0 or p<best_pos):
                    best_pos=p; best_var=(tok,instmpl)
            if best_pos<0: break
            tok,instmpl=best_var
            end=best_pos+len(tok)
            ins=instmpl.replace('__ES__', esvals[used]) if '__ES__' in instmpl else instmpl
            # build proper insertion preserving key style
            if tok.startswith('"'):
                ins=f', "{esk}": "{esc(esvals[used])}"'
            else:
                ins=f', {esk}: "{esc(esvals[used])}"'
            src=src[:end]+ins+src[end:]
            cursor=end+len(ins)
            used+=1; inserted+=1
    open(os.path.join(ROOT,FILE),"w").write(src)
    print(f"data.js rewritten. ES inserted: {inserted}, skipped(no translation): {skipped}")

if __name__=="__main__":
    main()
