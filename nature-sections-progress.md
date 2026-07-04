# Nature Sections Progress

## COMPLETED:
- Finland (v4.65) - encyclopedic, integrated, images clean
- Norway (this session) - encyclopedic, integrated in all 3 HTML files, images clean

## REMAINING COUNTRIES (in order as they appear in index.html):
1. Austria (id: natura-fauna-austria) → next: musica-arte-austria
2. Czech Republic (id: natura-fauna-ceca) → next: musica-arte-ceca
3. Poland (id: natura-fauna-polonia) → next: musica-arte-polonia
4. Lithuania (id: natura-fauna-lituania) → next: musica-arte-lituania
5. Latvia (id: natura-fauna-lettonia) → next: musica-arte-lettonia
6. Estonia (id: natura-fauna-estonia) → next: musica-arte-estonia
7. Denmark (id: natura-fauna-danimarca) → next: musica-arte-danimarca
8. Germany (id: natura-fauna-germania) → next: musica-arte-germania
9. France (id: natura-fauna-francia) → next: musica-arte-francia
10. Spain (id: natura-fauna-spagna) → next: musica-arte-spagna
11. Italy (id: natura-fauna-italia) → next: musica-arte-italia

## HTML SECTION MARKERS (for replacement):
- IT: <h3 id="natura-fauna-{country}">🌿 Natura e fauna</h3> ... <h3 id="musica-arte-{country}">
- EN: <h3 id="natura-fauna-{country}">🌿 Nature & Wildlife</h3> ... <h3 id="musica-arte-{country}">🎵 Music & Art</h3>
- ES: <h3 id="natura-fauna-{country}">🌿 Naturaleza y fauna</h3> ... <h3 id="musica-arte-{country}">🎵 Música y arte</h3>

## TOOLS:
- Translation script: translate_norway.py (adapt input/output paths)
- HTML generator: generate-nature-html-country.py <prefix>
- Images go in: images/nature/
- CSS already in style.css (nature-section, nature-content, etc.)

## WORKFLOW PER COUNTRY:
1. Research (search + webpage_extract)
2. Write {country}-nature-encyclopedic-it.md
3. Translate to EN/ES using LLM script
4. Find clean images (no watermark)
5. Generate HTML: python3 generate-nature-html-country.py {country}
6. Replace in all 3 index files using Python script

## KEY RESEARCH SOURCES:
- Britannica country pages for flora/fauna
- Wikipedia geology pages
- Visit{Country} official tourism sites
- Wikimedia Commons for clean images
- iNaturalist for species photos
- National park websites
