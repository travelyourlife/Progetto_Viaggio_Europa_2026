#!/usr/bin/env python3
"""Verify candidate Wikipedia titles exist on it/en wikipedia before adding links."""
import json, urllib.request, urllib.parse, sys, time

# candidate label -> (it_title, en_title). Titles use Wikipedia article titles (with spaces or underscores).
CANDIDATES = {
    # ── Attività: nature / landmarks ──
    "Kjeragbolten": ("Kjerag", "Kjeragbolten"),
    "Kjerag": ("Kjerag", "Kjerag"),
    "Geirangerfjord": ("Geirangerfjord", "Geirangerfjord"),
    "Trollstigen": ("Trollstigen", "Trollstigen"),
    "Strada dell'Atlantico": ("Strada dell'Atlantico", "Atlantic Ocean Road"),
    "Lagos de Covadonga": ("Laghi di Covadonga", "Lakes of Covadonga"),
    "Naranjo de Bulnes": ("Naranjo de Bulnes", "Naranjo de Bulnes"),
    "Monte Igueldo": ("Monte Igueldo", "Monte Igueldo"),
    "Møns Klint": ("Møns Klint", "Møns Klint"),
    "Reinebringen": ("Reinebringen", "Reinebringen"),
    "Preikestolen": ("Preikestolen", "Preikestolen"),
    "Kvalvika": ("Lofoten", "Kvalvika"),
    "Fløyen": ("Fløyen", "Fløyen"),
    "Fjellheisen": ("Fjellheisen", "Fjellheisen"),
    "Henningsvær": ("Henningsvær", "Henningsvær"),
    "Hirtshals": ("Hirtshals", "Hirtshals"),
    "Getxo": ("Getxo", "Getxo"),
    "Allemannsretten": ("Allemannsretten", "Freedom to roam"),
    "Jokamiehenoikeus": ("Jokamiehenoikeus", "Freedom to roam"),
    "Ruta del Cares": ("Ruta del Cares", "Cares Trail"),
    "Romsdalseggen": ("Romsdalen", "Romsdalseggen"),
    "Tankavaara": ("Tankavaara", "Tankavaara"),
    # ── Cibo: national cuisines ──
    "Cucina austriaca": ("Cucina austriaca", "Austrian cuisine"),
    "Cucina ceca": ("Cucina ceca", "Czech cuisine"),
    "Cucina polacca": ("Cucina polacca", "Polish cuisine"),
    "Cucina lituana": ("Cucina lituana", "Lithuanian cuisine"),
    "Cucina lettone": ("Cucina lettone", "Latvian cuisine"),
    "Cucina estone": ("Cucina estone", "Estonian cuisine"),
    "Cucina finlandese": ("Cucina finlandese", "Finnish cuisine"),
    "Cucina norvegese": ("Cucina norvegese", "Norwegian cuisine"),
    "Cucina danese": ("Cucina danese", "Danish cuisine"),
    "Cucina tedesca": ("Cucina tedesca", "German cuisine"),
    "Cucina francese": ("Cucina francese", "French cuisine"),
    "Cucina spagnola": ("Cucina spagnola", "Spanish cuisine"),
    "Cucina ligure": ("Cucina ligure", "Ligurian cuisine"),
    # ── Curiosità / nature phenomena ──
    "Aurora boreale": ("Aurora polare", "Aurora"),
    "Sole di mezzanotte": ("Sole di mezzanotte", "Midnight sun"),
    "Sauna": ("Sauna", "Sauna"),
    "Fiordo": ("Fiordo", "Fjord"),
    "Renna": ("Rangifer tarandus", "Reindeer"),
    "Sami": ("Sami (popolo)", "Sámi people"),
}

def exists(lang, title):
    title_q = urllib.parse.quote(title.replace(' ', '_'))
    url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title_q}?redirect=true"
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent':'QuoVadisLinkCheck/1.0 (travel app link verification)'})
            with urllib.request.urlopen(req, timeout=20) as r:
                data = json.load(r)
                t = data.get('type','')
                if t == 'disambiguation':
                    return ('DISAMBIG', data.get('content_urls',{}).get('desktop',{}).get('page',''))
                return ('OK', data.get('content_urls',{}).get('desktop',{}).get('page',''))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(3 * (attempt+1))
                continue
            return (f'HTTP{e.code}', '')
        except Exception as e:
            time.sleep(2)
            continue
    return ('RETRY_FAIL', '')

results = {}
for label,(it,en) in CANDIDATES.items():
    its = exists('it', it)
    ens = exists('en', en)
    results[label] = {'it_title':it,'it':its,'en_title':en,'en':ens}
    print(f"{label:28s} | IT {its[0]:10s} {it[:30]:30s} | EN {ens[0]:10s} {en}")
    time.sleep(0.8)

open('wiki_verify_results.json','w').write(json.dumps(results, ensure_ascii=False, indent=2))
print("\nSaved wiki_verify_results.json")
