import re

LANG_FILES = {
    'it': 'index.html',
    'en': 'index_en.html',
    'es': 'index_es.html',
}
TABS = ['cultura', 'natura', 'attivita', 'cibo']

results = {}
missing = []

for lang, fname in LANG_FILES.items():
    with open(fname, encoding='utf-8') as f:
        content = f.read()
    for tab in TABS:
        # handle both attribute orders
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
            missing.append((tab, lang))
            continue

        inner_start = start + len(open_tag_pattern)
        depth = 1
        i = inner_start
        while depth > 0:
            next_open = content.find('<section', i)
            next_close = content.find('</section>', i)
            if next_close == -1:
                raise Exception(f"no closing section for {tab}/{lang}")
            if next_open != -1 and next_open < next_close:
                depth += 1
                i = next_open + len('<section')
            else:
                depth -= 1
                i = next_close + len('</section>')
        inner_end = i - len('</section>')
        inner_html = content[inner_start:inner_end]

        frag_name = f'content-{tab}-{lang}.html'
        with open(frag_name, 'w', encoding='utf-8') as f:
            f.write(inner_html)
        results[(tab, lang)] = len(inner_html)

print("Estrazione completata:")
for (tab, lang), size in sorted(results.items()):
    print(f"  content-{tab}-{lang}.html : {size:,} caratteri")
print()
print("MANCANTI (sezione non trovata nel file):")
for tab, lang in missing:
    print(f"  tab-{tab} / {lang}")
