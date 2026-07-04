#!/usr/bin/env python3
"""
Remove <img> tags from HTML files that reference non-existent image files.
"""
import re
import os

def remove_missing_images(html_file):
    """Remove img tags referencing non-existent files."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_len = len(content)
    removed = 0
    
    # Find all img tags and check if their src files exist
    def check_img(match):
        nonlocal removed
        src = match.group(1)
        if src.startswith('images/nature/') and not os.path.exists(src):
            removed += 1
            return ''  # Remove the entire img tag
        return match.group(0)
    
    # Match img tags (both self-closing and not)
    content = re.sub(r'<img[^>]*src="([^"]+)"[^>]*/?\s*>', check_img, content)
    
    # Also remove any empty <figure> or <div> wrappers that now have no content
    # Remove figure tags that only contain whitespace
    content = re.sub(r'<figure[^>]*>\s*<figcaption>[^<]*</figcaption>\s*</figure>', '', content)
    content = re.sub(r'<figure[^>]*>\s*</figure>', '', content)
    
    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  {html_file}: removed {removed} missing images ({original_len} -> {len(content)} chars)")

# Process all country HTML files
countries = ['norway', 'estonia', 'latvia', 'lithuania', 'poland', 'austria', 'denmark', 'france', 'spain', 'finland']
for country in countries:
    for lang in ['it', 'en', 'es']:
        html_file = f"{country}-nature-{lang}.html"
        if os.path.exists(html_file):
            remove_missing_images(html_file)

print("\nDone!")
