#!/usr/bin/env python3
"""Extract nature sections from index.html and identify which country they belong to."""
import re

with open('index.html', 'r') as f:
    lines = f.readlines()

content = ''.join(lines)

# Strategy: find each <details class="nature-section"> and its matching </details>
# Then look backwards to find the country context

# Find all nature section start/end positions
nature_blocks = []
i = 0
while i < len(lines):
    if 'class="nature-section"' in lines[i]:
        start = i
        # Find matching </details>
        depth = 0
        for j in range(i, len(lines)):
            depth += lines[j].count('<details')
            depth -= lines[j].count('</details>')
            if depth == 0:
                end = j
                break
        nature_blocks.append((start, end))
        i = end + 1
    else:
        i += 1

print(f"Found {len(nature_blocks)} nature-section blocks")

# Now find which country each block belongs to by looking for h2/h3 headers with country names
# or accordion headers before each block
countries_found = {}
for start, end in nature_blocks:
    # Look backwards for country identifier
    country = "Unknown"
    for j in range(start, max(start-200, 0), -1):
        line = lines[j]
        # Look for country flag + name patterns
        if re.search(r'🇦🇹|Austria', line) and 'accordion-header' in line:
            country = "Austria"; break
        elif re.search(r'🇩🇰|Danmark|Danimarca|Denmark', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Danimarca"; break
        elif re.search(r'🇪🇪|Estonia', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Estonia"; break
        elif re.search(r'🇫🇮|Finlandia|Finland', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Finlandia"; break
        elif re.search(r'🇫🇷|Francia|France', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Francia"; break
        elif re.search(r'🇱🇻|Lettonia|Latvia', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Lettonia"; break
        elif re.search(r'🇱🇹|Lituania|Lithuania', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Lituania"; break
        elif re.search(r'🇳🇴|Norvegia|Norway', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Norvegia"; break
        elif re.search(r'🇵🇱|Polonia|Poland', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Polonia"; break
        elif re.search(r'🇪🇸|Spagna|Spain', line) and ('accordion-header' in line or '<h2' in line or '<h3' in line):
            country = "Spagna"; break
    
    if country not in countries_found:
        countries_found[country] = []
    countries_found[country].append((start, end))

print("\nCountries and their nature sections:")
for country, blocks in sorted(countries_found.items()):
    total_lines = sum(e - s + 1 for s, e in blocks)
    print(f"  {country}: {len(blocks)} blocks, {total_lines} lines (lines {blocks[0][0]+1}-{blocks[-1][1]+1})")

# Also check what <summary> tags say
print("\nNature section summaries:")
for start, end in nature_blocks[:20]:
    for j in range(start, min(start+3, len(lines))):
        if '<summary>' in lines[j]:
            summary = re.search(r'<summary>(.*?)</summary>', lines[j])
            if summary:
                # Find country
                country = "?"
                for c, blocks in countries_found.items():
                    if (start, end) in blocks:
                        country = c
                        break
                print(f"  {country}: {summary.group(1)} (line {j+1})")
            break
