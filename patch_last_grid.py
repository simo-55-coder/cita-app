import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner divs of the last grid
content = content.replace(
    '        <div className="flex flex-wrap gap-4 pt-1">\n          {languages && languages.length > 0 && (\n            <div className="min-w-0">',
    '        <div className="flex flex-wrap gap-4 pt-1">\n          {languages && languages.length > 0 && (\n            <div className="min-w-0 w-[47%] shrink-0">'
)

content = content.replace(
    '          {hobbies && hobbies.length > 0 && (\n            <div className="min-w-0">',
    '          {hobbies && hobbies.length > 0 && (\n            <div className="min-w-0 w-[47%] shrink-0">'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
