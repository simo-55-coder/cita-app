import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace min-h-[1056px] w-full max-w-[816px] with A4 specifics
content = content.replace('min-h-[1056px]', 'min-h-[1123px]')
content = content.replace('max-w-[816px]', 'max-w-[794px]')

# Replace grid-cols-[33%_67%] with grid-cols-[32%_68%]
content = content.replace('grid-cols-[33%_67%]', 'grid-cols-[32%_68%]')
# Replace grid-cols-[64%_36%] with grid-cols-[68%_32%] for Creative
content = content.replace('grid-cols-[64%_36%]', 'grid-cols-[68%_32%]')

# Remove scaleClass if it breaks layout or just make sure it's ''
# scaleClass is applied like ${scaleClass}
content = content.replace("const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';", "const scaleClass = '';")

# For CreativeMinimalTemplate: increase top padding to ensure avatar absolute doesn't clip
content = content.replace('pt-20 ps-8', 'pt-28 ps-8')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
