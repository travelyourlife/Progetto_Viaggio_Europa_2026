#!/usr/bin/env python3
"""Insert new images into the correct country nature sections in all HTML files.
Uses the Flora summary line as anchor point and inserts images just before it."""
import re

# Images per country with captions in 3 languages
# (filename, cap_it, cap_en, cap_es)
images_by_country = {
    'france': [
        ('mont-saint-michel-tide.jpg', 'Mont Saint-Michel durante l\'alta marea', 'Mont Saint-Michel at high tide', 'Mont Saint-Michel durante la marea alta'),
        ('grey-seal-brittany.jpg', 'Foca grigia sulla costa bretone', 'Grey seal on the Brittany coast', 'Foca gris en la costa bretona'),
        ('mont-saint-michel-aerial.jpg', 'Vista aerea di Mont Saint-Michel', 'Aerial view of Mont Saint-Michel', 'Vista aérea de Mont Saint-Michel'),
    ],
    'spain': [
        ('picos-chamois.jpg', 'Rebeco nei Picos de Europa', 'Chamois in the Picos de Europa', 'Rebeco en los Picos de Europa'),
        ('iberian-wolf-spain.jpg', 'Lupo iberico (Canis lupus signatus)', 'Iberian wolf (Canis lupus signatus)', 'Lobo ibérico (Canis lupus signatus)'),
    ],
    'latvia': [
        ('gauja-river-autumn.jpg', 'Falesie di arenaria rossa sul fiume Gauja in autunno', 'Red sandstone cliffs on the Gauja River in autumn', 'Acantilados de arenisca roja en el río Gauja en otoño'),
        ('kemeri-bog-sunrise.jpg', 'Torbiera di Ķemeri all\'alba', 'Ķemeri bog at sunrise', 'Turbera de Ķemeri al amanecer'),
        ('european-beaver-swimming.jpg', 'Castoro europeo (Castor fiber)', 'European beaver (Castor fiber)', 'Castor europeo (Castor fiber)'),
    ],
    'lithuania': [
        ('baltic-amber-raw.jpg', 'Ambra baltica grezza', 'Raw Baltic amber', 'Ámbar báltico en bruto'),
    ],
    'poland': [
        ('slowinski-dunes-baltic.jpg', 'Dune mobili del Parco di Słowiński', 'Moving dunes of Słowiński National Park', 'Dunas móviles del Parque Nacional de Słowiński'),
        ('tatra-chamois-snow.jpg', 'Camoscio dei Tatra (Rupicapra rupicapra tatrica)', 'Tatra chamois (Rupicapra rupicapra tatrica)', 'Rebeco de los Tatra (Rupicapra rupicapra tatrica)'),
    ],
}

# Unique text near the Flora section for each country to use as anchor
# We'll find the Flora <details> that comes right after a specific country intro paragraph
country_anchors = {
    'france': 'Coste atlantiche e Bretagna',  # IT unique text in France Flora
    'spain': 'Foreste atlantiche cantabriche',  # IT unique text in Spain Flora
    'latvia': None,  # Will use line-based approach
    'lithuania': 'Alberi dominanti delle foreste emiboreali',  # IT unique text
    'poland': None,  # Will use line-based approach
}

# Approach: for each file, find the Flora <summary> that's part of the country's section
# by searching for a unique nearby text, then insert images after <summary>Flora</summary>

files_info = [
    ('index.html', 'it', 0),
    ('index_en.html', 'en', 1),
    ('index_es.html', 'es', 2),
]

for filename, lang, cap_idx in files_info:
    with open(filename, 'r') as f:
        lines = f.readlines()
    
    content = ''.join(lines)
    insertions = []  # (line_number, html_to_insert)
    
    for country, images in images_by_country.items():
        # Build the image HTML
        img_html = ''
        for img_file, cap_it, cap_en, cap_es in images:
            if img_file in content:
                continue  # Already present
            cap = [cap_it, cap_en, cap_es][cap_idx]
            img_html += f'<figure class="nature-figure"><img src="images/nature/{img_file}" alt="{cap}" loading="lazy"><figcaption>{cap}</figcaption></figure>\n'
        
        if not img_html:
            continue
        
        # Find the right Flora section for this country
        # Strategy: find all <summary>Flora</summary> lines and pick the right one
        flora_lines = [i for i, l in enumerate(lines) if '<summary>Flora</summary>' in l or '<summary>🌲 Flora' in l]
        
        # Map country to approximate Flora line position
        # We know from earlier: France ~6853, Spain ~7493, Poland ~2228, Latvia ~2935, Lithuania ~3546
        # These are for index.html; EN/ES will be different but proportional
        target_ranges = {
            'france': (0.55, 0.75),  # roughly 55-75% through the file
            'spain': (0.60, 0.80),
            'poland': (0.15, 0.30),
            'latvia': (0.20, 0.40),
            'lithuania': (0.25, 0.50),
        }
        
        total_lines = len(lines)
        low = int(total_lines * target_ranges[country][0])
        high = int(total_lines * target_ranges[country][1])
        
        # Find Flora lines in the target range
        candidates = [l for l in flora_lines if low <= l <= high]
        
        if not candidates:
            # Broaden search
            candidates = [l for l in flora_lines if low - 1000 <= l <= high + 1000]
        
        if not candidates:
            print(f"  WARNING: Could not find Flora section for {country} in {filename}")
            continue
        
        # Use the first candidate
        flora_line = candidates[0]
        
        # Insert after the <summary>Flora</summary> line (and after the <div class="nature-content"> if present)
        insert_after = flora_line
        if insert_after + 1 < total_lines and 'nature-content' in lines[insert_after + 1]:
            insert_after += 1
        
        insertions.append((insert_after + 1, img_html))
    
    # Apply insertions in reverse order (so line numbers don't shift)
    insertions.sort(key=lambda x: x[0], reverse=True)
    for line_num, html in insertions:
        lines.insert(line_num, html)
    
    with open(filename, 'w') as f:
        f.writelines(lines)
    
    total_imgs = sum(1 for _, html in insertions for _ in html.strip().split('\n') if '<figure' in _)
    print(f"  {filename}: {total_imgs} images inserted across {len(insertions)} countries")

print("Done!")
