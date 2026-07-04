#!/usr/bin/env python3
"""
Add image references to country markdown files based on available images,
then regenerate HTML for all countries.
"""
import re
import os
import subprocess

# Mapping of images to countries and sections
# Format: country_prefix -> list of (section_keyword, image_filename, alt_text)
image_mappings = {
    'norway': [
        ('Arboree', 'mountain-birch.jpg', 'Betulla di montagna norvegese'),
        ('Arboree', 'scots-pine.jpg', 'Pino silvestre costiero'),
        ('Mammiferi', 'musk-ox.jpg', 'Bue muschiato Dovrefjell'),
        ('Mammiferi', 'reindeer-norway.jpg', 'Renna norvegese'),
        ('Mammiferi', 'arctic-fox.jpg', 'Volpe artica'),
        ('Mare.*Cieli|Ricchezza', 'sea-eagle.jpg', 'Aquila di mare coda bianca'),
        ('Mare.*Cieli|Ricchezza', 'puffin.jpg', 'Pulcinella di mare'),
        ('Mare.*Cieli|Ricchezza', 'sperm-whale.jpg', 'Capodoglio'),
        ('Mare.*Cieli|Ricchezza', 'orca-lofoten.jpg', 'Orche alle Lofoten'),
        ('Mare.*Cieli|Ricchezza', 'northern-gannet.jpg', 'Sula bassana'),
        ('Fiordi|Formazione', 'geirangerfjord.jpg', 'Geirangerfjord'),
        ('Fiordi|Formazione', 'lofoten-fjord.jpg', 'Fiordo delle Lofoten'),
        ('Maelstrom|Moskstraumen', 'maelstrom.jpg', 'Moskstraumen - Maelstrom'),
        ('Sole.*Mezzanotte|Midnight', 'midnight-sun-lofoten.jpg', 'Sole di mezzanotte alle Lofoten'),
        ('Kelp|Laminaria', 'kelp-forest.jpg', 'Foresta di kelp'),
        ('Corall|Coral', 'cold-water-coral.jpg', 'Coralli di acqua fredda'),
    ],
    'estonia': [
        ('Arboree|Flora|Foresta', 'lahemaa-forest.jpeg', 'Foresta di Lahemaa'),
        ('Lince|Lynx|Carnivori', 'eurasian-lynx.jpg', 'Lince eurasiatica'),
        ('Foca|Seal|Mammiferi marini', 'grey-seal-baltic.jpg', 'Foca grigia del Baltico'),
        ('Cicogna|Stork|Uccelli', 'black-stork-nest.jpg', 'Cicogna nera al nido'),
        ('Scoiattolo|Flying squirrel', 'flying-squirrel.jpg', 'Scoiattolo volante siberiano'),
        ('Klint|Calcare|Geologia', 'baltic-klint.jpg', 'Baltic Klint'),
        ('Erratic|Massi|Boulder', 'erratic-boulder.jpg', 'Masso erratico glaciale'),
        ('Torbiera|Bog|Palude', 'estonian-bog.jpg', 'Torbiera estone'),
        ('Torbiera|Bog|Palude', 'viru-bog.jpg', 'Sentiero della torbiera di Viru'),
    ],
    'latvia': [
        ('Gauja|Parco|Foresta', 'gauja-autumn.jpg', 'Valle del Gauja in autunno'),
        ('Arenaria|Sandstone|Devoniano', 'gauja-sandstone.jpg', 'Arenaria rossa del Gauja'),
        ('Castoro|Beaver', 'european-beaver.jpg', 'Castoro europeo'),
        ('Torbiera|Bog|Kemeri', 'kemeri-bog.jpg', 'Torbiera di Kemeri'),
        ('Ambra|Amber', 'baltic-amber.jpg', 'Ambra baltica'),
    ],
    'lithuania': [
        ('Curonian|Neringa|Dune', 'curonian-spit.jpg', 'Dune della Penisola Curlandese'),
        ('Curonian|Neringa|Dune', 'curonian-spit-aerial.jpg', 'Penisola Curlandese vista aerea'),
        ('Cicogna|Stork|Uccelli', 'white-stork.jpg', 'Cicogna bianca'),
        ('Alce|Moose|Elk', 'moose-lithuania.jpg', 'Alce lituano'),
        ('Ambra|Amber', 'baltic-amber-beach.jpg', 'Ambra sulla spiaggia baltica'),
    ],
    'poland': [
        ('Bisonte|Bison|Białowieża', 'bison-bialowieza.webp', 'Bisonte europeo a Białowieża'),
        ('Bisonte|Bison|Białowieża', 'european-bison.jpg', 'Bisonte europeo'),
        ('Camoscio|Chamois|Tatra', 'tatra-chamois.jpg', 'Camoscio dei Tatra'),
        ('Dune|Słowiński|Sabbia', 'slowinski-dunes.jpg', 'Dune mobili di Słowiński'),
    ],
    'austria': [
        ('Stambecco|Ibex|Capra', 'ibex-alps.jpg', 'Stambecco alpino'),
        ('Stella alpina|Edelweiss', 'edelweiss.jpg', 'Stella alpina'),
        ('Marmotta|Marmot', 'alpine-marmot.jpg', 'Marmotta alpina'),
        ('Aquila|Eagle|Rapaci', 'golden-eagle.jpg', 'Aquila reale'),
        ('Grossglockner|Ghiacciaio|Glacier', 'grossglockner.jpg', 'Grossglockner'),
    ],
    'denmark': [
        ('Wadden|Mare.*Wadden', 'wadden-sea.jpg', 'Mare dei Wadden'),
        ('Foca|Seal', 'harbour-seal.jpg', 'Foca comune'),
        ('Møns|Klint|Creta|Chalk', 'mons-klint.jpg', 'Møns Klint'),
        ('Sort Sol|Storni|Starling', 'sort-sol-starlings.jpg', 'Sort Sol - Sole Nero'),
    ],
    'france': [
        ('Granito rosa|Pink granite|Ploumanac', 'pink-granite-coast.jpg', 'Costa di granito rosa'),
        ('Granito rosa|Pink granite|Ploumanac', 'pink-granite-brittany.jpg', 'Granito rosa di Bretagna'),
        ('Delfin|Dolphin|Biscay', 'dolphins-biscay.jpg', 'Delfini nel Golfo di Biscaglia'),
    ],
    'spain': [
        ('Orso|Bear|Cantabric', 'cantabrian-bear.jpg', 'Orso bruno cantabrico'),
        ('Flysch|Zumaia', 'zumaia-flysch.webp', 'Flysch di Zumaia'),
        ('Grifone|Griffon|Avvoltoio', 'griffon-vulture.jpg', 'Grifone'),
        ('Lupo|Wolf|Iberic', 'iberian-wolf.webp', 'Lupo iberico'),
    ],
}

def add_images_to_markdown(country_prefix, lang='it'):
    """Add image references to a country's markdown file."""
    filename = f"{country_prefix}-nature-encyclopedic-{lang}.md"
    if not os.path.exists(filename):
        print(f"  SKIP: {filename} not found")
        return
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    mappings = image_mappings.get(country_prefix, [])
    if not mappings:
        print(f"  SKIP: No image mappings for {country_prefix}")
        return
    
    images_added = 0
    for section_pattern, img_file, alt_text in mappings:
        img_path = f"images/nature/{img_file}"
        img_tag = f"![{alt_text}]({img_path})"
        
        # Check if image already referenced
        if img_file in content:
            continue
        
        # Find the section and add image after the first paragraph
        lines = content.split('\n')
        new_lines = []
        found = False
        inserted = False
        
        for i, line in enumerate(lines):
            new_lines.append(line)
            if not inserted:
                # Check if this line matches the section header
                if re.search(section_pattern, line, re.IGNORECASE) and (line.startswith('#') or line.startswith('**')):
                    found = True
                elif found and line.strip() == '' and i > 0 and new_lines[-2].strip() != '':
                    # Insert image after first paragraph break in this section
                    new_lines.append(f"\n  {img_tag}\n")
                    inserted = True
                    images_added += 1
        
        if not inserted and found:
            # If we found the section but no paragraph break, add at end
            new_lines.append(f"\n  {img_tag}\n")
            images_added += 1
        
        content = '\n'.join(new_lines)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  {filename}: added {images_added} images")

# Process all countries for all languages
for country in image_mappings.keys():
    print(f"\nProcessing {country}...")
    for lang in ['it', 'en', 'es']:
        add_images_to_markdown(country, lang)

# Now regenerate HTML for all countries
print("\n\nRegenerating HTML...")
for country in image_mappings.keys():
    result = subprocess.run(
        ['python3', 'generate-nature-html-country.py', country],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"  ✓ {country} HTML regenerated")
    else:
        print(f"  ✗ {country} FAILED: {result.stderr[:100]}")

print("\nDone!")
