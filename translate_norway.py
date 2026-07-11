#!/usr/bin/env python3
"""Translate the Norway nature encyclopedic content from IT to EN and ES."""
import os, time
from openai import OpenAI
client = OpenAI()

def translate_file(input_path, output_path, target_lang, lang_name):
    with open(input_path, 'r') as f:
        content = f.read()
    sections = content.split('\n## ')
    translated_sections = []
    for i, section in enumerate(sections):
        if i == 0:
            text_to_translate = section
        else:
            text_to_translate = '## ' + section
        print(f"  Translating section {i+1}/{len(sections)} to {lang_name}...")
        for attempt in range(3):
            try:
                response = client.chat.completions.create(
                    model="gpt-4.1-mini",
                    messages=[
                        {"role": "system", "content": f"""You are a professional translator specializing in nature/science content.
Translate the following Italian text to {lang_name}.
Rules:
- Keep ALL Markdown formatting exactly as-is (headers, bold, italic, image links, tables)
- Keep scientific names in Latin (*Pinus sylvestris* etc.) unchanged
- Keep Norwegian names (*furu*, *bjørk*, *havørn* etc.) unchanged
- Keep image paths unchanged (e.g. images/nature/cloudberry.jpg)
- Translate naturally and fluently, not word-by-word
- For EN: use British English spelling
- For ES: use neutral/international Spanish
- Do NOT add or remove any content"""},
                        {"role": "user", "content": text_to_translate}
                    ],
                    max_tokens=16000,
                    temperature=0.3
                )
                if response.choices and response.choices[0].message.content:
                    translated_sections.append(response.choices[0].message.content)
                    break
                else:
                    print(f"    Empty response, retrying ({attempt+1}/3)...")
                    time.sleep(5)
            except Exception as e:
                print(f"    Error: {e}, retrying ({attempt+1}/3)...")
                time.sleep(5)
        else:
            print(f"    WARNING: Failed to translate section {i+1}, using original")
            translated_sections.append(text_to_translate)
    result = '\n'.join(translated_sections)
    with open(output_path, 'w') as f:
        f.write(result)
    print(f"  Done! Written to {output_path}")

input_file = '/home/ubuntu/quo-vadis/norway-nature-encyclopedic-it.md'
print("=== Translating Norway to English ===")
translate_file(input_file, '/home/ubuntu/quo-vadis/norway-nature-encyclopedic-en.md', 'English', 'English')
print("\n=== Translating Norway to Spanish ===")
translate_file(input_file, '/home/ubuntu/quo-vadis/norway-nature-encyclopedic-es.md', 'Spanish', 'Spanish')
print("\nAll translations complete!")
