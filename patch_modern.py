import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('className="grid grid-cols-12 gap-3 sm:gap-5"',
                          'className="flex flex-row gap-5"')

content = content.replace('className="col-span-8 min-w-0 space-y-5 sm:space-y-7"',
                          'className="w-[64%] shrink-0 min-w-0 space-y-5 sm:space-y-7"')

content = content.replace('className="col-span-4 min-w-0 space-y-5 sm:space-y-7"',
                          'className="w-[32%] shrink-0 min-w-0 space-y-5 sm:space-y-7"')


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
