import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all width wrappers to hardcoded 794px so it scales purely with transform
content = content.replace("w-full max-w-[794px]", "w-[794px] min-w-[794px] max-w-[794px]")
content = content.replace("w-full max-w-[210mm]", "w-[794px] min-w-[794px] max-w-[794px]")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
