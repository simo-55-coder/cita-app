import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure contact spans have dir="ltr" so +country codes and domains don't flip backwards in RTL.
content = re.sub(r'(<span className="break-words whitespace-normal[^>]*?)>({personal\.(email|phone|website|linkedin).*?})</span>', r'\1 dir="ltr">\2</span>', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
