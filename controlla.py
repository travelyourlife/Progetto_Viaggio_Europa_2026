#!/usr/bin/env python3
"""
controlla.py — Quo Vadis
Validazione pre-rilascio. Lancia prima di ogni deploy.
Se trova errori, stampa tutto e esce con codice 1 (blocca il deploy in uno script).

Uso:
  python3 controlla.py
"""

import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).parent
errors = []
warnings = []

def err(msg): errors.append(f"  ❌ {msg}")
def warn(msg): warnings.append(f"  ⚠️  {msg}")
def ok(msg): print(f"  ✅ {msg}")

print("=" * 60)
print("Quo Vadis — Controllo pre-rilascio")
print("=" * 60)

# ─── 1. Versione coerente ────────────────────────────────────
print("\n[1] Versione")
ver = json.loads((ROOT / 'version.json').read_text())['version']
sw  = (ROOT / 'sw.js').read_text()
idx = (ROOT / 'index.html').read_text()
idx_en = (ROOT / 'index_en.html').read_text()

if f"quo-vadis-v{ver}" in sw:
    ok(f"sw.js CACHE_NAME = {ver}")
else:
    err(f"sw.js non aggiornato: versione attesa {ver}")

for fname, content in [('index.html', idx), ('index_en.html', idx_en)]:
    if f"EXPECTED_VERSION = '{ver}'" in content:
        ok(f"{fname} EXPECTED_VERSION = {ver}")
    else:
        err(f"{fname} EXPECTED_VERSION non aggiornato")

# ─── 2. Numero giorni coerente ───────────────────────────────
print("\n[2] Numero giorni (55)")
data_js = (ROOT / 'data.js').read_text()
days_data = (ROOT / 'days-data.js').read_text()
weather  = (ROOT / 'weather-coords.js').read_text()
app_js   = (ROOT / 'app.js').read_text()

trip_days_match = re.search(r'var TRIP_DAYS\s*=\s*(\d+)', data_js)
trip_days = int(trip_days_match.group(1)) if trip_days_match else 0
ok(f"data.js TRIP_DAYS = {trip_days}") if trip_days == 55 else err(f"data.js TRIP_DAYS = {trip_days} (atteso 55)")

itinerario_count = len(re.findall(r'"id":\s*"g\d+"', data_js[:data_js.find('var regioni')]))
ok(f"data.js itinerario = {itinerario_count} entry") if itinerario_count == 55 else err(f"data.js itinerario = {itinerario_count} entry (atteso 55)")

try:
    m = re.search(r'var DAYS_DATA\s*=\s*(\[.*?\]);', days_data, re.DOTALL)
    days_count = len(json.loads(m.group(1)))
    ok(f"days-data.js = {days_count} giorni") if days_count == 55 else err(f"days-data.js = {days_count} giorni (atteso 55)")
except Exception as e:
    err(f"days-data.js non parsabile: {e}")

coords_count = len(re.findall(r'\{[^}]+lat:[^}]+\}', weather))
ok(f"weather-coords.js = {coords_count} entry") if coords_count == 55 else err(f"weather-coords.js = {coords_count} entry (atteso 55)")

# ─── 3. Testi stantii ────────────────────────────────────────
print("\n[3] Testi hardcoded obsoleti")
stale_files = {
    'data.js': data_js,
    'days-data.js': days_data,
    'app.js': app_js,
    'home-variants.js': (ROOT / 'home-variants.js').read_text(),
    'curiosita-data.js': (ROOT / 'curiosita-data.js').read_text(),
    'index.html': idx,
    'index_en.html': idx_en,
}
stale_patterns = [
    (r'\b54 (giorni|days|Giorni|Days)\b', "54 giorni/days"),
    (r'June 26|26 giugno 2026|26/06/2026', "data partenza sbagliata (26 giugno)"),
    (r'new Date\(2026, 5, 26\)', "fallback data sbagliato (26 giugno)"),
]
found_stale = False
for fname, content in stale_files.items():
    for pat, label in stale_patterns:
        matches = re.findall(pat, content, re.IGNORECASE)
        if matches:
            # Ignora occorrenze in commenti
            real = [m for line in content.split('\n')
                    for m in re.findall(pat, line, re.IGNORECASE)
                    if not line.strip().startswith('//') and 'Leoben' not in line and 'Vienna' not in line]
            if real:
                err(f"{fname}: testo obsoleto '{label}' ({len(real)} occorrenze)")
                found_stale = True
if not found_stale:
    ok("Nessun testo hardcoded obsoleto trovato")

# ─── 4. Sintassi JS ──────────────────────────────────────────
print("\n[4] Sintassi JavaScript")
js_files = ['app.js', 'data.js', 'days-data.js', 'home-variants.js',
            'curiosita-data.js', 'curiosita-scheduler.js', 'quiz-fun.js',
            'unified-map.js', 'sw.js', 'functions/index.js']
for fname in js_files:
    fpath = ROOT / fname
    if not fpath.exists():
        warn(f"{fname} non trovato")
        continue
    result = subprocess.run(['node', '--check', str(fpath)], capture_output=True, text=True)
    if result.returncode == 0:
        ok(f"{fname} — sintassi OK")
    else:
        err(f"{fname} — ERRORE SINTASSI: {result.stderr.strip()[:100]}")

# ─── 5. Link interni ────────────────────────────────────────
print("\n[5] Anchor href interni in index.html")
internal_hrefs = re.findall(r'href="#([^"]+)"', idx)
all_ids = set(re.findall(r'\bid="([^"]+)"', idx))
# Ignora: ID generati dinamicamente dal renderer e anchor noti
DYNAMIC_ID_PREFIXES = ('g', 'tab-', 'a', 'b', 'analytics')
broken = [h for h in internal_hrefs if h not in all_ids and not any(h.startswith(p) for p in DYNAMIC_ID_PREFIXES)]
if broken:
    unique_broken = list(set(broken))[:5]
    warn(f"Anchor href senza target: {unique_broken}")
else:
    ok("Tutti gli anchor href interni hanno un target")

# ─── 6. Firebase rules validazione ──────────────────────────
print("\n[6] database.rules.json")
try:
    rules = json.loads((ROOT / 'database.rules.json').read_text())
    ok("database.rules.json è JSON valido")
    # Verifica che notifications/queue non sia aperta a tutti
    queue_write = rules['rules']['trips']['$familyId']['notifications']['queue'].get('.write','')
    if 'auth != null' == queue_write.strip():
        err("notifications/queue .write è aperta a tutti gli autenticati")
    else:
        ok("notifications/queue .write è ristretta correttamente")
    # v2.99: verifica regole diary reactions/comments
    diary_rules = rules['rules']['trips']['$familyId'].get('diary', {})
    entry_rules = diary_rules.get('$entryKey', {})
    if 'reactions' in entry_rules and 'comments' in entry_rules:
        react_w = entry_rules['reactions'].get('$uid', {}).get('.write', '')
        com_w = entry_rules['comments'].get('$commentId', {}).get('.write', '')
        if 'approvedUsers' in react_w and 'bannedUsers' in react_w:
            ok("diary/reactions .write ristretta a utenti approvati")
        else:
            err("diary/reactions .write non ristretta correttamente")
        if 'approvedUsers' in com_w and 'bannedUsers' in com_w and 'uid' in com_w:
            ok("diary/comments .write ristretta a utenti approvati")
        else:
            err("diary/comments .write non ristretta correttamente")
    else:
        err("regole diary reactions/comments mancanti (v2.99)")
except Exception as e:
    err(f"database.rules.json: {e}")

# ─── 7. Cloud Function contratti ────────────────────────────
print("\n[7] Cloud Function — contratti client/server")
cf = (ROOT / 'functions/index.js').read_text()
# Verifica che translatePost nel client mandi key e familyId
translate_client = re.search(r'translateFn\(\{[^}]+\}\)', app_js)
if translate_client:
    call = translate_client.group(0)
    if 'key' in call and 'familyId' in call:
        ok("translatePost client manda key e familyId")
    else:
        err(f"translatePost client non manda key/familyId: {call[:80]}")
else:
    warn("translatePost client call non trovata")

# Verifica limite testo in CF
if 'text.length > 5000' in cf:
    ok("translatePost CF ha limite lunghezza testo")
else:
    err("translatePost CF manca limite lunghezza testo")

# ─── Riepilogo ───────────────────────────────────────────────
print("\n" + "=" * 60)
print("RIEPILOGO")
print("=" * 60)

if warnings:
    print("\nAvvisi (non bloccanti):")
    for w in warnings:
        print(w)

if errors:
    print(f"\nErrori ({len(errors)}) — RILASCIO BLOCCATO:")
    for e in errors:
        print(e)
    print("\n❌ Correggi gli errori prima di deployare.")
    sys.exit(1)
else:
    print(f"\n✅ Tutti i controlli superati. Pronto per il deploy.")
    print(f"   Versione: {ver}")
