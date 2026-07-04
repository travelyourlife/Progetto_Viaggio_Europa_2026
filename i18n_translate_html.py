#!/usr/bin/env python3
"""v4.63: build ES HTML from EN HTML by translating visible text nodes + key attributes.
Preserves scripts, styles, tags, attributes, placeholders. European Spanish (es-ES).
Usage: python3 i18n_translate_html.py <src_en.html> <dst_es.html>
"""
import sys, json, re, concurrent.futures as cf
from bs4 import BeautifulSoup, NavigableString, Comment
from i18n_common import chat_json

SKIP_PARENTS = {"script", "style", "noscript"}
# translatable attributes on elements
ATTRS = ["placeholder", "title", "aria-label", "alt", "value", "content"]
ATTR_TAGS_VALUE = {"input", "button", "option"}  # only translate value on these

def is_meaningful(s):
    t = s.strip()
    if not t: return False
    # skip pure numbers/symbols/emoji-only/urls/code-ish
    if re.fullmatch(r"[\W\d_]+", t): return False
    if t.startswith(("http://", "https://", "#", "{{", "var ", "function")): return False
    if re.fullmatch(r"[A-Za-z0-9_\-]+", t) and " " not in t and len(t) <= 3: return False
    # must contain at least one letter
    if not re.search(r"[A-Za-zÀ-ÿ]", t): return False
    return True

SYS = ("You translate UI text of a family road-trip PWA from English into European Spanish (es-ES). "
    "Return natural, concise Spanish suitable for buttons, labels, menus and short prose. "
    "CRITICAL: preserve EXACTLY any leading/trailing whitespace, emoji, HTML entities, numbers, prices (€), "
    "measurements, placeholders like {{x}} or %s, and proper nouns/place/brand names. Do not add or remove "
    "punctuation beyond what a correct translation needs. Return ONLY JSON mapping the SAME numeric keys to translations.")

def schema_for(keys):
    props = {k: {"type": "string"} for k in keys}
    return {"type": "object", "properties": props, "required": list(keys), "additionalProperties": False}

def translate_batch(items):
    # items: list of (id, text)
    strings = {str(i): t for i, t in items}
    keys = list(strings.keys())
    user = "Translate these EN UI strings to es-ES. Return JSON with the SAME keys.\n" + json.dumps(strings, ensure_ascii=False)
    data = chat_json(SYS, user, schema_for(keys))
    return data or {}

def main():
    src, dst = sys.argv[1], sys.argv[2]
    html = open(src, encoding="utf-8").read()
    soup = BeautifulSoup(html, "html.parser")

    # collect translatable text nodes
    nodes = []  # (node, kind, attr)
    for el in soup.find_all(string=True):
        if isinstance(el, Comment):
            continue
        parent = el.parent.name if el.parent else ""
        if parent in SKIP_PARENTS:
            continue
        if is_meaningful(str(el)):
            nodes.append(("text", el, None))

    for el in soup.find_all(True):
        for a in ATTRS:
            if a == "value" and el.name not in ATTR_TAGS_VALUE:
                continue
            if a == "content" and el.name == "meta":
                # only translate description-like meta
                nm = (el.get("name") or el.get("property") or "").lower()
                if nm not in ("description", "og:description", "og:title", "apple-mobile-web-app-title"):
                    continue
            if el.has_attr(a):
                v = el.get(a)
                if isinstance(v, str) and is_meaningful(v):
                    nodes.append(("attr", el, a))

    # build unique string list preserving stripped/original mapping
    originals = []
    for kind, el, attr in nodes:
        raw = str(el) if kind == "text" else el.get(attr)
        originals.append(raw)

    # translate unique stripped texts
    uniq = {}
    for raw in originals:
        s = raw.strip()
        if s and s not in uniq:
            uniq[s] = None
    uniq_list = list(uniq.keys())
    print(f"{src}: {len(nodes)} nodes, {len(uniq_list)} unique strings")

    BATCH = 40
    batches = [uniq_list[i:i+BATCH] for i in range(0, len(uniq_list), BATCH)]
    def do(bi):
        items = [(uniq_list.index(t) if False else idx, t) for idx, t in enumerate(batches[bi])]
        # use local indices then remap
        local = [(i, t) for i, t in enumerate(batches[bi])]
        res = translate_batch(local)
        out = {}
        for i, t in local:
            tr = res.get(str(i))
            if tr:
                out[t] = tr
        return out

    trans = {}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs = {ex.submit(do, bi): bi for bi in range(len(batches))}
        done = 0
        for f in cf.as_completed(futs):
            trans.update(f.result()); done += 1
            print(f"  batch {done}/{len(batches)}", flush=True)

    # apply, preserving surrounding whitespace of text nodes
    miss = 0
    for kind, el, attr in nodes:
        raw = str(el) if kind == "text" else el.get(attr)
        s = raw.strip()
        tr = trans.get(s)
        if not tr:
            miss += 1
            continue
        # preserve leading/trailing whitespace
        lead = raw[:len(raw)-len(raw.lstrip())]
        trail = raw[len(raw.rstrip()):]
        newval = lead + tr + trail
        if kind == "text":
            el.replace_with(NavigableString(newval))
        else:
            el[attr] = newval
    print(f"applied. missing translations: {miss}")

    out_html = str(soup)
    open(dst, "w", encoding="utf-8").write(out_html)
    print(f"wrote {dst}")

if __name__ == "__main__":
    main()
