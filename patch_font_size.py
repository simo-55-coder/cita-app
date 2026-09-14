import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure contact sections are consistently text-[12px] or text-xs
content = content.replace('text-[11px] sm:text-xs', 'text-[12px]')
content = content.replace('text-[11px] text-slate-300 w-full min-w-0 px-3', 'text-[12px] text-slate-300 w-full min-w-0 px-2.5')
content = content.replace('px-3 min-w-0', 'px-2.5 min-w-0')
content = content.replace('px-6 sm:px-8 text-[11px]', 'px-6 sm:px-8 text-[12px]')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
