#!/usr/bin/env python3
"""
bump_version.py — Quo Vadis
Unica fonte di verità per la versione: version.json
Aggiorna automaticamente sw.js, index.html / index_en.html e offline.html

Uso:
  python3 bump_version.py          # mostra versione attuale
  python3 bump_version.py 2.69     # aggiorna tutto a 2.69
"""

import sys, json, re
from pathlib import Path

ROOT = Path(__file__).parent

def read_version():
    with open(ROOT / 'version.json') as f:
        return json.load(f)['version']

def write_version(new_ver):
    old_ver = read_version()
    if old_ver == new_ver:
        print(f"⚠️  Versione già a {new_ver} — nessuna modifica")
        return

    # version.json
    with open(ROOT / 'version.json', 'w') as f:
        json.dump({"version": new_ver}, f)
    print(f"✅ version.json: {old_ver} → {new_ver}")

    # sw.js — CACHE_NAME
    _replace_in_file(
        ROOT / 'sw.js',
        f"'quo-vadis-v{old_ver}'",
        f"'quo-vadis-v{new_ver}'"
    )

    # index.html e index_en.html — EXPECTED_VERSION
    for fname in ['index.html', 'index_en.html']:
        _replace_in_file(
            ROOT / fname,
            f"EXPECTED_VERSION = '{old_ver}'",
            f"EXPECTED_VERSION = '{new_ver}'"
        )

    # offline.html — badge versione (qualsiasi vNN, non solo quella precedente)
    _replace_regex_in_file(
        ROOT / 'offline.html',
        r'Quo Vadis v\d+\.\d+',
        f'Quo Vadis v{new_ver}'
    )

    print(f"\n✅ Versione aggiornata a {new_ver} in tutti i file.")
    print("   Prossimo passo: python3 controlla.py")

def _replace_regex_in_file(path, pattern, new):
    if not path.exists():
        print(f"  ⚠️  File non trovato: {path.name}")
        return
    content = path.read_text()
    new_content, n = re.subn(pattern, new, content)
    if n == 0:
        print(f"  ⚠️  pattern '{pattern}' non trovato in {path.name}")
        return
    path.write_text(new_content)
    print(f"✅ {path.name}: aggiornato ({n} occorrenza/e)")

def _replace_in_file(path, old, new):
    if not path.exists():
        print(f"  ⚠️  File non trovato: {path.name}")
        return
    content = path.read_text()
    if old not in content:
        print(f"  ⚠️  '{old}' non trovato in {path.name}")
        return
    path.write_text(content.replace(old, new))
    print(f"✅ {path.name}: aggiornato")

if __name__ == '__main__':
    if len(sys.argv) == 1:
        print(f"Versione attuale: {read_version()}")
        print("Uso: python3 bump_version.py <nuova_versione>")
    else:
        new_ver = sys.argv[1].strip()
        if not re.match(r'^\d+\.\d+$', new_ver):
            print(f"❌ Formato versione non valido: {new_ver} (atteso: X.YY)")
            sys.exit(1)
        write_version(new_ver)
