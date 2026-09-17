import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# First instance
content = content.replace(
    '<div className="min-w-0">\n                <h2 className="text-xs sm:text-[13px] font-bold',
    '<div className="min-w-0 w-[47%] shrink-0">\n                <h2 className="text-xs sm:text-[13px] font-bold'
)

content = content.replace(
    '            {/* Languages & Interests */}\n            <div className="min-w-0">',
    '            {/* Languages & Interests */}\n            <div className="min-w-0 w-[47%] shrink-0">'
)

# Line 1019 replacement (which is now flex flex-wrap gap-4 pt-1)
# Let's check what's inside
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
