#!/usr/bin/env python3
"""Insert new images into the correct country nature sections in all HTML files."""
import re

# Define images per country with captions in all 3 languages
# Format: (filename, caption_it, caption_en, caption_es)
images_by_country = {
    'france': [
        ('mont-saint-michel-tide.jpg', 'Mont Saint-Michel durante l\'alta marea', 'Mont Saint-Michel at high tide', 'Mont Saint-Michel durante la marea alta'),
        ('grey-seal-brittany.jpg', 'Foca grigia sulla costa bretone', 'Grey seal on the Brittany coast', 'Foca gris en la costa bretona'),
        ('mont-saint-michel-aerial.jpg', 'Mont Saint-Michel vista aerea', 'Mont Saint-Michel aerial view', 'Mont Saint-Michel vista aérea'),
    ],
    'spain': [
        ('picos-chamois.jpg', 'Rebeco nei Picos de Europa', 'Chamois in the Picos de Europa', 'Rebeco en los Picos de Europa'),
        ('iberian-wolf-spain.jpg', 'Lupo iberico', 'Iberian wolf', 'Lobo ibérico'),
    ],
    'latvia': [
        ('gauja-river-autumn.jpg', 'Falesie di arenaria rossa sul fiume Gauja', 'Red sandstone cliffs on the Gauja River', 'Acantilados de arenisca roja en el río Gauja'),
        ('kemeri-bog-sunrise.jpg', 'Torbiera di Ķemeri all\'alba', 'Ķemeri bog at sunrise', 'Turbera de Ķemeri al amanecer'),
        ('european-beaver-swimming.jpg', 'Castoro europeo', 'European beaver', 'Castor europeo'),
    ],
    'lithuania': [
        ('baltic-amber-raw.jpg', 'Ambra baltica grezza', 'Raw Baltic amber', 'Ámbar báltico en bruto'),
    ],
    'poland': [
        ('slowinski-dunes-baltic.jpg', 'Dune mobili di Słowiński', 'Moving dunes of Słowiński', 'Dunas móviles de Słowiński'),
        ('tatra-chamois-snow.jpg', 'Camoscio dei Tatra', 'Tatra chamois', 'Rebeco de los Tatra'),
    ],
}

# Section markers to find the right country section
# We'll look for the first <details> tag after the country's nature section header
country_markers = {
    'france': {
        'it': 'natura-fauna-francia',
        'en': 'natura-fauna-francia',
        'es': 'natura-fauna-francia',
    },
    'spain': {
        'it': 'natura-fauna-spagna',
        'en': 'natura-fauna-spagna',
        'es': 'natura-fauna-spagna',
    },
    'latvia': {
        'it': 'natura-fauna-lettonia',
        'en': 'natura-fauna-lettonia',
        'es': 'natura-fauna-lettonia',
    },
    'lithuania': {
        'it': 'natura-fauna-lituania',
        'en': 'natura-fauna-lituania',
        'es': 'natura-fauna-lituania',
    },
    'poland': {
        'it': 'natura-fauna-polonia',
        'en': 'natura-fauna-polonia',
        'es': 'natura-fauna-polonia',
    },
}

files = {
    'it': 'index.html',
    'en': 'index_en.html',
    'es': 'index_es.html',
}

for lang, filename in files.items():
    with open(filename, 'r') as f:
        content = f.read()
    
    changes = 0
    for country, images in images_by_country.items():
        marker = country_markers[country][lang]
        
        # Find the section
        marker_pos = content.find(f'id="{marker}"')
        if marker_pos == -1:
            print(f"  WARNING: marker '{marker}' not found in {filename}")
            continue
        
        # Find the first <details> after the marker (this is where the content starts)
        first_details = content.find('<details', marker_pos)
        if first_details == -1:
            print(f"  WARNING: no <details> found after '{marker}' in {filename}")
            continue
        
        # Find the opening of the first <details> content (after <summary>...</summary>)
        summary_end = content.find('</summary>', first_details)
        if summary_end == -1:
            continue
        summary_end += len('</summary>')
        
        # Build the image HTML to insert
        img_html = '\n'
        for img_file, cap_it, cap_en, cap_es in images:
            # Skip if already present
            if img_file in content[marker_pos:marker_pos+50000]:
                continue
            
            cap = {'it': cap_it, 'en': cap_en, 'es': cap_es}[lang]
            img_html += f'<figure class="nature-figure"><img src="images/nature/{img_file}" alt="{cap}" loading="lazy"><figcaption>{cap}</figcaption></figure>\n'
            changes += 1
        
        if img_html.strip():
            content = content[:summary_end] + img_html + content[summary_end:]
    
    with open(filename, 'w') as f:
        f.write(content)
    
    print(f"  {filename}: {changes} images inserted")

print("Done!")
