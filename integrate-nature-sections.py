#!/usr/bin/env python3
"""
Replace old short nature sections in index.html, index_en.html, index_es.html
with the new expanded encyclopedic content.
All three files use the same ID pattern: natura-fauna-{country} / musica-arte-{country}
"""

# Countries to replace (not Finland/Norway which are already done)
# Format: (country_id_in_html, file_prefix)
countries_to_replace = [
    ('austria', 'austria'),
    ('polonia', 'poland'),
    ('lituania', 'lithuania'),
    ('lettonia', 'latvia'),
    ('estonia', 'estonia'),
    ('danimarca', 'denmark'),
    ('francia', 'france'),
    ('spagna', 'spain'),
]

def replace_nature_section(html_content, country_id, new_html):
    """Replace content between natura-fauna-{country} and musica-arte-{country}."""
    start_marker = f'id="natura-fauna-{country_id}"'
    end_marker = f'id="musica-arte-{country_id}"'
    
    start_idx = html_content.find(start_marker)
    if start_idx == -1:
        print(f"  WARNING: Could not find natura-fauna-{country_id}")
        return html_content
    
    end_idx = html_content.find(end_marker, start_idx)
    if end_idx == -1:
        print(f"  WARNING: Could not find musica-arte-{country_id}")
        return html_content
    
    # Find the start of the line containing the natura-fauna heading
    line_start = html_content.rfind('\n', 0, start_idx) + 1
    
    # Find the start of the line containing the musica-arte heading
    end_line_start = html_content.rfind('\n', 0, end_idx) + 1
    
    # Replace
    html_content = html_content[:line_start] + new_html + '\n' + html_content[end_line_start:]
    return html_content

def process_file(html_file, lang_suffix):
    """Process one HTML file."""
    print(f"\nProcessing {html_file}...")
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_len = len(content)
    
    for country_id, file_prefix in countries_to_replace:
        html_source = f"{file_prefix}-nature-{lang_suffix}.html"
        try:
            with open(html_source, 'r', encoding='utf-8') as f:
                new_html = f.read().strip()
            content = replace_nature_section(content, country_id, new_html)
            print(f"  ✓ {country_id} <- {html_source} ({len(new_html)} chars)")
        except FileNotFoundError:
            print(f"  ✗ SKIP: {html_source} not found")
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  File size: {original_len} -> {len(content)} chars ({len(content)-original_len:+d})")

# Process all three files
process_file('index.html', 'it')
process_file('index_en.html', 'en')
process_file('index_es.html', 'es')

print("\n✓ All done!")
