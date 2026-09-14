import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace break-all with break-words to avoid awkward mid-word splits
content = content.replace('break-all', 'break-words')

# Ensure contact items have sufficient horizontal padding.
# The sidebars use things like `px-5`, `px-6`. Let's ensure the contact lists have `px-3` or similar.
# In ExecutiveModernTemplate:
content = content.replace('px-1 min-w-0', 'px-3 min-w-0')
# In CreativeMinimalTemplate:
content = content.replace('px-6 text-[11px]', 'px-6 sm:px-8 text-[11px]')
# In CorporateEliteTemplate:
# It's `<div className="space-y-4 text-[11px] text-slate-300 w-full min-w-0">`
# Let's add `px-3` to it.
content = content.replace('className="space-y-4 text-[11px] text-slate-300 w-full min-w-0"', 'className="space-y-4 text-[11px] text-slate-300 w-full min-w-0 px-3"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

