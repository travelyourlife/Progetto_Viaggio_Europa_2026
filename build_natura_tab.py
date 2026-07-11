#!/usr/bin/env python3
"""
Extract nature sections from index.html and build a standalone tab-natura section.
Nature sections are <details class="nature-section"> blocks that appear within country h2 sections.
"""
import re

with open('index.html', 'r') as f:
    lines = f.readlines()

# Find all h2 country headers with their line numbers
country_headers = []
for i, line in enumerate(lines):
    m = re.match(r'^<h2 id="([^"]+)">(.*?)</h2>', line)
    if m:
        country_headers.append((i, m.group(1), m.group(2)))

# Countries that have nature sections (in route order)
NATURE_COUNTRIES = [
    ('austria', '🇦🇹', 'Austria'),
    ('polonia', '🇵🇱', 'Polonia'),
    ('lituania', '🇱🇹', 'Lituania'),
    ('lettonia', '🇱🇻', 'Lettonia'),
    ('estonia', '🇪🇪', 'Estonia'),
    ('finlandia', '🇫🇮', 'Finlandia'),
    ('norvegia', '🇳🇴', 'Norvegia'),
    ('danimarca', '🇩🇰', 'Danimarca'),
    ('francia', '🇫🇷', 'Francia'),
    ('spagna', '🇪🇸', 'Spagna'),
]

# Map h2 IDs to countries
h2_to_country = {}
for i, (line_num, h2_id, h2_text) in enumerate(country_headers):
    for key, flag, name in NATURE_COUNTRIES:
        if key in h2_id or name.lower() in h2_id:
            h2_to_country[line_num] = (key, flag, name)
            break

# For each country section, find the nature blocks within it
# A country section spans from its h2 to the next h2
country_nature_blocks = {}
for idx, (line_num, h2_id, h2_text) in enumerate(country_headers):
    if line_num not in h2_to_country:
        continue
    
    key, flag, name = h2_to_country[line_num]
    
    # Find end of this country section (next h2)
    if idx + 1 < len(country_headers):
        end_line = country_headers[idx + 1][0]
    else:
        end_line = len(lines)
    
    # Find all nature-section blocks within this range
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
        country_nature_blocks[key] = {
            'flag': flag,
            'name': name,
            'blocks': blocks
        }

print("Countries with nature sections:")
for key, data in country_nature_blocks.items():
    total = sum(e - s + 1 for s, e in data['blocks'])
    summaries = []
    for s, e in data['blocks']:
        for j in range(s, min(s+3, e)):
            m = re.search(r'<summary>(.*?)</summary>', lines[j])
            if m:
                summaries.append(m.group(1))
                break
    print(f"  {data['flag']} {data['name']}: {len(data['blocks'])} sections ({total} lines) - {', '.join(summaries)}")

# Now build the tab-natura HTML
output = []
output.append('<!-- ═══ TAB NATURA ═══ -->')
output.append('<section id="tab-natura" class="tab-content">')
output.append('<h1>🌿 Natura e Ambiente</h1>')
output.append('<p class="natura-intro">Guida naturalistica completa: flora, fauna, geologia, fenomeni e ecosistemi dei 10 Paesi attraversati.</p>')
output.append('')
output.append('<!-- Country index -->')
output.append('<div class="natura-country-index">')

for key, flag, name in NATURE_COUNTRIES:
    if key in country_nature_blocks:
        output.append(f'  <a href="#natura-{key}" class="natura-index-link">{flag} {name}</a>')

output.append('</div>')
output.append('')

# For each country, output its nature sections
for key, flag, name in NATURE_COUNTRIES:
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

# Write the output
with open('tab-natura-section.html', 'w') as f:
    f.write('\n'.join(output) + '\n')

print(f"\nGenerated tab-natura-section.html ({len(output)} lines)")
