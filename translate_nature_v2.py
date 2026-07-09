#!/usr/bin/env python3
"""Translate Finland encyclopedic nature section from Italian to English and European Spanish."""

from openai import OpenAI

client = OpenAI()

# Read the Italian content
with open("/home/ubuntu/quo-vadis/finland-nature-encyclopedic-it.md", "r") as f:
    italian_text = f.read()

# Split into major sections (## headers)
sections = italian_text.split("\n## ")
header = sections[0]
body_sections = sections[1:]

def translate_section(section_text, lang_code):
    """Translate a section to the target language."""
    if lang_code == "en":
        system_prompt = """You are a professional translator specializing in nature/science content.
Translate the following Italian text to British English.
Rules:
- Keep ALL Markdown formatting intact (headers, bold, italic, lists, blockquotes)
- Keep scientific names in italics exactly as they are (e.g., *Pinus sylvestris*)
- Keep Finnish words in italics exactly as they are (e.g., *mänty*, *mustikka*)
- Keep emoji icons unchanged
- Keep proper nouns unchanged (Punkaharju, Saimaa, Salpausselkä, Wiborg, etc.)
- The translation must be natural, fluent, and accurate — not literal
- Maintain the encyclopedic, detailed tone of the original
- Do NOT add or remove any information"""
    else:
        system_prompt = """You are a professional translator specializing in nature/science content.
Translate the following Italian text to European Spanish (es-ES).
Rules:
- Keep ALL Markdown formatting intact (headers, bold, italic, lists, blockquotes)
- Keep scientific names in italics exactly as they are (e.g., *Pinus sylvestris*)
- Keep Finnish words in italics exactly as they are (e.g., *mänty*, *mustikka*)
- Keep emoji icons unchanged
- Keep proper nouns unchanged (Punkaharju, Saimaa, Salpausselkä, Wiborg, etc.)
- The translation must be natural, fluent, and accurate — not literal
- Use European Spanish conventions (prefer impersonal constructions)
- Maintain the encyclopedic, detailed tone of the original
- Do NOT add or remove any information"""

    resp = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": section_text},
        ],
    )
    return resp.choices[0].message.content


# Translate header
print("Translating header...")
en_header = translate_section(header, "en")
es_header = translate_section(header, "es")

# Translate each section
print(f"\nTranslating {len(body_sections)} sections to English...")
en_sections = []
for i, sec in enumerate(body_sections):
    print(f"  EN Section {i+1}/{len(body_sections)}...")
    en_sections.append(translate_section("## " + sec, "en"))

print(f"\nTranslating {len(body_sections)} sections to Spanish...")
es_sections = []
for i, sec in enumerate(body_sections):
    print(f"  ES Section {i+1}/{len(body_sections)}...")
    es_sections.append(translate_section("## " + sec, "es"))

# Write English version
with open("/home/ubuntu/quo-vadis/finland-nature-encyclopedic-en.md", "w") as f:
    f.write(en_header + "\n\n" + "\n\n".join(en_sections) + "\n")

# Write Spanish version
with open("/home/ubuntu/quo-vadis/finland-nature-encyclopedic-es.md", "w") as f:
    f.write(es_header + "\n\n" + "\n\n".join(es_sections) + "\n")

print("\nDone! Files written:")
print("  - finland-nature-encyclopedic-en.md")
print("  - finland-nature-encyclopedic-es.md")
