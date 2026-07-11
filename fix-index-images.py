#!/usr/bin/env python3
"""
Remove <img> tags from index HTML files that reference non-existent image files.
"""
import re
import os

def fix_html_file(filepath):
    """Remove img tags referencing non-existent files from an HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_len = len(content)
    removed = 0
    
    def check_img(match):
        nonlocal removed
        full_tag = match.group(0)
        src_match = re.search(r'src="([^"]+)"', full_tag)
        if src_match:
            src = src_match.group(1)
            if src.startswith('images/nature/') and not os.path.exists(src):
                removed += 1
                return ''
        return full_tag
    
    content = re.sub(r'<img[^>]*>', check_img, content)
    
    # Also remove empty figure elements left behind
    content = re.sub(r'<figure[^>]*>\s*<figcaption>[^<]*</figcaption>\s*</figure>', '', content)
    content = re.sub(r'<figure[^>]*>\s*</figure>', '', content)
    
    # Clean up excessive blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  {filepath}: removed {removed} missing images ({original_len} -> {len(content)} chars)")

os.chdir('/home/ubuntu/quo-vadis')
for f in ['index.html', 'index_en.html', 'index_es.html']:
    fix_html_file(f)

print("\nDone! Verifying...")
for f in ['index.html', 'index_en.html', 'index_es.html']:
    with open(f, 'r') as fh:
        content = fh.read()
    missing = 0
    for m in re.finditer(r'src="(images/nature/[^"]+)"', content):
        if not os.path.exists(m.group(1)):
            missing += 1
    print(f"  {f}: {missing} still missing")
