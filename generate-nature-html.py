#!/usr/bin/env python3
"""
Generate HTML for the expanded Finland nature section from the markdown content.
Uses <details> elements for each subsection to keep it collapsible.
"""

import re

def md_to_html_section(md_file, lang='it'):
    """Convert the markdown nature content to HTML with collapsible sections."""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into main sections (## headers)
    sections = re.split(r'^## ', content, flags=re.MULTILINE)
    
    html_parts = []
    
    for section in sections[1:]:  # skip the intro before first ##
        lines = section.strip().split('\n')
        section_title = lines[0].strip()
        section_body = '\n'.join(lines[1:]).strip()
        
        # Convert section body to HTML
        section_html = convert_body_to_html(section_body)
        
        # Wrap in details/summary
        html_parts.append(f'<details class="nature-section">\n<summary>{section_title}</summary>\n<div class="nature-content">\n{section_html}\n</div>\n</details>')
    
    return '\n'.join(html_parts)


def convert_body_to_html(body):
    """Convert markdown body to HTML."""
    html = []
    lines = body.split('\n')
    i = 0
    in_table = False
    table_rows = []
    in_list = False
    list_items = []
    current_item_lines = []
    
    while i < len(lines):
        line = lines[i]
        
        # Handle tables
        if line.startswith('|') and not in_table:
            in_table = True
            table_rows = [line]
            i += 1
            continue
        elif in_table and line.startswith('|'):
            table_rows.append(line)
            i += 1
            continue
        elif in_table and not line.startswith('|'):
            in_table = False
            html.append(convert_table(table_rows))
            table_rows = []
            # Don't increment i, process this line normally
            continue
        
        # Handle ### subsection headers
        if line.startswith('### '):
            if in_list:
                html.append(flush_list(list_items, current_item_lines))
                in_list = False
                list_items = []
                current_item_lines = []
            title = line[4:].strip()
            html.append(f'<h4 class="nature-subsection">{title}</h4>')
            i += 1
            continue
        
        # Handle list items (- **bold**)
        if line.startswith('- **'):
            if not in_list:
                in_list = True
                list_items = []
                current_item_lines = []
            else:
                # Flush previous item
                if current_item_lines:
                    list_items.append(current_item_lines)
                    current_item_lines = []
            current_item_lines.append(line)
            i += 1
            continue
        elif line.startswith('  ') and in_list:
            current_item_lines.append(line)
            i += 1
            continue
        elif in_list and (line.strip() == '' or not line.startswith(' ')):
            if current_item_lines:
                list_items.append(current_item_lines)
                current_item_lines = []
            if line.strip() == '':
                i += 1
                # Check if next line continues the list
                if i < len(lines) and lines[i].startswith('- **'):
                    continue
                else:
                    html.append(flush_list(list_items, current_item_lines))
                    in_list = False
                    list_items = []
                    current_item_lines = []
                    continue
            else:
                html.append(flush_list(list_items, current_item_lines))
                in_list = False
                list_items = []
                current_item_lines = []
                # Don't increment, process this line
                continue
        
        # Handle regular paragraphs
        if line.strip() == '':
            i += 1
            continue
        
        # Handle image lines
        if line.strip().startswith('!['):
            img_match = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', line.strip())
            if img_match:
                alt = img_match.group(1)
                src = img_match.group(2)
                html.append(f'<figure class="nature-figure"><img src="{src}" alt="{alt}" loading="lazy" class="nature-img"><figcaption>{alt}</figcaption></figure>')
            i += 1
            continue
        
        # Handle lines starting with **bold** (like standalone bold paragraphs)
        if line.startswith('**') and not line.startswith('- '):
            html.append(f'<p>{convert_inline(line)}</p>')
            i += 1
            continue
        
        # Regular paragraph
        para_lines = [line]
        i += 1
        while i < len(lines) and lines[i].strip() != '' and not lines[i].startswith('#') and not lines[i].startswith('- **') and not lines[i].startswith('|') and not lines[i].startswith('!['):
            para_lines.append(lines[i])
            i += 1
        html.append(f'<p>{convert_inline(" ".join(para_lines))}</p>')
    
    # Flush remaining
    if in_list:
        if current_item_lines:
            list_items.append(current_item_lines)
        html.append(flush_list(list_items, []))
    if in_table:
        html.append(convert_table(table_rows))
    
    return '\n'.join(html)


def flush_list(list_items, current_item_lines):
    """Convert accumulated list items to HTML."""
    if current_item_lines and current_item_lines not in list_items:
        list_items.append(current_item_lines)
    
    html_items = []
    for item_lines in list_items:
        full_text = '\n'.join(item_lines)
        # Extract the bold title
        # Check for image
        img_html = ''
        img_match = re.search(r'!\[([^\]]*)\]\(([^)]+)\)', full_text)
        if img_match:
            alt = img_match.group(1)
            src = img_match.group(2)
            img_html = f'<img src="{src}" alt="{alt}" loading="lazy" class="nature-species-img">'
            full_text = full_text.replace(img_match.group(0), '')
        
        # Remove leading "- " 
        full_text = re.sub(r'^- ', '', full_text)
        # Clean up indentation
        full_text = re.sub(r'\n  ', ' ', full_text)
        
        html_items.append(f'<div class="nature-species-card">{img_html}<div class="nature-species-text">{convert_inline(full_text)}</div></div>')
    
    return '\n'.join(html_items)


def convert_table(rows):
    """Convert markdown table to HTML table."""
    if len(rows) < 3:
        return ''
    
    # Parse header
    headers = [cell.strip() for cell in rows[0].split('|')[1:-1]]
    # Skip separator row (rows[1])
    # Parse data rows
    data_rows = []
    for row in rows[2:]:
        cells = [cell.strip() for cell in row.split('|')[1:-1]]
        data_rows.append(cells)
    
    html = '<div class="nature-table-wrap"><table class="nature-table">\n<thead><tr>'
    for h in headers:
        html += f'<th>{convert_inline(h)}</th>'
    html += '</tr></thead>\n<tbody>'
    for row in data_rows:
        html += '<tr>'
        for cell in row:
            # Handle images in table cells
            cell_html = convert_inline(cell)
            img_match = re.search(r'!\[([^\]]*)\]\(([^)]+)\)', cell)
            if img_match:
                alt = img_match.group(1)
                src = img_match.group(2)
                cell_html = cell_html.replace(img_match.group(0), f'<img src="{src}" alt="{alt}" loading="lazy" class="nature-table-img">')
            html += f'<td>{cell_html}</td>'
        html += '</tr>'
    html += '</tbody></table></div>'
    return html


def convert_inline(text):
    """Convert inline markdown to HTML."""
    # Bold + italic
    text = re.sub(r'\*\*\*([^*]+)\*\*\*', r'<strong><em>\1</em></strong>', text)
    # Bold
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    # Italic
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    # Images (in inline context, convert to img tag)
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1" loading="lazy" class="nature-inline-img">', text)
    # Links
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', text)
    # Line breaks for <br>
    text = text.replace('<br>', '<br>')
    return text


def generate_all():
    """Generate HTML for all three languages."""
    langs = {
        'it': '/home/ubuntu/quo-vadis/finland-nature-encyclopedic-it.md',
        'en': '/home/ubuntu/quo-vadis/finland-nature-encyclopedic-en.md',
        'es': '/home/ubuntu/quo-vadis/finland-nature-encyclopedic-es.md',
    }
    
    for lang, md_file in langs.items():
        html = md_to_html_section(md_file, lang)
        out_file = f'/home/ubuntu/quo-vadis/finland-nature-{lang}.html'
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Generated {out_file} ({len(html)} chars)")


if __name__ == '__main__':
    generate_all()
