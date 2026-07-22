# v4.88 Fix Notes — from 3 audit reports

## Action Items (7 total)

### 1. Midnight Sun labels (days-data.js) — 4 strings
- g13 (7 lug, Rovaniemi 66.5°N): "22h+ di luce" → "24h (sole di mezzanotte)" + EN/ES
- g21 (15 lug, Svolvær 68.2°N): "22h+ di luce" → "24h (sole di mezzanotte)" + EN/ES
- g22 (16 lug, Henningsvær 68.1°N): "22h+ di luce" → "24h (sole di mezzanotte)" + EN/ES
- g23 (17 lug, Lofoten spiagge 68.1°N): "22h di luce" → "24h (sole di mezzanotte)" + EN/ES

### 2. Finland nature: "31 specie di alberi" → "circa 30 specie"
- File: finland-nature-it.html line 6
- Also check EN/ES versions

### 3. Finland nature: Scarpetta di Venere "fino a 10 cm" → "6-8 cm"
- File: finland-nature-it.html line 88
- Also check EN/ES versions

### 4. Poland nature: Bison ">2.000 individui... >800 a Białowieża" → "~3.000 in Polonia / ~1.200 a Białowieża"
- File: poland-nature-it.html line 232
- Also check EN/ES versions

### 5. Spain nature: Orso cantabrico "~350 individui" → "~400"
- File: spain-nature-it.html line 146
- Also check EN/ES versions

### 6. Norway nature: Alci "circa 100.000" → "120.000-150.000"
- File: norway-nature-it.html line 63
- Also check EN/ES versions

### 7. hs-countries (Home): align with stat-countries logic
- hs-countries (app.js ~line 9304): counts only check-ins
- stat-countries (app.js lines 4120-4131): merges check-in + countriesVisited (GPS)
- Fix: copy the merge logic from stat-countries to hs-countries
