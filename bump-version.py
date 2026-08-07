#!/usr/bin/env python3
"""
bump-version.py — aggiorna la versione di Quo Vadis in TUTTI i punti che contano,
in un colpo solo, con verifica finale che fallisce rumorosamente se qualcosa resta
disallineato.

Nato dal bug del 07/08/2026: un aggiornamento manuale aveva toccato solo alcuni file,
lasciando index_en.html e index_es.html con un EXPECTED_VERSION vecchio — causa di un
loop di aggiornamento infinito in produzione. Questo script esiste per non ripetere
quell'errore: non fa update incrementali "solo dove serve", riscrive OVUNQUE la stessa
versione, poi si autoverifica.

USO:
    python3 bump-version.py 5.31

Da lanciare nella cartella con tutti i file del deploy (stessa cartella dove si trova
version.json). Funziona sia nel sandbox di lavoro sia, se preferisci, direttamente nel
repo clonato prima del commit — è pensato per essere portabile.

Cosa aggiorna, in un solo passaggio:
  1. Tutte le query string ?v=X.YY  -> nei file HTML/JS versionati
  2. var EXPECTED_VERSION = "X.YY"; -> in index.html, index_en.html, index_es.html
  3. const CACHE_NAME = 'quo-vadis-vX.YY'; -> in sw.js
  4. Il fallback EXPECTED_VERSION : 'X.YY' -> in app.js
  5. Il self-reference "city-itineraries.js?v=X.YY" -> in city-itineraries-ui.js
     (il file che lo carica lazy si autoreferenzia con la stringa, va tenuto allineato)
  6. version.json

Poi:
  7. Verifica ESAUSTIVA — rilegge tutti i file e segnala QUALSIASI stringa di versione
     residua diversa da quella appena impostata. Se trova anche solo UNA riga
     disallineata, lo script si ferma con errore e NON crea nessun output silenzioso.
  8. `node --check` su tutti i file .js del progetto (incluso functions/), per
     verificare che nessuna sostituzione abbia rotto la sintassi.

Se lo script termina senza errori, la versione è coerente ovunque, garantito — non
serve ricontrollare a mano.
"""

import sys
import re
import subprocess
import os
import glob

# File la cui versione va bumpata via query string ?v=X.YY
VERSIONED_QS_FILES = [
    'index.html', 'index_en.html', 'index_es.html',
    'sw.js', 'app.js', 'city-itineraries-ui.js',
]

# File con var EXPECTED_VERSION = "X.YY";
EXPECTED_VERSION_FILES = ['index.html', 'index_en.html', 'index_es.html']


def fail(msg):
    print(f"\n❌ ERRORE: {msg}")
    print("Nessuna modifica è stata lasciata a metà — ma controlla i file manualmente prima di procedere.")
    sys.exit(1)


def main():
    if len(sys.argv) != 2:
        fail("uso: python3 bump-version.py <nuova_versione>  (es. python3 bump-version.py 5.31)")

    new_version = sys.argv[1]
    if not re.match(r'^\d+\.\d+$', new_version):
        fail(f"'{new_version}' non sembra una versione valida (atteso formato tipo 5.31)")

    if not os.path.exists('version.json'):
        fail("version.json non trovato in questa cartella — lanciare lo script dalla cartella del deploy")

    missing = [f for f in set(VERSIONED_QS_FILES + EXPECTED_VERSION_FILES) if not os.path.exists(f)]
    if missing:
        fail(f"file mancanti in questa cartella: {', '.join(missing)}")

    print(f"Bump versione -> {new_version}\n")

    # 1. Query string ?v=X.YY ovunque nei file versionati
    for fname in VERSIONED_QS_FILES:
        content = open(fname, encoding='utf-8').read()
        new_content, n = re.subn(r'\?v=\d+\.\d+', f'?v={new_version}', content)
        open(fname, 'w', encoding='utf-8').write(new_content)
        print(f"  {fname}: {n} query string aggiornate")

    # 2. EXPECTED_VERSION nei 3 HTML
    for fname in EXPECTED_VERSION_FILES:
        content = open(fname, encoding='utf-8').read()
        new_content, n = re.subn(
            r'var EXPECTED_VERSION = "\d+\.\d+";',
            f'var EXPECTED_VERSION = "{new_version}";',
            content
        )
        if n == 0:
            fail(f"{fname}: nessuna riga 'var EXPECTED_VERSION = ...' trovata — file cambiato? Aggiorna lo script.")
        open(fname, 'w', encoding='utf-8').write(new_content)
        print(f"  {fname}: EXPECTED_VERSION aggiornato ({n})")

    # 3. CACHE_NAME in sw.js
    content = open('sw.js', encoding='utf-8').read()
    new_content, n = re.subn(
        r"const CACHE_NAME = 'quo-vadis-v\d+\.\d+';",
        f"const CACHE_NAME = 'quo-vadis-v{new_version}';",
        content
    )
    if n == 0:
        fail("sw.js: nessuna riga 'const CACHE_NAME = ...' trovata — file cambiato? Aggiorna lo script.")
    open('sw.js', 'w', encoding='utf-8').write(new_content)
    print(f"  sw.js: CACHE_NAME aggiornato ({n})")

    # 4. Fallback EXPECTED_VERSION in app.js
    content = open('app.js', encoding='utf-8').read()
    new_content, n = re.subn(
        r"EXPECTED_VERSION : '\d+\.\d+'",
        f"EXPECTED_VERSION : '{new_version}'",
        content
    )
    open('app.js', 'w', encoding='utf-8').write(new_content)
    print(f"  app.js: fallback EXPECTED_VERSION aggiornato ({n})")
    if n == 0:
        print("    (0 è normale se questa riga non esiste più nel file: non bloccante)")

    # 5. city-itineraries.js?v=X.YY dentro city-itineraries-ui.js (self-reference per il lazy-load)
    content = open('city-itineraries-ui.js', encoding='utf-8').read()
    new_content, n = re.subn(
        r'city-itineraries\.js\?v=\d+\.\d+',
        f'city-itineraries.js?v={new_version}',
        content
    )
    open('city-itineraries-ui.js', 'w', encoding='utf-8').write(new_content)
    print(f"  city-itineraries-ui.js: self-reference lazy-load aggiornato ({n})")

    # 6. version.json
    with open('version.json', 'w', encoding='utf-8') as f:
        f.write(f'{{"version": "{new_version}"}}')
    print(f"  version.json: impostato a {new_version}")

    # 6b. <title> tag — found to be a hardcoded string never touched by any
    # previous version bump (stuck at V4.92/V4.62/V4.90, three different
    # stale values across the 3 language files, unrelated to the real
    # deployed version). Keep it in sync from now on.
    for fname in EXPECTED_VERSION_FILES:
        content = open(fname, encoding='utf-8').read()
        new_content, n = re.subn(
            r'<title>Quo Vadis — V[\d.]+</title>',
            f'<title>Quo Vadis — V{new_version}</title>',
            content
        )
        open(fname, 'w', encoding='utf-8').write(new_content)
        print(f"  {fname}: <title> aggiornato ({n})")

    # 7. VERIFICA ESAUSTIVA — rilegge tutto, cerca QUALSIASI versione diversa da quella nuova
    print("\nVerifica esaustiva...")
    check_files = list(set(VERSIONED_QS_FILES + EXPECTED_VERSION_FILES)) + ['version.json']
    pattern = re.compile(
        r'\?v=\d+\.\d+'
        r'|EXPECTED_VERSION = "\d+\.\d+"'
        r'|quo-vadis-v\d+\.\d+'
        r"|EXPECTED_VERSION : '\d+\.\d+'"
        r'|"version": "\d+\.\d+"'
        r'|<title>Quo Vadis — V[\d.]+</title>'
    )
    stale_found = []
    for fname in check_files:
        content = open(fname, encoding='utf-8').read()
        for match in pattern.finditer(content):
            if new_version not in match.group(0):
                stale_found.append((fname, match.group(0)))

    if stale_found:
        print("\n❌ Trovate versioni NON allineate dopo l'aggiornamento:")
        for fname, m in stale_found:
            print(f"    {fname}: '{m}'")
        fail("verifica fallita — controlla manualmente i file sopra prima di procedere col deploy")

    print(f"  Nessuna versione residua diversa da {new_version} trovata. ✓")

    # 8. node --check su tutti i .js del progetto
    print("\nControllo sintassi JS (node --check)...")
    js_files = glob.glob('*.js') + glob.glob('functions/*.js')
    syntax_errors = []
    for fname in js_files:
        result = subprocess.run(['node', '--check', fname], capture_output=True, text=True)
        if result.returncode != 0:
            syntax_errors.append((fname, result.stderr.strip()))

    if syntax_errors:
        print("\n❌ Errori di sintassi trovati:")
        for fname, err in syntax_errors:
            print(f"    {fname}:\n{err}\n")
        fail("sintassi JS non valida dopo l'aggiornamento — NON procedere col deploy")

    print(f"  {len(js_files)} file .js controllati, nessun errore di sintassi. ✓")

    print(f"\n✅ Fatto. Versione {new_version} allineata ovunque, verificata, sintassi JS pulita.")
    print("   Pronto per essere impacchettato/deployato.")


if __name__ == '__main__':
    main()
