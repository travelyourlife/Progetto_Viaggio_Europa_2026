#!/usr/bin/env python3
"""
Generate HTML for the expanded Finland nature section from the markdown content.
Uses <details> elements for each main section (Flora, Fauna, etc.) to keep it collapsible.
Fixes: handles scientific names in italics correctly (nested ** and * patterns).
"""

import re

def process_inline(text):
    """Convert inline markdown to HTML, handling bold/italic/links/images correctly."""
    # Handle images first (before other processing)
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', 
                  r'<img src="\2" alt="\1" loading="lazy" class="nature-species-img">', text)
    
    # Handle links
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', 
                  r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', text)
    
    # Handle bold (**text**) - use .+? to allow nested * inside
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    
    # Handle italic (*text*) - but not inside already-processed tags
    text = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<em>\1</em>', text)
    
    return text


def convert_markdown_to_html(md_content):
    """Convert the full markdown content to structured HTML with collapsible sections."""
    lines = md_content.split('\n')
    
    output = []
    current_section = None
    current_subsection = None
    section_content = []
    i = 0
    
    # Skip the title line (# header) and intro paragraph
    while i < len(lines) and not lines[i].startswith('## '):
        i += 1
    
    while i < len(lines):
        line = lines[i]
        
        # Main section header (## )
        if line.startswith('## '):
            # Close previous section
            if current_section:
                output.append(flush_section(current_section, section_content))
            current_section = line[3:].strip()
            section_content = []
            i += 1
            continue
        
        # Subsection header (### )
        if line.startswith('### '):
            section_content.append(('h4', line[4:].strip()))
            i += 1
            continue
        
        # Table
        if line.startswith('|'):
            table_lines = []
            while i < len(lines) and lines[i].startswith('|'):
                table_lines.append(lines[i])
                i += 1
            section_content.append(('table', table_lines))
            continue
        
        # Image (standalone)
        img_match = re.match(r'^!\[([^\]]*)\]\(([^)]+)\)$', line.strip())
        if img_match:
            section_content.append(('img', img_match.group(1), img_match.group(2)))
            i += 1
            continue
        
        # List item starting with "- **"
        if line.startswith('- **'):
            item_lines = [line[2:]]  # Remove "- " prefix
            i += 1
            while i < len(lines) and lines[i].startswith('  ') and not lines[i].strip().startswith('- '):
                item_lines.append(lines[i].strip())
                i += 1
            section_content.append(('species', '\n'.join(item_lines)))
            continue
        
        # Horizontal rule
        if line.strip() == '---':
            i += 1
            continue
        
        # Italic source line at the end
        if line.strip().startswith('*Fonti') or line.strip().startswith('*Sources') or line.strip().startswith('*Fuentes'):
            section_content.append(('source', line.strip().strip('*')))
            i += 1
            continue
        
        # Empty line
        if line.strip() == '':
            i += 1
            continue
        
        # Regular paragraph
        para_lines = [line]
        i += 1
        while i < len(lines) and lines[i].strip() != '' and not lines[i].startswith('#') and not lines[i].startswith('- **') and not lines[i].startswith('|') and not re.match(r'^!\[', lines[i].strip()):
            para_lines.append(lines[i])
            i += 1
        section_content.append(('p', ' '.join(para_lines)))
    
    # Close last section
    if current_section:
        output.append(flush_section(current_section, section_content))
    
    return '\n'.join(output)


def flush_section(title, content_items):
    """Generate HTML for a collapsible section."""
    html = f'<details class="nature-section">\n<summary>{process_inline(title)}</summary>\n<div class="nature-content">\n'
    
    for item in content_items:
        if item[0] == 'h4':
            html += f'<h4 class="nature-subsection">{process_inline(item[1])}</h4>\n'
        elif item[0] == 'p':
            html += f'<p>{process_inline(item[1])}</p>\n'
        elif item[0] == 'img':
            alt, src = item[1], item[2]
            html += f'<figure class="nature-figure"><img src="{src}" alt="{alt}" loading="lazy" class="nature-img"><figcaption>{alt}</figcaption></figure>\n'
        elif item[0] == 'species':
            html += convert_species_card(item[1])
        elif item[0] == 'table':
            html += convert_table(item[1])
        elif item[0] == 'source':
            html += f'<p class="nature-sources"><em>{process_inline(item[1])}</em></p>\n'
    
    html += '</div>\n</details>'
    return html


def convert_species_card(text):
    """Convert a species list item to a card with optional image."""
    # Check for image
    img_html = ''
    img_match = re.search(r'!\[([^\]]*)\]\(([^)]+)\)', text)
    if img_match:
        alt = img_match.group(1)
        src = img_match.group(2)
        img_html = f'<img src="{src}" alt="{alt}" loading="lazy" class="nature-species-img">'
        text = text.replace(img_match.group(0), '').strip()
    
    # Process the text content
    processed = process_inline(text)
    
    if img_html:
        return f'<div class="nature-species-card">\n{img_html}\n<div class="nature-species-text">{processed}</div>\n</div>\n'
    else:
        return f'<div class="nature-species-card">\n<div class="nature-species-text">{processed}</div>\n</div>\n'


def convert_table(rows):
    """Convert markdown table rows to HTML table."""
    if len(rows) < 3:
        return ''
    
    # Parse header - handle cells that may contain | inside markdown
    headers = split_table_row(rows[0])
    # Skip separator row (rows[1])
    data_rows = [split_table_row(row) for row in rows[2:]]
    
    html = '<div class="nature-table-wrap"><table class="nature-table">\n<thead><tr>\n'
    for h in headers:
        html += f'<th>{process_inline(h)}</th>\n'
    html += '</tr></thead>\n<tbody>\n'
    
    for row in data_rows:
        html += '<tr>\n'
        for cell in row:
            cell_processed = process_inline(cell)
            # Handle images in cells
            cell_processed = re.sub(
                r'<img src="([^"]+)" alt="([^"]*)" loading="lazy" class="nature-species-img">',
                r'<img src="\1" alt="\2" loading="lazy" class="nature-table-img">',
                cell_processed
            )
            # Convert <br> tags
            cell_processed = cell_processed.replace('&lt;br&gt;', '<br>')
            html += f'<td>{cell_processed}</td>\n'
        html += '</tr>\n'
    
    html += '</tbody>\n</table></div>\n'
    return html


def split_table_row(row):
    """Split a markdown table row handling escaped pipes and <br> tags."""
    # Remove leading/trailing |
    row = row.strip()
    if row.startswith('|'):
        row = row[1:]
    if row.endswith('|'):
        row = row[:-1]
    
    # Split by | but not inside markdown formatting
    cells = row.split('|')
    return [cell.strip() for cell in cells]


def generate_all():
    """Generate HTML for all three languages."""
    files = {
        'it': '/home/ubuntu/quo-vadis/finland-nature-encyclopedic-it.md',
        'en': '/home/ubuntu/quo-vadis/finland-nature-encyclopedic-en.md',
        'es': '/home/ubuntu/quo-vadis/finland-nature-encyclopedic-es.md',
    }
    
    for lang, md_file in files.items():
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        html = convert_markdown_to_html(content)
        out_file = f'/home/ubuntu/quo-vadis/finland-nature-{lang}.html'
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Generated {out_file} ({len(html)} chars, {html.count('<details')} sections)")


if __name__ == '__main__':
    generate_all()
