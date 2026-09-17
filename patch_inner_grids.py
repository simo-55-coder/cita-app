import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace inner grids with flex
content = content.replace('className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 pt-1 border-t border-slate-200"',
                          'className="flex flex-wrap gap-5 pt-1 border-t border-slate-200" style={{ flexDirection: "row" }}')

content = content.replace('className="grid grid-cols-2 gap-x-2 gap-y-1 text-[12px]"',
                          'className="flex flex-wrap gap-x-2 gap-y-1 text-[12px]"')

content = content.replace('className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1"',
                          'className="flex flex-wrap gap-4 pt-1"')


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
