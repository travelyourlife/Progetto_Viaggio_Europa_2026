#!/usr/bin/env python3
"""Translate Finland nature section from Italian to English and European Spanish."""

from openai import OpenAI
import json

client = OpenAI()

# Read the Italian content
with open("/home/ubuntu/quo-vadis/finland-nature-draft-it.md", "r") as f:
    italian_text = f.read()

# Split into sections for better translation quality
sections = italian_text.split("\n## ")
header = sections[0]
body_sections = sections[1:]

def translate_section(section_text, target_lang, lang_code):
    """Translate a section to the target language."""
    if lang_code == "en":
        system_prompt = """You are a professional translator specializing in nature/science content. 
Translate the following Italian text to British English. 
Keep all Markdown formatting, scientific names in italics, emoji icons, and bold markers intact.
Keep Finnish/Latin proper nouns unchanged (e.g., Punkaharju, Jokamiehenoikeus, Saimaa).
The translation must be natural, fluent, and accurate — not literal."""
    else:
        system_prompt = """You are a professional translator specializing in nature/science content.
Translate the following Italian text to European Spanish (es-ES).
Keep all Markdown formatting, scientific names in italics, emoji icons, and bold markers intact.
Keep Finnish/Latin proper nouns unchanged (e.g., Punkaharju, Jokamiehenoikeus, Saimaa).
The translation must be natural, fluent, and accurate — not literal.
Use European Spanish conventions (vosotros form where applicable, but prefer impersonal constructions)."""

    resp = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": section_text},
        ],
    )
    return resp.choices[0].message.content


# Translate each section
print("Translating to English...")
en_sections = []
for i, sec in enumerate(body_sections):
    print(f"  Section {i+1}/{len(body_sections)}...")
    en_sections.append(translate_section("## " + sec, "English", "en"))

print("\nTranslating to Spanish...")
es_sections = []
for i, sec in enumerate(body_sections):
    print(f"  Section {i+1}/{len(body_sections)}...")
    es_sections.append(translate_section("## " + sec, "Spanish", "es"))

# Write English version
en_header = "# Nature in Finland\n\nFinland offers one of the purest and wildest ecosystems in Europe. This nature section explores the biological and geological richness of the country, with a particular focus on the Lakeland region (Saimaa) crossed by the itinerary.\n"
with open("/home/ubuntu/quo-vadis/finland-nature-draft-en.md", "w") as f:
    f.write(en_header + "\n" + "\n\n".join(en_sections) + "\n")

# Write Spanish version
es_header = "# Naturaleza en Finlandia\n\nFinlandia ofrece uno de los ecosistemas más puros y salvajes de Europa. Esta sección naturalista explora la riqueza biológica y geológica del país, con un enfoque particular en la región de los lagos (Saimaa) que atraviesa el itinerario.\n"
with open("/home/ubuntu/quo-vadis/finland-nature-draft-es.md", "w") as f:
    f.write(es_header + "\n" + "\n\n".join(es_sections) + "\n")

print("\nDone! Files written:")
print("  - finland-nature-draft-en.md")
print("  - finland-nature-draft-es.md")
