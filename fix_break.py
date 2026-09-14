import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for field in ['email', 'phone', 'location', 'website', 'linkedin', 'github']:
    pattern = r'(className="[^"]*?)break-words([^"]*?"[^>]*?>\s*\{personal\.' + field + r'(?:\}|\.))'
    content = re.sub(pattern, r'\1break-all\2', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
