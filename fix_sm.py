import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any orphaned 'sm: ' with just ''
content = content.replace('sm: break-words', 'break-words')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
