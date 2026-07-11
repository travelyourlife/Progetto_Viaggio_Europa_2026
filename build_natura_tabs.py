#!/usr/bin/env python3
"""
Extract nature sections from index_en.html and index_es.html and build tab-natura sections.
Uses h2 IDs that contain country keywords (in any language).
"""
import re

def extract_nature_tab(input_file, output_file, title, intro, countries_map):
    """
    countries_map: list of (id_keywords, flag, display_name) tuples
    id_keywords: list of strings to match in h2 id attribute
    """
    with open(input_file, 'r') as f:
        lines = f.readlines()

    # Find all h2 headers
    country_headers = []
    for i, line in enumerate(lines):
        m = re.match(r'^<h2 id="([^"]+)">(.*?)</h2>', line)
        if m:
            country_headers.append((i, m.group(1), m.group(2)))

    # Map h2 lines to countries using id_keywords
    h2_to_country = {}
    for line_num, h2_id, h2_text in country_headers:
        for id_keywords, flag, name in countries_map:
            if any(kw in h2_id for kw in id_keywords):
                h2_to_country[line_num] = (id_keywords[0], flag, name)
                break

    # Extract nature blocks per country
    country_nature_blocks = {}
    for idx, (line_num, h2_id, h2_text) in enumerate(country_headers):
        if line_num not in h2_to_country:
            continue
        key, flag, name = h2_to_country[line_num]
        
        # Skip cuisine sections (cucina-*)
        if 'cucina' in h2_id or 'cuisine' in h2_id or 'cocina' in h2_id:
            continue
        
        if idx + 1 < len(country_headers):
            end_line = country_headers[idx + 1][0]
        else:
            end_line = len(lines)
        
        # Find nature-section blocks
        blocks = []
        i = line_num
        while i < end_line:
            if 'class="nature-section"' in lines[i]:
                start = i
                depth = 0
                for j in range(i, end_line):
                    depth += lines[j].count('<details')
                    depth -= lines[j].count('</details>')
                    if depth == 0:
                        blocks.append((start, j))
                        i = j + 1
                        break
                else:
                    i += 1
            else:
                i += 1
        
        if blocks:
            if key not in country_nature_blocks:
                country_nature_blocks[key] = {'flag': flag, 'name': name, 'blocks': []}
            country_nature_blocks[key]['blocks'].extend(blocks)

    print(f"\n{input_file} - Countries with nature sections:")
    for key, data in country_nature_blocks.items():
        print(f"  {data['flag']} {data['name']}: {len(data['blocks'])} sections")

    # Build output
    output = []
    output.append('<!-- ═══ TAB NATURA ═══ -->')
    output.append('<section id="tab-natura" class="tab-content">')
    output.append(f'<h1>{title}</h1>')
    output.append(f'<p class="natura-intro">{intro}</p>')
    output.append('')
    output.append('<div class="natura-country-index">')
    for id_keywords, flag, name in countries_map:
        key = id_keywords[0]
        if key in country_nature_blocks:
            output.append(f'  <a href="#natura-{key}" class="natura-index-link">{flag} {name}</a>')
    output.append('</div>')
    output.append('')

    for id_keywords, flag, name in countries_map:
        key = id_keywords[0]
        if key not in country_nature_blocks:
            continue
        data = country_nature_blocks[key]
        output.append(f'<div class="natura-country-block" id="natura-{key}">')
        output.append(f'<h2>{flag} {name}</h2>')
        for start, end in data['blocks']:
            for j in range(start, end + 1):
                output.append(lines[j].rstrip())
        output.append('</div>')
        output.append('')

    output.append('</section>')

    with open(output_file, 'w') as f:
        f.write('\n'.join(output) + '\n')
    print(f"Generated {output_file} ({len(output)} lines)")

# EN version
EN_COUNTRIES = [
    (['austria'], '🇦🇹', 'Austria'),
    (['polonia', 'poland'], '🇵🇱', 'Poland'),
    (['lituania', 'lithuania'], '🇱🇹', 'Lithuania'),
    (['lettonia', 'latvia'], '🇱🇻', 'Latvia'),
    (['estonia'], '🇪🇪', 'Estonia'),
    (['finlandia', 'finland'], '🇫🇮', 'Finland'),
    (['norvegia', 'norway'], '🇳🇴', 'Norway'),
    (['danimarca', 'denmark'], '🇩🇰', 'Denmark'),
    (['francia', 'france'], '🇫🇷', 'France'),
    (['spagna', 'spain'], '🇪🇸', 'Spain'),
]

extract_nature_tab(
    'index_en.html',
    'tab-natura-section-en.html',
    '🌿 Nature & Wildlife',
    'Complete naturalist guide: flora, fauna, geology, phenomena and ecosystems of the 10 countries crossed.',
    EN_COUNTRIES
)

# ES version
ES_COUNTRIES = [
    (['austria'], '🇦🇹', 'Austria'),
    (['polonia', 'poland'], '🇵🇱', 'Polonia'),
    (['lituania', 'lithuania'], '🇱🇹', 'Lituania'),
    (['lettonia', 'latvia'], '🇱🇻', 'Letonia'),
    (['estonia'], '🇪🇪', 'Estonia'),
    (['finlandia', 'finland'], '🇫🇮', 'Finlandia'),
    (['norvegia', 'norway'], '🇳🇴', 'Noruega'),
    (['danimarca', 'denmark'], '🇩🇰', 'Dinamarca'),
    (['francia', 'france'], '🇫🇷', 'Francia'),
    (['spagna', 'spain'], '🇪🇸', 'España'),
]

extract_nature_tab(
    'index_es.html',
    'tab-natura-section-es.html',
    '🌿 Naturaleza y Medio Ambiente',
    'Guía naturalista completa: flora, fauna, geología, fenómenos y ecosistemas de los 10 países recorridos.',
    ES_COUNTRIES
)
