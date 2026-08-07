import re

LANG_FILES = {
    'it': 'index.html',
    'en': 'index_en.html',
    'es': 'index_es.html',
}
TABS = ['cultura', 'natura', 'attivita', 'cibo']

PLACEHOLDER = {
    'it': 'Caricamento…',
    'en': 'Loading…',
    'es': 'Cargando…',
}

for lang, fname in LANG_FILES.items():
    with open(fname, encoding='utf-8') as f:
        content = f.read()

    for tab in TABS:
        patterns = [
            f'<section id="tab-{tab}" class="tab-content">',
            f'<section class="tab-content" id="tab-{tab}">',
        ]
        start = -1
        open_tag_pattern = None
        for p in patterns:
            idx = content.find(p)
            if idx != -1:
                start = idx
                open_tag_pattern = p
                break
        if start == -1:
            continue  # e.g. tab-natura missing in EN

        inner_start = start + len(open_tag_pattern)
        depth = 1
        i = inner_start
        while depth > 0:
            next_open = content.find('<section', i)
            next_close = content.find('</section>', i)
            if next_open != -1 and next_open < next_close:
                depth += 1
                i = next_open + len('<section')
            else:
                depth -= 1
                i = next_close + len('</section>')
        inner_end = i - len('</section>')

        placeholder_html = f'<div class="lazy-tab-loading" style="padding:60px 20px;text-align:center;color:#888;font-size:15px;">{PLACEHOLDER[lang]}</div>'
        content = content[:inner_start] + placeholder_html + content[inner_end:]

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"{fname} aggiornato, nuova dimensione: {len(content):,} caratteri")
