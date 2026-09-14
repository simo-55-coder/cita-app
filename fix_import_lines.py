import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find "import {" followed by "const getDynamicTextSize"
# Let's just strip lines 4 to 12.
# 1: import React
# 2: import { CVData
# 3: import {
# 4: const getDynamicTextSize
# 5:   if (!text) return baseSize;
# 6:   const len = text.length;
# 7:   if (len > 35) return 'text-[9.5px] leading-tight';
# 8:   if (len > 25) return 'text-[10.5px] leading-tight';
# 9:   return baseSize;
# 10: };
# 11:   Mail,
# Let's dynamically find it.

new_lines = []
skip = False
for line in lines:
    if line.startswith('const getDynamicTextSize = (text?: string, baseSize: string = \'text-[12px]\') => {') and 'import {' in "".join(new_lines[-2:]):
        skip = True
    if skip and line.strip() == '};':
        skip = False
        continue
    
    if not skip:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
