# EN Posizione Alignment Plan

## Current EN structure (lines 7980-8132):
After garmin-card (line 7980), EN has:
1. `<hr>` (line 7982)
2. Stops details (7984-8006) ✅ matches IT
3. `<hr>` (8008)
4. Overnight Parking details (8010-8015) ✅ matches IT
5. `<hr>` (8017)
6. Daily Summary details (8019-8024) ✅ matches IT
7. `<hr>` (8026)
8. **OLD ADMIN PANEL** (8028-8127) ❌ REMOVE THIS
9. Close divs (8128-8132)

## Current IT structure (lines 8500-8989):
After garmin-card (line 8500), IT has:
1. Meteo Storico details (8502-8939) ← ADD THIS (translated)
2. `<hr>` (8941)
3. Stops details (8943-8965) ✅ already in EN
4. `<hr>` (8967)
5. Overnight Parking details (8969-8974) ✅ already in EN
6. `<hr>` (8976)
7. Daily Summary details (8978-8983) ✅ already in EN
8. Comment "Pannello Admin rimosso" (8985)
9. Close divs (8987-8989)

## Action:
1. Insert translated Meteo Storico between garmin-card and first `<hr>` in EN
2. Remove the entire admin panel block (lines 8026-8128 in EN)
3. Add comment "Admin panel removed from Posizione — now in Admin tab"
