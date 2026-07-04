#!/usr/bin/env python3
"""Verify alternative titles for entries missing on one language."""
import json, urllib.request, urllib.parse, time

ALTS = {
    # label: list of (lang, title) to try
    "Ruta del Cares (it)": [("it","Ruta del Cares"), ("it","Cares")],
    "Reinebringen (it)": [("it","Reine"), ("it","Lofoten")],
    "Lagos de Covadonga (it)": [("it","Laghi di Covadonga"), ("it","Covadonga")],
    "Sami (it)": [("it","Sami"), ("it","Lapponi"), ("it","Popolo sami")],
    "Tankavaara (it)": [("it","Tankavaara"), ("it","Sodankylä")],
    "Allemannsretten (it)": [("it","Diritto di accesso alla natura"), ("it","Libertà di campeggio")],
    "Fjellheisen (it)": [("it","Tromsø")],
    "Romsdalseggen (en)": [("en","Romsdalseggen"), ("en","Åndalsnes")],
    "Romsdalseggen (it)": [("it","Åndalsnes"), ("it","Romsdal")],
    "Kvalvika (en)": [("en","Kvalvika Beach"), ("en","Lofoten")],
}

def exists(lang, title):
    title_q = urllib.parse.quote(title.replace(' ', '_'))
    url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title_q}?redirect=true"
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent':'QuoVadisLinkCheck/1.0'})
            with urllib.request.urlopen(req, timeout=20) as r:
                data = json.load(r)
                return (data.get('type','standard'), data.get('content_urls',{}).get('desktop',{}).get('page',''))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(3*(attempt+1)); continue
            return (f'HTTP{e.code}','')
        except Exception:
            time.sleep(2); continue
    return ('RETRY_FAIL','')

for label, tries in ALTS.items():
    print(f"\n## {label}")
    for lang,title in tries:
        st,url = exists(lang,title)
        print(f"   {lang} {st:13s} {title:35s} {url}")
        time.sleep(0.8)
