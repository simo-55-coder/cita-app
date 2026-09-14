import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# For contact and text spans, ensure whitespace-normal is present.
# We'll just globally replace 'break-words' with 'break-words whitespace-normal' if it's not already there.
# To prevent double additions, we first remove whitespace-normal where it might be adjacent to break-words.
content = content.replace('break-words whitespace-normal', 'break-words')
content = content.replace('break-words', 'break-words whitespace-normal')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
